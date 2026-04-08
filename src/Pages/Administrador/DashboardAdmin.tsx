import { ChartAdmin } from "@/components/Charts/ChartAdmin";
import { Bell, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

export default function DashboardAdmin() {
  // Componente para simular o gráfico de barras horizontais (Análise Gráfico)
  const VerticalBarChartSimulation: React.FC = () => {
    // Dados simulados (rótulo, valor percentual, cor)
    const data = [
      { label: "Total de Instituições", value: 75, color: "bg-[#184d8a]" },
      { label: "Total de Estudantes", value: 50, color: "bg-[#184d8a]" },
      { label: "Total de Encarregados", value: 30, color: "bg-[#184d8a]" },
      {
        label: "Total de Serviços",
        value: 90,
        color: "bg-[#184d8a]",
      },
      { label: "Total de Receita", value: 60, color: "bg-[#184d8a]" },
    ];

    return (
      <div className="bg-white p-6 rounded-xl border mt-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 p-2">
          Análise Gráfico
        </h1>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center"
            >
              <div className="w-full sm:w-48 text-sm text-gray-600 truncate mb-2 sm:mb-0">
                {item.label}
              </div>
              <div className="flex-1 ml-0 sm:ml-4 flex items-center">
                <div
                  className={`${item.color} h-6 rounded-r-md transition-all duration-500 flex-1`}
                  style={{ width: `${item.value}%` }}
                />
                <div className="ml-4 text-sm font-medium text-gray-700 w-10 text-right">
                  {item.value}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- DADOS MOCK (Simulação de Dados para o Dashboard) ---

  interface Metric {
    title: string;
    value: string;
    unit?: string;
    trend: number;
    trendText?: string;
    isKz?: boolean;
  }
  const mainMetrics: Metric[] = [
    {
      title: "Total de instituições",
      value: "6",
      unit: "No último mês",
      trend: 50,
      trendText: "+50",
      isKz: false,
    },
    {
      title: "Total de estudantes",
      value: "1,000",
      unit: "No último mês",
      trend: 95,
      trendText: "+30",
      isKz: false,
    },
    {
      title: "Total de Encarregados",
      value: "1,500",
      unit: "No último mês",
      trend: 10,
      trendText: "+10",
      isKz: false,
    },
    {
      title: "Total de Serviços",
      value: "2",
      unit: "No último mês",
      trend: 6,
      trendText: "+6",
      isKz: false,
    },
    {
      title: "Total de Receita",
      value: "200,000",
      unit: "KZ",
      trend: 5,
      trendText: "+10,000",
      isKz: true,
    },
  ];
  // Componente para o card de métrica principal
  const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
    const isPositive = metric.trend >= 0;

    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl border flex flex-col justify-between h-32 sm:h-36">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500">
          {metric.title}
        </h3>
        <div className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
          {metric.isKz && <span className="text-lg sm:text-xl">KZ </span>}
          {metric.value}
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 border-t border-gray-100">
          <div className="text-xs sm:text-base text-gray-500">
            {metric.unit}
          </div>
          <div
            className={`flex items-center text-xs sm:text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {metric.trendText}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <main className="p-6 md:p-8 space-y-8">
        {/* Seção de Filtros e Alerta */}
        <div className="bg-white p-4 sm:p-6 border rounded-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b pb-4">
            <div className="flex items-center text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-0">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Alerta das Instituições
            </div>
            <button className="bg-[#184d8a] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#184d8a]/80 transition-colors duration-700 shadow-md">
              Ver Alertas
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Ano", "Semestre", "Mês", "Instituição"].map((filter) => (
            <div key={filter} className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                {filter}
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Sem Filtro"
                >
                  <option>Sem Filtro</option>
                  <option>Filtro A</option>
                  <option>Filtro B</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
        {/* Cartões de Métricas Principais (Linha 1) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {mainMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* Seção de Gráficos e Cartões de Tendência */}
        {/* Container de Gráficos em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Coluna 1: Análise Gráfico */}
          <div className="w-full">
            <VerticalBarChartSimulation />
          </div>

          {/* Coluna 2: Gráfico de Área (Limitado pela Grid) */}
          <div className="w-full">
            <ChartAdmin />
          </div>
        </div>
      </main>
    </div>
  );
}
