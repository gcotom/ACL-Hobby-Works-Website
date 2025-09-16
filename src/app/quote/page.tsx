import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default function QuotePage() {
  async function createQuote(formData: FormData) {
    "use server";
    await prisma.quote.create({
      data: {
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        baseLegion: String(formData.get("baseLegion") || ""),
        helmet: String(formData.get("helmet") || ""),
        finish: String(formData.get("finish") || ""),
        quantity: Number(formData.get("quantity") || 1),
        refs: String(formData.get("refs") || ""),
        budget: String(formData.get("budget") || ""),
        deadline: String(formData.get("deadline") || ""),
        notes: String(formData.get("notes") || ""),
      },
    });
    revalidatePath("/admin");
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6 text-gradient animate-in">
        Request a Custom Quote
      </h2>
      <p className="text-center text-white/70 mb-6 animate-in delay-1">
        Tell us about the custom clone trooper you&apos;d like to commission — colors, battalion, accessories — and we&apos;ll get back to you with a quote.
      </p>
      <form action={createQuote} className="grid gap-4 animate-in delay-2">
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
        <button className="btn-primary btn-tech">Request quote</button>
      </form>
    </section>
  );
}
