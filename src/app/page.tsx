import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Headline + CTAs + badges */}
        <div>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-acl-300 mb-3 animate-in">
            Clone Army Ready
          </p>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-gradient animate-in delay-1">
            Custom LEGO® Clone Troopers
          </h1>

          <p className="mt-5 text-white/80 max-w-xl animate-in delay-2">
            Hand-built minifigures with authentic LEGO® parts, premium water-slide decals, and AV Figures accessories.
            Commission your dream design or build out your battalion with collector-grade quality.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 animate-in delay-3">
            <Link href="/shop" className="btn-primary btn-tech">Shop Now</Link>
            <Link href="/quote" className="btn-ghost">Request Custom</Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs animate-in delay-4">
            <span className="px-3 py-1 rounded-full border border-white/15 text-white/80">Official LEGO® Base</span>
            <span className="px-3 py-1 rounded-full border border-white/15 text-white/80">AV Figures Accessories</span>
            <span className="px-3 py-1 rounded-full border border-white/15 text-white/80">Collector-Grade Finish</span>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-3 animate-in delay-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="font-display text-xl">500+</div>
              <div className="text-xs text-white/70">Figures built</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="font-display text-xl">30+</div>
              <div className="text-xs text-white/70">Legions covered</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="font-display text-xl">Worldwide</div>
              <div className="text-xs text-white/70">Shipping</div>
            </div>
          </div>
        </div>

        {/* Right: Spotlight panel */}
        <div className="relative animate-in delay-2">
          <div className="rounded-3xl card-glass overflow-hidden">
            {/* Gradient edge highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl"
                 style={{
                   boxShadow:
                     "inset 0 0 0 1px rgba(255,255,255,.06), inset 0 0 40px rgba(88,125,255,.12)",
                 }} />
            <div className="p-5 sm:p-6">
              <div className="aspect-[4/3] rounded-2xl bg-[radial-gradient(60%_60%_at_50%_40%,rgba(122,162,255,.25),rgba(34,255,214,.12)_60%,transparent_70%)] grid place-items-center">
                <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
                  Product spotlight — photo carousel coming soon
                </div>
              </div>

              {/* Quick bullets */}
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-display text-sm tracking-wide">Weathered or Gloss</div>
                  <p className="text-xs text-white/70 mt-1">
                    Choose matte, gloss, or battle-worn finishes.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="font-display text-sm tracking-wide">Phase I / II Helmets</div>
                  <p className="text-xs text-white/70 mt-1">
                    501st, 212th, Coruscant Guard, Wolfpack & more.
                  </p>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <Link href="/gallery" className="nav-link text-white/80 hover:text-white">
                  Explore Gallery
                </Link>
                <Link href="/quote" className="btn-primary btn-tech">
                  Start a Custom
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee (units/keywords) */}
      <div className="border-t border-white/10 border-b bg-white/5/0">
        <div className="overflow-hidden">
          <ul
            className="flex whitespace-nowrap animate-in"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            {[
              "501st Legion",
              "212th Attack",
              "Coruscant Guard",
              "Wolfpack",
              "ARC Troopers",
              "Airborne",
              "Geonosis",
              "Custom Commissions",
            ].map((item, i) => (
              <li
                key={item + i}
                className="px-6 py-3 text-xs text-white/70"
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature strip */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Premium Materials",
            desc: "Authentic LEGO® + AV Figures accessories for top-tier builds.",
          },
          {
            title: "Made to Order",
            desc: "Describe your vision — we’ll create it to spec.",
          },
          {
            title: "Collector Friendly",
            desc: "Sealed & finished for display, animation, or dioramas.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:-translate-y-0.5 transition">
            <div className="font-display text-sm tracking-wider">{f.title}</div>
            <p className="text-xs text-white/70 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
