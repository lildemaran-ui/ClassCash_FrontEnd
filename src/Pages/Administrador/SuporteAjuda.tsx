
import MenuAdmin from "@/components/Menu/MenuAdmin";
import {
  Bell,
  CheckCheck,
  Circle,
  CircleUser,
  Clock,
  MessageSquare,
  Search, Send
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type StatusTicket = "Pendente" | "Em andamento" | "Resolvido";

interface Mensagem {
  id: number;
  remetente: "admin" | "secretaria";
  texto: string;
  hora: string;
}

interface Ticket {
  id: number;
  instituicao: string;
  utilizador: string;
  assunto: string;
  status: StatusTicket;
  ultimaMensagem: string;
  hora: string;
  naoLidas: number;
  mensagens: Mensagem[];
}

// ─── Dados mock ───────────────────────────────────────────────────────────────
const TICKETS_MOCK: Ticket[] = [
  {
    id: 1,
    instituicao: "Instituto Kibangas",
    utilizador: "Pedro Santos",
    assunto: "Problema ao registar pagamento",
    status: "Pendente",
    ultimaMensagem: "O sistema não está a aceitar o comprovativo...",
    hora: "14:32",
    naoLidas: 2,
    mensagens: [
      { id: 1, remetente: "secretaria", texto: "Bom dia, estou com dificuldade ao registar um pagamento. O sistema não está a aceitar o comprovativo em PDF.", hora: "14:30" },
      { id: 2, remetente: "secretaria", texto: "Já tentei várias vezes mas continua a dar erro.", hora: "14:32" },
    ],
  },
  {
    id: 2,
    instituicao: "Colégio Caracol",
    utilizador: "Maria Filomena",
    assunto: "Como exportar relatório em Excel?",
    status: "Em andamento",
    ultimaMensagem: "Obrigada, vou tentar agora mesmo.",
    hora: "11:15",
    naoLidas: 0,
    mensagens: [
      { id: 1, remetente: "secretaria", texto: "Boa tarde! Gostaria de saber como posso exportar o relatório mensal em Excel.", hora: "10:50" },
      { id: 2, remetente: "admin",      texto: "Boa tarde, Maria! Para exportar em Excel, vá até Relatórios > clique em 'Exportar' > seleccione o formato Excel. Deve aparecer o download automaticamente.", hora: "11:00" },
      { id: 3, remetente: "secretaria", texto: "Obrigada, vou tentar agora mesmo.", hora: "11:15" },
    ],
  },
  {
    id: 3,
    instituicao: "MAPTESS",
    utilizador: "Ana Costa",
    assunto: "Estudante não aparece na lista",
    status: "Resolvido",
    ultimaMensagem: "Problema resolvido, muito obrigada!",
    hora: "Ontem",
    naoLidas: 0,
    mensagens: [
      { id: 1, remetente: "secretaria", texto: "Um estudante foi cadastrado mas não aparece na lista da turma.", hora: "09:00" },
      { id: 2, remetente: "admin",      texto: "Verifiquei e o estudante estava associado a uma instituição diferente. Já corrigi.", hora: "09:20" },
      { id: 3, remetente: "secretaria", texto: "Problema resolvido, muito obrigada!", hora: "09:25" },
    ],
  },
  {
    id: 4,
    instituicao: "INSUTEC",
    utilizador: "Carlos Mendes",
    assunto: "Módulo de multas não carrega",
    status: "Pendente",
    ultimaMensagem: "A página fica a carregar infinitamente.",
    hora: "08:45",
    naoLidas: 1,
    mensagens: [
      { id: 1, remetente: "secretaria", texto: "O módulo de multas não está a carregar. A página fica a girar infinitamente.", hora: "08:45" },
    ],
  },
];

const STATUS_CONFIG: Record<StatusTicket, { cor: string; icon: React.ElementType }> = {
  "Pendente":      { cor: "bg-amber-100 text-amber-700",  icon: Clock     },
  "Em andamento":  { cor: "bg-blue-100 text-blue-700",    icon: Circle    },
  "Resolvido":     { cor: "bg-green-100 text-green-700",  icon: CheckCheck},
};

// ─── Página ───────────────────────────────────────────────────────────────────
export default function SuporteAjuda() {
  const [tickets,         setTickets]         = useState<Ticket[]>(TICKETS_MOCK);
  const [ticketActivo,    setTicketActivo]    = useState<Ticket>(TICKETS_MOCK[0]);
  const [novaMensagem,    setNovaMensagem]    = useState("");
  const [filtroStatus,    setFiltroStatus]    = useState<StatusTicket | "Todos">("Todos");
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll no chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [ticketActivo]);

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;
    const nova: Mensagem = {
      id: Date.now(),
      remetente: "admin",
      texto: novaMensagem.trim(),
      hora: new Date().toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" }),
    };
    const ticketsActualizados = tickets.map((t) =>
      t.id === ticketActivo.id
        ? { ...t, mensagens: [...t.mensagens, nova], ultimaMensagem: nova.texto, status: "Em andamento" as StatusTicket }
        : t
    );
    setTickets(ticketsActualizados);
    setTicketActivo({ ...ticketActivo, mensagens: [...ticketActivo.mensagens, nova], status: "Em andamento" });
    setNovaMensagem("");
  };

  const marcarResolvido = () => {
    const ticketsActualizados = tickets.map((t) =>
      t.id === ticketActivo.id ? { ...t, status: "Resolvido" as StatusTicket } : t
    );
    setTickets(ticketsActualizados);
    setTicketActivo({ ...ticketActivo, status: "Resolvido" });
  };

  const filtrados = tickets.filter((t) =>
    filtroStatus === "Todos" || t.status === filtroStatus
  );

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#268cff]">Suporte e Ajuda</h1>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none text-sm" />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="text-[#268cff]" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
            </div>
            <CircleUser className="w-8 h-8 text-[#268cff]" />
          </div>
        </div>

        <main className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex gap-4 h-[calc(100vh-140px)]">

            {/* ── Lista de tickets ── */}
            <div className="w-80 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {/* Filtros */}
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-sm mb-3">Pedidos de Suporte</h2>
                <div className="flex gap-1 flex-wrap">
                  {(["Todos", "Pendente", "Em andamento", "Resolvido"] as const).map((s) => (
                    <button key={s} onClick={() => setFiltroStatus(s)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                        filtroStatus === s
                          ? "bg-[#268cff] text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {filtrados.map((ticket) => {
                  const StatusIcon = STATUS_CONFIG[ticket.status].icon;
                  const isActive = ticketActivo.id === ticket.id;
                  return (
                    <button key={ticket.id}
                      onClick={() => setTicketActivo(ticket)}
                      className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${isActive ? "bg-blue-50 border-l-2 border-[#268cff]" : ""}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-gray-900 truncate flex-1">{ticket.assunto}</p>
                        {ticket.naoLidas > 0 && (
                          <span className="w-5 h-5 bg-[#268cff] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {ticket.naoLidas}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mb-1.5">{ticket.instituicao} · {ticket.utilizador}</p>
                      <p className="text-[11px] text-gray-400 truncate mb-2">{ticket.ultimaMensagem}</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[ticket.status].cor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {ticket.status}
                        </span>
                        <span className="text-[10px] text-gray-400">{ticket.hora}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Área de chat ── */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {/* Header do chat */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{ticketActivo.assunto}</p>
                  <p className="text-xs text-gray-500">{ticketActivo.instituicao} · {ticketActivo.utilizador}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_CONFIG[ticketActivo.status].cor}`}>
                    {ticketActivo.status}
                  </span>
                  {ticketActivo.status !== "Resolvido" && (
                    <button onClick={marcarResolvido}
                      className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">
                      <CheckCheck className="w-3.5 h-3.5" /> Marcar Resolvido
                    </button>
                  )}
                </div>
              </div>

              {/* Mensagens */}
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {ticketActivo.mensagens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma mensagem ainda.</p>
                  </div>
                ) : (
                  ticketActivo.mensagens.map((msg) => {
                    const isAdmin = msg.remetente === "admin";
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                          isAdmin
                            ? "bg-[#268cff] text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.texto}</p>
                          <p className={`text-[10px] mt-1 ${isAdmin ? "text-blue-200 text-right" : "text-gray-400"}`}>
                            {isAdmin ? "Você" : ticketActivo.utilizador} · {msg.hora}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input de resposta */}
              <div className="p-4 border-t border-gray-100">
                {ticketActivo.status === "Resolvido" ? (
                  <div className="flex items-center justify-center py-2 text-sm text-gray-400 gap-2">
                    <CheckCheck className="w-4 h-4 text-green-500" />
                    Este ticket foi marcado como resolvido.
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Escreva a sua resposta..."
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#268cff]/20 outline-none"
                    />
                    <button onClick={enviarMensagem}
                      disabled={!novaMensagem.trim()}
                      className="w-10 h-10 bg-[#268cff] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-40 shrink-0">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
