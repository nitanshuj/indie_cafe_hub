import { useState } from "react";
import { User, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type Comment = {
  id: string;
  name: string;
  date: string;
  text: string;
  isGuest: boolean;
};

const seedComments: Record<string, Comment[]> = {};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function CommentsSection({ cafeId }: { cafeId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(seedComments[cafeId] ?? [
    {
      id: "c1",
      name: "Asha",
      date: formatDate(new Date(Date.now() - 86400000 * 3)),
      text: "Lovely filter coffee and the upstairs nook is perfect for calls. WiFi held up all afternoon.",
      isGuest: false,
    },
    {
      id: "c2",
      name: "Visitor",
      date: formatDate(new Date(Date.now() - 86400000 * 9)),
      text: "Cardamom latte was the highlight. A bit packed on weekends though.",
      isGuest: true,
    },
  ]);
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    const name = user?.name || guestName.trim() || "Guest";
    const next: Comment = {
      id: `c${Date.now()}`,
      name,
      date: formatDate(new Date()),
      text: body,
      isGuest: !user,
    };
    setComments((cs) => [next, ...cs]);
    setText("");
    setGuestName("");
  };

  return (
    <section className="mt-16" data-testid="comments-section">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">Community</p>
          <h2 className="mt-2 text-3xl sm:text-4xl tracking-tight font-medium text-[#2D2422] font-outfit">
            Notes & Reviews
          </h2>
        </div>
        <p className="text-sm text-[#A3938F] font-work-sans">
          {comments.length} {comments.length === 1 ? "note" : "notes"}
        </p>
      </div>

      <form
        onSubmit={submit}
        data-testid="comment-form"
        className="mt-8 bg-white border border-[#F5EBE9] rounded-[2rem] p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans shrink-0">
            {user ? (user.name || user.email).charAt(0).toUpperCase() : <User size={16} strokeWidth={1.5} />}
          </div>
          <div className="flex-1 space-y-3">
            {!user && (
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Display Name (Optional)"
                data-testid="comment-guest-name-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans text-sm"
              />
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Share your experience…"
              data-testid="comment-text-input"
              className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans resize-none"
            />
            {!user && (
              <p className="text-xs text-[#A3938F] font-work-sans">
                Posting as a guest. Log in to save your cafe history.
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!text.trim()}
                data-testid="comment-submit-btn"
                className="bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center gap-2"
              >
                Post comment <Send size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </form>

      <ul className="mt-10 space-y-6" data-testid="comments-list">
        {comments.map((c) => (
          <li key={c.id} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans shrink-0">
              {c.isGuest ? <User size={16} strokeWidth={1.5} /> : c.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="font-medium text-[#2D2422] font-outfit">{c.name}</p>
                {c.isGuest && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#A3938F] font-work-sans">
                    Guest
                  </span>
                )}
                <p className="text-xs text-[#A3938F] font-work-sans">{c.date}</p>
              </div>
              <p className="mt-2 text-[#6B5C58] font-work-sans leading-relaxed">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
