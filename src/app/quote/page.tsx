import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "../../lib/db";
import { sendQuoteNotifications } from "../../lib/notify";
import CaptchaField from "../../components/CaptchaField";
import FormMeta from "../../components/FormMeta";
import { checkAndRecord } from "../../lib/rate-limit";

/* Friendly messages */
function errorMessage(key?: string) {
  switch (key) {
    case "captcha_missing":
      return "Please check the “I’m not a robot” box.";
    case "captcha_invalid_secret":
      return "Server reCAPTCHA secret is invalid. Double-check RECAPTCHA_SECRET_KEY in .env.";
    case "captcha_invalid_keytype":
      return "Your site key is for reCAPTCHA v3. Create a v2 “I’m not a robot” key.";
    case "captcha_hostname":
      return "Site key doesn’t match this domain. Add “localhost” and “127.0.0.1” in reCAPTCHA.";
    case "captcha_timeout":
      return "Captcha expired. Please try again.";
    case "captcha_badrequest":
      return "Captcha verification failed (bad request). Please retry.";
    case "rate_interval":
      return "You’re going a bit fast. Please wait ~30 seconds and try again.";
    case "rate_burst":
      return "Too many requests in a short period. Please slow down and try again later.";
    default:
      return "Verification failed. Please try again.";
  }
}

export default function QuotePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  async function createQuote(formData: FormData) {
    "use server";

    /* ---------- Honeypot (hidden field) ---------- */
    const honeypot = String(formData.get("company") || "");
    if (honeypot.trim().length > 0) {
      await new Promise((r) => setTimeout(r, 350)); // slow bots a hair
      redirect("/quote/thanks");
    }

    /* ---------- Time-trap (dwell time) ---------- */
    const startedAt = Number(formData.get("startedAt") || 0);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500) {
      await new Promise((r) => setTimeout(r, 350));
      redirect("/quote/thanks");
    }

    /* ---------- Rate limit per IP ---------- */
    const ip =
      headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers().get("x-real-ip") ||
      "unknown";
    const gate = checkAndRecord(String(ip));
    if (!gate.ok) {
      redirect(`/quote?error=rate_${gate.reason}`);
    }

    /* ---------- reCAPTCHA (server verify) ---------- */
    const token = String(formData.get("recaptchaToken") || "");
    const secret = process.env.RECAPTCHA_SECRET_KEY || "";

    if (secret) {
      if (!token) redirect("/quote?error=captcha_missing");

      const params = new URLSearchParams();
      params.append("secret", secret);
      params.append("response", token);

      const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
        cache: "no-store",
      });

      const json: any = await res.json();
      if (!json?.success) {
        const codes: string[] = (json?.["error-codes"] || []) as string[];
        let reason = "captcha";
        if (codes.includes("missing-input-response")) reason = "captcha_missing";
        else if (codes.includes("missing-input-secret") || codes.includes("invalid-input-secret"))
          reason = "captcha_invalid_secret";
        else if (codes.includes("invalid-key-type")) reason = "captcha_invalid_keytype";
        else if (codes.includes("timeout-or-duplicate")) reason = "captcha_timeout";
        else if (codes.includes("bad-request")) reason = "captcha_badrequest";
        else if (codes.includes("hostname-mismatch")) reason = "captcha_hostname";
        redirect(`/quote?error=${reason}`);
      }
    }

    /* ---------- Save + notify ---------- */
    const data = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      baseLegion: String(formData.get("baseLegion") || ""),
      helmet: String(formData.get("helmet") || ""),
      finish: String(formData.get("finish") || ""),
      quantity: Number(formData.get("quantity") || 1),
      refs: String(formData.get("refs") || ""),
      budget: String(formData.get("budget") || ""),
      deadline: String(formData.get("deadline") || ""),
      notes: String(formData.get("notes") || ""),
    };

    const quote = await prisma.quote.create({ data });
    await sendQuoteNotifications(quote).catch(() => {});

    const nameParam = encodeURIComponent(data.name || "");
    redirect(`/quote/thanks?name=${nameParam}`);
  }

  const errKey = typeof searchParams?.error === "string" ? searchParams?.error : undefined;
  const isCaptchaErr = !!errKey && (errKey.startsWith("captcha") || errKey.startsWith("rate"));
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6 text-gradient">
        Request a Custom Quote
      </h2>
      <p className="text-center text-white/70 mb-6">
        Tell us about the custom clone trooper you&apos;d like to commission — colors, battalion, accessories — and we&apos;ll email you back with a quote.
      </p>

      {errKey && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage(errKey)}
        </div>
      )}

      <form action={createQuote} className="grid gap-4">
        <input name="name" required className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Your name" />
        <input name="email" required type="email" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Email" />

        <div className="grid md:grid-cols-2 gap-4">
          <select name="baseLegion" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" defaultValue="">
            <option value="" disabled>Base legion / unit</option>
            <option>501st</option>
            <option>212th</option>
            <option>Coruscant Guard</option>
            <option>Wolfpack</option>
            <option>Geonosis</option>
            <option>Custom (non-canon)</option>
          </select>
          <select name="helmet" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" defaultValue="">
            <option value="" disabled>Helmet type</option>
            <option>Phase I</option>
            <option>Phase II</option>
            <option>Airborne</option>
            <option>ARF</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <select name="finish" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" defaultValue="">
            <option value="" disabled>Finish</option>
            <option>Matte</option>
            <option>Gloss</option>
            <option>Weathered</option>
          </select>
          <input name="quantity" type="number" min={1} max={20} className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Quantity (1–20)" />
        </div>

        <input name="refs" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Reference links (Imgur/Drive)" />
        <input name="budget" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Target budget (USD)" />
        <input name="deadline" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5" placeholder="Deadline (optional)" />
        <textarea name="notes" className="px-4 py-3 rounded-xl border border-white/15 bg-white/5 min-h-[140px]" placeholder="Describe armor markings, accessories, and any special requests." />

        {/* Honeypot (kept in DOM, off-screen) */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Time-trap */}
        <FormMeta />

        {/* reCAPTCHA */}
        <CaptchaField siteKey={siteKey} captchaError={isCaptchaErr} />

        <button className="btn-primary btn-tech">Request quote</button>
      </form>

      <p className="mt-3 text-xs text-white/50 text-center">
        We&apos;ll email you back within 1–2 business days.
      </p>
    </section>
  );
}
