"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { Orbitron, Rajdhani } from "next/font/google";

const display = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});
const sans = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`nav-link hover:text-white ${isActive ? "text-white nav-link-active" : "text-white/70"}`}
    >
      {label}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onQuotePage = pathname === "/quote";

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} min-h-screen text-white app-bg bg-grid`}>
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur header-glass">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={Logo}
                width={32}
                height={32}
                alt="ACL Hobby Works logo"
                className="rounded-sm ring-1 ring-white/10"
                priority
              />
              <span className="font-display font-semibold tracking-wider uppercase">
                ACL Hobby Works
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLink href="/" label="Home" />
              <NavLink href="/gallery" label="Gallery" />
              <NavLink href="/shop" label="Shop" />
              <NavLink href="/quote" label="Get a Quote" />
            </nav>

            <Link
              href="/quote"
              className={`btn-primary btn-tech transition ${onQuotePage ? "animate-pulse" : ""}`}
            >
              Request Custom
            </Link>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-white/70 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={Logo}
                width={20}
                height={20}
                alt="ACL logo small"
                className="rounded-sm ring-1 ring-white/10"
              />
              <p>
                © {new Date().getFullYear()} ACL Hobby Works. Not affiliated with LEGO® or
                Lucasfilm™.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white nav-link">Instagram</a>
              <a href="#" className="hover:text-white nav-link">Shop</a>
              <Link href="/quote" className="hover:text-white nav-link">Custom Request</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
