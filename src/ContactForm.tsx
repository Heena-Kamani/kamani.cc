import { useState, type FormEvent } from "react";
import { isEmail, sendToInbox, type SendState } from "./forms";

export default function ContactForm() {
  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("botcheck")) return;
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const message = String(f.get("message") || "").trim();
    if (!name || !isEmail(email) || !message) {
      setError("Please fill in your name, a valid email and a message.");
      return;
    }
    setError("");
    setState("sending");
    const ok = await sendToInbox(`Message from ${name} via kamani.cc`, { name, email, message }).catch(() => false);
    setState(ok ? "sent" : "error");
    if (ok) form.reset();
  }

  if (state === "sent") {
    return <p className="form-sent">Thanks, your message is on its way. I'll get back to you soon.</p>;
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" />
      <div className="row">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        Message
        <textarea name="message" rows={4} required />
      </label>
      {error && <p className="form-error">{error}</p>}
      {state === "error" && <p className="form-error">That didn't send. Please try again, or reach me on LinkedIn.</p>}
      <button className="btn primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
