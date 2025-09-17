import { redirect } from "next/navigation";
import { prisma } from "../../lib/db";
import { sendQuoteNotifications } from "../../lib/notify";
import CaptchaField from "../../components/CaptchaField";

export default function QuotePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  async function createQuote(formData: FormData) {
    "use server";

    // Verify reCAPTCHA (if secret configured)
    const token = String(formData.get("recaptchaToken") || "");
    const secret = process.env.RECAPTCHA_SECRET_KEY || "";

    if (secret) {
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
        redirect("/quote?error=captcha");
      }
    }

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

  const captchaError = searchParams?.error === "captcha";

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6 text-gradient">
        Request a Custom Quote
      </h2>
      <p className="text-center text-white/70 mb-6">
        Tell us about the custom clone trooper you&apos;d like to commission — colors, battalion, accessories — and we&apos;ll email you back with a quote.
      </p>

      {/* Keep the server action here; CaptchaField is client-only and writes the token */}
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

        <CaptchaField captchaError={captchaError} />

        <button className="btn-primary btn-tech">Request quote</button>
      </form>

      <p className="mt-3 text-xs text-white/50 text-center">
        We&apos;ll email you back within 1–2 business days.
      </p>
    </section>
  );
}
