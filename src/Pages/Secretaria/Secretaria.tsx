import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";

import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MonthlyBarChartSimulation: React.FC = () => {
  const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  const values = [40, 65, 80, 5, 95, 20, 40, 60, 50, 5, 45, 35];

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl mt-6 cursor-default overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="flex items-end h-48 sm:h-64 border-l border-b border-gray-300 relative">
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <div
              key={y}
              className="absolute left-0 w-full text-xs sm:text-sm text-gray-500"
              style={{ bottom: `${y}%`, transform: "translateY(50%)" }}
            >
              {y}
              {y > 0 && (
                <div className="absolute left-0 bottom-0 w-full border-t border-gray-200 -z-10" />
              )}
            </div>
          ))}
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center h-full justify-end relative z-10"
              style={{ width: `${100 / months.length}%` }}
            >
              <div
                className="w-6 sm:w-10 bg-[#184d8a] hover:bg-blue-500 transition-all duration-300 rounded-t-md"
                style={{ height: `${value}%` }}
                title={`${months[index]}: ${value}% Pagos`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span className="text-gray-500 text-xs w-2">MM</span>
          {months.map((month, index) => (
            <div
              key={index}
              className="text-xs text-gray-600 font-medium text-center"
              style={{ width: `${100 / months.length}%` }}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardKpi = ({
  title,
  value,
  subtext,
  trend,
}: {
  title: string;
  value: string;
  subtext: string;
  trend?: "up" | "down";
}) => (
  <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border">
    <p className="text-gray-400 text-xs sm:text-sm mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-lg sm:text-xl font-bold text-gray-800">
        {value}
      </span>
      {trend === "up" && <TrendingUp className="text-green-500" size={18} />}
      {trend === "down" && <TrendingDown className="text-red-500" size={18} />}
    </div>
    <p className="text-xs text-gray-400 mt-1">{subtext}</p>
  </div>
);

export default function Secretaria() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return null;
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 overflow-y-auto min-w-0 top-0">
        {/* Header sticky */}
        <Header
          titulo="Painel Geral"
          usuario={<Avatar name={user.nome} src={user.foto} size="md" />}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Filtros + Botão PDF */}
          <section className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <div className="flex flex-wrap gap-3">
                {["Ano", "Semestre", "Mês"].map((filtro) => (
                  <div key={filtro}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {filtro}
                    </label>
                    <select className="bg-white border rounded-lg px-3 sm:px-6 py-2 text-sm text-gray-400 outline-none hover:border-[#184d8a] cursor-pointer">
                      <option>Sem filtro</option>
                    </select>
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#184d8a] text-white rounded-md text-sm font-semibold hover:bg-blue-500 transition-all duration-500 w-full sm:w-auto">
                Gerar PDF <Download size={16} />
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <CardKpi
                title="Total de estudantes"
                value="50"
                subtext="no último mês"
                trend="up"
              />
              <CardKpi
                title="Total de Encarregados"
                value="100"
                subtext="no último mês"
                trend="up"
              />
              <CardKpi
                title="Estudantes ativos"
                value="50"
                subtext="no último mês"
              />
              <CardKpi
                title="Estudantes Inativos"
                value="0"
                subtext="no último mês"
                trend="down"
              />
            </div>
          </section>

          {/* Serviços */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-gray-700 font-bold mb-4 text-sm sm:text-base">
              Serviços mais utilizados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {["Multicaixa Express", "Unitel Money", "PayPay"].map(
                (servico) => (
                  <div
                    key={servico}
                    className="bg-white p-4 sm:p-6 rounded-xl border text-center"
                  >
                    <p className="font-bold text-gray-700 mb-3 text-sm sm:text-base">
                      {servico}
                    </p>
                    <div className="h-2 w-4 bg-[#184d8a] rounded-full mb-2 mx-auto"></div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Serviço digital
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Alunos */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-gray-700 font-bold mb-4 text-sm sm:text-base">
              Alunos Cadastrados
            </h3>
            <div className="flex flex-col gap-1 border font-medium rounded overflow-hidden">
              {[
                { nome: "Délcio Valente de Sousa", processo: "21234" },
                { nome: "Jacira de Almeida Cassongo", processo: "20455" },
                { nome: "Andreia Lurdes do Rosário Lima", processo: "19982" },
              ].map((aluno, i) => (
                <div
                  key={i}
                  className={`p-3 sm:p-4 ${i % 2 === 0 ? "bg-[#184d8a] text-white" : "bg-white text-gray-700"}`}
                >
                  <p className="font-bold text-xs sm:text-sm">{aluno.nome}</p>
                  <p className="text-xs sm:text-sm opacity-80">
                    Classe: 7ª | Nº de processo: {aluno.processo}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/GestaoAlunos">
              <button className="mt-4 bg-[#184d8a] text-white px-6 py-2 rounded text-sm hover:px-7 transition-all duration-500 font-bold shadow-md">
                Ver mais
              </button>
            </Link>
          </section>

          {/* Faturamento */}
          <section className="bg-white p-4 sm:p-6 rounded-xl border mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 border-b pb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Faturamento mensal
                </p>
                <p className="text-[#184d8a] font-bold text-sm sm:text-base">
                  375.600,00 Kz
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500">Mês</p>
                <p className="text-blue-900 font-bold text-sm sm:text-base">
                  Outubro
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Faturamento anual
                </p>
                <p className="text-[#184d8a] font-bold text-sm sm:text-base">
                  4.507.200,00 Kz
                </p>
              </div>
            </div>
            <MonthlyBarChartSimulation />
          </section>
        </div>
      </main>
    </div>
  );
}
