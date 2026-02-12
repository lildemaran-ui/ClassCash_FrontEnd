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
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";

export default function GestaodeEncarregados() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      nome: "Valente de Sousa",
      nomedoeducando: "Dário Valente de Sousa",
      parentesco: "Pai",
      Contacto: "924576878",
      Estado: "Ativo",
    },
    {
      nome: "Eduarda João",
      nomedoeducando: "Eduarda Paula João",
      parentesco: "Mãe",
      Contacto: "924576878",
      Estado: "Ativo",
    },
    {
      nome: "Luana Ngola",
      nomedoeducando: "Luana da Silva Ngola",
      parentesco: "Mãe",
      Contacto: "924576878",
      Estado: "Inativo",
    },
    {
      nome: "Felisberto Costa",
      nomedoeducando: "Felisberto Manuel Costa",
      parentesco: "Pai",
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
  const handleSort = (chave: "nome") => {
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
                active={true}
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
        {/* Header com Título e Search */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] p-2 hover:bg-blue-50 rounded-lg"
              >
                <Menu size={28} />
              </button>
            )}
            <h2 className="text-xl font-bold text-[#268cff]">
              Gestão de Encarregados
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por um nome..."
                className="w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none transition-all bg-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff]" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border border-[#268cff]/20 overflow-hidden">
                <img src="https://via.placeholder.com/40" alt="User" />
              </div>
            </div>
          </div>
        </div>

        {/* Ações e Tabela */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center cursor-default">
            <div>
              <h3 className="text-lg font-bold text-gray-700">
                Lista de Encarregados
              </h3>
              <p className="text-sm text-gray-400">
                Gerencie os dados de contacto e alunos associados
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#268cff] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95 cursor-pointer">
              <Plus size={20} />
              <span>Cadastrar </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse cursor-default">
              <thead>
                <tr className="bg-[#268cff]/70 text-white text-[14px] font-black tracking-widest border-b border-gray-200 text-center">
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-[#268cff]"
                    onClick={() => handleSort("nome")}
                  >
                    <div className="flex items-center justify-center gap-1 cursor-pointer">
                      Encarregado{" "}
                      {ordemCrescente ? (
                        <ArrowDown size={14} />
                      ) : (
                        <ArrowUp size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Educando (Aluno)</th>
                  <th className="px-6 py-4">Parentesco</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dadosAlunos.map((aluno, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#268cff]/5 transition-colors text-center "
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-500 ">
                      {aluno.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {aluno.nomedoeducando}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {aluno.parentesco}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {aluno.Contacto}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold border inline-block min-w-[90px] ${colorsSit(aluno.Estado)}`}
                      >
                        {aluno.Estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="group w-max relative flex items-center mx-auto">
                       <div className="flex ">
                      <div
                        
                        className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm cursor-pointer"
                      >
                        <EyeIcon size={18} />
                        
                      </div>
                      <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">Visualizar</span>
                    </div>
                     </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
