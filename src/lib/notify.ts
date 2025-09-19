import type { Quote } from "@prisma/client";

type QuoteLike = Pick<
  Quote,
  | "id"
  | "name"
  | "email"
  | "baseLegion"
  | "helmet"
  | "finish"
  | "quantity"
  | "refs"
  | "budget"
  | "deadline"
  | "notes"
  | "createdAt"
>;

export async function sendQuoteNotifications(q: QuoteLike) {
  await Promise.allSettled([sendOwnerEmail(q), sendCustomerReceipt(q), sendSlack(q)]);
}

/** Email to you (shop owner) */
async function sendOwnerEmail(q: QuoteLike) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const subject = `New Quote — ${q.name} (${q.email})`;
  const lines = summaryLines(q).join("\n");

  await resend.emails.send({
    from: process.env.NOTIFY_FROM ?? "ACL Hobby Works <onboarding@resend.dev>",
    to,
    subject,
    text: lines,
    html: htmlSummary(q),
    reply_to: q.email || undefined,
  });
}

/** Auto-reply to the customer */
async function sendCustomerReceipt(q: QuoteLike) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !q.email) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: process.env.NOTIFY_FROM ?? "ACL Hobby Works <onboarding@resend.dev>",
    to: q.email,
    subject: "We received your quote request — ACL Hobby Works",
    text:
      `Hi ${q.name || "there"},\n\n` +
      `Thanks for your request! We’ll review everything and reply within 1–2 business days.\n\n` +
      summaryLines(q).join("\n") +
      `\n\n— ACL Hobby Works`,
    html: htmlReceipt(q),
  });
}

/** Optional Slack notification (Incoming Webhook URL) */
async function sendSlack(q: QuoteLike) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    text: `*New Quote* — ${q.name} (${q.email})`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: "New Quote" } },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name:*\n${q.name}` },
          { type: "mrkdwn", text: `*Email:*\n${q.email}` },
          { type: "mrkdwn", text: `*Legion:*\n${q.baseLegion || "—"}` },
          { type: "mrkdwn", text: `*Helmet:*\n${q.helmet || "—"}` },
          { type: "mrkdwn", text: `*Finish:*\n${q.finish || "—"}` },
          { type: "mrkdwn", text: `*Qty:*\n${q.quantity}` },
          { type: "mrkdwn", text: `*Budget:*\n${q.budget || "—"}` },
          { type: "mrkdwn", text: `*Deadline:*\n${q.deadline || "—"}` },
        ],
      },
      { type: "section", text: { type: "mrkdwn", text: `*Refs:*\n${q.refs || "—"}` } },
      { type: "section", text: { type: "mrkdwn", text: `*Notes:*\n${q.notes || "—"}` } },
      { type: "context", elements: [{ type: "mrkdwn", text: `Quote ID: ${q.id}` }] },
    ],
  };

  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* ---------------- helpers ---------------- */

function summaryLines(q: QuoteLike) {
  return [
    `Submitted: ${q.createdAt?.toISOString?.() ?? new Date().toISOString()}`,
    `Name: ${q.name}`,
    `Email: ${q.email}`,
    `Legion: ${q.baseLegion || "—"}`,
    `Helmet: ${q.helmet || "—"}`,
    `Finish: ${q.finish || "—"}`,
    `Quantity: ${q.quantity}`,
    `Budget: ${q.budget || "—"}`,
    `Deadline: ${q.deadline || "—"}`,
    `Refs: ${q.refs || "—"}`,
    `Notes: ${q.notes || "—"}`,
    `Quote ID: ${q.id}`,
  ];
}

function htmlSummary(q: QuoteLike) {
  return baseHtml(
    `<h2 style="margin:0 0 12px">New Quote</h2>` + tableHtml(q) + footerHtml()
  );
}
function htmlReceipt(q: QuoteLike) {
  return baseHtml(
    `<h2 style="margin:0 0 12px">We received your request</h2>
     <p style="margin:0 0 12px;color:#9aa4b2">Thanks! We’ll reply within 1–2 business days.</p>` +
      tableHtml(q) +
      footerHtml()
  );
}

function tableHtml(q: QuoteLike) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 8px;color:#9aa4b2">${k}</td><td style="padding:6px 8px;color:#e5e7eb">${v || "—"}</td></tr>`;
  return `
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0b1220;border:1px solid #1f2937;border-radius:12px;overflow:hidden;width:100%">
    ${row("Name", q.name)}
    ${row("Email", q.email)}
    ${row("Legion", q.baseLegion || "")}
    ${row("Helmet", q.helmet || "")}
    ${row("Finish", q.finish || "")}
    ${row("Quantity", String(q.quantity))}
    ${row("Budget", q.budget || "")}
    ${row("Deadline", q.deadline || "")}
    ${row("Refs", q.refs || "")}
    ${row("Notes", q.notes || "")}
    ${row("Quote ID", q.id)}
  </table>`;
}

function baseHtml(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#0a0f14;padding:24px;font-family:ui-sans-serif,system-ui">
    <div style="max-width:640px;margin:0 auto;background:#0f1724;padding:20px;border:1px solid #1f2937;border-radius:14px">
      ${inner}
    </div>
  </body></html>`;
}

function footerHtml() {
  return `<p style="margin:12px 0 0;color:#6b7280;font-size:12px">© ${new Date().getFullYear()} ACL Hobby Works</p>`;
}
