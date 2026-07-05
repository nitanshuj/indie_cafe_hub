import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseUrl =
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : "") ||
  import.meta.env.VITE_SUPABASE_URL ||
  "";

const supabaseAnonKey =
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : "") ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

const geminiApiKey =
  (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : "") ||
  "";

const geminiModel =
  (typeof process !== "undefined" ? process.env.GEMINI_MODEL : "") ||
  ["gemini", "2.5", "flash"].join("-");

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  token: string;
}

export const askAiBarista = createServerFn({ method: "POST" })
  .validator((data: ChatRequest) => data)
  .handler(async ({ data: { message, history, token } }) => {
    if (!token) {
      throw new Error("Unauthorized: Missing auth token");
    }

    // 1. Authenticate the user session using the token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized: Invalid user session");
    }

    // 2. Fetch the user's profile record to check quota
    const { data: profile, error: profileError } = await userClient
      .from("profiles")
      .select("llm_query_count, llm_reset_date, is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Failed to load user profile for quota checks");
    }

    const isAdmin = profile.is_admin || false;
    let queryCount = profile.llm_query_count || 0;
    let resetDateStr = profile.llm_reset_date;
    let isReset = false;

    // Check if reset period (7 days) has passed
    if (resetDateStr) {
      const resetDate = new Date(resetDateStr);
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() > resetDate.getTime() + oneWeekMs) {
        queryCount = 0;
        resetDateStr = new Date().toISOString();
        isReset = true;
      }
    } else {
      resetDateStr = new Date().toISOString();
      isReset = true;
    }

    // Check query limit (admins have unlimited queries)
    if (!isAdmin && queryCount >= 4) {
      return { error: "QUOTA_EXCEEDED", message: "You have used your 4 free queries for this week. Please check back next week!" };
    }

    // 3. Invoke Gemini API
    if (!geminiApiKey) {
      throw new Error("Gemini API key is not configured on the server");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const systemInstruction =
      "You are the resident expert barista for Indie Cafe Hub. Your tone is warm, welcoming, and passionate about specialty coffee. " +
      "YOUR DOMAIN: You exclusively answer questions about coffee, brewing methods, cafe equipment, bean origins, and cafe culture. " +
      "OUT OF BOUNDS: If asked about anything unrelated to coffee, politely decline using a brief coffee-themed pivot (e.g., 'I'm better with beans than bytes! Let's talk coffee instead.'). " +
      "CONSTRAINTS: You are chatting in a small web widget. Keep answers highly concise—maximum 2 short paragraphs. " +
      "FORMATTING: Use Markdown. Use bolding for key terms, bullet points for lists or steps, and double newlines to separate paragraphs cleanly.";

    const model = genAI.getGenerativeModel({
      model: geminiModel,
      systemInstruction,
    });

    // Format history for Google Gen AI SDK
    const formattedHistory = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.parts[0]?.text || "" }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 4. Update the quota count in Supabase
    const finalCount = queryCount + 1;
    const { error: updateError } = await userClient
      .from("profiles")
      .update({
        llm_query_count: finalCount,
        llm_reset_date: resetDateStr,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update user query count:", updateError);
    }

    return {
      text: responseText,
      queryCount: finalCount,
    };
  });

export const getGeminiModelName = createServerFn({ method: "GET" })
  .handler(async () => {
    return geminiModel;
  });
