import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

type EstadoPagina = "validando" | "formulario" | "sucesso" | "erro";

export default function RecuperacaodeSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [estado, setEstado] = useState<EstadoPagina>("validando");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");
  const [nomeUtilizador, setNomeUtilizador] = useState("");

  // Valida o token ao montar
  useEffect(() => {
    if (!token) {
      setEstado("erro");
      setErroMensagem("Link inválido ou em falta.");
      return;
    }

    const validarToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/validar-token-recuperacao`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Token inválido ou expirado.");
        setNomeUtilizador(data.nome || "");
        setEstado("formulario");
      } catch (err) {
        setErroMensagem(
          err instanceof Error ? err.message : "Erro ao validar o link.",
        );
        setEstado("erro");
      }
    };

    validarToken();
  }, [token]);

  const senhasConferem =
    novaSenha === confirmarSenha && confirmarSenha.length > 0;
  const senhaValida = novaSenha.length >= 6;

  const handleSubmit = async () => {
    if (!senhaValida) return;
    if (!senhasConferem) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/redefinir-senha-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao redefinir senha.");
      setEstado("sucesso");
    } catch (err) {
      setErroMensagem(
        err instanceof Error ? err.message : "Erro desconhecido.",
      );
      setEstado("erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10" />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #268cff 0%, transparent 70%)",
          }}
        />
        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#184d8a 1px, transparent 1px), linear-gradient(90deg, #184d8a 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg mb-4"
            style={{ boxShadow: "0 8px 32px rgba(24,77,138,0.35)" }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f2d54] tracking-tight">
            ClassCash
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plataforma de Gestão Escolar
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(24,77,138,0.12)" }}
        >
          {/* ── ESTADO: Validando ── */}
          {estado === "validando" && (
            <div className="p-10 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#184d8a] animate-spin" />
              <p className="text-sm text-slate-500 font-medium">
                A validar o seu link…
              </p>
            </div>
          )}

          {/* ── ESTADO: Formulário ── */}
          {estado === "formulario" && (
            <>
              {/* Header do card */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#184d8a]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base leading-tight">
                      Redefinir Senha
                    </h2>
                    {nomeUtilizador && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Olá,{" "}
                        <span className="font-semibold text-[#184d8a]">
                          {nomeUtilizador}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos */}
              <div className="px-8 py-6 space-y-5">
                {/* Nova senha */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarNova ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarNova(!mostrarNova)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#184d8a] transition-colors p-1"
                    >
                      {mostrarNova ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Feedback mínimo */}
                  {novaSenha.length > 0 && !senhaValida && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> A senha deve ter pelo
                      menos 6 caracteres
                    </p>
                  )}
                  {senhaValida && (
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Senha válida
                    </p>
                  )}
                </div>

                {/* Confirmar senha */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarConfirmar ? "text" : "password"}
                      placeholder="Repita a nova senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#184d8a] transition-colors p-1"
                    >
                      {mostrarConfirmar ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmarSenha.length > 0 && !senhasConferem && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> As senhas não coincidem
                    </p>
                  )}
                  {senhasConferem && (
                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> As senhas coincidem
                    </p>
                  )}
                </div>
              </div>

              {/* Botão */}
              <div className="px-8 pb-8">
                <button
                  onClick={handleSubmit}
                  disabled={!senhaValida || !senhasConferem || loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #268cff 0%, #184d8a 100%)",
                    boxShadow: "0 4px 20px rgba(24,77,138,0.3)",
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "A guardar…" : "Redefinir Senha"}
                </button>
              </div>
            </>
          )}

          {/* ── ESTADO: Sucesso ── */}
          {estado === "sucesso" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Senha redefinida!
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  A sua senha foi actualizada com sucesso.
                  <br />
                  Pode fazer login agora.
                </p>
              </div>
              <button
                onClick={() => navigate("/Login")}
                className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #268cff 0%, #184d8a 100%)",
                  boxShadow: "0 4px 20px rgba(24,77,138,0.3)",
                }}
              >
                Ir para o Login
              </button>
            </div>
          )}

          {/* ── ESTADO: Erro ── */}
          {estado === "erro" && (
            <div className="p-10 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Link inválido
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {erroMensagem || "Este link expirou ou já foi utilizado."}
                </p>
              </div>
              <button
                onClick={() => navigate("/Login")}
                className="w-full border border-[#184d8a]/30 text-[#184d8a] font-bold py-3.5 rounded-xl text-sm hover:bg-primary hover:text-white transition-all"
              >
                Voltar ao Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          ClassCash © {new Date().getFullYear()} — Plataforma de Gestão Escolar
        </p>
      </div>
    </div>
  );
}
