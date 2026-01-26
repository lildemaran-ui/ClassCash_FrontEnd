import { ArrowDown, EyeIcon, 
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
  
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import { Link } from "react-router-dom";

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
      case "Estável":
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors ${
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
                           label="Gestão de Alunos"
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={28} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-[#268cff]">
              Gestão de Alunos
            </h2>
          </div>

          <header className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-[#268cff] cursor-pointer" />
              <span className="absolute bg-red-500 w-2.5 h-2.5 -top-1 -right-1 rounded-full border-2 border-white"></span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#268cff]/20 overflow-hidden shadow-sm">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-full h-full object-cover"
              />
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
          <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
            <Plus size={20} /> Cadastrar Aluno
          </button>
        </section>

        {/* Dashboard de Visão Geral */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm mb-12 flex flex-col items-center">
          <div className="w-full flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-700 italic">
              Visão Geral da Instituição
            </h3>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
              Status de Matrículas
            </p>
          </div>

          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Círculo de Fundo (Inativos) */}
            <div className="absolute w-full h-full rounded-full border-[16px] border-blue-100"></div>
            {/* Círculo de Progresso (Ativos) - Simulação usando border-l/t */}
            <div className="absolute w-full h-full rounded-full border-[16px] border-[#268cff] border-l-transparent border-b-transparent rotate-45"></div>

            <div className="text-center z-10">
              <span className="text-4xl font-black text-[#268cff]">70%</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Ativos
              </p>
            </div>
          </div>

          <div className="flex gap-10 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#268cff] rounded-sm shadow-sm"></div>
              <span className="text-sm font-medium text-gray-600">
                Alunos Ativos
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-100 rounded-sm shadow-sm"></div>
              <span className="text-sm font-medium text-gray-600">
                Alunos Inativos
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase font-black tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Código</th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-[#268cff]"
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center justify-center gap-1">
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
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {aluno.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
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
                    <div className="flex justify-center">
                      <Link
                        to="/DashboardEstud"
                        className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all shadow-sm"
                      >
                        <EyeIcon size={18} />
                      </Link>
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
