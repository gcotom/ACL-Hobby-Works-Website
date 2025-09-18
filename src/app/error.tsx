"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body className="min-h-screen bg-[#0a0f14] text-white">
        <section className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-4xl text-gradient">Something went wrong</h1>
          <p className="mt-3 text-white/70">We’re on it. Please try again in a moment.</p>
          {error?.digest && <p className="mt-2 text-xs text-white/40">Error ID: {error.digest}</p>}
          <a href="/" className="btn-primary btn-tech mt-8 inline-block">Back to home</a>
        </section>
      </body>
    </html>
  );
}
