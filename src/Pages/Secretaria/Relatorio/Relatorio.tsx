import Avatar from "@/components/Avatar/Avatar";
import HelpButton from "@/components/Botoes/helpbutton";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import {
  TrendingUp, TrendingDown, Users, BarChart2,
  AlertTriangle, RefreshCcw, Clock,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

/* ── Tipos ── */
interface DadosRelatorio {
  cards: {
    receita: { propinas_servicos: number; multas_liquidadas: number };
    fluxo: { novas_matriculas: number; desistencias: number; transferencias: number };
    inadimplentes: { encarregado: string; dias_atraso: number }[];
  };
  graficos: {
    receitaMensal: { mes: string; mes_num: number; receita: number }[];
    distribuicao: { categoria: string; valor: number }[];
  };
  tabela: {
    estudante: string;
    classe: number | null;
    valor_original: number;
    multa: number | null;
    dias_atraso: number | null;
    status: string;
  }[];
}

/* ── Helpers ── */
const fmt = (val: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(val);

const statusCfg: Record<string, string> = {
  Pago:       "bg-green-100 text-green-700",
  Pendente:   "bg-amber-100 text-amber-700",
  "Em Atraso":"bg-red-100 text-red-700",
  Cancelado:  "bg-gray-100 text-gray-500",
};

/* ── Gráfico de barras ── */
const BarChart = ({ dados }: { dados: { mes: string; receita: number }[] }) => {
  if (!dados.length) return <p className="text-xs text-gray-400 text-center py-8">Sem dados</p>;
  const max = Math.max(...dados.map((d) => Number(d.receita)), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {dados.map((d) => (
        <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-primary rounded-t-md transition-all duration-700"
            style={{ height: `${(Number(d.receita) / max) * 140}px`, minHeight: 4 }}
          />
          <span className="text-[10px] text-gray-400">{d.mes}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Gráfico de donut ── */
const DonutChart = ({ dados }: { dados: { categoria: string; valor: number }[] }) => {
  const total = dados.reduce((s, d) => s + Number(d.valor), 0) || 1;
  const cores = ["#184d8a", "#f97316", "#ef4444", "#22c55e"];
  let offset = 0;
  const segmentos = dados.map((d, i) => {
    const pct = (Number(d.valor) / total) * 100;
    const seg = { ...d, pct, offset, cor: cores[i % cores.length] };
    offset += pct;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
          {segmentos.map((s, i) => (
            <circle
              key={i}
              cx="18" cy="18" r="15.9"
              fill="transparent"
              stroke={s.cor}
              strokeWidth="3"
              strokeDasharray={`${s.pct} ${100 - s.pct}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[10px] font-bold text-gray-400 text-center leading-tight">
            Total<br />{fmt(total)}
          </p>
        </div>
      </div>
      <div className="space-y-3 flex-1">
        {segmentos.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: s.cor }} />
              <span className="text-xs font-semibold text-gray-600">{s.categoria}</span>
            </div>
            <span className="text-xs font-bold text-gray-500">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function Relatorio() {
  const [dados, setDados] = useState<DadosRelatorio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetchComAuth("http://localhost:5000/api/centro-relatorio");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setDados(json);
    } catch {
      toast.error("Erro ao carregar relatórios");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const receitaTotal = dados
    ? Number(dados.cards.receita.propinas_servicos) + Number(dados.cards.receita.multas_liquidadas)
    : 0;

  const inadimplentes = dados?.cards.inadimplentes ?? [];
  const fluxo = dados?.cards.fluxo;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Centro de Relatórios"
          usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* Botão refresh */}
          <div className="flex justify-end mb-4">
            <button
              onClick={carregar}
              disabled={carregando}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCcw size={14} className={carregando ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>

          {carregando ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !dados ? null : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp size={14} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Receita Total</p>
                  <p className="text-lg font-bold text-green-600 leading-tight">{fmt(receitaTotal)}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3">
                    <Users size={14} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Novas Matrículas</p>
                  <p className="text-xl font-bold text-blue-600">{fluxo?.novas_matriculas ?? 0}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-blue-50 text-[#184d8a] rounded-xl flex items-center justify-center mb-3">
                    <BarChart2 size={14} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Propinas Liquidadas</p>
                  <p className="text-lg font-bold text-[#184d8a] leading-tight">{fmt(Number(dados.cards.receita.propinas_servicos))}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
                  <div className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-3">
                    <TrendingDown size={14} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Em Inadimplência</p>
                  <p className="text-xl font-bold text-red-500">{inadimplentes.length}</p>
                </div>
              </div>

              {/* Fluxo de alunos */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Novas Matrículas", val: fluxo?.novas_matriculas ?? 0, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                  { label: "Desistências", val: fluxo?.desistencias ?? 0, color: "text-red-500", bg: "bg-red-50 border-red-100" },
                  { label: "Transferências", val: fluxo?.transferencias ?? 0, color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
                ].map(({ label, val, color, bg }) => (
                  <div key={label} className={`bg-white rounded-2xl border p-4 ${bg}`}>
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{val}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Este mês</p>
                  </div>
                ))}
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700">Receita Mensal</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Evolução ao longo do ano</p>
                  </div>
                  <BarChart dados={dados.graficos.receitaMensal} />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700">Distribuição por Categoria</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Proporção de receitas</p>
                  </div>
                  <DonutChart dados={dados.graficos.distribuicao} />
                </div>
              </div>

              {/* Inadimplentes */}
              {inadimplentes.length > 0 && (
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm mb-6 overflow-hidden">
                  <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2 bg-red-50/50">
                    <AlertTriangle size={15} className="text-red-500" />
                    <h3 className="font-bold text-red-700 text-sm">Inadimplência Crítica (+60 dias)</h3>
                    <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{inadimplentes.length} casos</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {inadimplentes.map((item, i) => (
                      <div key={i} className="px-5 py-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">{item.encarregado}</p>
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                          <Clock size={12} />
                          {item.dias_atraso} dias em atraso
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabela de pagamentos recentes */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-700">Pagamentos Recentes</h3>
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">{dados.tabela.length} registos</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white text-[12px] font-semibold">
                        <th className="px-5 py-3">Estudante</th>
                        <th className="px-5 py-3">Classe</th>
                        <th className="px-5 py-3">Valor</th>
                        <th className="px-5 py-3">Multa</th>
                        <th className="px-5 py-3">Atraso</th>
                        <th className="px-5 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {dados.tabela.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors text-sm">
                          <td className="px-5 py-3 font-semibold text-gray-700">{row.estudante}</td>
                          <td className="px-5 py-3 text-gray-500">{row.classe != null ? `${row.classe}ª` : "—"}</td>
                          <td className="px-5 py-3 text-gray-700">{fmt(Number(row.valor_original))}</td>
                          <td className="px-5 py-3 text-red-500">{row.multa ? fmt(Number(row.multa)) : "—"}</td>
                          <td className="px-5 py-3 text-gray-500">{row.dias_atraso ? `${row.dias_atraso}d` : "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusCfg[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
        <HelpButton/>
      </main>
    </div>
  );
}