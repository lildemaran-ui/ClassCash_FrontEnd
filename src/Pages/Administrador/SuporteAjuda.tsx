// src/Pages/Administrador/SuporteAjuda.tsx
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, getToken, type SessaoUsuario } from "@/types/global/sessao";
import {
  Bell, CheckCheck, Circle, CircleUser, Clock,
  Loader2, MessageSquare, RefreshCw, Search, Send,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

// ─── Status como números (igual ao banco de dados) ────────────
type StatusTicket = 0 | 1 | 2;

const STATUS_CONFIG = {
  0: { label: "Pendente",      cor: "bg-yellow-100 text-yellow-700", icon: Circle },
  1: { label: "Em andamento",  cor: "bg-blue-100 text-blue-700",    icon: Clock },
  2: { label: "Resolvido",     cor: "bg-green-100 text-green-700",  icon: CheckCheck },
} as const;

const FILTROS = [
  { label: "Todos",        value: "Todos" as const },
  { label: "Pendente",     value: 0 as StatusTicket },
  { label: "Andamento",    value: 1 as StatusTicket },
  { label: "Resolvido",    value: 2 as StatusTicket },
];

interface Mensagem {
  mensagem: string;
  data_envio: string;
  autor: string;
  perfil: string;
}

interface Ticket {
  idsuporte: number;
  assunto: string;
  status: StatusTicket;
  data: string;
  tipoproblema: string;
  nome_representante: string;
  nome_instituicao: string;
  resumo: string | null;
}

export default function SuporteAjuda() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketActivo, setTicketActivo] = useState<Ticket | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusTicket | "Todos">("Todos");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [searchTicket, setSearchTicket] = useState("");
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  // Carregar lista de tickets
  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar tickets");
      const data: Ticket[] = await res.json();
      setTickets(data);
      if (data.length > 0 && !ticketActivo) {
        setTicketActivo(data[0]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar tickets");
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // Carregar mensagens do ticket ativo
  const fetchMensagens = useCallback(async (idsuporte: number) => {
    setLoadingChat(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/mensagens/${idsuporte}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    if (user) fetchTickets();
  }, [user, fetchTickets]);

  useEffect(() => {
    if (ticketActivo) fetchMensagens(ticketActivo.idsuporte);
  }, [ticketActivo, fetchMensagens]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !ticketActivo) return;
    setSendingMsg(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idsuporte: ticketActivo.idsuporte, mensagem: novaMensagem.trim() }),
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      setNovaMensagem("");
      await fetchMensagens(ticketActivo.idsuporte);
      // Atualiza status para "Em andamento" (1)
      setTickets((prev) =>
        prev.map((t) =>
          t.idsuporte === ticketActivo.idsuporte
            ? { ...t, status: 1 as StatusTicket, resumo: novaMensagem.trim() }
            : t
        )
      );
      setTicketActivo((prev) =>
        prev ? { ...prev, status: 1 as StatusTicket } : prev
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar mensagem");
    } finally {
      setSendingMsg(false);
    }
  };

  const marcarResolvido = async () => {
    if (!ticketActivo) return;
    try {
      const token = getToken();
      await fetch(`${API_BASE}/tickets/${ticketActivo.idsuporte}/resolver`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {
      // ignora erro de rede, atualiza UI mesmo assim
    }
    // Atualiza status para "Resolvido" (2)
    setTickets((prev) =>
      prev.map((t) =>
        t.idsuporte === ticketActivo.idsuporte ? { ...t, status: 2 as StatusTicket } : t
      )
    );
    setTicketActivo((prev) => (prev ? { ...prev, status: 2 as StatusTicket } : prev));
    toast.success("Ticket marcado como resolvido.");
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

  // Detect if admin message
  const isAdminMsg = (msg: Mensagem) =>
    msg.perfil?.toLowerCase().includes("admin") || msg.perfil?.toLowerCase().includes("administrador");

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 sm:p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <h1 className="text-lg sm:text-xl font-bold text-[#184d8a]">Suporte e Ajuda</h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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

            {/* ── Lista de tickets ── */}
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
                          ? "bg-[#184d8a] text-white"
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

            {/* ── Área de chat ── */}
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
                      <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                        {ticketActivo.assunto}
                      </p>
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
                        return (
                          <div key={i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                              isAdmin
                                ? "bg-[#184d8a] text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-800 rounded-bl-sm"
                            }`}>
                              <p className="text-xs sm:text-sm leading-relaxed">{msg.mensagem}</p>
                              <p className={`text-[10px] mt-0.5 sm:mt-1 ${isAdmin ? "text-blue-200 text-right" : "text-gray-400"}`}>
                                {isAdmin ? "Você" : msg.autor} ·{" "}
                                {new Date(msg.data_envio).toLocaleTimeString("pt-AO", {
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-3 sm:p-4 border-t border-gray-100">
                    {ticketActivo.status === 2 ? (
                      <div className="flex items-center justify-center py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 gap-2">
                        <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        Este ticket foi marcado como resolvido.
                      </div>
                    ) : (
                      <div className="flex gap-2 sm:gap-3">
                        <input
                          type="text"
                          placeholder="Escreva a sua resposta..."
                          value={novaMensagem}
                          onChange={(e) => setNovaMensagem(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviarMensagem()}
                          className="flex-1 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#184d8a]/20 outline-none min-w-0"
                        />
                        <button
                          onClick={enviarMensagem}
                          disabled={!novaMensagem.trim() || sendingMsg}
                          className="w-9 h-9 sm:w-10 sm:h-10 bg-[#184d8a] text-white rounded-xl flex items-center justify-center hover:bg-[#184d8a]/80 transition-colors disabled:opacity-40 shrink-0"
                        >
                          {sendingMsg
                            ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            : <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
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