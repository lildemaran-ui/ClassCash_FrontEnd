// src/components/Admin/ModalDetalhesUtilizador.tsx
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { getToken } from "@/types/global/sessao";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

type Perfil = "Encarregado" | "Estudante" | "Instituição" | string;
type StatusAcesso = "Ativo" | "Inativo" | "Bloqueado";

export interface UtilizadorDetalhes {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  instituicao: string;
  status: StatusAcesso;
  planoActivo: boolean;
  ultimoAcesso: string;
}

interface Props {
  utilizador: UtilizadorDetalhes;
  onClose: () => void;
  onUpdated?: () => void;
}

// ─── Gera senha aleatória segura ──────────────────────────────────────────────
function gerarSenha(comprimento = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
  return Array.from(crypto.getRandomValues(new Uint8Array(comprimento)))
    .map((b) => chars[b % chars.length])
    .join("");
}

// ─── Badge de perfil ──────────────────────────────────────────────────────────
const PERFIL_COR: Record<string, string> = {
  Encarregado: "bg-purple-100 text-purple-700 border-purple-200",
  Estudante: "bg-blue-100 text-blue-700 border-blue-200",
  Instituição: "bg-gray-100 text-gray-600 border-gray-200",
  Secretaria: "bg-teal-100 text-teal-700 border-teal-200",
  Administrador: "bg-amber-100 text-amber-700 border-amber-200",
};

const STATUS_COR: Record<string, string> = {
  Ativo: "bg-green-100 text-green-700",
  Inativo: "bg-gray-100 text-gray-500",
  Bloqueado: "bg-red-100 text-red-600",
};

