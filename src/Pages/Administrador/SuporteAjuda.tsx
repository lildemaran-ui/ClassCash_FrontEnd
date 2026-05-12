// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Administrador/SuporteAjuda.tsx
// Integração: Gemini AI — resposta automática + botão "Regenerar"
// ════════════════════════════════════════════════════════════════
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import {
  Bell,
  Bot,
  CheckCheck,
  Circle,
  CircleUser,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

// ─── Tipos ────────────────────────────────────────────────────
type StatusTicket = 0 | 1 | 2;

const STATUS_CONFIG = {
  0: { label: "Pendente",     cor: "bg-yellow-100 text-yellow-700", icon: Circle },
  1: { label: "Em andamento", cor: "bg-blue-100 text-blue-700",     icon: Clock },
  2: { label: "Resolvido",    cor: "bg-green-100 text-green-700",   icon: CheckCheck },
} as const;

const FILTROS = [
  { label: "Todos",     value: "Todos" as const },
  { label: "Pendente",  value: 0 as StatusTicket },
  { label: "Andamento", value: 1 as StatusTicket },
  { label: "Resolvido", value: 2 as StatusTicket },
];

interface Mensagem {
  mensagem:   string;
  data_envio: string;
  autor:      string;
  perfil:     string;
}

interface Ticket {
  idsuporte:        number;
  assunto:          string;
  status:           StatusTicket;
  data:             string;
  tipoproblema:     string;
  nome_representante: string;
  nome_instituicao: string;
  resumo:           string | null;
}

// ─── Componente: Badge de IA ──────────────────────────────────
const IABadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
    <Bot size={10} /> Gemini IA
  </span>
);

// ─── Helper: detectar mensagem de IA ─────────────────────────
const isMsgIA = (msg: Mensagem) =>
  msg.mensagem.includes("Equipa de Suporte") ||
  msg.mensagem.includes("departamento financeiro") ||
  msg.mensagem.includes("Sistema de Gestão Escolar");

const isAdminMsg = (msg: Mensagem) =>
  msg.perfil?.toLowerCase().includes("admin") ||
  msg.perfil?.toLowerCase().includes("administrador");

