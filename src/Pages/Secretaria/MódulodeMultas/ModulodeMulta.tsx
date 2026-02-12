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
  Trash2,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import ItemsDoCabeçalho from "@/Componentes/ItemsDoCabeçalho/ItemsDoCabeçalho";
import ChartGestaoMulta from "@/Componentes/Charts/ChartGestaoMulta";
import ChartGestaoMulta2 from "@/Componentes/Charts/ChartGestaoMulta2";
export default function ModulodeMulta() {
  const devedores = [
    {
      nome: "Abel Fortunato",
      codigo: "AF-2026-KB",
      motivo: "Propina - Dezembro",
      valorOriginal: 25000,
      multa: 2500,
      diasAtraso: "15 dias",
      estado: "Pendente",
    },
     {
      nome: "Isabela Fortunato",
      codigo: "IF-2026-KB",
      motivo: "Propina - Dezembro",
      valorOriginal: 25000,
      multa: 2500,
      diasAtraso: "10 dias",
      estado: "Pago",
    },
  ];
  const colorsSit = (estado: string) => {
    switch (estado) {
      case "Pago":
        return "text-green-500 ";
      case "Pendente":
        return "text-orange-400 ";
      default:
        return "text-black";
    }
  };
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500 ${
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
          <div className="flex items-center gap-4">
            {!menu && (
              <button>
                <Menu
                  className="text-[#268cff] flex items-start"
                  size={28}
                  onClick={OpenMenu}
                />
              </button>
            )}
            <div className="block">
              <h2 className="text-xl font-bold text-[#268cff]">
              Gestão de Multas
            </h2>
            <p className="text-gray-400 text-sm ">
              Controle de multas aplicadas aos estudantes, com detalhes sobre
              motivos, valores e status de pagamento.
            </p>
            </div>
          </div>
              <ItemsDoCabeçalho/>
        </div>
          <div className="flex justify-between items-end mb-6  ">
            <div className="flex gap-4 cursor-pointer ">
              {["Ano", "Semestre", "Mês"].map((filtro) => (
                <div key={filtro}>
                  <label className="block text-sm text-gray-500 mb-1">
                    {filtro}
                  </label>
                  <select className="bg-white border  rounded-lg px-6 py-2 text-sm text-gray-400 outline-none hover:border-[#268cff] cursor-pointer">
                    <option>Sem filtro</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#268cff] text-white rounded-md text-base font-semibold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">
              Gerar PDF <Download />
            </button>
          </div>

        {/* Cards Financeiros de Multas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 cursor-default">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-gray-400   tracking-widest">
                Total de multas pendentes
              </p>
              <span className="p-2 bg-red-50 text-red-600 rounded-lg">
                <DollarSign size={20} />
              </span>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              KZ 27.500,00
            </h3>
            <div className="mt-2 flex items-center gap-1 text-red-500 text-xs font-bold">
              <TrendingUp size={14} /> +15% em relação ao mês anterior
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400   tracking-widest">
              Valor das multas Pagas (Mês)
            </p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">
              KZ 40.000,00
            </h3>
            <div className="mt-2 flex items-center gap-1 text-green-500 text-xs font-bold">
              <CheckCircle size={14} /> 32 transações liquidadas
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400   tracking-widest">
              Quantidade de pagamentos com multas
            </p>
            <h3 className="text-3xl font-black text-gray-800 mt-2">15%</h3>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
              <div className="bg-red-500 h-2 rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>
  {/* Dashboard de Visão Geral */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
          {/* Card 1: Gráfico de Pizza/Pie */}
          <div className="flex-1 bg-white border  p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Multas Pendentes e Pagas
              </h3>
            </div>

            <div className="flex-grow flex items-center justify-center min-h-[300px]">
             <ChartGestaoMulta />
            </div>
          </div>

          {/* Card 2: Gráfico de Linha */}
          <div className="flex-1 bg-white border  p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Quantidade de Multas Pagas
              </h3>
            </div>

            <div className="flex-grow flex items-center justify-center min-h-[300px]">
             <ChartGestaoMulta2 />
            </div>
          </div>
        </div>
        {/* Tabela de Multas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex gap-4">
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 outline-none">
                <option disabled selected>
                  Filtrar por dias de atraso
                </option>
                <option>5 dias</option>
                <option>10 dias</option>
                <option>15 dias</option>
                <option>20 dias</option>
              </select>
            </div>
            <div className="flex gap-3">
            <button className="bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 shadow-sm transition-all duration-500 flex items-center gap-2">
              <Plus size={20} /> Aplicar Multa 
            </button>
          </div>
          </div>

          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#268cff]/70 text-white text-[14px]   font-black  border-b border-gray-200">
                <th className="px-6 py-4">Estudante</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Valor Original</th>
                <th className="px-6 py-4">Valor Multa</th>
                <th className="px-6 py-4">Dias em Atraso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {devedores.map((devedores, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/5 transition-colors text-center hover:border-b hover:border-dashed hover:border-[#268cff]"
                >
                  <td className="px-4 py-4 text-sm  ">
                   <div className="flex flex-col items-center justify-center">
                     <div className="font-bold text-gray-700">
                      {devedores.nome}
                     </div>
                    <div className="text-[10px] text-gray-500">
                      Código: {devedores.codigo}
                    </div>
                   </div>
                  </td>
                  
                  <td className="px-4 py-4 text-sm  text-gray-500">
                    {devedores.motivo}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-500">
                    {devedores.valorOriginal.toLocaleString("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                    })}
                  </td>
                  <td className="px-4 py-4 text-sm  text-red-500">
                    {devedores.multa.toLocaleString("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                    })}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-500">
                    {devedores.diasAtraso}
                  </td>
                  <td className="px-4  py-4 text-sm  text-gray-500">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${colorsSit(devedores.estado)}`}
                    >
                      {devedores.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                     <div className="flex gap-3 justify-center mx-auto cursor-pointer">
                      <div className="group relative w-max  ">
                        <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
                          <EyeIcon size={18} />
                        </div>
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                          Visualizar
                        </span>
                      </div>
                      <div className=" group relative w-max ">
                        <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
                          <Trash2 size={18} />
                        </div>
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                          Deletar
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