// ─── Modal principal ──────────────────────────────────────────────────────────
export default function ModalDetalhesUtilizador({ utilizador, onClose, onUpdated }: Props) {
  // "idle" | "escolher" | "gerar" | "link" | "sucesso_gerar" | "sucesso_link"
  const [etapa, setEtapa] = useState<string>("idle");
  const [novaSenha, setNovaSenha] = useState<string>("");
  const [senhaCopiada, setSenhaCopiada] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Método 1: Gerar nova senha e definir no backend ───────────────────────
  const handleGerarSenha = async () => {
    const senha = gerarSenha();
    setNovaSenha(senha);
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/admin/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idusuario: utilizador.id, novaSenha: senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao redefinir senha");
      setEtapa("sucesso_gerar");
      onUpdated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // ── Método 2: Enviar link de recuperação por email ────────────────────────
  const handleEnviarLink = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/admin/enviar-link-recuperacao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idusuario: utilizador.id, email: utilizador.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar link");
      setEtapa("sucesso_link");
      onUpdated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const copiarSenha = () => {
    navigator.clipboard.writeText(novaSenha);
    setSenhaCopiada(true);
    toast.success("Senha copiada!");
    setTimeout(() => setSenhaCopiada(false), 2500);
  };

  const perfilCor = PERFIL_COR[utilizador.perfil] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const statusCor = STATUS_COR[utilizador.status] ?? "bg-gray-100 text-gray-500";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

        {/* ── Cabeçalho ── */}
        <div className="relative bg-gradient-to-br from-[#184d8a] to-[#1a6fd4] px-6 pt-6 pb-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-white font-bold text-lg leading-tight">{utilizador.nome}</h2>
              <p className="text-white/70 text-xs mt-0.5">{utilizador.email}</p>
            </div>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${perfilCor}`}>
                {utilizador.perfil}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusCor}`}>
                {utilizador.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="px-6 -mt-4 pb-6 space-y-4">

          {/* Card de informações */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 space-y-3">
            {[
              { icon: Building2, label: "Instituição", value: utilizador.instituicao },
              { icon: Calendar, label: "Último Acesso", value: utilizador.ultimoAcesso },
              {
                icon: Shield,
                label: "Plano",
                value: utilizador.planoActivo ? "Activo" : "Inactivo",
                cor: utilizador.planoActivo ? "text-green-600" : "text-gray-400",
              },
            ].map(({ icon: Icon, label, value, cor }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#184d8a]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className={`text-xs font-semibold truncate ${cor ?? "text-gray-700"}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Secção de Recuperação de Senha ── */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#184d8a]" />
              <span className="text-xs font-bold text-gray-700">Recuperação de Senha</span>
            </div>

            <div className="p-4">
              {/* Estado: idle — botão para iniciar */}
              {etapa === "idle" && (
                <button
                  onClick={() => setEtapa("escolher")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-[#184d8a]/30 text-[#184d8a] text-sm font-semibold hover:bg-blue-50 hover:border-[#184d8a] transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  Redefinir Senha deste Utilizador
                </button>
              )}

              {/* Estado: escolher método */}
              {etapa === "escolher" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    Escolhe como redefinir a senha de <strong className="text-gray-700">{utilizador.nome}</strong>:
                  </p>

                  {/* Opção 1: Gerar senha */}
                  <button
                    onClick={() => setEtapa("gerar")}
                    className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-[#184d8a] hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-[#184d8a] flex items-center justify-center shrink-0 transition-colors">
                      <RefreshCw className="w-4 h-4 text-[#184d8a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Gerar nova senha</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                        Cria uma senha temporária e partilha manualmente com o utilizador.
                      </p>
                    </div>
                  </button>

                  {/* Opção 2: Enviar link */}
                  <button
                    onClick={() => setEtapa("link")}
                    className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-[#184d8a] hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-[#184d8a] flex items-center justify-center shrink-0 transition-colors">
                      <Mail className="w-4 h-4 text-[#184d8a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Enviar link por email</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                        Envia um link de recuperação para <span className="text-[#184d8a] font-semibold">{utilizador.email}</span>
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setEtapa("idle")}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* Estado: confirmar gerar senha */}
              {etapa === "gerar" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                    ⚠️ Isto vai <strong>substituir a senha actual</strong> do utilizador. Partilha a nova senha de forma segura.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEtapa("escolher")}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleGerarSenha}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-[#184d8a] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#184d8a]/85 transition-all disabled:opacity-60 shadow-md"
                    >
                      {loading
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A gerar...</>
                        : <><RefreshCw className="w-3.5 h-3.5" /> Confirmar</>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Estado: confirmar enviar link */}
              {etapa === "link" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
                    <p>Será enviado um link de recuperação para:</p>
                    <p className="font-bold mt-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {utilizador.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEtapa("escolher")}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleEnviarLink}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-[#184d8a] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#184d8a]/85 transition-all disabled:opacity-60 shadow-md"
                    >
                      {loading
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A enviar...</>
                        : <><Send className="w-3.5 h-3.5" /> Enviar Link</>
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Estado: sucesso — senha gerada */}
              {etapa === "sucesso_gerar" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-700">Senha redefinida com sucesso!</p>
                    <p className="text-[11px] text-gray-400 text-center">
                      Partilha esta senha temporária com o utilizador de forma segura.
                    </p>
                  </div>

                  {/* Senha gerada */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-bold text-[#184d8a] tracking-widest select-all">
                      {novaSenha}
                    </span>
                    <button
                      onClick={copiarSenha}
                      className={`p-2 rounded-lg transition-all ${senhaCopiada ? "bg-green-100 text-green-600" : "bg-white border border-gray-200 text-gray-500 hover:text-[#184d8a] hover:border-[#184d8a]"}`}
                    >
                      {senhaCopiada ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-amber-700 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    O utilizador deve alterar esta senha após o primeiro login.
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-[#184d8a] text-white text-xs font-bold hover:bg-[#184d8a]/85 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              )}

              {/* Estado: sucesso — link enviado */}
              {etapa === "sucesso_link" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs font-bold text-gray-700">Link enviado com sucesso!</p>
                    <p className="text-[11px] text-gray-400 text-center">
                      Um email de recuperação foi enviado para{" "}
                      <span className="text-[#184d8a] font-semibold">{utilizador.email}</span>.
                      O link expira em <strong>24 horas</strong>.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-[#184d8a] text-white text-xs font-bold hover:bg-[#184d8a]/85 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}