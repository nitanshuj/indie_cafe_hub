import { useState, useEffect, useRef } from "react";
import { User, Send, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Comment = {
  id: string;
  name: string;
  date: string;
  text: string;
  isGuest: boolean;
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function mapDbCommentToUiComment(c: any): Comment {
  return {
    id: c.id,
    name: c.is_guest ? (c.author_name || "Guest") : (c.author_name || "Member"),
    date: formatDate(new Date(c.created_at)),
    text: c.content,
    isGuest: c.is_guest,
  };
}

export function CommentsSection({ cafeId }: { cafeId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestNameError, setGuestNameError] = useState("");
  // Honeypot — bots fill this in, humans leave it empty
  const [honeypot, setHoneypot] = useState("");

  const fetchComments = async (isBackground = false) => {
    try {
      if (isBackground) setPolling(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("cafe_id", cafeId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Separately fetch profiles to avoid auth-schema cross-join cache issues in PostgREST
      const authorIds = (data || [])
        .map((c: any) => c.author_id)
        .filter((id): id is string => !!id);

      const profilesMap: Record<string, string> = {};
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", authorIds);

        if (profiles) {
          profiles.forEach((p: any) => {
            profilesMap[p.id] = p.full_name;
          });
        }
      }

      const mapped = (data || []).map((c: any) => ({
        id: c.id,
        name: c.is_guest
          ? (c.author_name || "Guest")
          : (profilesMap[c.author_id] || c.author_name || "Member"),
        date: formatDate(new Date(c.created_at)),
        text: c.content,
        isGuest: c.is_guest,
      }));

      setComments(mapped);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
      setPolling(false);
    }
  };

  useEffect(() => {
    if (cafeId) {
      void fetchComments();

      // Timed calls (background polling) from Database to update comments every 120 seconds
      const interval = setInterval(() => {
        void fetchComments(true);
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [cafeId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;

    // Honeypot check — if a bot filled in the hidden field, silently abort
    if (honeypot) return;

    // Guest name is required for unauthenticated users
    if (!user) {
      const trimmedName = guestName.trim();
      if (!trimmedName) {
        setGuestNameError("Please enter a display name to post as a guest.");
        return;
      }
      setGuestNameError("");
    }

    try {
      let payload: Record<string, any>;

      if (user) {
        // Authenticated: submit with author_id and their name
        payload = {
          cafe_id: cafeId,
          author_id: user.id,
          author_name: user.name || "Member",
          is_guest: false,
          content: body,
        };
      } else {
        // Guest: submit with null author_id and guest name
        payload = {
          cafe_id: cafeId,
          author_id: null,
          author_name: guestName.trim(),
          is_guest: true,
          content: body,
        };
      }

      const { data, error } = await supabase
        .from("comments")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newComment: Comment = {
          id: data.id,
          name: data.is_guest
            ? (data.author_name || "Guest")
            : (user?.name || data.author_name || "Member"),
          date: formatDate(new Date(data.created_at)),
          text: data.content,
          isGuest: data.is_guest,
        };
        setComments((cs) => [newComment, ...cs]);
      }
      setText("");
      setGuestName("");
      setGuestNameError("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment.");
    }
  };

  return (
    <section className="mt-16" data-testid="comments-section">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Community
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl tracking-tight font-medium text-cafe-heading font-outfit">
            Notes &amp; Reviews
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {polling && (
            <span className="text-[10px] text-cafe-muted font-work-sans inline-flex items-center gap-1">
              <RefreshCw size={10} className="animate-spin" /> syncing...
            </span>
          )}
          <p className="text-sm text-cafe-muted font-work-sans">
            {comments.length} {comments.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        data-testid="comment-form"
        className="mt-8 bg-cafe-surface border border-cafe-border rounded-[2rem] p-6 sm:p-8"
      >
        {/* Hidden honeypot field — invisible to humans, filled by bots */}
        <input
          type="text"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: "none" }}
        />

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-cafe-primary-light text-cafe-primary inline-flex items-center justify-center font-medium font-work-sans shrink-0">
            {user ? (
              (user.name || user.email).charAt(0).toUpperCase()
            ) : (
              <User size={16} strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            {!user && (
              <div>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (e.target.value.trim()) setGuestNameError("");
                  }}
                  placeholder="Display Name"
                  required
                  data-testid="comment-guest-name-input"
                  className={`w-full bg-cafe-surface border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-2.5 outline-none font-work-sans text-sm ${
                    guestNameError ? "border-red-400" : "border-cafe-border"
                  }`}
                />
                {guestNameError && (
                  <p className="mt-1 text-xs text-red-500 font-work-sans">{guestNameError}</p>
                )}
              </div>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Share your experience…"
              data-testid="comment-text-input"
              className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans resize-none"
            />
            {!user && (
              <p className="text-xs text-cafe-muted font-work-sans">
                Posting as a guest. <a href="/login" className="text-cafe-primary hover:underline">Sign in</a> to link comments to your account.
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!text.trim()}
                data-testid="comment-submit-btn"
                className="bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center gap-2 cursor-pointer"
              >
                Post comment <Send size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <p className="mt-10 text-sm text-cafe-muted font-work-sans text-center">
          Loading comments...
        </p>
      ) : (
        <ul className="mt-10 space-y-6" data-testid="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-cafe-primary-light text-cafe-primary inline-flex items-center justify-center font-medium font-work-sans shrink-0">
                {c.isGuest ? <User size={16} strokeWidth={1.5} /> : c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="font-medium text-cafe-heading font-outfit">{c.name}</p>
                  {c.isGuest && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cafe-muted font-work-sans">
                      Guest
                    </span>
                  )}
                  <p className="text-xs text-cafe-muted font-work-sans">{c.date}</p>
                </div>
                <p className="mt-2 text-cafe-body font-work-sans leading-relaxed">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
