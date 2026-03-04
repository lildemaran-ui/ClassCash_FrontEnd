import {
  Download,
  RefreshCcw,
  AlertTriangle,
  Users,
  Menu,
  FileText,
  AlertOctagon,
  Settings,
  MessageSquare,
  Receipt,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
export default function Relatorio() {
  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: LucideIcon;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500 ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-16 h-16 "
              />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={22} className="text-white" onClick={CloseMenu} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1 text-white">
            <Link to="/Secretaria">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={false}
              />
            </Link>

            <Link to="/GestaoAlunos">
              <SidebarItem
                icon={Users}
                label="Gestão de Estudantes"
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
                label="Gestão de Multa"
                active={false}
              />
            </Link>
            <Link to="/Relatorio">
              <SidebarItem
                icon={FileText}
                label="Centro de Relatório"
                active={true}
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
      <main className="flex-1 p-8 bg-gray-50 custom_scroll">
        {/* Header com Seleção de Período */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-xl font-bold text-[#268cff]">
              Centro de Relatórios
            </h1>
            <p className="text-gray-400 text-sm">
              Análise detalhada de performance e finanças.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col px-3">
              <label className="text-[10px] font-black text-gray-400  ">
                Período
              </label>
              <select className="text-sm font-bold text-gray-700 outline-none cursor-pointer">
                <option>Ano Lectivo 2024</option>
                <option>Últimos 30 dias</option>
                <option>1º Trimestre</option>
              </select>
            </div>
            <button className="bg-[#268cff] text-white p-2.5 rounded-lg hover:bg-[#1a76db] transition-all">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {/* Grid de Relatórios Rápidos (Download) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-50 text-[#268cff] rounded-xl group-hover:bg-[#268cff] group-hover:text-white transition-all">
                <FileText size={22} />
              </div>
              <Download
                size={18}
                className="text-gray-300 group-hover:text-gray-600"
              />
            </div>
            <h4 className="font-bold text-gray-700">Relatório de Receita</h4>
            <p className="text-xs text-gray-400 mt-1">
              Propinas, multas e serviços extras liquidados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Users size={22} />
              </div>
              <Download
                size={18}
                className="text-gray-300 group-hover:text-gray-600"
              />
            </div>
            <h4 className="font-bold text-gray-700">Fluxo de Alunos</h4>
            <p className="text-xs text-gray-400 mt-1">
              Novas matrículas vs. desistências e transferências.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                <AlertTriangle size={22} />
              </div>
              <Download
                size={18}
                className="text-gray-300 group-hover:text-gray-600"
              />
            </div>
            <h4 className="font-bold text-gray-700">Inadimplência Crítica</h4>
            <p className="text-xs text-gray-400 mt-1">
              Lista de encarregados com mais de 2 meses de atraso.
            </p>
          </div>
        </div>

        {/* Gráficos Analíticos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Box de Gráfico 1 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-700 text-lg">
                Crescimento de Receita
              </h3>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">
                +12.5%
              </span>
            </div>
            {/* Aqui entraria sua lib de gráficos como Recharts ou Chart.js */}
            <div className="h-64 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
              {/* Representação visual do gráfico de linha */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-[#268cff]/5"></div>
              <p className="text-gray-400 text-sm font-medium">
                Gráfico de Linha: Receita Mensal
              </p>
            </div>
          </div>

          {/* Box de Gráfico 2 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-700 text-lg">
                Distribuição por Categoria
              </h3>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48 rounded-full border-[15px] border-blue-500 border-l-orange-400 border-b-red-400 flex items-center justify-center">
                <span className="text-xs font-black text-gray-400  ">
                  Propinas
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>{" "}
                  Propinas (75%)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>{" "}
                  Multas (15%)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div> Outros
                  (10%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
