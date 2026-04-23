// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/GestaodeServiços.tsx
// Melhorias: Modal Adicionar + Modal Editar serviço, responsividade
// ════════════════════════════════════════════════════════════════
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import { ArrowDown, ArrowUp, Pen, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface Servico {
  idservico: number;
  servico: string;
  idclasse: number;
  classe: number;
  valorservico: string;
  multa_base: number;
}

/* ── Modal de Confirmação de Exclusão ── */
const ModalConfirmarExclusao = ({
  servico,
  onClose,
  onConfirm,
  loading,
}: {
  servico: Servico;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Remover Serviço
        </h2>
        <p className="text-gray-500 text-sm">
          Tens a certeza que queres remover o serviço{" "}
          <strong className="text-gray-700">"{servico.servico}"</strong> da{" "}
          {servico.classe}ª classe?
        </p>
        <p className="text-red-500 text-xs mt-2 font-medium">
          Esta acção não pode ser revertida.
        </p>
      </div>
      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
              A remover...
            </>
          ) : (
            <>
              <Trash2 size={16} /> Remover
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

/* ── Modal de Adicionar / Editar Serviço ── */
const ModalServico = ({
  servico,
  onClose,
  onSave,
}: {
  servico?: Servico | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const isEdicao = Boolean(servico);
  const [form, setForm] = useState({
    servico: servico?.servico ?? "",
    classe: servico?.classe ? String(servico.classe) : "",
    valorservico: servico?.valorservico ?? "",
    multa_base: servico?.multa_base ? String(servico.multa_base) : "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.servico || !form.classe || !form.valorservico) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const url = isEdicao
        ? `${API}/gestaoServicos/${servico!.idservico}`
        : `${API}/gestaoServicos`;
      const method = isEdicao ? "PUT" : "POST";
      const payload = {
        nome: form.servico, // ✅ mapear servico → nome
        nivel: form.classe, // ✅ mapear classe → nivel
        valorservico: form.valorservico,
        multa_base: form.multa_base || 0,
      };

      const res = await fetchComAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao guardar");
      toast.success(isEdicao ? "Serviço actualizado!" : "Serviço adicionado!");
      onSave();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  const ehPropina = form.servico.toLowerCase().includes("propina");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary px-6 py-5 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-white font-bold text-lg">
              {isEdicao ? "Editar Serviço" : "Novo Serviço"}
            </h2>
            <p className="text-blue-200 text-sm">
              {isEdicao
                ? "Actualiza os dados do serviço"
                : "Adiciona um novo serviço ao sistema"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Nome do Serviço <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Propina Mensal, Matrícula..."
              value={form.servico}
              onChange={(e) => setForm({ ...form, servico: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Classe <span className="text-red-500">*</span>
            </label>
            <select
              value={form.classe}
              onChange={(e) => setForm({ ...form, classe: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
            >
              <option value="">Selecionar classe</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                <option key={c} value={c}>
                  {c}ª Classe
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Valor Base (AOA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.valorservico}
                onChange={(e) =>
                  setForm({ ...form, valorservico: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
              />
            </div>
            {ehPropina && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Multa Base (AOA)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.multa_base}
                  onChange={(e) =>
                    setForm({ ...form, multa_base: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
                />
              </div>
            )}
          </div>

          {form.valorservico && form.multa_base && (
            <div className="bg-primary/5 rounded-xl p-4 border border-[#184d8a]/10">
              <p className="text-xs font-semibold text-gray-400 mb-2">
                Pré-visualização
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor:</span>
                <span className="font-bold text-gray-800">
                  {Number(form.valorservico).toLocaleString("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Multa:</span>
                <span className="font-bold text-red-500">
                  {Number(form.multa_base).toLocaleString("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                A guardar...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdicao ? "Actualizar" : "Adicionar"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function GestaodeServiços() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [modalServico, setModalServico] = useState<{
    open: boolean;
    servico?: Servico | null;
  }>({ open: false });
  const [modalExclusao, setModalExclusao] = useState<{
    open: boolean;
    servico?: Servico;
  }>({ open: false });
  const [excluindo, setExcluindo] = useState(false);
  const [filtroServico, setFiltroServico] = useState("");

  const carregar = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/gestaoServicos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar serviços");
      const data = await res.json();
      setServicos(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);
  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#184d8a]">
          <div className="w-5 h-5 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">A verificar autenticação...</span>
        </div>
      </div>
    );

  const handleSort = () => {
    const ordenados = [...servicos].sort((a, b) =>
      ordemCrescente
        ? a.servico.localeCompare(b.servico)
        : b.servico.localeCompare(a.servico),
    );
    setServicos(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const handleDelete = async () => {
    if (!modalExclusao.servico) return;
    setExcluindo(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(
        `${API}/gestaoServicos/${modalExclusao.servico.idservico}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Erro ao remover");
      toast.success("Serviço removido com sucesso");
      setModalExclusao({ open: false });
      carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover");
    } finally {
      setExcluindo(false);
    }
  };

  const servicosFiltrados = servicos.filter(
    (s) =>
      !filtroServico ||
      s.servico.toLowerCase().includes(filtroServico.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Gestão de Serviços"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Stats rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total de Serviços", val: servicos.length },
              {
                label: "Classes Cobertas",
                val: new Set(servicos.map((s) => s.classe)).size,
              },
              {
                label: "Valor Médio",
                val:
                  servicos.length > 0
                    ? (
                        servicos.reduce(
                          (a, s) => a + Number(s.valorservico),
                          0,
                        ) / servicos.length
                      ).toLocaleString("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      })
                    : "—",
              },
              {
                label: "Com Multa Base",
                val: servicos.filter((s) => s.multa_base > 0).length,
              },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all"
              >
                <p className="text-xs text-gray-400 font-medium mb-1">
                  {label}
                </p>
                <p className="text-xl font-bold text-[#184d8a]">{val}</p>
              </div>
            ))}
          </div>

          {/* Filtros + Botão */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Pesquisar Serviço
              </label>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={filtroServico}
                onChange={(e) => setFiltroServico(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#184d8a] w-56 transition-all"
              />
            </div>
            <button
              onClick={() => setModalServico({ open: true, servico: null })}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 active:scale-95"
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Tabela de Serviços</h3>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">
                {servicosFiltrados.length} serviços
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-primary text-white text-[13px] font-semibold">
                    <th
                      className="px-6 py-3.5 cursor-pointer hover:bg-[#1a5fad] transition-colors text-left"
                      onClick={handleSort}
                    >
                      <div className="flex items-center gap-1">
                        Serviço{" "}
                        {ordemCrescente ? (
                          <ArrowDown size={13} />
                        ) : (
                          <ArrowUp size={13} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Classe</th>
                    <th className="px-6 py-3.5">Valor Base</th>
                    <th className="px-6 py-3.5">Multa Base</th>
                    <th className="px-6 py-3.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
                          A carregar...
                        </div>
                      </td>
                    </tr>
                  ) : servicosFiltrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        Nenhum serviço encontrado
                      </td>
                    </tr>
                  ) : (
                    servicosFiltrados.map((s) => (
                      <tr
                        key={`${s.idservico}-${s.idclasse}`}
                        className="hover:bg-primary/3 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700 text-left">
                          {s.servico}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {s.classe}ª Classe
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {Number(s.valorservico).toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-500">
                          {s.multa_base > 0 ? (
                            Number(s.multa_base).toLocaleString("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                            })
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                setModalServico({ open: true, servico: s })
                              }
                              className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all"
                              title="Editar"
                            >
                              <Pen size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setModalExclusao({ open: true, servico: s })
                              }
                              className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              title="Remover"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  A carregar...
                </div>
              ) : (
                servicosFiltrados.map((s) => (
                  <div
                    key={`${s.idservico}-${s.idclasse}`}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">
                          {s.servico}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.classe}ª Classe
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setModalServico({ open: true, servico: s })
                          }
                          className="p-1.5 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          <Pen size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setModalExclusao({ open: true, servico: s })
                          }
                          className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <p className="text-sm font-bold text-gray-800">
                        {Number(s.valorservico).toLocaleString("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                        })}
                      </p>
                      {s.multa_base > 0 && (
                        <p className="text-sm font-medium text-red-500">
                          +{" "}
                          {Number(s.multa_base).toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}{" "}
                          multa
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {modalServico.open && (
        <ModalServico
          servico={modalServico.servico}
          onClose={() => setModalServico({ open: false })}
          onSave={carregar}
        />
      )}
      {modalExclusao.open && modalExclusao.servico && (
        <ModalConfirmarExclusao
          servico={modalExclusao.servico}
          onClose={() => setModalExclusao({ open: false })}
          onConfirm={handleDelete}
          loading={excluindo}
        />
      )}
    </div>
  );
}
