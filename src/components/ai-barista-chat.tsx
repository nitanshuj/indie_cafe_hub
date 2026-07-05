import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { askAiBarista, getGeminiModelName } from "@/lib/ai-chat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Coffee, Send, Sparkles, Lock, ArrowRight, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

function parseMarkdown(text: string) {
  if (!text) return "";
  
  // Escape HTML tags to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cafe-heading">$1</strong>');

  // Headings (### text)
  html = html.replace(/^###[ \t]+(.*?)$/gm, '<h4 class="font-outfit font-bold text-cafe-primary mt-2 mb-1 text-sm">$1</h4>');
  html = html.replace(/^##[ \t]+(.*?)$/gm, '<h3 class="font-outfit font-bold text-cafe-primary mt-3 mb-1 text-[13px]">$1</h3>');
  html = html.replace(/^#[ \t]+(.*?)$/gm, '<h2 class="font-outfit font-bold text-cafe-primary mt-3 mb-1 text-sm">$1</h2>');

  // Bullet items (* text or - text)
  html = html.replace(/^\*[ \t]+(.*?)$/gm, '<li class="ml-4 list-disc my-0.5">$1</li>');
  html = html.replace(/^-[ \t]+(.*?)$/gm, '<li class="ml-4 list-disc my-0.5">$1</li>');

  return html;
}

export function AiBaristaChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [queryCount, setQueryCount] = useState<number>(0);
  const [activeModel, setActiveModel] = useState("Gemini");
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch active Gemini model name from the server
  useEffect(() => {
    getGeminiModelName()
      .then((modelName) => {
        if (modelName) {
          // Format model name nicely for UI presentation: "gemini-2.5-flash" -> "Gemini 2.5 Flash"
          const formatted = modelName
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          setActiveModel(formatted);
        }
      })
      .catch(err => console.error("Failed to fetch Gemini model name:", err));
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch current query count on mount and when popover opens
  useEffect(() => {
    if (user && isOpen) {
      supabase
        .from("profiles")
        .select("llm_query_count, is_admin")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (data && !error) {
            setQueryCount(data.llm_query_count || 0);
            const isAdmin = data.is_admin || false;
            if (!isAdmin && data.llm_query_count >= 4) {
              setQuotaExceeded(true);
            }
          }
        });
    }
  }, [user, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || quotaExceeded || !user) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to local state
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", parts: [{ text: userMessage }] }
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";

      const res = await askAiBarista({
        data: {
          message: userMessage,
          history: messages,
          token
        }
      });

      if (res.error === "QUOTA_EXCEEDED") {
        setQuotaExceeded(true);
        setMessages((prev) => [
          ...prev,
          { 
            role: "model", 
            parts: [{ text: "Sorry, you have exceeded your weekly quota of 4 free queries. Check back next week!" }] 
          }
        ]);
        toast.warning("Weekly chat quota exceeded.");
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: res.text || "" }] }
        ]);
        if (res.queryCount !== undefined) {
          setQueryCount(res.queryCount);
          if (!user.isAdmin && res.queryCount >= 4) {
            setQuotaExceeded(true);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to get response from AI Barista.");
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          parts: [{ text: "I ran into a quick issue connection error. Please try asking again!" }] 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div className="fixed bottom-6 right-6 z-[99] font-work-sans">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 h-12 rounded-full bg-cafe-primary text-white hover:bg-cafe-primary-hover shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 relative group font-outfit text-xs font-semibold tracking-wider"
            title="Ask AI Coffee Expert"
          >
            <Bot size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">AI Coffee Expert</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[10px] items-center justify-center font-bold text-white text-[9px]">!</span>
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent 
          align="end" 
          side="top" 
          sideOffset={12}
          className="w-[360px] sm:w-[380px] p-0 rounded-2xl border border-cafe-border bg-[#FCFAF7] shadow-2xl overflow-hidden flex flex-col h-[500px]"
        >
          {/* Header */}
          <div className="p-4 bg-cafe-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Coffee size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-sm tracking-wide">AI Coffee Expert</h3>
                <p className="text-[10px] text-white/70">Powered by {activeModel}</p>
              </div>
            </div>
            {user && (
              <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full font-semibold">
                {user.isAdmin ? "Admin (Unlimited)" : `${Math.max(0, 4 - queryCount)} / 4 remaining`}
              </span>
            )}
          </div>

          {/* Gated UI Container */}
          <div className="flex-1 relative flex flex-col min-h-0 bg-[#FCFAF7]">
            {/* Locked View for Unauthenticated Users */}
            {!user ? (
              <div className="absolute inset-0 bg-[#FCFAF7]/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-cafe-primary-light flex items-center justify-center text-cafe-primary mb-4">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <h4 className="font-outfit font-medium text-cafe-heading mb-2">AI Barista is Locked</h4>
                <p className="text-xs text-cafe-muted leading-relaxed max-w-[260px] mb-6">
                  Join the community to unlock our AI Barista. Log in or sign up to get 4 free coffee queries a week.
                </p>
                <Link
                  to="/login"
                  search={{ returnTo }}
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-cafe-primary text-white hover:bg-cafe-primary-hover py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0"
                >
                  Log In to Unlock <ArrowRight size={14} />
                </Link>
              </div>
            ) : null}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center py-8 px-4 space-y-3">
                  <Sparkles className="mx-auto text-amber-500 animate-pulse" size={24} />
                  <p className="text-xs text-cafe-muted font-medium font-outfit">
                    Hello! Ask me any questions about brewing coffee, latte art, coffee origins, cafe recipes, or equipment.
                  </p>
                  <p className="text-[10px] text-cafe-muted/70 italic">
                    Example: "How do I make a V60 pour over?"
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 max-w-[85%] ${
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                        msg.role === "user"
                          ? "bg-cafe-primary text-white"
                          : "bg-cafe-primary-light text-cafe-primary border border-cafe-border/20"
                      }`}
                    >
                      {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed font-work-sans whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-cafe-primary text-white rounded-tr-none"
                          : "bg-cafe-surface border border-cafe-border/20 text-cafe-heading rounded-tl-none"
                      }`}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.parts[0]?.text || "") }}
                    />
                  </div>
                ))
              )}

              {loading && (
                <div className="flex gap-2 mr-auto max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-cafe-primary-light text-cafe-primary flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-cafe-surface border border-cafe-border/20 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cafe-primary animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cafe-primary animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cafe-primary animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-cafe-border/20 bg-white">
              {quotaExceeded ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-center text-[11px] font-medium leading-normal animate-fade-in">
                  Weekly quota reached (4/4 queries). Please check back next week to ask more questions!
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <textarea
                    value={input}
                    disabled={quotaExceeded || loading || !user}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend(e);
                      }
                    }}
                    rows={1}
                    placeholder="Ask about coffee..."
                    className="flex-1 bg-cafe-bg border border-cafe-border/40 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-cafe-primary focus:border-cafe-primary outline-none text-cafe-heading resize-none min-h-[36px] max-h-[80px]"
                  />
                  <button
                    type="submit"
                    disabled={quotaExceeded || loading || !input.trim() || !user}
                    className="bg-cafe-primary hover:bg-cafe-primary-hover disabled:opacity-40 text-white rounded-xl p-2 shrink-0 cursor-pointer border-0 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
