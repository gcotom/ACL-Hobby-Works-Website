export default function GalleryPage() {
  const items = ["Captain Rex","501st Trooper","Custom ARC","Commander Cody","Siege Battalion","Your Design"];
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center text-gradient animate-in">
        Our Latest Clones
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((name, i) => (
          <div
            key={name}
            className={`rounded-3xl overflow-hidden card-glass transition hover:-translate-y-1 animate-in ${i%3===0?'delay-1':i%3===1?'delay-2':'delay-3'}`}
          >
            <div className="aspect-square bg-acl-gradient" />
            <div className="p-4 text-white">
              <h3 className="font-display tracking-wide">{name}</h3>
              <p className="text-sm text-white/80 mt-1">Premium custom finish, ready for display or battle scenes.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
