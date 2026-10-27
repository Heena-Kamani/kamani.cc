import { useEffect, useRef, useState, type FormEvent } from "react";
import { isEmail, sendToInbox, type SendState } from "./forms";

export default function ResumeRequest({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setState("idle");
      setError("");
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("botcheck")) return; // bots fill hidden fields, people don't
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    if (!name || !isEmail(email)) {
      setError("Please add your name and a valid email.");
      return;
    }
    setError("");
    setState("sending");
    const ok = await sendToInbox(`Resume request from ${name}`, {
      name,
      email,
      company: String(f.get("company") || ""),
      note: String(f.get("note") || ""),
    }).catch(() => false);
    setState(ok ? "sent" : "error");
  }

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} aria-labelledby="rr-title">
      <button className="dialog-x" onClick={onClose} aria-label="Close">
        ×
      </button>
      {state === "sent" ? (
        <div className="dialog-done">
          <h2 id="rr-title">Thank you!</h2>
          <p>I've got your request and I'll email my resume to you soon.</p>
          <button className="btn primary" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <h2 id="rr-title">Request my resume</h2>
          <p className="soft">Tell me where to send it and I'll email it to you personally.</p>
          <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" />
          <label>
            Your name
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Work email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>
              Company <span className="soft">(optional)</span>
            </span>
            <input name="company" autoComplete="organization" />
          </label>
          <label>
            <span>
              Anything else? <span className="soft">(optional)</span>
            </span>
            <textarea name="note" rows={3} placeholder="The role you're hiring for, a question for me..." />
          </label>
          {error && <p className="form-error">{error}</p>}
          {state === "error" && <p className="form-error">That didn't send. Please try again, or reach me on LinkedIn.</p>}
          <button className="btn primary" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending..." : "Send request"}
          </button>
        </form>
      )}
    </dialog>
  );
}
