import { supabase } from "@/lib/supabase";
import type { EmailEventKey } from "@/types/emailTemplate";

const RESEND_API_KEY = "re_CuiX3iTg_AGwem7YEDaUGx6aZarSBYVEe";
const FROM_EMAIL = "MGP Capital Group <onboarding@resend.dev>"; // Change to noreply@grupomgp.com after domain verification

interface SendEmailParams {
  eventKey: EmailEventKey;
  to: string;
  variables: Record<string, string>;
  recipientId?: string;
}

function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function wrapInLayout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Montserrat',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <tr><td style="background:#0B1F3A;padding:24px 32px;text-align:center">
          <h2 style="margin:0;color:#D4AF37;font-size:22px;font-weight:700;letter-spacing:1px">MGP CAPITAL GROUP</h2>
          <p style="margin:4px 0 0;color:#8899aa;font-size:11px;letter-spacing:2px">VALUE-ADD INVESTING & HOMEBUILDING</p>
        </td></tr>
        <tr><td style="padding:32px 32px 40px;color:#333;font-size:15px;line-height:1.7">
          ${bodyHtml}
        </td></tr>
        <tr><td style="background:#0B1F3A;padding:20px 32px;text-align:center">
          <p style="margin:0;color:#667;font-size:12px">© ${new Date().getFullYear()} MGP Capital Group LLC. Todos los derechos reservados.</p>
          <p style="margin:6px 0 0;color:#556;font-size:11px">Ohio · Georgia · Florida</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEventEmail({ eventKey, to, variables, recipientId }: SendEmailParams): Promise<boolean> {
  try {
    // Fetch template
    const { data: template, error: tplError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("event_key", eventKey)
      .eq("is_active", true)
      .single();

    if (tplError || !template) {
      console.warn(`[email] No active template for event: ${eventKey}`);
      return false;
    }

    // Replace variables
    const subject = replaceVariables(template.subject, variables);
    const bodyHtml = replaceVariables(template.body_html, variables);
    const html = wrapInLayout(bodyHtml);

    // Send via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    const result = await response.json();

    // Log the email
    await supabase.from("email_logs").insert({
      template_id: template.id,
      event_key: eventKey,
      recipient_email: to,
      recipient_id: recipientId ?? null,
      subject,
      status: result.id ? "sent" : "failed",
      error_message: result.id ? null : JSON.stringify(result),
      sent_at: result.id ? new Date().toISOString() : null,
      metadata: variables,
    });

    if (!result.id) {
      console.error(`[email] Failed to send ${eventKey} to ${to}:`, result);
      return false;
    }

    console.log(`[email] Sent ${eventKey} to ${to} (${result.id})`);
    return true;
  } catch (err) {
    console.error(`[email] Error sending ${eventKey}:`, err);
    return false;
  }
}

// Helper: send to all investors of a project
export async function sendToProjectInvestors(
  projectId: string,
  eventKey: EmailEventKey,
  variables: Record<string, string>
): Promise<void> {
  const { data: investors } = await supabase
    .from("project_investors")
    .select("investor_id, investor:profiles(full_name, email)")
    .eq("project_id", projectId);

  if (!investors) return;

  for (const inv of investors) {
    const profile = inv.investor as unknown as { full_name: string; email: string };
    if (!profile?.email) continue;
    await sendEventEmail({
      eventKey,
      to: profile.email,
      recipientId: inv.investor_id,
      variables: { ...variables, investor_name: profile.full_name },
    });
  }
}

// Helper: send to all investors
export async function sendToAllInvestors(
  eventKey: EmailEventKey,
  variables: Record<string, string>
): Promise<void> {
  const { data: investors } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "investor");

  if (!investors) return;

  for (const inv of investors) {
    await sendEventEmail({
      eventKey,
      to: inv.email,
      recipientId: inv.id,
      variables: { ...variables, investor_name: inv.full_name },
    });
  }
}
