// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/components/Suporte/SuporteDrawer.tsx
// Socket.io em tempo real + badge de não lidas + chat sempre aberto
// ════════════════════════════════════════════════════════════════
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { getToken } from "@/types/global/sessao";
import { getSocket } from "@/Hooks/useSocket";
import {
  ArrowLeft,
  Bot,
  CheckCheck,
  ChevronRight,
  Circle,
  Clock,
  Loader2,
  MessageSquarePlusIcon,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

// ─── Tipos ────────────────────────────────────────────────────
type StatusTicket = 0 | 1 | 2;

const STATUS_CONFIG = {
  0: { label: "Pendente",     cor: "bg-yellow-100 text-yellow-700", icon: Circle },
  1: { label: "Em andamento", cor: "bg-blue-100 text-blue-700",     icon: Clock },
  2: { label: "Resolvido",    cor: "bg-green-100 text-green-700",   icon: CheckCheck },
} as const;

const TIPOS_PROBLEMA = [
  "Propinas / Pagamentos",
  "Uniformes / Materiais",
  "Faltas / Documentos",
  "Reclamação Urgente",
  "Outro",
];

export interface Ticket {
  idsuporte:    number;
  assunto:      string;
  status:       StatusTicket;
  data:         string;
  tipoproblema: string;
  resumo:       string | null;
}

interface Mensagem {
  mensagem:   string;
  data_envio: string;
  autor:      string;
  perfil:     string;
}

const isMsgIA = (msg: Mensagem) =>
  msg.perfil?.toLowerCase().includes("admin") ||
  msg.mensagem.includes("Equipa de Suporte") ||
  msg.mensagem.includes("Sistema de Gestão Escolar");

const IABadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
    <Bot size={10} /> IA
  </span>
);

