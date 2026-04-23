import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import {
  BarChart3,
  Building2,
  CheckCircle,
  CreditCard,
  Download,
  Loader2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

interface RelatorioData {
  cards: {
    totalInstituicoes: number;
    totalUtilizadores: number;
    totalReceita: number;
    instituicoesAtivas: string;
  };
  pizza: {
    instituicoes: { ativas: number; inativas: number };
    utilizadores: { ativos: number; inativos: number };
  };
  graficoBarra: { mes: string; total: number }[];
  tabela: { nome: string; total_pago: number; percentual: string | number }[];
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
      >
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

export default function GestaoDeRelatorios() {
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  useEffect(() => {
    const fetchRelatorio = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const res = await fetchComAuth(`${API_BASE}/gestaoDeRelatorios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar relatório");
        const json: RelatorioData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorio();
  }, []);

  if (!user) return null;

  const statusInst = data
    ? [
        {
          name: "Ativas",
          value: data.pizza.instituicoes.ativas,
          color: "#22c55e",
        },
        {
          name: "Inativas",
          value: data.pizza.instituicoes.inativas,
          color: "#ef4444",
        },
      ]
    : [];

  const statusUser = data
    ? [
        {
          name: "Ativos",
          value: data.pizza.utilizadores.ativos,
          color: "#184d8a",
        },
        {
          name: "Inativos",
          value: data.pizza.utilizadores.inativos,
          color: "#f59e0b",
        },
      ]
    : [];

  const totalTabela = data?.tabela.reduce((s, i) => s + i.total_pago, 0) ?? 0;

  return (
    <div className="flex bg-gray-50 font-sans h-screen overflow-hidden">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header
          titulo="Gestão de Relatórios"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Botão exportar */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors shadow-md">
              <Download className="w-4 h-4" /> Exportar Relatório
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#184d8a]" />
            </div>
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  icon={Building2}
                  label="Total de Instituições"
                  value={data?.cards.totalInstituicoes ?? 0}
                  color="text-blue-600"
                  bg="bg-blue-50"
                />
                <KpiCard
                  icon={Users}
                  label="Total de Utilizadores"
                  value={data?.cards.totalUtilizadores ?? 0}
                  color="text-indigo-600"
                  bg="bg-indigo-50"
                />
                <KpiCard
                  icon={CreditCard}
                  label="Total Arrecadado (KZ)"
                  value={(data?.cards.totalReceita ?? 0).toLocaleString(
                    "pt-AO",
                    { maximumFractionDigits: 0 },
                  )}
                  color="text-green-600"
                  bg="bg-green-50"
                />
                <KpiCard
                  icon={TrendingUp}
                  label="Inst. Activas"
                  value={data?.cards.instituicoesAtivas ?? "0/0"}
                  color="text-emerald-600"
                  bg="bg-emerald-50"
                />
              </div>

              {/* Gráficos Pizza */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#184d8a]" /> Estado das
                    Instituições
                  </h2>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={statusInst}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {statusInst.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} instituições`]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          Ativas:{" "}
                          <strong>
                            {data?.pizza.instituicoes.ativas ?? 0}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-600">
                          Inativas:{" "}
                          <strong>
                            {data?.pizza.instituicoes.inativas ?? 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#184d8a]" /> Estado dos
                    Utilizadores
                  </h2>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={statusUser}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {statusUser.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} utilizadores`]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">
                          Ativos:{" "}
                          <strong>
                            {data?.pizza.utilizadores.ativos ?? 0}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-gray-600">
                          Inativos:{" "}
                          <strong>
                            {data?.pizza.utilizadores.inativos ?? 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico barras mensais */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 text-sm mb-5 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#184d8a]" /> Pagamentos
                  Mensais (KZ)
                </h2>
                {data?.graficoBarra && data.graficoBarra.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.graficoBarra} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(v) => [
                          `KZ ${Number(v).toLocaleString("pt-AO")}`,
                        ]}
                      />
                      <Bar
                        dataKey="total"
                        fill="#184d8a"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    Sem dados de pagamentos ainda
                  </div>
                )}
              </div>

              {/* Tabela por instituição */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-sm">
                    Pagamentos por Instituição
                  </h2>
                  <span className="text-xs bg-primary/10 text-[#184d8a] font-semibold px-3 py-1 rounded-full">
                    {data?.tabela.length ?? 0} instituições
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        <th className="px-6 py-3 text-left">Instituição</th>
                        <th className="px-6 py-3 text-right">
                          Total Pago (KZ)
                        </th>
                        <th className="px-6 py-3 text-right">% do Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data?.tabela.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-10 text-center text-sm text-gray-400"
                          >
                            Sem dados disponíveis
                          </td>
                        </tr>
                      ) : (
                        data?.tabela.map((inst) => {
                          const pct =
                            totalTabela > 0
                              ? ((inst.total_pago / totalTabela) * 100).toFixed(
                                  1,
                                )
                              : "0.0";
                          return (
                            <tr
                              key={inst.nome}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <Building2 className="w-4 h-4 text-[#184d8a]" />
                                  </div>
                                  <span className="font-semibold text-gray-900 text-xs">
                                    {inst.nome}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right font-bold text-gray-900 text-xs">
                                {inst.total_pago.toLocaleString("pt-AO")}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#184d8a] bg-blue-50 px-2 py-0.5 rounded-full">
                                  {pct}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
