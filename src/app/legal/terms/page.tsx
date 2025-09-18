export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 prose prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>ACL Hobby Works</strong> provides custom LEGO®-compatible figures and accessories.</p>
      <p><em>Disclaimer:</em> ACL Hobby Works is not affiliated with The LEGO Group, Disney, or Lucasfilm. LEGO® is a trademark of the LEGO Group. Star Wars™ and related properties are trademarks of Lucasfilm Ltd.</p>
      <h2>Use of the Site</h2>
      <p>By using this site you agree to our terms and any policies referenced here.</p>
      <h2>Orders & Quotes</h2>
      <p>Quotes are estimates and not binding until confirmed. Custom orders are hand-crafted and may vary slightly.</p>
      <h2>Shipping & Returns</h2>
      <p>We carefully package items. For issues on arrival, contact us within 7 days.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:you@yourmail.com">you@yourmail.com</a></p>
    </section>
  );
}
// Note: This is a static page. For dynamic functionality (e.g., forms), see other files like quote/page.tsx.