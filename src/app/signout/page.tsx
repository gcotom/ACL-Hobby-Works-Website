"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    // NextAuth v5: use redirectTo, not callbackUrl
    signOut({ redirectTo: "/" });
  }, []);

  return (
    <section className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-2xl text-gradient">Signing you out…</h1>
      <p className="mt-3 text-white/70">
        If nothing happens, refresh the page or use the “Sign out” button in the navbar.
      </p>
    </section>
  );
}
    