// ═════════════════════════════════════════════════════════════
// VISTA: Novo Ticket
// ═════════════════════════════════════════════════════════════
function NovoTicketForm({ onCriado, onCancelar }: { onCriado: () => void; onCancelar: () => void }) {
  const [form, setForm] = useState({ assunto: "", mensagem: "", tipoproblema: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.assunto.trim() || !form.mensagem.trim() || !form.tipoproblema) {
      toast.error("Preenche todos os campos.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetchComAuth(`${API}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao criar ticket");
      const data = await res.json();
      toast.success("Reclamação enviada! A IA irá responder em instantes.", { icon: "✨" });
      onCriado();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#184d8a] px-4 py-4 flex items-center gap-3">
        <button onClick={onCancelar} className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-white font-bold text-sm">Nova Reclamação</p>
          <p className="text-blue-200 text-xs">A IA responde automaticamente</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2">
          <Sparkles size={14} className="text-purple-600 mt-0.5 shrink-0" />
          <p className="text-xs text-purple-700 leading-relaxed">
            A tua reclamação será respondida automaticamente pela <strong>IA</strong> em segundos.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tipo de Problema <span className="text-red-500">*</span></label>
          <select value={form.tipoproblema} onChange={(e) => setForm({ ...form, tipoproblema: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 cursor-pointer transition-all">
            <option value="">Selecionar tipo...</option>
            {TIPOS_PROBLEMA.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assunto <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Ex: Erro no valor da propina de Janeiro"
            value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Descrição <span className="text-red-500">*</span></label>
          <textarea rows={5} placeholder="Descreve a situação com o máximo de detalhe..."
            value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all resize-none" />
          <p className="text-[11px] text-gray-400 mt-1 text-right">{form.mensagem.length} caracteres</p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-3">
        <button onClick={onCancelar} className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all text-sm">Cancelar</button>
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
          {saving ? <><Loader2 size={14} className="animate-spin" /> A enviar...</> : <><Send size={14} /> Enviar</>}
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// VISTA: Chat — sempre aberto, mesmo resolvido
// ═════════════════════════════════════════════════════════════
function ChatTicket({
  ticket,
  onVoltar,
  onMensagensLidas,
}: {
  ticket: Ticket;
  onVoltar: () => void;
  onMensagensLidas: (idSuporte: number) => void;
}) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [sending, setSending] = useState(false);
  const [iaEscrevendo, setIaEscrevendo] = useState(false);
  const [statusActual, setStatusActual] = useState<StatusTicket>(ticket.status);
  const chatRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  const fetchMensagens = useCallback(async () => {
    try {
      const res = await fetchComAuth(`${API}/mensagens/${ticket.idsuporte}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const data: Mensagem[] = await res.json();
      setMensagens(data);
    } catch {
      /* silencioso */
    } finally {
      setLoading(false);
    }
  }, [ticket.idsuporte]);

  useEffect(() => {
    fetchMensagens();

    // Entrar na sala do ticket via Socket.io
    socket.emit("entrar_ticket", ticket.idsuporte);

    // Marcar mensagens como lidas ao abrir o chat
    onMensagensLidas(ticket.idsuporte);

    // ── Ouvir novas mensagens em tempo real ──────────────────
    const handleNovaMensagem = (msg: Mensagem) => {
      setMensagens((prev) => {
        // Evitar duplicatas
        const jaExiste = prev.some(
          (m) => m.mensagem === msg.mensagem && m.data_envio === msg.data_envio,
        );
        if (jaExiste) return prev;
        return [...prev, msg];
      });
      setIaEscrevendo(false);
    };

    // ── Ouvir actualização de status ─────────────────────────
    const handleStatusAtualizado = (data: { idsuporte: number; status: StatusTicket }) => {
      if (data.idsuporte === ticket.idsuporte) {
        setStatusActual(data.status);
      }
    };

    socket.on("nova_mensagem", handleNovaMensagem);
    socket.on("status_atualizado", handleStatusAtualizado);

    return () => {
      socket.emit("sair_ticket", ticket.idsuporte);
      socket.off("nova_mensagem", handleNovaMensagem);
      socket.off("status_atualizado", handleStatusAtualizado);
    };
  }, [ticket.idsuporte]);

  // Auto-scroll sempre que chegam mensagens
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensagens, iaEscrevendo]);

  const enviar = async () => {
    if (!novaMensagem.trim()) return;
    setSending(true);
    const texto = novaMensagem.trim();
    setNovaMensagem("");

    // Mostrar "IA a escrever..." após enviar
    try {
      const res = await fetchComAuth(`${API}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ idsuporte: ticket.idsuporte, mensagem: texto }),
      });
      if (!res.ok) throw new Error();
      // Mostrar indicador de escrita da IA
      setIaEscrevendo(true);
      // A resposta da IA chegará via socket — desligar o indicador em 15s por segurança
      setTimeout(() => setIaEscrevendo(false), 15000);
    } catch {
      toast.error("Erro ao enviar mensagem");
      setNovaMensagem(texto);
    } finally {
      setSending(false);
    }
  };

  const cfg = STATUS_CONFIG[statusActual];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#184d8a] px-4 py-3 flex items-center gap-3">
        <button onClick={onVoltar} className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-sm truncate">{ticket.assunto}</p>
            <IABadge />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cor}`}>
              {cfg.label}
            </span>
            <span className="text-blue-300 text-[10px]">{ticket.tipoproblema}</span>
          </div>
        </div>
      </div>

      {/* Aviso de resolvido — NÃO bloqueia o chat */}
      {statusActual === 2 && (
        <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center gap-2">
          <CheckCheck size={13} className="text-green-600 shrink-0" />
          <p className="text-xs text-green-700">
            Este ticket foi marcado como resolvido, mas podes continuar a enviar mensagens se necessário.
          </p>
        </div>
      )}

      {/* Mensagens */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#184d8a]" /></div>
        ) : mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
            <Bot size={32} className="opacity-30 mb-2" />
            <p className="text-xs">Nenhuma mensagem ainda.<br />A IA irá responder em breve.</p>
          </div>
        ) : (
          <>
            {mensagens.map((msg, i) => {
              const isIA = isMsgIA(msg);
              return (
                <div key={i} className={`flex flex-col ${isIA ? "items-start" : "items-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    isIA
                      ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                      : "bg-[#184d8a] text-white rounded-tr-sm"
                  }`}>
                    {msg.mensagem}
                    <p className={`text-[10px] mt-1 ${isIA ? "text-gray-400" : "text-blue-200"}`}>
                      {new Date(msg.data_envio).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {isIA && (
                    <span className="text-[10px] text-purple-500 mt-0.5 flex items-center gap-0.5 px-1">
                      <Bot size={9} /> Resposta da IA
                    </span>
                  )}
                </div>
              );
            })}

            {/* Indicador "IA a escrever..." */}
            {iaEscrevendo && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span className="text-[11px] text-gray-400">IA a elaborar resposta...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input — SEMPRE visível, mesmo resolvido */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            rows={2}
            placeholder={statusActual === 2 ? "Ticket resolvido — mas ainda podes enviar mensagens..." : "Escreve a tua mensagem..."}
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
            className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 resize-none transition-all ${
              statusActual === 2
                ? "border-green-200 focus:ring-green-200/40 bg-green-50/30"
                : "border-gray-200 focus:ring-[#184d8a]/20"
            }`}
          />
          <button onClick={enviar} disabled={!novaMensagem.trim() || sending}
            className="w-9 h-9 bg-[#184d8a] text-white rounded-xl flex items-center justify-center hover:bg-[#1a5fad] transition-all disabled:opacity-40 shrink-0">
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// VISTA: Lista de Tickets
// ═════════════════════════════════════════════════════════════
function ListaTickets({
  tickets,
  loading,
  naoLidas,
  onSelecionar,
  onNovo,
}: {
  tickets:      Ticket[];
  loading:      boolean;
  naoLidas:     Record<number, number>;
  onSelecionar: (t: Ticket) => void;
  onNovo:       () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#184d8a] px-4 py-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-white font-bold text-sm">Suporte & Ajuda</p>
          
        </div>
        <p className="text-blue-200 text-xs">As tuas reclamações são respondidas automaticamente pela IA</p>
      </div>

      

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#184d8a]" /></div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center px-4">
            <Bot size={32} className="opacity-30 mb-2" />
            <p className="text-xs font-medium">Sem reclamações ainda.</p>
            <p className="text-xs mt-1">Clica em "Nova Reclamação" para começar.</p>
          </div>
        ) : (
          tickets.map((t) => {
            const cfg = STATUS_CONFIG[t.status];
            const StatusIcon = cfg.icon;
            const naoLidasCount = naoLidas[t.idsuporte] || 0;
            return (
              <button key={t.idsuporte} onClick={() => onSelecionar(t)}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group border-b">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800 truncate">{t.assunto}</p>
                    {/* Badge de não lidas por ticket */}
                    {naoLidasCount > 0 && (
                      <span className="ml-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shrink-0">
                        {naoLidasCount > 9 ? "9+" : naoLidasCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{t.resumo || t.tipoproblema}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cor}`}>
                      <StatusIcon size={9} /> {cfg.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{new Date(t.data).toLocaleDateString("pt-AO")}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
              </button>
            );
          })
        )}
      </div>
      <div className="px-4 pt-4 pb-2 flex justify-end">
        <button onClick={onNovo}
          className=" flex items-center justify-center gap-2 bg-[#184d8a] text-white w-16 h-16 rounded-2xl font-bold text-sm hover:bg-[#1a5fad] transition-all shadow-md ">
          <MessageSquarePlusIcon size={28} /> 
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — SuporteDrawer
// Exporta também totalNaoLidas para o botão Headset
// ═════════════════════════════════════════════════════════════
type Vista = "lista" | "novo" | "chat";

export default function SuporteDrawer({
  aberto,
  onFechar,
  onNaoLidasChange,
}: {
  aberto:             boolean;
  onFechar:           () => void;
  onNaoLidasChange?:  (total: number) => void;
}) {
  const [vista, setVista]               = useState<Vista>("lista");
  const [tickets, setTickets]           = useState<Ticket[]>([]);
  const [ticketActivo, setTicketActivo] = useState<Ticket | null>(null);
  const [loading, setLoading]           = useState(true);
  // naoLidas: { [idSuporte]: count }
  const [naoLidas, setNaoLidas]         = useState<Record<number, number>>({});
  const socket = getSocket();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/tickets/secretaria`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const data: Ticket[] = await res.json();
      setTickets(data);
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  };

  // Calcular total não lidas e notificar o pai (botão Headset)
  useEffect(() => {
    const total = Object.values(naoLidas).reduce((a, b) => a + b, 0);
    onNaoLidasChange?.(total);
  }, [naoLidas]);

  // Ouvir notificações de novas mensagens via Socket
  useEffect(() => {
    const handleNotificacao = (data: { idSuporte: number }) => {
      // Só incrementar se o drawer estiver fechado OU se não for o ticket activo
      const estaNoTicket = aberto && ticketActivo?.idsuporte === data.idSuporte;
      if (!estaNoTicket) {
        setNaoLidas((prev) => ({
          ...prev,
          [data.idSuporte]: (prev[data.idSuporte] || 0) + 1,
        }));
      }
    };

    const handleNovoTicket = () => {
      fetchTickets();
    };

    socket.on("nova_notificacao", handleNotificacao);
    socket.on("novo_ticket", handleNovoTicket);

    return () => {
      socket.off("nova_notificacao", handleNotificacao);
      socket.off("novo_ticket", handleNovoTicket);
    };
  }, [aberto, ticketActivo]);

  useEffect(() => {
    if (aberto) {
      fetchTickets();
      setVista("lista");
    }
  }, [aberto]);

  const marcarComoLido = (idSuporte: number) => {
    setNaoLidas((prev) => {
      const novo = { ...prev };
      delete novo[idSuporte];
      return novo;
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${aberto ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onFechar}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${aberto ? "translate-x-0" : "translate-x-full"}`}
      >
        <button onClick={onFechar}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all">
          <X size={16} />
        </button>

        <div className="flex-1 min-h-0 flex flex-col">
          {vista === "lista" && (
            <ListaTickets
              tickets={tickets}
              loading={loading}
              naoLidas={naoLidas}
              onSelecionar={(t) => { setTicketActivo(t); setVista("chat"); }}
              onNovo={() => setVista("novo")}
            />
          )}
          {vista === "novo" && (
            <NovoTicketForm
              onCriado={() => { fetchTickets(); setVista("lista"); }}
              onCancelar={() => setVista("lista")}
            />
          )}
          {vista === "chat" && ticketActivo && (
            <ChatTicket
              ticket={ticketActivo}
              onVoltar={() => { fetchTickets(); setVista("lista"); }}
              onMensagensLidas={marcarComoLido}
            />
          )}
        </div>
      </div>
    </>
  );
}