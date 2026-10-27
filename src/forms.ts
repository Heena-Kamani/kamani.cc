import { WEB3FORMS_KEY } from "./data";

export type SendState = "idle" | "sending" | "sent" | "error";

// Sends a form to my inbox. Returns true when it was delivered.
export async function sendToInbox(subject: string, fields: Record<string, string>): Promise<boolean> {
  if (!WEB3FORMS_KEY) {
    console.warn("WEB3FORMS_KEY is not set yet, so nothing was sent.");
    return false;
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: "kamani.cc", ...fields }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return res.ok && data.success === true;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