// ═════════════════════════════════════════════════════════════
export default function SuporteAjuda() {
  const [tickets, setTickets]           = useState<Ticket[]>([]);
  const [ticketActivo, setTicketActivo] = useState<Ticket | null>(null);
  const [mensagens, setMensagens]       = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusTicket | "Todos">("Todos");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingChat, setLoadingChat]       = useState(false);
  const [sendingMsg, setSendingMsg]         = useState(false);
  const [searchTicket, setSearchTicket]     = useState("");
  const [user, setUser]                     = useState<SessaoUsuario | null>(null);
  const [regenerando, setRegenerando]       = useState(false);
  const [respostaSugerida, setRespostaSugerida] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  // ── Carregar tickets ────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const res = await fetchComAuth(`${API_BASE}/tickets`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar tickets");
      const data: Ticket[] = await res.json();
      setTickets(data);
      if (data.length > 0 && !ticketActivo) setTicketActivo(data[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar tickets");
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // ── Carregar mensagens ──────────────────────────────────────
  const fetchMensagens = useCallback(async (idsuporte: number) => {
    setLoadingChat(true);
    try {
      const res = await fetchComAuth(`${API_BASE}/mensagens/${idsuporte}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar mensagens");
      const data: Mensagem[] = await res.json();
      setMensagens(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar mensagens");
    } finally {
      setLoadingChat(false);
    }
  }, []);

  useEffect(() => { if (user) fetchTickets(); }, [user, fetchTickets]);

  useEffect(() => {
    if (ticketActivo) {
      fetchMensagens(ticketActivo.idsuporte);
      setRespostaSugerida(""); // limpar sugestão ao trocar de ticket
    }
  }, [ticketActivo, fetchMensagens]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensagens]);

  // ── Enviar mensagem manual ──────────────────────────────────
  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !ticketActivo) return;
    setSendingMsg(true);
    try {
      const res = await fetchComAuth(`${API_BASE}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ idsuporte: ticketActivo.idsuporte, mensagem: novaMensagem.trim() }),
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      setNovaMensagem("");
      setRespostaSugerida("");
      await fetchMensagens(ticketActivo.idsuporte);
      setTickets((prev) =>
        prev.map((t) =>
          t.idsuporte === ticketActivo.idsuporte
            ? { ...t, status: 1 as StatusTicket, resumo: novaMensagem.trim() }
            : t,
        ),
      );
      setTicketActivo((prev) => (prev ? { ...prev, status: 1 as StatusTicket } : prev));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar mensagem");
    } finally {
      setSendingMsg(false);
    }
  };

  // ── Marcar resolvido ────────────────────────────────────────
  const marcarResolvido = async () => {
    if (!ticketActivo) return;
    try {
      await fetchComAuth(`${API_BASE}/tickets/${ticketActivo.idsuporte}/resolver`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (_) { /* ignora */ }
    setTickets((prev) =>
      prev.map((t) =>
        t.idsuporte === ticketActivo.idsuporte ? { ...t, status: 2 as StatusTicket } : t,
      ),
    );
    setTicketActivo((prev) => (prev ? { ...prev, status: 2 as StatusTicket } : prev));
    toast.success("Ticket marcado como resolvido.");
  };

  // ── Regenerar resposta via Gemini ───────────────────────────
  const regenerarResposta = async () => {
    if (!ticketActivo) return;
    setRegenerando(true);
    try {
      const res = await fetchComAuth(
        `${API_BASE}/tickets/${ticketActivo.idsuporte}/regenerar-ia`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      if (!res.ok) throw new Error("Erro ao gerar resposta");
      const data = await res.json();
      // Pré-preenche o campo de texto para o Admin poder editar antes de enviar
      setRespostaSugerida(data.respostaIA);
      setNovaMensagem(data.respostaIA);
      toast.success("Resposta gerada pela IA. Podes editar antes de enviar.", {
        icon: "✨",
      });
    } catch (err) {
      toast.error("Erro ao gerar resposta com IA");
    } finally {
      setRegenerando(false);
    }
  };

  if (!user) return null;

  const filtrados = tickets.filter((t) => {
    const statusOk = filtroStatus === "Todos" || t.status === filtroStatus;
    const searchOk =
      !searchTicket ||
      t.assunto.toLowerCase().includes(searchTicket.toLowerCase()) ||
      t.nome_instituicao?.toLowerCase().includes(searchTicket.toLowerCase()) ||
      t.nome_representante?.toLowerCase().includes(searchTicket.toLowerCase());
    return statusOk && searchOk;
  });

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        {/* ── Topbar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 sm:p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-[#184d8a]">Suporte e Ajuda</h1>
            {/* Badge IA activo */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              <Sparkles size={12} /> Gemini IA activo
            </span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar ticket..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 sm:w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none text-xs sm:text-sm"
              />
            </div>
            <button onClick={fetchTickets} className="p-2 text-gray-500 hover:text-[#184d8a] transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="relative cursor-pointer">
              <Bell className="text-[#184d8a] w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
            <CircleUser className="w-7 h-7 sm:w-8 sm:h-8 text-[#184d8a]" />
          </div>
        </div>

        <main className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
          {/* Mobile: pesquisa */}
          <div className="md:hidden mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar ticket..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 flex-1 min-h-0" style={{ height: "calc(100vh - 200px)" }}>
            {/* ── Lista de tickets ─────────────────────────── */}
            <div className="w-64 sm:w-72 md:w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-xs sm:text-sm mb-2 sm:mb-3">
                  Pedidos de Suporte
                </h2>
                <div className="flex gap-1 flex-wrap">
                  {FILTROS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => setFiltroStatus(f.value)}
                      className={`text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-colors ${
                        filtroStatus === f.value
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {loadingTickets ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#184d8a]" />
                  </div>
                ) : filtrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs sm:text-sm">
                    Nenhum ticket encontrado.
                  </div>
                ) : (
                  filtrados.map((ticket) => {
                    const cfg = STATUS_CONFIG[ticket.status];
                    const StatusIcon = cfg.icon;
                    const isActive = ticketActivo?.idsuporte === ticket.idsuporte;
                    return (
                      <button
                        key={ticket.idsuporte}
                        onClick={() => setTicketActivo(ticket)}
                        className={`w-full text-left p-3 sm:p-4 hover:bg-blue-50 transition-colors ${
                          isActive ? "bg-blue-50 border-l-2 border-[#184d8a]" : ""
                        }`}
                      >
                        <p className="text-xs font-bold text-gray-900 truncate mb-0.5 sm:mb-1">
                          {ticket.assunto}
                        </p>
                        <p className="text-[10px] text-gray-500 mb-1">
                          {ticket.nome_instituicao} · {ticket.nome_representante}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate mb-1.5 sm:mb-2">
                          {ticket.resumo || "—"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${cfg.cor}`}>
                            <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {cfg.label}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(ticket.data).toLocaleDateString("pt-AO")}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Área de chat ─────────────────────────────── */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-w-0">
              {!ticketActivo ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-xs sm:text-sm">Selecione um ticket para ver as mensagens.</p>
                </div>
              ) : (
                <>
                  {/* Header do chat */}
                  <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                          {ticketActivo.assunto}
                        </p>
                        <IABadge />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {ticketActivo.nome_instituicao} · {ticketActivo.nome_representante}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full ${STATUS_CONFIG[ticketActivo.status].cor}`}>
                        {STATUS_CONFIG[ticketActivo.status].label}
                      </span>
                      {ticketActivo.status !== 2 && (
                        <button
                          onClick={marcarResolvido}
                          className="hidden sm:flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 sm:px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Marcar Resolvido</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {loadingChat ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#184d8a]" />
                      </div>
                    ) : mensagens.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-30" />
                        <p className="text-xs sm:text-sm">Nenhuma mensagem ainda.</p>
                      </div>
                    ) : (
                      mensagens.map((msg, i) => {
                        const isAdmin = isAdminMsg(msg);
                        const geradaPorIA = isAdmin && isMsgIA(msg);
                        return (
                          <div key={i} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                            <div
                              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                                isAdmin
                                  ? "bg-primary text-white rounded-br-sm"
                                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.mensagem}
                              </p>
                              <p className={`text-[10px] mt-0.5 sm:mt-1 ${isAdmin ? "text-blue-200 text-right" : "text-gray-400"}`}>
                                {isAdmin ? "Administração" : msg.autor} ·{" "}
                                {new Date(msg.data_envio).toLocaleTimeString("pt-AO", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {/* Badge de IA abaixo da bolha */}
                            {geradaPorIA && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 mt-0.5 px-1">
                                <Bot size={10} /> Resposta gerada pela IA Gemini
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input + botão regenerar IA */}
                  <div className="p-3 sm:p-4 border-t border-gray-100">
                    {ticketActivo.status === 2 ? (
                      <div className="flex items-center justify-center py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 gap-2">
                        <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        Este ticket foi marcado como resolvido.
                      </div>
                    ) : (
                      <>
                        {/* Botão Regenerar IA */}
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={regenerarResposta}
                            disabled={regenerando}
                            title="Gerar sugestão de resposta com Gemini IA"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
                          >
                            {regenerando ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <WandSparkles size={11} />
                            )}
                            {regenerando ? "A gerar..." : "Sugerir resposta com IA"}
                          </button>
                        </div>

                        {/* Campo de texto — pré-preenchido se IA gerou sugestão */}
                        <div className="flex gap-2 sm:gap-3 items-end">
                          <div className="flex-1 relative">
                            <textarea
                              rows={respostaSugerida ? 4 : 1}
                              placeholder="Escreva a sua resposta..."
                              value={novaMensagem}
                              onChange={(e) => {
                                setNovaMensagem(e.target.value);
                                if (respostaSugerida) setRespostaSugerida("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  enviarMensagem();
                                }
                              }}
                              className={`w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 outline-none resize-none transition-all ${
                                respostaSugerida
                                  ? "border-purple-300 focus:ring-purple-200 bg-purple-50/40"
                                  : "border-gray-200 focus:ring-[#184d8a]/20"
                              }`}
                            />
                            {respostaSugerida && (
                              <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 text-[10px] text-purple-500">
                                <Sparkles size={9} /> Sugestão da IA — pode editar antes de enviar
                              </span>
                            )}
                          </div>
                          <button
                            onClick={enviarMensagem}
                            disabled={!novaMensagem.trim() || sendingMsg}
                            className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-40 shrink-0 mb-0.5"
                          >
                            {sendingMsg ? (
                              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}