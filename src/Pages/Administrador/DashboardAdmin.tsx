// src/Pages/Administrador/DashboardAdmin.tsx
import { ChartAdmin } from "@/components/Charts/ChartAdmin";
import { Bell, ChevronDown, ArrowUp, ArrowDown, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getToken } from "@/types/global/sessao";
import { fetchComAuth } from "@/types/global/fetchComAuth";

const API_BASE = "http://localhost:5000/api";

interface PainelCards {
  estudantes: number;
  encarregados: number;
  instituicoes: number;
  servicos: number;
  receitaUltimoMes: number;
}

interface PainelData {
  cards: PainelCards;
  percentuais: {
    estudantes: string;
    encarregados: string;
    instituicoes: string;
  };
  graficoCadastros: { mes: string; total: number }[];
}

interface Filtros {
  ano: string;
  semestre: string;
  mes: string;
  instituicao: string;
}

export default function DashboardAdmin() {
  const [data, setData] = useState<PainelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    ano: "",
    semestre: "",
    mes: "",
    instituicao: "",
  });

  const fetchPainel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/PainelGeralAdmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar painel");
      const json: PainelData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPainel();
  }, [fetchPainel]);

  // ── Gráfico de barras horizontais com dados reais ──────────────
const VerticalBarChartSimulation = () => {
  if (!data) return null;

  const total =
    data.cards.estudantes +
    data.cards.encarregados +
    data.cards.instituicoes;

  const barData = [
    {
      label: "Total de Instituições",
      value: total > 0 ? (data.cards.instituicoes / total) * 100 : 0,
    },
    {
      label: "Total de Estudantes",
      value: total > 0 ? (data.cards.estudantes / total) * 100 : 0,
    },
    {
      label: "Total de Encarregados",
      value: total > 0 ? (data.cards.encarregados / total) * 100 : 0,
    },
    {
      label: "Total de Serviços",
      value: total > 0 ? Math.min((data.cards.servicos / total) * 100, 100) : 0,
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border mt-6">
      <h1 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Análise Gráfico
      </h1>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#184d8a]" />
        </div>
      ) : (
        <div className="space-y-4">
          {barData.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <div className="w-full sm:w-48 text-xs sm:text-sm text-gray-600 truncate">
                {item.label}
              </div>
              <div className="flex-1 sm:ml-4 flex items-center">
                <div className="flex-1 bg-gray-100 rounded-r-md h-6 overflow-hidden">
                  <div
                    className="bg-[#184d8a] h-6 rounded-r-md transition-all duration-700"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <div className="ml-3 text-xs sm:text-sm font-medium text-gray-700 w-12 text-right">
                  {item.value.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  // ── Cards de métricas ──────────────────────────────────────────
  interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    trendText: string;
    isPositive?: boolean;
    isKz?: boolean;
    isLoading?: boolean;
  }

  const MetricCard = ({
    title,
    value,
    unit,
    trendText,
    isPositive = true,
    isKz = false,
    isLoading = false,
  }: MetricCardProps) => (
    <div className="bg-white p-4 sm:p-5 rounded-xl border flex flex-col justify-between h-32 sm:h-36 min-w-0">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
        {title}
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-5 h-5 animate-spin text-[#184d8a]" />
        </div>
      ) : (
        <>
          <div className="text-lg sm:text-xl font-bold text-gray-900 mt-1 truncate">
            {isKz && <span className="text-base sm:text-lg">KZ </span>}
            {typeof value === "number" ? value.toLocaleString("pt-AO") : value}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 truncate max-w-[60%]">
              {unit}
            </div>
            <div
              className={`flex items-center text-xs font-semibold shrink-0 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {trendText}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <main className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        {/* Alerta das Instituições */}
        <div className="bg-white p-4 sm:p-6 border rounded-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-4 mb-2">
            <div className="flex items-center text-base sm:text-lg font-semibold text-gray-700">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2 shrink-0" />
              Alerta das Instituições
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPainel}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#184d8a] hover:border-[#184d8a] transition-colors"
                title="Atualizar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="bg-[#184d8a] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#184d8a]/80 transition-colors shadow-md">
                Ver Alertas
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {(["Ano", "Semestre", "Mês", "Instituição"] as const).map(
            (filter) => (
              <div key={filter} className="space-y-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  {filter}
                </label>
                <div className="relative">
                  <select
                    className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Sem Filtro"
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        [filter.toLowerCase()]: e.target.value,
                      }))
                    }
                  >
                    <option>Sem Filtro</option>
                    <option>Filtro A</option>
                    <option>Filtro B</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Cartões de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <MetricCard
            title="Total de Instituições"
            value={data?.cards.instituicoes ?? 0}
            unit="No último mês"
            trendText={`+${data?.cards.instituicoes ?? 0}`}
            isLoading={loading}
          />
          <MetricCard
            title="Total de Estudantes"
            value={data?.cards.estudantes ?? 0}
            unit="No último mês"
            trendText={`+${data?.cards.estudantes ?? 0}`}
            isLoading={loading}
          />
          <MetricCard
            title="Total de Encarregados"
            value={data?.cards.encarregados ?? 0}
            unit="No último mês"
            trendText={`+${data?.cards.encarregados ?? 0}`}
            isLoading={loading}
          />
          <MetricCard
            title="Total de Serviços"
            value={data?.cards.servicos ?? 0}
            unit="No último mês"
            trendText={`+${data?.cards.servicos ?? 0}`}
            isLoading={loading}
          />
          <MetricCard
            title="Total de Receita"
            value={
              data
                ? data.cards.receitaUltimoMes.toLocaleString("pt-AO", {
                    maximumFractionDigits: 0,
                  })
                : "0"
            }
            unit="KZ"
            trendText={`+${data?.cards.receitaUltimoMes.toLocaleString("pt-AO", { maximumFractionDigits: 0 }) ?? "0"}`}
            isKz={true}
            isLoading={loading}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ">
          <div className="w-full h-full ">
            <VerticalBarChartSimulation />
          </div>
          <div className="w-full h-full ">
            <ChartAdmin data={data?.graficoCadastros} />
          </div>
        </div>
      </main>
    </div>
  );
}