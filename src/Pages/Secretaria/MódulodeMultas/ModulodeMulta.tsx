import {
  EyeIcon,
  Percent,
  Plus,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
  Menu,
  FileText,
  AlertOctagon,
  Settings,
  MessageSquare,
  Receipt,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
export default function ModulodeMulta() {
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
                active={true}
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
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-red-600">
              Gestão de Multas
            </h2>
            <p className="text-gray-400 text-sm">
              Controle de penalidades e juros por atraso.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              Configurar Taxas %
            </button>
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 shadow-md transition-all flex items-center gap-2">
              <Plus size={20} /> Aplicar Multa Manual
            </button>
          </div>
        </div>

        {/* Cards Financeiros de Multas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Total a Receber
              </p>
              <span className="p-2 bg-red-50 text-red-600 rounded-lg">
                <DollarSign size={20} />
              </span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              KZ 120.500,00
            </h3>
            <div className="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold">
              <TrendingUp size={14} /> +15% em relação ao mês anterior
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Multas Pagas (Mês)
            </p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              KZ 45.000,00
            </h3>
            <div className="mt-2 flex items-center gap-1 text-green-500 text-xs font-bold">
              <CheckCircle size={14} /> 32 transações liquidadas
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Inadimplência de Multas
            </p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">65%</h3>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
              <div className="bg-red-500 h-2 rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Tabela de Multas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex gap-4">
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 outline-none">
                <option>Filtrar por Motivo</option>
                <option>Atraso de Propina</option>
                <option>Biblioteca</option>
              </select>
            </div>
          </div>

          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Estudante</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Valor Original</th>
                <th className="px-6 py-4">Valor Multa</th>
                <th className="px-6 py-4">Dias em Atraso</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-red-50/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-700">
                    Abel Fortunato
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ID: 2024091
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-tighter">
                  Propina - Dezembro
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  KZ 25.000,00
                </td>
                <td className="px-6 py-4 text-sm font-black text-red-600">
                  KZ 2.500,00
                </td>
                <td className="px-6 py-4">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-black italic">
                    15 DIAS
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      title="Dar Desconto"
                      className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                    >
                      <Percent size={18} />
                    </button>
                    <button
                      title="Ver Detalhes"
                      className="p-2 text-[#268cff] hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <EyeIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
