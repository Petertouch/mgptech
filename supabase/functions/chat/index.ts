import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Compact project summary to save tokens
function summarizeProjects(projects: Record<string, unknown>[]): string {
  if (!projects.length) return "No hay proyectos disponibles actualmente.";
  return projects
    .map((p: Record<string, unknown>) => {
      const phases = (p.project_phases as Record<string, unknown>[]) || [];
      const phaseStr = phases
        .map((ph: Record<string, unknown>) => `F${ph.phase_number}:${ph.phase_name}(${ph.status})`)
        .join(", ");
      return `- ${p.name} | ${p.location} | ${p.status} | ${p.investment_type} | $${p.total_value} | ${p.sqft}sqft ${p.bedrooms}bd/${p.bathrooms}ba | Fase actual:${p.current_phase} | Fases:[${phaseStr}] | ${(p.description as string || "").slice(0, 150)}`;
    })
    .join("\n");
}

function summarizeInvestorProjects(data: Record<string, unknown>[]): string {
  if (!data.length) return "No tienes proyectos asignados.";
  return data
    .map((inv: Record<string, unknown>) => {
      const p = inv.project as Record<string, unknown>;
      if (!p) return "";
      const phases = (p.project_phases as Record<string, unknown>[]) || [];
      const phaseStr = phases
        .map((ph: Record<string, unknown>) => `F${ph.phase_number}:${ph.phase_name}(${ph.status})`)
        .join(", ");
      return `- ${p.name} | ${p.location} | ${p.status} | Inversión:$${inv.invested_amount} (${inv.investment_date}) | Fase actual:${p.current_phase} | Fases:[${phaseStr}]`;
    })
    .filter(Boolean)
    .join("\n");
}

async function getPublicProjects() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("projects")
    .select("name, description, location, status, investment_type, total_value, sqft, bedrooms, bathrooms, current_phase, project_phases(phase_number, phase_name, status)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

async function getInvestorProjects(investorId: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("project_investors")
    .select(`
      invested_amount, investment_date,
      project:projects(name, location, status, current_phase,
        project_phases(phase_number, phase_name, status))
    `)
    .eq("investor_id", investorId);
  return data || [];
}

async function authenticateInvestor(email: string, password: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || SUPABASE_SERVICE_ROLE_KEY;
  const authClient = createClient(SUPABASE_URL, anonKey);

  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "investor") return null;
  return { id: profile.id, name: profile.full_name, session: data.session };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, mode, credentials } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only keep last 6 messages to save tokens
    const recentMessages = messages.slice(-6);

    let systemPrompt = "";
    let investorInfo = null;

    if (mode === "investor" && credentials) {
      const investor = await authenticateInvestor(credentials.email, credentials.password);
      if (!investor) {
        return new Response(
          JSON.stringify({ error: "auth_failed", message: "Credenciales inválidas" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      investorInfo = { id: investor.id, name: investor.name };
      const projects = await getInvestorProjects(investor.id);

      systemPrompt = `Eres el asistente EXCLUSIVO de MGP Capital Group. SOLO respondes sobre los proyectos de este inversionista. No respondes preguntas sobre otros temas.

Inversionista: **${investor.name}**

PROYECTOS:
${summarizeInvestorProjects(projects as Record<string, unknown>[])}

REGLAS ESTRICTAS:
- SOLO responde sobre los proyectos listados arriba
- Si preguntan algo que NO sea sobre estos proyectos, responde: "Solo puedo ayudarte con información sobre tus proyectos en MGP Capital Group. ¿Qué te gustaría saber sobre ellos?"
- No respondas preguntas generales, de cultura, matemáticas, código, ni nada fuera de MGP
- Responde en español, máximo 3-4 oraciones
- Usa **negritas** para proyectos, cifras y datos clave
- Usa listas con viñetas (-) para múltiples items
- No inventes datos`;
    } else {
      const projects = await getPublicProjects();

      systemPrompt = `Eres el asistente EXCLUSIVO de MGP Capital Group. SOLO respondes sobre los proyectos inmobiliarios de MGP. No respondes preguntas sobre otros temas.

MGP Capital Group: inversión inmobiliaria en Ohio, Georgia y Florida. Especialistas en Value-Add Investing & Homebuilding.

PROYECTOS:
${summarizeProjects(projects as Record<string, unknown>[])}

REGLAS ESTRICTAS:
- SOLO responde sobre MGP Capital Group y los proyectos listados arriba
- Si preguntan algo que NO sea sobre MGP o sus proyectos, responde: "Solo puedo ayudarte con información sobre los proyectos de MGP Capital Group. ¿Qué te gustaría saber?"
- No respondas preguntas generales, de cultura, matemáticas, código, ni nada fuera de MGP
- Responde en español, máximo 3-4 oraciones
- Usa **negritas** para proyectos, ubicaciones y datos clave
- Usa listas con viñetas (-) para múltiples items
- No compartas montos financieros sensibles
- Invita a contactar al equipo para invertir`;
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    const groqResult = await groqResponse.json();

    if (!groqResult.choices?.[0]?.message) {
      console.error("[chat] Groq error:", JSON.stringify(groqResult));
      return new Response(
        JSON.stringify({ error: "ai_error", message: "Error al procesar tu mensaje", debug: groqResult.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        reply: groqResult.choices[0].message.content,
        investorInfo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[chat] Error:", err);
    return new Response(
      JSON.stringify({ error: "server_error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
