import { supabase } from "@/lib/supabase";
import type { EmailEventKey } from "@/types/emailTemplate";

const SUPABASE_URL = "https://ngklmluckyetcshnzpgv.supabase.co";

interface SendEmailParams {
  eventKey: EmailEventKey;
  to: string;
  variables: Record<string, string>;
  recipientId?: string;
}

export async function sendEventEmail({ eventKey, to, variables, recipientId }: SendEmailParams): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2xtbHVja3lldGNzaG56cGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTcyOTEsImV4cCI6MjA5MDEzMzI5MX0.Gax424G3QueolbPjTkfmVGOZbBfVVDnpLacZ15KolKA",
      },
      body: JSON.stringify({ eventKey, to, variables, recipientId }),
    });

    const result = await response.json();

    if (!result.success) {
      console.warn(`[email] Failed to send ${eventKey} to ${to}:`, result);
      return false;
    }

    console.log(`[email] Sent ${eventKey} to ${to}`);
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
