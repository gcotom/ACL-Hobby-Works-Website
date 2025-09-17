"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Load the widget only on the client to avoid SSR issues.
// Casting to any avoids type nags if the lib types aren't found.
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false }) as any;

export default function CaptchaField({
  siteKey,            // optional prop
  captchaError,       // show error if bounced back with ?error=captcha
}: {
  siteKey?: string;
  captchaError?: boolean;
}) {
  const [token, setToken] = useState("");

  // ✅ Fallback to NEXT_PUBLIC_ env on the client
  const key =
    siteKey ??
    (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string | undefined) ??
    "";

  const enabled = Boolean(key);

  return (
    <>
      {captchaError && (
        <div className="mb-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Please complete the reCAPTCHA and try again.
        </div>
      )}

      {enabled ? (
        <div className="mt-1">
          <ReCAPTCHA sitekey={key} onChange={(val: string | null) => setToken(val || "")} />
          {/* Send token to the server action */}
          <input type="hidden" name="recaptchaToken" value={token} />
        </div>
      ) : (
        <p className="text-xs text-yellow-300/80">
          reCAPTCHA not configured — set <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and{" "}
          <code>RECAPTCHA_SECRET_KEY</code> in your <code>.env</code>.
        </p>
      )}
    </>
  );
}
