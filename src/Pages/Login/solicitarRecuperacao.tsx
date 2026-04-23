import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

type Estado = "formulario" | "enviado" | "erro";

export default function SolicitarRecuperacao() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("formulario");
  const [loading, setLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState("");

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErroMsg("");

    try {
      const res = await fetch(`${API_BASE}/solicitar-recuperacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar email.");
      setEstado("enviado");
    } catch (err) {
      setErroMsg(err instanceof Error ? err.message : "Erro desconhecido.");
      setEstado("erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #184d8a 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #268cff 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#184d8a 1px, transparent 1px), linear-gradient(90deg, #184d8a 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg mb-4"
            style={{ boxShadow: "0 8px 32px rgba(24,77,138,0.35)" }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f2d54] tracking-tight">ClassCash</h1>
          <p className="text-sm text-slate-500 mt-1">Plataforma de Gestão Escolar</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(24,77,138,0.12)" }}
        >

          {/* ── ESTADO: Formulário ── */}
          {estado === "formulario" && (
            <>
              <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#184d8a]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base leading-tight">
                      Recuperar Senha
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Insira o seu email e enviaremos um link
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleEnviar} className="px-8 py-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Endereço de Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="oseuemail@exemplo.ao"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    O link será válido por <span className="font-semibold text-slate-500">24 horas</span>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #268cff 0%, #184d8a 100%)",
                    boxShadow: "0 4px 20px rgba(24,77,138,0.3)",
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "A enviar…" : "Enviar Link de Recuperação"}
                </button>
              </form>

              <div className="px-8 pb-8">
                <Link
                  to="/Login"
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#184d8a] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar ao Login
                </Link>
              </div>
            </>
          )}

          {/* ── ESTADO: Enviado ── */}
          {estado === "enviado" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Email enviado!</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Se o endereço <span className="font-semibold text-slate-700">{email}</span> estiver
                  registado, receberá um link para redefinir a senha.
                </p>
              </div>
              <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
                <p className="text-xs text-amber-700 leading-relaxed">
                  ⚠️ Verifique também a pasta de <strong>spam</strong>. O link expira em <strong>24 horas</strong>.
                </p>
              </div>
              <Link
                to="/Login"
                className="w-full flex items-center justify-center gap-2 border border-[#184d8a]/30 text-[#184d8a] font-bold py-3.5 rounded-xl text-sm hover:bg-primary hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Link>
            </div>
          )}

          {/* ── ESTADO: Erro ── */}
          {estado === "erro" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Algo correu mal</h3>
                <p className="text-sm text-slate-500 mt-1">{erroMsg}</p>
              </div>
              <button
                onClick={() => { setEstado("formulario"); setErroMsg(""); }}
                className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                style={{ background: "linear-gradient(135deg, #268cff 0%, #184d8a 100%)" }}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          ClassCash © {new Date().getFullYear()} — Plataforma de Gestão Escolar
        </p>
      </div>
    </div>
  );
}
