import { prisma } from "@/lib/db";

export default async function ShopPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center text-gradient animate-in">
        Shop Highlights
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <div
            key={p.id}
            className={`p-6 rounded-3xl card-glass flex flex-col hover:-translate-y-1 transition animate-in ${i%3===0?'delay-1':i%3===1?'delay-2':'delay-3'}`}
          >
            <div className="aspect-square rounded-2xl mb-4 bg-acl-gradient" />
            <h3 className="font-display tracking-wide text-lg">{p.name}</h3>
            <p className="text-sm text-white/80 flex-grow">{p.description}</p>
            <p className="mt-2 text-xl font-bold">${(p.priceCents/100).toFixed(2)}</p>
            <button className="mt-4 btn-primary btn-tech">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}
