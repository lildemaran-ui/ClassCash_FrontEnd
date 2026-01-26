import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  AlertOctagon,
  FileText,
  Settings,
  MessageSquare,
  Bell,
  Search,
  Download,
  Menu,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors ${
      active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
    }`}
  >
    <Icon size={20} className="text-white" />
    <span className="text-white font-medium text-sm">{label}</span>
  </div>
);

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
  <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border ">
    <p className="text-gray-400 text-base mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {trend === "up" && (
        <span className="text-green-500 text-base">
          <ArrowUp></ArrowUp>
        </span>
      )}
      {trend === "down" && (
        <span className="text-red-500 text-xs">
          <ArrowDown></ArrowDown>
        </span>
      )}
    </div>
    <p className="text-[14px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

// Componente para simular o gráfico de barras mensais (Gráfico dos meses)
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
  const values = [40, 65, 80, 5, 95, 20, 40, 60, 50, 5, 45, 35]; // Altura da barra (0 a 100)

  return (
    <div className="bg-white p-8 rounded-xl  mt-6 ">
      <div className="flex items-end h-64 border-l border-b border-gray-300 relative">
        {/* Linhas de grade e valores Y simulados */}
        {[0, 20, 40, 60, 80, 100].map((y) => (
          <div
            key={y}
            className="absolute left-0 w-full text-xs text-gray-500 "
            style={{ bottom: `${y}%`, transform: "translateY(50%)" }}
          >
            {y}%
            {y > 0 && (
              <div className="absolute left-0 bottom-0 w-full border-t border-gray-200 -z-10" />
            )}
          </div>
        ))}

        {/* Barras de dados */}
        {values.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center h-full justify-end relative z-10"
            style={{ width: `${100 / months.length}%` }}
          >
            <div
              className="w-12 bg-[#268CFF] hover:bg-blue-600 transition-all duration-300 rounded-t-md"
              style={{ height: `${value}%` }}
              title={`${months[index]}: ${value}% Pagos`}
            />
          </div>
        ))}
      </div>
      {/* Rótulos dos meses X */}
      <div className="flex justify-between -mt-px border-t border-gray-300 pt-2">
        <div className="flex items-center">
          {" "}
          <span className="text-gray-500 text-xs w-2 ">MM</span>
        </div>
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
  );
};

export default function Secretaria() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden overflow-y-auto">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img src={Logo5} alt="Logo" className="w-16 h-16 " />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={28} className="text-white" onClick={CloseMenu} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            <Link to="/Secretaria">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={true}
              />
            </Link>

            <Link to="/GestaoAlunos">
              <SidebarItem
                icon={Users}
                label="Gestão de Alunos"
                active={false}
              />
            </Link>

            <Link to="/GestaodeEncarregados">
              <SidebarItem
                icon={Users}
                label="Gestão de Encarregados"
                active={false}
              />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={CreditCard}
                label="Gestão de Propinas"
                active={false}
              />
            </Link>
            <Link to="/GestaoPagamentos">
              <SidebarItem
                icon={Receipt}
                label="Gestão de Pagamentos"
                active={false}
              />
            </Link>

            <Link to="/GestaodeServiços">
              <SidebarItem
                icon={Settings}
                label="Gestão de Serviços"
                active={false}
              />
            </Link>
            <Link to="/GestaodeReclamacoes">
              <SidebarItem
                icon={MessageSquare}
                label="Gestão de Reclamações"
                active={false}
              />
            </Link>
            <Link to="/ModulodeMulta">
              <SidebarItem
                icon={AlertOctagon}
                label="Gestão de Multas"
                active={false}
              />
            </Link>
            <Link to="/Relatorio">
              <SidebarItem
                icon={FileText}
                label="Centro de Relatório"
                active={false}
              />
            </Link>
            <Link to="/Configuracao">
              <SidebarItem
                icon={Settings}
                label="Configurações"
                active={false}
              />
            </Link>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 ">
        <div className="flex gap-6">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={28}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h2 className="text-lg font-bold text-[#268cff]">Dashboard</h2>
        </div>
        {/* Header */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex">
            <div className="relative w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por um código"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-MeuAzul/20 focus:border-none"
              />
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="relative">
                <Bell className="text-[#268cff] cursor-pointer" />
                <div className="absolute bg-red-500 w-3 h-3 flex -top-1 -right-1 rounded-full border border-white"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border overflow-hidden">
                <img src="https://via.placeholder.com/40" alt="User" />
              </div>
            </div>
          </div>
        </header>

        {/* Filters & KPI Cards */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-6 ">
            <div className="flex gap-4">
              {["Ano", "Semestre", "Mês"].map((filtro) => (
                <div key={filtro}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {filtro}
                  </label>
                  <select className="bg-white border  rounded-md px-6 py-2 text-sm text-gray-400 outline-none">
                    <option>Sem filtro</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#268cff] text-white rounded-md text-base font-semibold hover:bg-blue-600 hover:text-white transition-all duration-500">
              Gerar PDF <Download />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
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

        {/* Serviços Mais Utilizados */}
        <section className="mb-8">
          <h3 className="text-gray-700 font-bold mb-4 text-base">
            Serviços mais utilizados
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {["Multicaixa Express", "Unitel Money", "PayPay"].map((servico) => (
              <div
                key={servico}
                className="bg-white p-6 rounded-xl border  text-center"
              >
                <p className="font-bold text-gray-700 mb-3">{servico}</p>
                <div className="h-2 w-4 bg-[#268cff] rounded-full mb-2"></div>
                <p className="text-[10px] text-gray-400">Serviço digital</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alunos Cadastrados */}
        <section className="mb-8">
          <h3 className="text-gray-700 font-bold mb-4 text-base">
            Alunos Cadastrados
          </h3>
          <div className="flex flex-col gap-1 border font-medium">
            {[
              { nome: "Délcio Valente de Sousa", processo: "21234" },
              { nome: "Jacira de Almeida Cassongo", processo: "20455" },
              { nome: "Andreia Lurdes do Rosário Lima", processo: "19982" },
            ].map((aluno, i) => (
              <div
                key={i}
                className={`p-4 ${
                  i % 2 === 0
                    ? "bg-[#268bffd3] text-white"
                    : "bg-white text-gray-700"
                } rounded-sm`}
              >
                <p className="font-bold text-sm">{aluno.nome}</p>
                <p className="text-[10px] opacity-80">
                  Classe: 7ª | Nº de processo: {aluno.processo}
                </p>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-[#268cff] text-white px-6 py-2 rounded text-sm hover:px-7 hover:ml-2 transition-all duration-500 font-bold shadow-md">
            Ver mais
          </button>
        </section>

        {/* Faturamento Chart Placeholder */}
        <section className="bg-white p-6 rounded-xl  border ">
          <div className="flex justify-between mb-8 border-b pb-4">
            <div>
              <p className="text-xs text-gray-500">Faturamento mensal</p>
              <p className="text-[#268cff] font-bold">375.600,00 Kz</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Mês</p>
              <p className="text-blue-900 font-bold">Outubro</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Faturamento anual</p>
              <p className="text-[#268cff] font-bold">4.507.200,00 Kz</p>
            </div>
          </div>

          {/* Gráfico Representativo com Divs */}
          <div>
            <MonthlyBarChartSimulation />
          </div>
        </section>
      </main>
    </div>
  );
}
