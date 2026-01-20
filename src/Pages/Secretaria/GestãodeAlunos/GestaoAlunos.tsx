import { ArrowDown, EyeIcon, PiIcon, Plus } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  AlertOctagon,
  FileText,
  UserCog,
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
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      {Icon ?? <PiIcon size={20} className="text-white" />}
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
                icon={<LayoutDashboard size={20}/>}
                label="Painel Geral"
                active={false}
              />
            </Link>

            <SidebarItem
              icon={<Users size={20}/>}
              label="Gestão de Alunos"
              active={true}
            />

            <Link to="/GestaodeEncarregados">
            <SidebarItem
              icon={<Users size={20}/>}
              label="Gestão de Encarregados"
              active={false}
            />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={<CreditCard size={20}/>}
                label="Gestão de Propinas"
                active={false}
              />
            </Link>
            <Link to="/GestaoPagamentos">
              <SidebarItem
                icon={<Receipt size={20}/>}
                label="Gestão de Pagamentos"
                active={false}
              />
            </Link>
            
            <SidebarItem
              icon={<Settings size={20}/>}
              label="Gestão de Serviços"
              active={false}
            />
            <SidebarItem
              icon={<MessageSquare size={20}/>}
              label="Gestão de Reclamações"
              active={false}
            />
            <SidebarItem
              icon={<AlertOctagon size={20}/>}
              label="Gestão de Multas"
              active={false}
            />

            <SidebarItem icon={<FileText size={20}/>} label="Relatório" active={false} />

            <SidebarItem
              icon={<Settings size={20}/>}
              label="Configurações"
              active={false}
            />
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 ">
        <div className="flex justify-between">
          <div className="flex gap-6 items-center">
            {!menu && (
              <button>
                <Menu
                  className="text-[#268cff] flex items-start"
                  size={28}
                  onClick={OpenMenu}
                ></Menu>
              </button>
            )}
            <h2 className="text-lg font-bold text-[#268cff]">
              Gestão de Alunos
            </h2>
          </div>
          {/* Header */}
          <header className="flex justify-end items-center mb-8">
            <div className="flex">
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
        </div>

        <section className="mb-8">
          <div className="flex justify-start mb-6">
            <div className="relative mr-5 w-auto ">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por um código/Nome"
                className="w-80 pl-10 pr-5  py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-MeuAzul/20 focus:border-none"
              />
            </div>
            <div className="flex gap-3 bg-[#268cff] w-32 py-2 px-2 text-white rounded-lg ">
        <div><Plus/></div>
        <div className="font-semibold">Cadastrar</div>
       </div>
          </div>
        </section>
        <div className=" border p-6 rounded-lg ">
          <div>
            <p className="text-sm text-gray-400 font-bold mb-4 justify-end flex ">
              Melhor visão e Gestão de Alunos
            </p>
            <div className=" w-96 h-56 flex justify-center items-center mx-auto">
              <div className="border-[20px] relative w-48 h-48 rounded-full  p-16 border-blue-500 border-l-blue-400 flex items-center justify-center">
                <div className="absolute text-sm font-semibold">
                  <p>70% Ativos</p>
                </div>
              </div>
            </div>
            <div className="flex gap-8 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500"></div>
                <p>Alunos ativos</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400"></div>
                <p>Alunos inativos</p>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mt-28  ">
          <thead>
            <tr className="bg-[#268cff]/80 text-white">
              <th className="border border-gray-300 px-4 py-2">Código</th>
              <th className="border border-gray-300 px-4 py-2 ">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("nome")}
                >
                  Nome
                  {ordemCrescente ? (
                    <ArrowDown size={18} />
                  ) : (
                    <ArrowUp size={20} />
                  )}
                </div>
              </th>
              <th className="border border-gray-300 px-4 py-2">Classe</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Situação</th>
            </tr>
          </thead>
          <tbody>
            {dadosAlunos.map((aluno, index) => (
              <tr
                key={index}
                className="hover:bg-[#268cff]/10 even:bg-[#268cff]/20 hover:border hover:border-dashed hover:border-black text-center"
              >
                <td className=" px-4 py-2 border-r border-l border-gray-300">
                  {aluno.codigo}
                </td>
                <td className=" px-4 py-2 border-r border-l border-gray-300">
                  {aluno.nome}
                </td>
                <td className=" px-4 py-2 border-r border-l border-gray-300">
                  {aluno.classe}
                </td>
                <td className=" px-4 py-2 border-r border-l border-gray-300">
                  {aluno.status}
                </td>
                <div className="flex  justify-between items-center">
                  <div className="flex justify-center mx-auto">
                    <td className={`px-4 py-2 ${colorsSit(aluno.situacao)}`}>
                      {aluno.situacao}{" "}
                    </td>
                  </div>
                  <Link
                    to="/DashboardEstud"
                    className=" justify-end flex items-end mr-5 bg-[#268cff]/50 px-3 rounded-lg"
                  >
                    <EyeIcon className="text-white" />
                  </Link>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
