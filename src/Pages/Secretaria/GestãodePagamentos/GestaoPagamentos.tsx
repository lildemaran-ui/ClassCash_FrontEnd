// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/GestaoPagamentos.tsx
// Melhorias: Modal de detalhes + Modal de adicionar pagamento, responsividade
// ════════════════════════════════════════════════════════════════
import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import {
  ArrowDown, ArrowUp, EyeIcon, Plus, TrendingDown, TrendingUp,
  X, User, BookOpen, Calendar, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Save
} from "lucide-react";
import { useEffect, useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { toast } from "sonner";
import { exigirSessao, getToken, type SessaoUsuario } from "@/types/global/sessao";
import { Header } from "@/components/Header/header";
import Avatar from "@/components/Avatar/Avatar";

const API = "http://localhost:5000/api";

interface PagamentoRow {
  codigo: number; nome_estudante: string; classe: number | null;
  data: string | null; servico: string; valor: string;
  multa_estimada: string; status: string;
}
interface Cards {
  total_pagamentos: string; confirmados: string;
  pendentes: string; atrasados: string; cancelados: string;
}

/* ── KPI Card ── */
const CardKpi = ({ title, value, subtext, trend }: {
  title: string; value: string; subtext: string; trend?: "up" | "down"
}) => (
  <div className="bg-white px-3 py-4 rounded-2xl flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all duration-300">
    <p className="text-gray-400 text-xs font-medium mb-1 truncate w-full">{title}</p>
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-bold text-gray-800">{value}</span>
      {trend === "up" && <TrendingUp size={16} className="text-green-500" />}
      {trend === "down" && <TrendingDown size={16} className="text-red-500" />}
    </div>
    <p className="text-[11px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

/* ── Status Badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    confirmado: "bg-green-50 text-green-700 border-green-200",
    pendente: "bg-orange-50 text-orange-700 border-orange-200",
    atrasado: "bg-red-50 text-red-700 border-red-200",
    cancelado: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status === "confirmado" && <CheckCircle size={10} />}
      {status === "pendente" && <Clock size={10} />}
      {status === "atrasado" && <AlertTriangle size={10} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/* ── Modal de Detalhes ── */
const ModalDetalhes = ({ row, onClose }: { row: PagamentoRow; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-start">
        <div>
          <h2 className="text-white font-bold text-lg">{row.nome_estudante}</h2>
          <p className="text-blue-200 text-sm mt-0.5">Pagamento #{row.codigo}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <X size={18} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <BookOpen size={13} className="text-[#184d8a]" />, label: "Classe", val: row.classe ? `${row.classe}ª Classe` : "—" },
            { icon: <Calendar size={13} className="text-[#184d8a]" />, label: "Data", val: row.data ?? "—" },
            { icon: <FileText size={13} className="text-[#184d8a]" />, label: "Serviço", val: row.servico },
            { icon: <User size={13} className="text-[#184d8a]" />, label: "Estado", val: <StatusBadge status={row.status} /> },
          ].map(({ icon, label, val }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span></div>
              <div className="text-sm font-bold text-gray-700">{val}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#184d8a]/5 rounded-2xl p-4 border border-[#184d8a]/10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#184d8a]" />
              <span className="text-sm font-semibold text-gray-600">Valor</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">
              {Number(row.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </span>
          </div>
          {Number(row.multa_estimada) > 0 && (
            <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
              <span className="text-sm font-semibold text-red-500">Multa</span>
              <span className="font-bold text-red-600">
                {Number(row.multa_estimada).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
          Fechar
        </button>
        <button className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200">
          Imprimir Recibo
        </button>
      </div>
    </div>
  </div>
);

/* ── Modal de Adicionar Pagamento ── */
const ModalAdicionar = ({ onClose, onSave }: { onClose: () => void; onSave: () => void }) => {
  const [form, setForm] = useState({
    nome: "", classe: "", servico: "", valor: "", data: "", status: "pendente"
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.nome || !form.servico || !form.valor) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    setSaving(true);
    try {
      // Simulated save — replace with actual API call
      await new Promise(r => setTimeout(r, 800));
      toast.success("Pagamento adicionado com sucesso!");
      onSave();
      onClose();
    } catch {
      toast.error("Erro ao guardar pagamento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-white font-bold text-lg">Novo Pagamento</h2>
            <p className="text-blue-200 text-sm">Preencha os dados do pagamento</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nome do Estudante *</label>
            <input
              type="text"
              placeholder="Ex: João Manuel dos Santos"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Classe</label>
              <select
                value={form.classe}
                onChange={e => setForm({ ...form, classe: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="">Selecionar</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                  <option key={c} value={c}>{c}ª Classe</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Serviço *</label>
            <input
              type="text"
              placeholder="Ex: Propina do mês de Janeiro"
              value={form.servico}
              onChange={e => setForm({ ...form, servico: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Valor (AOA) *</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data</label>
              <input
                type="date"
                value={form.data}
                onChange={e => setForm({ ...form, data: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> A guardar...</>
            ) : (
              <><Save size={16} /> Guardar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function GestaoPagamentos() {
  const [tabela, setTabela] = useState<PagamentoRow[]>([]);
  const [cards, setCards] = useState<Cards>({ total_pagamentos: "0", confirmados: "0", pendentes: "0", atrasados: "0", cancelados: "0" });
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [selectedRow, setSelectedRow] = useState<PagamentoRow | null>(null);
  const [showAdicionar, setShowAdicionar] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
 const [user, setUser] = useState<SessaoUsuario | null>(null);
    
  useEffect(() => {
      const sessao = exigirSessao();
      if (!sessao) return;
      setUser(sessao.usuario);
  }, []);
  const carregar = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/gestaoPagamentos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar pagamentos");
      const data = await res.json();
      setCards(data.cards ?? cards);
      setTabela(data.tabela ?? []);
    } catch {
      toast.error("Erro ao carregar pagamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSort = () => {
    const ordenados = [...tabela].sort((a, b) =>
      ordemCrescente ? a.nome_estudante.localeCompare(b.nome_estudante) : b.nome_estudante.localeCompare(a.nome_estudante)
    );
    setTabela(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const tabelaFiltrada = tabela.filter(r => !filtroEstado || r.status === filtroEstado);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
         <Header
                  titulo="Gestão de Pagamentos"
                  usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
                />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPI Grid - scrollable on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <CardKpi title="Total Recebido" value={cards.total_pagamentos} subtext="este mês" trend="up" />
            <CardKpi title="Confirmados" value={cards.confirmados} subtext="validados" />
            <CardKpi title="Pendentes" value={cards.pendentes} subtext="em análise" trend="down" />
            <CardKpi title="Em Atraso" value={cards.atrasados} subtext="vencidos" trend="down" />
            <CardKpi title="Cancelados" value={cards.cancelados} subtext="estornados" />
          </div>

          {/* Filtros + Botão */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={e => setFiltroEstado(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#184d8a] cursor-pointer min-w-[130px]"
                >
                  <option value="">Todos</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                  <option value="atrasado">Em Atraso</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowAdicionar(true)}
              className="flex items-center gap-2 bg-[#184d8a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 active:scale-95"
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Histórico de Transações</h3>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">{tabelaFiltrada.length} registos</span>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#184d8a] text-white text-[13px] font-semibold">
                    <th className="px-4 py-3.5">Código</th>
                    <th className="px-4 py-3.5 cursor-pointer hover:bg-[#1a5fad] transition-colors" onClick={handleSort}>
                      <div className="flex items-center justify-center gap-1">
                        Nome {ordemCrescente ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Classe</th>
                    <th className="px-4 py-3.5">Serviço</th>
                    <th className="px-4 py-3.5">Valor</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={7} className="py-14 text-center text-sm text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
                        A carregar...
                      </div>
                    </td></tr>
                  ) : tabelaFiltrada.length === 0 ? (
                    <tr><td colSpan={7} className="py-14 text-center text-sm text-gray-400">Nenhum pagamento encontrado</td></tr>
                  ) : tabelaFiltrada.map((row, i) => (
                    <tr key={i} className="hover:bg-[#184d8a]/3 transition-colors">
                      <td className="px-4 py-4 text-sm font-mono text-gray-400">{row.codigo}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-700">{row.nome_estudante}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{row.classe ? `${row.classe}ª` : "—"}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{row.servico}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                        {Number(row.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedRow(row)}
                          className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all mx-auto block"
                        >
                          <EyeIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-400">A carregar...</div>
              ) : tabelaFiltrada.map((row, i) => (
                <div key={i} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">{row.nome_estudante}</p>
                      <p className="text-xs text-gray-400">{row.servico}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm font-bold text-gray-800">
                      {Number(row.valor).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                    </p>
                    <button onClick={() => setSelectedRow(row)} className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all">
                      <EyeIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedRow && <ModalDetalhes row={selectedRow} onClose={() => setSelectedRow(null)} />}
      {showAdicionar && <ModalAdicionar onClose={() => setShowAdicionar(false)} onSave={carregar} />}
    </div>
  );
}