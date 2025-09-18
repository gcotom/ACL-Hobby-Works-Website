export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>We collect only the information you provide (like name and email) to respond to your quote requests and orders.</p>
      <h2>What We Collect</h2>
      <ul>
        <li>Contact details from the quote form</li>
        <li>Optional reference links you share</li>
      </ul>
      <h2>How We Use It</h2>
      <ul>
        <li>To contact you with a quote</li>
        <li>To fulfill an agreed order</li>
        <li>To send status updates you request</li>
      </ul>
      <h2>Third Parties</h2>
      <p>We use trusted providers to send emails (Resend) and host this site (Vercel). We don’t sell your data.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:you@yourmail.com">you@yourmail.com</a></p>
      <p className="text-xs opacity-70">Last updated {new Date().toLocaleDateString()}</p>
    </section>
  );
}
// Note: This is a static page. For dynamic functionality (e.g., forms), see other files like quote/page.tsx.