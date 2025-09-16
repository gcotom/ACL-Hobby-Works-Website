import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-gradient animate-in">
        Quotes
      </h2>
      <div className="grid gap-4">
        {quotes.map((q, i) => (
          <div key={q.id} className={`rounded-3xl card-glass p-4 animate-in ${i%3===0?'delay-1':i%3===1?'delay-2':'delay-3'}`}>
            <div className="flex justify-between items-center gap-4">
              <h3 className="font-display tracking-wide">{q.name} — {q.email}</h3>
              <span className="text-xs rounded-full px-2 py-1 border border-white/20">{q.status}</span>
            </div>
            <p className="text-sm text-white/80 mt-2">{q.notes}</p>
            <div className="text-xs text-white/70 mt-2">
              Legion: {q.baseLegion || "—"} • Helmet: {q.helmet || "—"} • Finish: {q.finish || "—"} • Qty: {q.quantity}
            </div>
            <div className="text-xs text-white/50 mt-1">Budget: {q.budget || "—"} • Deadline: {q.deadline || "—"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
