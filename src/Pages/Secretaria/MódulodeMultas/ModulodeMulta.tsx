// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/ModulodeMulta.tsx
// Melhorias: Modal Aplicar Multa + Modal Detalhes, responsividade
// ════════════════════════════════════════════════════════════════
import Avatar from "@/components/Avatar/Avatar";
import ChartGestaoMulta from "@/components/Charts/ChartGestaoMulta";
import ChartGestaoMulta2 from "@/components/Charts/ChartGestaoMulta2";
import { Header } from "@/components/Header/header";
import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, getToken, type SessaoUsuario } from "@/types/global/sessao";
import {
  CheckCircle, DollarSign, Download, EyeIcon, Plus, TrendingUp,
  Trash2, X, Save, AlertTriangle, Clock, User, FileText, Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface MultaRow {
  nome: string; motivo: string; valor_original: string;
  multa: string; dias_atraso: number; status: string;
}
interface Cards {
  multas_pendentes: string; percentual_pendentes: string;
  multas_pagas: string; transacoes_liquidadas: string; percentual_multas: string;
}

/* ── Status Badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Paga: { cls: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle size={10} /> },
    Pendente: { cls: "bg-orange-50 text-orange-700 border-orange-200", icon: <Clock size={10} /> },
  };
  const c = map[status] ?? { cls: "bg-gray-50 text-gray-600 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${c.cls}`}>
      {c.icon} {status}
    </span>
  );
};

/* ── Modal de Aplicar Multa ── */
const ModalAplicarMulta = ({ onClose, onSave }: { onClose: () => void; onSave: () => void }) => {
  const [form, setForm] = useState({
    nome: "", motivo: "", valor_original: "", percentual: "10", dias_atraso: "", status: "Pendente"
  });
  const [saving, setSaving] = useState(false);

  const multaCalculada = form.valor_original && form.percentual
    ? (Number(form.valor_original) * Number(form.percentual)) / 100
    : 0;

  const handleSave = async () => {
    if (!form.nome || !form.motivo || !form.valor_original) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      await fetch(`${API}/gestaoMultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, multa: multaCalculada }),
      });
      toast.success("Multa aplicada com sucesso!");
      onSave();
      onClose();
    } catch {
      toast.error("Erro ao aplicar multa");
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
            <h2 className="text-white font-bold text-lg">Aplicar Multa</h2>
            <p className="text-blue-200 text-sm">Preencha os dados da multa</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Nome do Estudante <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Maria Silva"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Motivo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Propina em atraso - Janeiro 2025"
              value={form.motivo}
              onChange={e => setForm({ ...form, motivo: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Valor Original (AOA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.valor_original}
                onChange={e => setForm({ ...form, valor_original: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Percentual Multa (%)</label>
              <input
                type="number"
                min="0" max="100"
                value={form.percentual}
                onChange={e => setForm({ ...form, percentual: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Dias em Atraso</label>
              <input
                type="number"
                placeholder="0"
                value={form.dias_atraso}
                onChange={e => setForm({ ...form, dias_atraso: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="Pendente">Pendente</option>
                <option value="Paga">Paga</option>
              </select>
            </div>
          </div>

          {/* Resumo Calculado */}
          {form.valor_original && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Resumo da Multa</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Original:</span>
                  <span className="font-bold text-gray-800">
                    {Number(form.valor_original).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Multa ({form.percentual}%):</span>
                  <span className="font-bold text-red-600">
                    {multaCalculada.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-red-100 pt-2 mt-2">
                  <span className="font-bold text-gray-700">Total a Pagar:</span>
                  <span className="font-bold text-[#184d8a] text-base">
                    {(Number(form.valor_original) + multaCalculada).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                  </span>
                </div>
              </div>
            </div>
          )}
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
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> A aplicar...</>
            ) : (
              <><Save size={16} /> Aplicar Multa</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Modal de Detalhes de Multa ── */
const ModalDetalhes = ({ row, onClose }: { row: MultaRow; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-start">
        <div>
          <h2 className="text-white font-bold text-lg">{row.nome}</h2>
          <p className="text-blue-200 text-sm mt-0.5">Detalhes da Multa</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <X size={18} />
        </button>
      </div>

      <div className={`px-6 py-3 border-b ${row.status === "Paga" ? "bg-green-50" : "bg-orange-50"}`}>
        <StatusBadge status={row.status} />
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <User size={13} className="text-[#184d8a]" />, label: "Estudante", val: row.nome },
            { icon: <FileText size={13} className="text-[#184d8a]" />, label: "Motivo", val: row.motivo },
            { icon: <AlertTriangle size={13} className="text-orange-500" />, label: "Dias em Atraso", val: `${row.dias_atraso} dias` },
            { icon: <Clock size={13} className="text-[#184d8a]" />, label: "Estado", val: <StatusBadge status={row.status} /> },
          ].map(({ icon, label, val }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span></div>
              <div className="text-sm font-bold text-gray-700">{val}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#184d8a]/5 rounded-2xl p-4 border border-[#184d8a]/10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Valor Original</span>
            <span className="font-bold text-gray-800 text-lg">
              {Number(row.valor_original).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
            <span className="text-sm font-semibold text-red-500">Valor Multa</span>
            <span className="font-bold text-red-600 text-lg">
              {Number(row.multa).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className="font-bold text-[#184d8a] text-xl">
              {(Number(row.valor_original) + Number(row.multa)).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">Fechar</button>
        {row.status === "Pendente" && (
          <button className="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-all">
            Marcar como Paga
          </button>
        )}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
export default function ModulodeMulta() {
  const [tabela, setTabela] = useState<MultaRow[]>([]);
  const [cards, setCards] = useState<Cards | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAplicar, setShowAplicar] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MultaRow | null>(null);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
      
    useEffect(() => {
        const sessao = exigirSessao();
        if (!sessao) return;
        setUser(sessao.usuario);
    }, []);
  
  const [filtroDias, setFiltroDias] = useState("");

  const carregar = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/gestaoMultas`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao carregar multas");
      const data = await res.json();
      setCards(data.cards ?? null);
      setTabela(data.tabela ?? []);
    } catch { toast.error("Erro ao carregar dados de multas"); }
    finally { setLoading(false); }
  };

  useEffect(() => { carregar(); }, []);

  const tabelaFiltrada = filtroDias
    ? tabela.filter(r => r.dias_atraso >= Number(filtroDias))
    : tabela;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
                 titulo="Gestão de Multas"
                 usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
               />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Acções + Filtros */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
            <div className="flex flex-wrap gap-3">
              {["Ano", "Semestre", "Mês"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{f}</label>
                  <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-500 outline-none focus:border-[#184d8a] cursor-pointer min-w-[100px]">
                    <option>Sem filtro</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:border-[#184d8a] hover:text-[#184d8a] transition-all">
              Gerar PDF <Download size={16} />
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Multas Pendentes</p>
                <span className="p-2 bg-red-50 text-red-500 rounded-xl"><DollarSign size={18} /></span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">{loading ? "—" : (cards?.multas_pendentes ?? "0")}</h3>
              <div className="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold">
                <TrendingUp size={12} /> {cards?.percentual_pendentes ?? "0"}% em relação ao mês anterior
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Multas Pagas (Mês)</p>
              <h3 className="text-3xl font-black text-gray-800">{loading ? "—" : (cards?.multas_pagas ?? "0")}</h3>
              <div className="mt-2 flex items-center gap-1 text-green-500 text-xs font-bold">
                <CheckCircle size={12} /> {cards?.transacoes_liquidadas ?? "0"} transações liquidadas
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Com Multas</p>
              <h3 className="text-3xl font-black text-gray-800">{loading ? "—" : `${cards?.percentual_multas ?? "0"}%`}</h3>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
                <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${cards?.percentual_multas ?? 0}%` }} />
              </div>
            </div>
          </div>

          {/* Gráficos - responsivos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Multas Pendentes e Pagas</h3>
              <div className="min-h-[250px] flex items-center justify-center">
                <ChartGestaoMulta />
              </div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Quantidade de Multas Pagas</h3>
              <div className="min-h-[250px] flex items-center justify-center">
                <ChartGestaoMulta2 />
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50">
              <select
                value={filtroDias}
                onChange={e => setFiltroDias(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-500 outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="">Todos os dias</option>
                <option value="5">5+ dias</option>
                <option value="10">10+ dias</option>
                <option value="15">15+ dias</option>
                <option value="20">20+ dias</option>
              </select>
              <button
                onClick={() => setShowAplicar(true)}
                className="flex items-center gap-2 bg-[#184d8a] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 active:scale-95 text-sm"
              >
                <Plus size={16} /> Aplicar Multa
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#184d8a] text-white text-[13px] font-semibold">
                    <th className="px-6 py-3.5">Estudante</th>
                    <th className="px-6 py-3.5">Motivo</th>
                    <th className="px-6 py-3.5">Valor Original</th>
                    <th className="px-6 py-3.5">Multa</th>
                    <th className="px-6 py-3.5">Dias em Atraso</th>
                    <th className="px-6 py-3.5">Estado</th>
                    <th className="px-6 py-3.5">Ação</th>
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
                    <tr><td colSpan={7} className="py-14 text-center text-sm text-gray-400">Nenhuma multa registada</td></tr>
                  ) : tabelaFiltrada.map((row, i) => (
                    <tr key={i} className="hover:bg-[#184d8a]/3 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-gray-700">{row.nome}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-[180px]">
                        <span className="line-clamp-1">{row.motivo}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-semibold">
                        {Number(row.valor_original).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-500 font-bold">
                        {Number(row.multa).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-bold ${row.dias_atraso > 15 ? "text-red-500" : row.dias_atraso > 7 ? "text-orange-500" : "text-gray-500"}`}>
                          {row.dias_atraso} dias
                        </span>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setSelectedRow(row)}
                            className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all"
                            title="Visualizar"
                          >
                            <EyeIcon size={15} />
                          </button>
                          <button className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Remover">
                            <Trash2 size={15} />
                          </button>
                        </div>
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
                      <p className="font-bold text-gray-700 text-sm">{row.nome}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{row.motivo}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Original: <span className="font-semibold text-gray-700">
                        {Number(row.valor_original).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </span></p>
                      <p className="text-xs text-red-500 font-bold">
                        Multa: {Number(row.multa).toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
                      </p>
                      <p className="text-xs text-orange-500">{row.dias_atraso} dias em atraso</p>
                    </div>
                    <button onClick={() => setSelectedRow(row)} className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all">
                      <EyeIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showAplicar && <ModalAplicarMulta onClose={() => setShowAplicar(false)} onSave={carregar} />}
      {selectedRow && <ModalDetalhes row={selectedRow} onClose={() => setSelectedRow(null)} />}
    </div>
  );
}