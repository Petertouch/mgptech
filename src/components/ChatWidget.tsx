import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, LogIn, LogOut, Loader2 } from "lucide-react";

const SUPABASE_URL = "https://ngklmluckyetcshnzpgv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2xtbHVja3lldGNzaG56cGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTcyOTEsImV4cCI6MjA5MDEzMzI5MX0.Gax424G3QueolbPjTkfmVGOZbBfVVDnpLacZ15KolKA";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InvestorSession {
  email: string;
  password: string;
  name: string;
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        const isBullet = /^[-*•]\s/.test(trimmed);
        const content = isBullet ? trimmed.replace(/^[-*•]\s/, "") : trimmed;

        const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return (
              <em key={j} className="italic">
                {part.slice(1, -1)}
              </em>
            );
          }
          return <span key={j}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-[#D4AF37] mt-0.5 text-xs">&#9679;</span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }

        return <p key={i}>{parts}</p>;
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [investor, setInvestor] = useState<InvestorSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: investor
            ? `**¡Hola, ${investor.name}!**\nSoy tu asistente de MGP Capital Group. Pregúntame sobre tus proyectos de inversión.`
            : "**Bienvenido a MGP Capital Group**\nSoy tu asistente virtual. Puedo informarte sobre nuestros proyectos inmobiliarios.\n\n¿Eres inversionista? Inicia sesión para consultar tus proyectos.",
        },
      ]);
    }
  }, [open, investor]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        mode: investor ? "investor" : "public",
      };

      if (investor) {
        body.credentials = { email: investor.email, password: investor.password };
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.error === "auth_failed") {
        setInvestor(null);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Tu sesión ha expirado. Inicia sesión de nuevo." },
        ]);
      } else if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Lo siento, hubo un error. Intenta de nuevo." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de conexión. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hola, quiero ver mis proyectos" }],
          mode: "investor",
          credentials: { email: loginEmail, password: loginPassword },
        }),
      });

      const data = await res.json();

      if (data.error === "auth_failed") {
        setLoginError("Email o contraseña incorrectos");
      } else if (data.reply) {
        setInvestor({
          email: loginEmail,
          password: loginPassword,
          name: data.investorInfo?.name || loginEmail,
        });
        setMessages([{ role: "assistant", content: data.reply }]);
        setShowLogin(false);
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch {
      setLoginError("Error de conexión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setInvestor(null);
    setShowLogin(false);
    setMessages([
      {
        role: "assistant",
        content: "**Sesión cerrada.**\nPuedo seguir ayudándote con información general sobre nuestros proyectos.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#D4AF37] text-[#0B1F3A] shadow-lg hover:bg-[#c4a030] transition-all hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-[#0B1F3A]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1a30] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">MGP Asistente</p>
                {investor ? (
                  <p className="text-[10px] text-[#D4AF37] font-medium">{investor.name}</p>
                ) : (
                  <p className="text-[10px] text-gray-500">En línea</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {investor ? (
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              ) : !showLogin ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-semibold hover:bg-[#D4AF37]/25 transition-colors flex items-center gap-1"
                >
                  <LogIn className="h-3 w-3" /> Login
                </button>
              ) : null}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Login Panel - fixed section, not inside a message */}
          {showLogin && !investor && (
            <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10">
              <form onSubmit={handleLogin} className="space-y-2">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Acceso Inversionistas</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                />
                {loginError && <p className="text-[11px] text-red-400">{loginError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowLogin(false); setLoginError(""); }}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-[#0B1F3A] text-xs font-semibold hover:bg-[#c4a030] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {loginLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="h-3.5 w-3.5" /> Entrar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#D4AF37] text-[#0B1F3A] rounded-br-sm font-medium"
                      : "bg-white/[0.07] text-gray-300 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <RichText text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.07] px-4 py-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#D4AF37]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#D4AF37]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10 bg-[#0a1a30]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={investor ? "Pregunta sobre tus proyectos..." : "Escribe tu pregunta..."}
                className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#c4a030] transition-colors disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
