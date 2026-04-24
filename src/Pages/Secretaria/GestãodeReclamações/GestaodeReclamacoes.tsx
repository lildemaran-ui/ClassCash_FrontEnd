import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import {
  Download, MessageSquare, Trash2, X, Send, CheckCircle, Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
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

/* ── Badge de Status ── */
const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Pendente: { cls: "bg-orange-50 text-orange-700 border-orange-200", icon: <Clock size={10} /> },
    Resolvida: { cls: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle size={10} /> },
  };
  const c = map[s] ?? { cls: "bg-gray-50 text-gray-600 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.cls}`}>
      {c.icon} {s}
    </span>
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
  const [resposta, setResposta] = useState(rec.resposta ?? "");
  const [status, setStatus] = useState<Reclamacao["status"]>(rec.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!resposta.trim()) { toast.error("Escreve uma resposta"); return; }
    setSaving(true);
    await onUpdate(rec.id, resposta, status);
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
          {/* Reclamante */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reclamante</p>
            <p className="font-bold text-gray-700">{rec.nome}</p>
          </div>

          {/* Assunto + Descrição */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">{rec.assunto}</h3>
            {rec.descricao && (
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                {rec.descricao}
              </p>
            )}
          </div>

          {/* Resposta anterior (se existir) */}
          {rec.resposta && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">Resposta anterior:</p>
              <p className="text-sm text-blue-800">{rec.resposta}</p>
            </div>
          )}

          {/* Status */}
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

          {/* Resposta */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Resposta ao Utilizador
            </label>
            <textarea
              rows={4}
              placeholder="Escreve uma resposta clara e construtiva..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{resposta.length} caracteres</p>
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
export default function GestaodeReclamacoes() {
  const [reclamacoes, setReclamacoes] = useState<Reclamacao[]>([]);
  const [modalResposta, setModalResposta] = useState<Reclamacao | null>(null);
  const [modalExclusao, setModalExclusao] = useState<number | null>(null);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  const carregarReclamacoes = async () => {
    setCarregando(true);
    try {
      // ✅ FIX: URL actualizada para o novo prefixo /secretaria/todas
      const res = await fetchComAuth("http://localhost:5000/api/reclamacoes/secretaria/todas");
      const dados = await res.json();

      // ✅ A API agora devolve { reclamacoes: [...], paginacao: {...} }
      const lista = dados.reclamacoes ?? dados;

      setReclamacoes(
        lista.map((r: any) => ({
          id: r.idreclamacao,
          data: new Date(r.data).toLocaleDateString("pt-AO"),
          nome: r.nome,
          assunto: r.titulo ?? r.descricao?.substring(0, 50) ?? "—",
          // ✅ Status já vem como texto da BD (CASE WHEN), não precisa converter
          status: r.status === "Resolvida" ? "Resolvida" : "Pendente",
          descricao: r.descricao,
          resposta: r.resposta ?? "",
        }))
      );
    } catch (err) {
      toast.error("Erro ao carregar reclamações");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarReclamacoes(); }, []);

  const handleUpdate = async (id: number, resposta: string, status: Reclamacao["status"]) => {
    try {
      // ✅ FIX: URL actualizada para o novo prefixo /secretaria/
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
      // ✅ FIX: URL actualizada para o novo prefixo /secretaria/
      await fetchComAuth(`http://localhost:5000/api/reclamacoes/secretaria/${modalExclusao}`, {
        method: "DELETE",
      });
      toast.success("Reclamação removida");
      setModalExclusao(null);
      await carregarReclamacoes();
    } catch {
      toast.error("Erro ao remover reclamação");
    }
  };

  const pendentes = reclamacoes.filter((r) => r.status === "Pendente").length;
  const resolvidas = reclamacoes.filter((r) => r.status === "Resolvida").length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
          <Header
            titulo="Gestão de Reclamações"
            usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
          />
          <button className="flex items-center gap-2 bg-primary text-white hover:bg-[#1a5fad] px-4 py-2 rounded-xl font-bold transition-all text-sm">
            <Download size={16} /> Exportar PDF
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border-l-4 border-orange-400 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-orange-400" />
                <p className="text-xs font-medium text-gray-400">Pendentes</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{String(pendentes).padStart(2, "0")}</h3>
              <span className="text-orange-500 text-[11px] font-bold">Por resolver</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border-l-4 border-green-500 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-green-500" />
                <p className="text-xs font-medium text-gray-400">Resolvidas</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{String(resolvidas).padStart(2, "0")}</h3>
              <span className="text-green-500 text-[11px] font-bold">Concluídas</span>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Lista de Reclamações</h3>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">
                {reclamacoes.length} total
              </span>
            </div>

            {carregando ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reclamacoes.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma reclamação registada</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white text-[13px] font-semibold text-center">
                        <th className="px-6 py-3.5">Data</th>
                        <th className="px-6 py-3.5">Remetente</th>
                        <th className="px-6 py-3.5">Assunto</th>
                        <th className="px-6 py-3.5">Estado</th>
                        <th className="px-6 py-3.5">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reclamacoes.map((r) => (
                        <tr key={r.id} className="hover:bg-primary/3 transition-colors text-center">
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{r.data}</td>
                          <td className="px-6 py-4 text-left">
                            <p className="text-sm font-bold text-gray-700">{r.nome}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] text-left">
                            <span className="line-clamp-1">{r.assunto}</span>
                          </td>
                          <td className="px-6 py-4"><StatusBadge s={r.status} /></td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setModalResposta(r)}
                                className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all"
                                title="Responder"
                              >
                                <MessageSquare size={15} />
                              </button>
                              <button
                                onClick={() => setModalExclusao(r.id)}
                                className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                title="Remover"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-gray-100">
                  {reclamacoes.map((r) => (
                    <div key={r.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-700 text-sm truncate">{r.nome}</p>
                          <p className="text-[11px] text-gray-400">{r.data}</p>
                        </div>
                        <StatusBadge s={r.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1">{r.assunto}</p>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setModalResposta(r)} className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all">
                          <MessageSquare size={14} />
                        </button>
                        <button onClick={() => setModalExclusao(r.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {modalResposta && (
        <ModalResposta
          rec={modalResposta}
          onClose={() => setModalResposta(null)}
          onUpdate={handleUpdate}
        />
      )}
      {modalExclusao !== null && (
        <ModalExclusao
          onClose={() => setModalExclusao(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}