import Avatar from "@/components/Avatar/Avatar";
import HelpButton from "@/components/Botoes/helpbutton";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import {
  MessageSquare, Trash2, X, Send, CheckCircle, Clock,
  Search, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface Reclamacao {
  id: number;
  data: string;
  nome: string;
  assunto: string;
  status: "Pendente" | "Resolvida";
  descricao?: string;
  resposta?: string;
}

interface Paginacao {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

/* ── Respostas acumuladas ── */
const RespostasAcumuladas = ({ texto }: { texto: string }) => {
  const blocos = texto.split(/\n\n(?=\[)/).filter(Boolean);
  return (
    <div className="flex flex-col gap-2 mt-2">
      {blocos.map((bloco, i) => {
        const match = bloco.match(/^\[(.+?)\]\s*([\s\S]*)$/);
        const data = match?.[1] ?? "";
        const mensagem = match?.[2]?.trim() ?? bloco;
        return (
          <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            {data && <p className="text-[10px] font-bold text-blue-400 mb-1">{data}</p>}
            <p className="text-xs text-blue-800 leading-relaxed">{mensagem}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ── Card de Reclamação ── */
const statusConfig = {
  Resolvida: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  Pendente:  { color: "bg-amber-100 text-amber-700 border-amber-200",  icon: Clock },
};

const ReclamacaoCard = ({
  rec,
  onResponder,
  onEliminar,
}: {
  rec: Reclamacao;
  onResponder: (rec: Reclamacao) => void;
  onEliminar: (id: number) => void;
}) => {
  const cfg = statusConfig[rec.status] ?? statusConfig.Pendente;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <MessageSquare size={15} className="text-[#184d8a]" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{rec.assunto}</h3>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border ${cfg.color}`}>
          <Icon size={11} />{rec.status}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-500 pl-9">
        <span><span className="font-medium text-gray-700">Remetente:</span> {rec.nome}</span>
        <span><span className="font-medium text-gray-700">Data:</span> {rec.data}</span>
        {rec.descricao && (
          <span><span className="font-medium text-gray-700">Descrição:</span> {rec.descricao}</span>
        )}
      </div>

      {rec.resposta && rec.resposta.trim() && (
        <div className="pl-9">
          <p className="text-xs font-semibold text-blue-700 mb-1">Respostas enviadas:</p>
          <RespostasAcumuladas texto={rec.resposta} />
        </div>
      )}

      <div className="flex gap-2 justify-end pt-1 border-t border-gray-50">
        <button
          onClick={() => onResponder(rec)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-[#184d8a] text-xs font-bold hover:bg-primary hover:text-white transition-all"
        >
          <MessageSquare size={12} /> Responder
        </button>
        <button
          onClick={() => onEliminar(rec.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={12} /> Remover
        </button>
      </div>
    </div>
  );
};

/* ── Modal Resposta ── */
const ModalResposta = ({
  rec, onClose, onUpdate,
}: {
  rec: Reclamacao;
  onClose: () => void;
  onUpdate: (id: number, resposta: string, status: Reclamacao["status"]) => Promise<void>;
}) => {
  const [novaResposta, setNovaResposta] = useState("");
  const [status, setStatus] = useState<Reclamacao["status"]>(rec.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!novaResposta.trim()) { toast.error("Escreve uma resposta"); return; }
    setSaving(true);
    await onUpdate(rec.id, novaResposta, status);
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary px-6 py-5 flex justify-between items-start sticky top-0">
          <div>
            <h2 className="text-white font-bold text-lg">Responder Reclamação</h2>
            <p className="text-blue-200 text-sm mt-0.5">#{rec.id} · {rec.data}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reclamante</p>
            <p className="font-bold text-gray-700">{rec.nome}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">{rec.assunto}</h3>
            {rec.descricao && (
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{rec.descricao}</p>
            )}
          </div>

          {rec.resposta && rec.resposta.trim() && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Respostas anteriores</p>
              <RespostasAcumuladas texto={rec.resposta} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Reclamacao["status"])}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
            >
              <option value="Pendente">Pendente</option>
              <option value="Resolvida">Resolvida</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nova Resposta</label>
            <textarea
              rows={4}
              placeholder="Escreve uma nova resposta..."
              value={novaResposta}
              onChange={(e) => setNovaResposta(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{novaResposta.length} caracteres</p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> A enviar...</>
              : <><Send size={16} /> Enviar Resposta</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Modal Exclusão ── */
const ModalExclusao = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Remover Reclamação</h2>
      <p className="text-gray-500 text-sm mb-6">Tens a certeza? Esta acção não pode ser revertida.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
          Cancelar
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all">
          Remover
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
const LIMITE = 10;

export default function GestaodeReclamacoes() {
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao>({ total: 0, pagina: 1, limite: LIMITE, totalPaginas: 1 });
  const [modalResposta, setModalResposta] = useState<Reclamacao | null>(null);
  const [modalExclusao, setModalExclusao] = useState<number | null>(null);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");
  const [buscaActiva, setBuscaActiva] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"" | "Pendente" | "Resolvida">("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  const carregarReclamacoes = useCallback(async () => {
    setCarregando(true);
    try {
      const params = new URLSearchParams({ pagina: String(pagina), limite: String(LIMITE) });
      if (buscaActiva.trim()) params.set("busca", buscaActiva.trim());
      if (filtroStatus) params.set("status", filtroStatus);

      const res = await fetchComAuth(
        `http://localhost:5000/api/reclamacoes/secretaria/todas?${params.toString()}`
      );
      const dados = await res.json();
      const lista = dados.reclamacoes ?? dados;

      setReclamacoes(
        lista.map((r: any) => ({
          id: r.idreclamacao,
          data: new Date(r.data).toLocaleDateString("pt-AO"),
          nome: r.nome,
          assunto: r.titulo ?? r.descricao?.substring(0, 50) ?? "—",
          status: r.status === "Resolvida" ? "Resolvida" : "Pendente",
          descricao: r.descricao,
          resposta: r.resposta ?? "",
        }))
      );
      if (dados.paginacao) setPaginacao(dados.paginacao);
    } catch {
      toast.error("Erro ao carregar reclamações");
    } finally {
      setCarregando(false);
    }
  }, [pagina, buscaActiva, filtroStatus]);

  useEffect(() => { carregarReclamacoes(); }, [carregarReclamacoes]);

  const aplicarFiltroStatus = (valor: "" | "Pendente" | "Resolvida") => { setFiltroStatus(valor); setPagina(1); };
  const aplicarBusca = () => { setBuscaActiva(busca); setPagina(1); };
  const limparFiltros = () => { setBusca(""); setBuscaActiva(""); setFiltroStatus(""); setPagina(1); };

  const handleUpdate = async (id: number, resposta: string, status: Reclamacao["status"]) => {
    try {
      await fetchComAuth(`http://localhost:5000/api/reclamacoes/secretaria/${id}/responder`, {
        method: "PUT",
        body: JSON.stringify({ resposta, status }),
      });
      toast.success("Resposta enviada com sucesso!");
      await carregarReclamacoes();
    } catch {
      toast.error("Erro ao enviar resposta");
    }
  };

  const handleDelete = async () => {
    try {
      await fetchComAuth(`http://localhost:5000/api/reclamacoes/secretaria/${modalExclusao}`, { method: "DELETE" });
      toast.success("Reclamação removida");
      setModalExclusao(null);
      await carregarReclamacoes();
    } catch {
      toast.error("Erro ao remover reclamação");
    }
  };

  const temFiltrosActivos = buscaActiva || filtroStatus;

  const paginasVisiveis = Array.from({ length: paginacao.totalPaginas }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === paginacao.totalPaginas || Math.abs(p - pagina) <= 1)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Gestão de Reclamações"
          usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl border-l-4 border-orange-400 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-orange-400" />
                <p className="text-xs font-medium text-gray-400">Pendentes</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {String(reclamacoes.filter(r => r.status === "Pendente").length).padStart(2, "0")}
              </h3>
              <span className="text-orange-500 text-[11px] font-bold">Por resolver</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border-l-4 border-green-500 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-green-500" />
                <p className="text-xs font-medium text-gray-400">Resolvidas</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {String(reclamacoes.filter(r => r.status === "Resolvida").length).padStart(2, "0")}
              </h3>
              <span className="text-green-500 text-[11px] font-bold">Concluídas</span>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 mb-4 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && aplicarBusca()}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              {busca && (
                <button onClick={() => { setBusca(""); setBuscaActiva(""); setPagina(1); }}>
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-gray-400" />
              {(["", "Pendente", "Resolvida"] as const).map((op) => (
                <button
                  key={op || "todos"}
                  onClick={() => aplicarFiltroStatus(op)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filtroStatus === op ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {op || "Todos"}
                </button>
              ))}
            </div>
            <button onClick={aplicarBusca} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1a5fad] transition-all">
              Pesquisar
            </button>
            {temFiltrosActivos && (
              <button onClick={limparFiltros} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <X size={12} /> Limpar
              </button>
            )}
          </div>

          {/* Cards */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-700">Lista de Reclamações</h3>
                <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">{paginacao.total} total</span>
              </div>
            </div>

            {carregando ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reclamacoes.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">{temFiltrosActivos ? "Nenhum resultado para os filtros aplicados" : "Nenhuma reclamação registada"}</p>
                {temFiltrosActivos && (
                  <button onClick={limparFiltros} className="mt-2 text-xs text-primary hover:underline">Limpar filtros</button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reclamacoes.map((r) => (
                  <ReclamacaoCard
                    key={r.id}
                    rec={r}
                    onResponder={setModalResposta}
                    onEliminar={setModalExclusao}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Paginação */}
          {paginacao.totalPaginas > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-3">
              <p className="text-xs text-gray-400">
                Página <span className="font-bold text-gray-600">{paginacao.pagina}</span> de{" "}
                <span className="font-bold text-gray-600">{paginacao.totalPaginas}</span>
                {" · "}{paginacao.total} reclamações
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={15} className="text-gray-600" />
                </button>
                {paginasVisiveis.map((item, i) =>
                  item === "..." ? (
                    <span key={`dots-${i}`} className="px-1 text-gray-400 text-sm">…</span>
                  ) : (
                    <button key={item} onClick={() => setPagina(item as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${pagina === item ? "bg-primary text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {item}
                    </button>
                  )
                )}
                <button onClick={() => setPagina((p) => Math.min(paginacao.totalPaginas, p + 1))} disabled={pagina === paginacao.totalPaginas} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={15} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
        <HelpButton/>
      </main>

      {modalResposta && (
        <ModalResposta rec={modalResposta} onClose={() => setModalResposta(null)} onUpdate={handleUpdate} />
      )}
      {modalExclusao !== null && (
        <ModalExclusao onClose={() => setModalExclusao(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}