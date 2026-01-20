import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  AlertOctagon,
  Menu,
  Settings,
  MessageSquare,
  FileText,
  Bell,
  Search,
  ArrowDown,
  ArrowUp,
  Plus,
  EyeIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";

export default function GestaodeEncarregados() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      
      nome: "Valente de Sousa",
      nomedoeducando:"Dário Valente de Sousa",
     Contacto: "924576878",
      Estado: "Ativo",
    },
    {
      nome:"Eduarda João",
      nomedoeducando: "Eduarda Paula João",
     Contacto: "924576878",
      Estado: "Ativo",
    },
    {
      nome:"Luana Ngola",
      nomedoeducando: "Luana da Silva Ngola",
     Contacto: "924576878",  
      Estado: "Inativo",
    },
    {
      nome:"Felisberto Costa",
      nomedoeducando: "Felisberto Manuel Costa",
     Contacto: "924576878", 
      Estado: "Ativo",
    },
  ]);
  const colorsSit = (Estado: string) => {
    switch (Estado) {
      case "Ativo":
        return "text-green-500";
      case "Inativo":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  {
    /*Função de ordenação**/
  }
  const handleSort = (chave: "nome" ) => {
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
                icon={LayoutDashboard }
                label="Painel Geral"
                active={false}
              />
            </Link>

            <Link to = "/GestaoAlunos">
            <SidebarItem
              icon={Users }
              label="Gestão de Alunos"
              active={false}
            />

            </Link>
            <Link to="/GestaodeEncarregados">
            <SidebarItem
              icon={Users }
              label="Gestão de Encarregados"
              active={true}
            />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={CreditCard }
                label="Gestão de Propinas"
                active={false}
              />
            </Link>
            <Link to="/GestaoPagamentos">
              <SidebarItem
                icon={Receipt }
                label="Gestão de Pagamentos"
                active={false}
              />
            </Link>

            <SidebarItem
              icon={Settings }
              label="Gestão de Serviços"
              active={false}
            />
            <SidebarItem
              icon={MessageSquare }
              label="Gestão de Reclamações"
              active={false}
            />
            <SidebarItem
              icon={AlertOctagon }
              label="Gestão de Multas"
              active={false}
            />

            <SidebarItem
              icon={FileText }
              label="Relatório"
              active={false}
            />

            <SidebarItem
              icon={Settings }
              label="Configurações"
              active={false}
            />
          </nav>
        </aside>
      )}
      {/* Main Content */}
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
          <h2 className="text-lg font-bold text-[#268cff]">
            Gestão de Encarregados
          </h2>
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
                placeholder="Procurar por um nome"
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

       
        {/* Tabela de Dados */}
        <div className="mt-16">
          <div className="flex gap-3 bg-[#268cff] w-32 py-2 px-2 text-white rounded-lg  ml-auto ">
        <div><Plus/></div>
        <div className="font-semibold">Cadastrar</div>
       </div>
          <h2 className="mb-2 text-gray-500 text-base font-semibold">
            Lista de Encarregados
          </h2>

          <table className="w-full border-collapse border border-gray-300   ">
            <thead>
              <tr className="bg-[#268cff]/80 text-white">
                
                <th className="border border-gray-300 px-4 py-2 ">
                  <div
                    className="flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => handleSort("nome")}
                  >
                    Nome do Encarregado
                    {ordemCrescente ? (
                      <ArrowDown size={18} />
                    ) : (
                      <ArrowUp size={20} />
                    )}
                  </div>
                </th>
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
                
                <th className="border border-gray-300 px-4 py-2">Contacto</th>
                
                <th className="border border-gray-300 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/10 even:bg-[#268cff]/20 hover:border hover:border-dashed hover:border-black text-center"
                >
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.nome}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.nomedoeducando}
                  </td>
                 <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.Contacto}
                  </td>

                  <div className="flex  justify-between items-center">
                    <div className="flex justify-center mx-auto">
                      <td className={`px-4 py-2 ${colorsSit(aluno.Estado)}`}>
                        {aluno.Estado}
                      </td>
                    </div>
                    <button className=" justify-end flex items-end mr-5 bg-[#268cff]/50 px-3 rounded-lg">
                      <EyeIcon className="text-white" />
                    </button>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
