import React from "react";
import { X, ArrowUp, Phone, MessageCircle } from "lucide-react";
export default function Assistant({ open, close }) {
  const [messages, setMessages] = React.useState([]),
    [input, setInput] = React.useState(""),
    [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState("");
  const session = React.useRef(crypto.randomUUID()),
    field = React.useRef(null),
    log = React.useRef(null),
    lock = React.useRef(false);
  React.useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);
  React.useEffect(() => {
    log.current?.scrollTo(0, log.current.scrollHeight);
  }, [messages, busy, error]);
  async function send(e, question) {
    e?.preventDefault();
    const text = (question || input).trim();
    if (!text || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setInput("");
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    try {
      const response = await fetch(
        "https://hb-receptionist.2faxrpl.workers.dev/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session: session.current, messages: history }),
          signal: AbortSignal.timeout(30000),
        },
      );
      if (!response.ok) throw Error();
      const data = await response.json();
      if (typeof data.reply !== "string" || !data.reply.trim()) throw Error();
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch {
      setError(
        "HB couldn’t connect. Please try again, call or WhatsApp the team.",
      );
      setMessages(messages);
      setInput(text);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (!open) return null;
  return (
    <aside
      className="assistant-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="hb-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
          document.querySelector(".hb")?.focus();
        }
      }}
    >
      <div className="assistant-head">
        <span className="hb-avatar">HB</span>
        <div>
          <b id="hb-title">A little clarity, on demand.</b>
          <small>HB · Hairouna’s AI receptionist</small>
        </div>
        <button
          onClick={() => {
            close();
            document.querySelector(".hb")?.focus();
          }}
          aria-label="Close HB Assistant"
        >
          <X size={19} />
        </button>
      </div>
      <div className="chat-log" ref={log} role="log" aria-live="polite">
        <div className="bot-msg">
          Welcome to Hairouna. Tell me what you need help with, and I’ll help
          you find the next step.
        </div>
        {messages.map((m, i) => (
          <div className={"bot-msg " + m.role} key={i}>
            {m.content}
          </div>
        ))}
        {busy && <p className="chat-status">HB is replying…</p>}
        {error && (
          <p role="alert" className="chat-status">
            {error}
          </p>
        )}
      </div>
      {!messages.length && (
        <div className="assistant-options">
          {["Personal taxes", "Business bookkeeping"].map((q) => (
            <button key={q} disabled={busy} onClick={() => send(null, q)}>
              {q}
            </button>
          ))}
        </div>
      )}
      <form className="chat-input" onSubmit={send}>
        <input
          ref={field}
          aria-label="Your question for HB"
          placeholder="How can we help?"
          maxLength={500}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={busy || !input.trim()} aria-label="Send message">
          <ArrowUp size={20} />
        </button>
      </form>
      <div className="assistant-actions">
        <a href="tel:+14169081916">
          <Phone size={14} />
          Call the team
        </a>
        <a href="https://wa.me/14169081916" target="_blank" rel="noreferrer">
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </div>
      <small className="assistant-note">
        AI guidance, not tax advice. Please don’t share SINs, banking details or
        tax documents here.
      </small>
    </aside>
  );
}
