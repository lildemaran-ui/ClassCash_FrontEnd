import {
  ArrowDown,
  EyeIcon,
  Plus,
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
  Menu,
  ArrowUp,
  PencilIcon,
  Trash2,
  CircleUser,
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import ChartGestaoEstud from "@/Componentes/Charts/chartGestaoEstud";
import ChartGestaoEstud2 from "@/Componentes/Charts/ChartGestaoEstud2";

export default function GestaoAlunos() {
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      codigo: "DVS-2025-KS",
      nome: "Dário Valente de Sousa",
      classe: "10ª Classe",
      status: "Ativo",
      situacao: "Estável",
    },
    {
      codigo: "EPJ-2025-AL",
      nome: "Eduarda Paula João",
      classe: "10ª Classe",
      status: "Ativo",
      situacao: "Razoável",
    },
    {
      codigo: "LSN-2025-EF",
      nome: "Luana da Silva Ngola",
      classe: "7ª Classe",
      status: "Inativo",
      situacao: "Sem assunto",
    },
    {
      codigo: "FMC-2025-KS",
      nome: "Felisberto Manuel Costa",
      classe: "8ª Classe",
      status: "Inativo",
      situacao: "Sem assunto",
    },
    {
      codigo: "DCG-2025-EF",
      nome: "Diana Cristina Geraldo",
      classe: "10ª Classe",
      status: "Ativo",
      situacao: "Em crise",
    },
  ]);
  const [ordemCrescente, setOrdemCrescente] = useState(true);

  {
    /*Função de ordenação**/
  }
  const handleSort = (chave: "nome" | "codigo") => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) => {
      if (ordemCrescente) {
        return a[chave].localeCompare(b[chave]);
      } else {
        return b[chave].localeCompare(a[chave]);
      }
    });

    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };
  const colorsSit = (situacao: string) => {
    switch (situacao) {
      case "Ativo":
        return "text-green-500";
      case "Razoável":
        return "text-orange-400";
      case "Em crise":
        return "text-red-500";
      case "Sem assunto":
        return "text-gray-500";
      default:
        return "text-black";
    }
  };

  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  // Componente Sidebar
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
                active={true}
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
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {/* Header Superior */}
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 mb-5 bg-translucido">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={28}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h2 className="text-xl font-bold text-[#268cff]">Gestão de Estudantes </h2>
        
        {/* Header */}
       <header className="flex justify-between ">
          <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
          <div className="flex items-center space-x-4">
            {/* Campo de Pesquisa */}
            

            {/* Ícones de Notificação e Perfil */}
            <div className="relative cursor-pointer">
              <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
            </div>
            <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
          </div>
        </header>
</div>
        {/* Barra de Pesquisa e Ação */}
        <section className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="search"
              placeholder="Procurar por código ou nome..."
              className="w-96 pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#268cff]/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all duration-500 shadow-md ">
            <Plus size={20} /> Cadastrar
          </button>
        </section>

        {/* Dashboard de Visão Geral */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
          {/* Card 1: Gráfico de Pizza/Pie */}
          <div className="flex-1 bg-white border  p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Distribuição de Ativos vs Inativos
              </h3>
            </div>

            <div className="flex-grow flex items-center justify-center min-h-[300px]">
              <ChartGestaoEstud />
            </div>
          </div>

          {/* Card 2: Gráfico de Linha */}
          <div className="flex-1 bg-white border  p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Evolução Mensal de Estudantes
              </h3>
            </div>

            <div className="flex-grow flex items-center justify-center min-h-[300px]">
              <ChartGestaoEstud2 />
            </div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#268cff]/70 text-white text-[14px]  font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Código</th>
                <th
                  className="px-6 py-4 cursor-pointer "
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center justify-center gap-1 cursor-pointer">
                    Nome{" "}
                    {ordemCrescente ? (
                      <ArrowDown size={14} />
                    ) : (
                      <ArrowUp size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/5 transition-colors "
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {aluno.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {aluno.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {aluno.classe}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[80px] ${colorsSit(aluno.situacao)}`}
                    >
                      {aluno.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center mx-auto gap-4 cursor-pointer">
                      <div className="group relative w-max">
                        <div className="flex">
                          <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
                            <PencilIcon size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Editar
                          </span>
                        </div>
                      </div>
                      <div className="group relative w-max">
                        <div className="flex ">
                          <Link
                            to="/DashboardEstud"
                            className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm"
                          >
                            <EyeIcon size={18} />
                          </Link>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Visualizar
                          </span>
                        </div>
                      </div>
                      <div className="group relative w-max">
                        <div className="flex ">
                          <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all shadow-sm">
                            <Trash2 size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Excluir
                          </span>
                        </div>
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
