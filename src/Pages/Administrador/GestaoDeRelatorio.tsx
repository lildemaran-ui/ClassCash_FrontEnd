// src/Pages/Administrador/Relatorios.tsx

import MenuAdmin from "@/components/Menu/MenuAdmin";
import {
  BarChart3,
  Bell, Building2,
  CheckCircle,
  CircleUser,
  CreditCard,
  Download,
  Search, TrendingUp, Users,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts";

// ─── Dados mock — substitui por chamadas reais à API ─────────────────────────
const STATS = {
  totalInstituicoes:   12,
  instituicoesAtivas:  9,
  instituicoesInativas:3,
  totalUsuarios:       348,
  usuariosAtivos:      310,
  usuariosInativos:    38,
  totalArrecadado:     "4,850,000",
  mediaPortInstituicao:"404,167",
};

const PAGAMENTOS_POR_MES = [
  { mes: "Jan", valor: 320000 },
  { mes: "Fev", valor: 410000 },
  { mes: "Mar", valor: 390000 },
  { mes: "Abr", valor: 480000 },
  { mes: "Mai", valor: 520000 },
  { mes: "Jun", valor: 460000 },
  { mes: "Jul", valor: 540000 },
  { mes: "Ago", valor: 490000 },
  { mes: "Set", valor: 610000 },
  { mes: "Out", valor: 580000 },
  { mes: "Nov", valor: 430000 },
  { mes: "Dez", valor: 620000 },
];

const PAGAMENTOS_POR_INSTITUICAO = [
  { nome: "Kibangas",       valor: 850000 },
  { nome: "Caracol",        valor: 620000 },
  { nome: "INSUTEC",        valor: 940000 },
  { nome: "MAPTESS",        valor: 480000 },
  { nome: "Kiesse",         valor: 310000 },
  { nome: "Elizângela F.",  valor: 290000 },
];

const STATUS_INST = [
  { name: "Ativas",   value: 9,  color: "#22c55e" },
  { name: "Inativas", value: 3,  color: "#ef4444" },
];

const STATUS_USER = [
  { name: "Ativos",   value: 310, color: "#268cff" },
  { name: "Inativos", value: 38,  color: "#f59e0b" },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, sub, color, bg,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function GestaoDeRelatorios() {
  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#268cff]">Gestão de Relatórios</h1>
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

        <main className="p-6 md:p-8 space-y-6">

          {/* Botão exportar */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-[#268cff] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
              <Download className="w-4 h-4" /> Exportar Relatório
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard icon={Building2}   label="Total de Instituições"  value={STATS.totalInstituicoes}   color="text-blue-600"   bg="bg-blue-50" />
            <KpiCard icon={Users}        label="Total de Utilizadores"  value={STATS.totalUsuarios}       color="text-indigo-600" bg="bg-indigo-50" />
            <KpiCard icon={CreditCard}   label="Total Arrecadado (KZ)"  value={STATS.totalArrecadado}     color="text-green-600"  bg="bg-green-50" sub={`Média: KZ ${STATS.mediaPortInstituicao}/inst.`} />
            <KpiCard icon={TrendingUp}   label="Inst. Activas"          value={`${STATS.instituicoesAtivas} / ${STATS.totalInstituicoes}`} color="text-emerald-600" bg="bg-emerald-50" />
          </div>

          {/* Status Instituições + Utilizadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instituições */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#268cff]" /> Estado das Instituições
              </h2>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={STATUS_INST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                      {STATUS_INST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} instituições`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Ativas: <strong>{STATS.instituicoesAtivas}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Inativas: <strong>{STATS.instituicoesInativas}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Utilizadores */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#268cff]" /> Estado dos Utilizadores
              </h2>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={STATUS_USER} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                      {STATUS_USER.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} utilizadores`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Ativos: <strong>{STATS.usuariosAtivos}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-gray-600">Inativos: <strong>{STATS.usuariosInativos}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico pagamentos mensais */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-800 text-sm mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#268cff]" /> Pagamentos Mensais (KZ)
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={PAGAMENTOS_POR_MES} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`KZ ${Number(v).toLocaleString("pt-AO")}`]} />
                <Bar dataKey="valor" fill="#268cff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela pagamentos por instituição */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Pagamentos por Instituição</h2>
              <span className="text-xs bg-[#268cff]/10 text-[#268cff] font-semibold px-3 py-1 rounded-full">
                {PAGAMENTOS_POR_INSTITUICAO.length} instituições
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Instituição</th>
                    <th className="px-6 py-3 text-right">Total Pago (KZ)</th>
                    <th className="px-6 py-3 text-right">% do Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PAGAMENTOS_POR_INSTITUICAO.map((inst) => {
                    const total = PAGAMENTOS_POR_INSTITUICAO.reduce((s, i) => s + i.valor, 0);
                    const pct = ((inst.valor / total) * 100).toFixed(1);
                    return (
                      <tr key={inst.nome} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4 text-[#268cff]" />
                            </div>
                            <span className="font-semibold text-gray-900 text-xs">{inst.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-gray-900 text-xs">
                          {inst.valor.toLocaleString("pt-AO")}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#268cff] bg-blue-50 px-2 py-0.5 rounded-full">
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
