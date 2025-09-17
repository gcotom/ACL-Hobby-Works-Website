"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function QuoteThanksPage() {
  const params = useSearchParams();
  const name = (params.get("name") || "").trim();

  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-4xl md:text-5xl text-gradient">
        Request received{ name ? `, ${name}` : "" }!
      </h1>
      <p className="mt-4 text-white/80">
        Thanks for sending your custom trooper idea. We’ll review the details and reply to your email within
        <span className="font-semibold"> 1–2 business days</span>.
      </p>

      <div className="mt-6 text-sm text-white/60">
        <p>Tip: check your spam folder just in case.</p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <Link href="/shop" className="btn-primary btn-tech">Browse Shop</Link>
        <Link href="/gallery" className="btn-ghost">View Gallery</Link>
      </div>
    </section>
  );
}
