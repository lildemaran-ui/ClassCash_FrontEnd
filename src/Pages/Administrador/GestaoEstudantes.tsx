import {
  ArrowDown,
  ArrowUp,
  Bell,
  CircleUser,
  CreditCard,
  EyeIcon,
  FileText,
  InfoIcon,
  KeyIcon,
  LayoutDashboard,
  Menu,
  PencilIcon,
  Plus,
  Receipt,
  School,
  ScrollText,
  Settings,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo5 from "../../assets/Logo5.5.png";
import { colorsSit } from "@/lib/utils";

export default function GestaoEstudantes() {
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      codigo: "DVS-2025-KS",
      nome: "Dário Valente de Sousa",
      classe: "10ª Classe",
      institution: "Kibangas",
      status: "Ativo",
    },
    {
      codigo: "EPJ-2025-AL",
      nome: "Eduarda Paula João",
      classe: "10ª Classe",
      institution: "Kibangas",
      status: "Ativo",
    },
    {
      codigo: "LSN-2025-EF",
      nome: "Luana da Silva Ngola",
      classe: "7ª Classe",
      institution: "Kibangas",
      status: "Inativo",
    },
    {
      codigo: "FMC-2025-KS",
      nome: "Felisberto Manuel Costa",
      classe: "8ª Classe",
      institution: "Kibangas",
      status: "Inativo",
    },
    {
      codigo: "DCG-2025-EF",
      nome: "Diana Cristina Geraldo",
      classe: "10ª Classe",
      institution: "Kibangas",
      status: "Ativo",
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
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll transition-all duration-500">
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
          <nav className="flex-1 flex flex-col gap-1 transition-all duration-500 text-white max-h-screen custom_scroll">
            <Link to="/Administradores">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={false}
              />
            </Link>

            <div className="flex flex-col gap-1 text-white">
              <Link to="/GestaoDeInstituicao">
                <SidebarItem
                  icon={School}
                  label="Gestão de Instituições"
                  active={false}
                />
              </Link>
              <Link to="/GestaoDeUsuarios">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Usuarios"
                  active={false}
                />
              </Link>
              <Link to="/GestaoPropinasAdmin">
                <SidebarItem
                  icon={CreditCard}
                  label="Gestão de Propinas"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={Receipt}
                  label="Gestão de Pagamentos"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={Settings}
                  label="Gestão de Serviços"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={FileText}
                  label="Gestão de Relatórios"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={KeyIcon}
                  label="Permissões e Acessos"
                  active={false}
                />
              </Link>
              <Link to="/GestaoLogs">
                <SidebarItem
                  icon={ScrollText}
                  label="Logs de Atividades"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={InfoIcon}
                  label="Suporte e Ajuda"
                  active={false}
                />
              </Link>
              <Link to="/Configuracoes">
                <SidebarItem
                  icon={Settings}
                  label="Configurações"
                  active={false}
                />
              </Link>
            </div>
          </nav>
        </aside>
      )}
      {/* Main Content */}
      <div className=" flex-col  flex-1">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 mb-5 bg-translucido">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold  text-[#268cff]">
              Gestão de Estudantes
            </h1>
          </div>
          {/* Header (Topo) */}
          <header className=" ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
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
        <section className="flex justify-between items-center mb-10  p-4 rounded-2xl   m-8">
          <div className="flex justify-between items-end mb-6  ">
            <div className="flex gap-4 cursor-pointer ">
              {["Nome/Código", "Instituição", "Classe"].map((filtro) => (
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
          </div>
        </section>
        <div className="flex justify-end items-end mr-10">
          <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all duration-500 shadow-md ">
            <Plus size={22} /> Cadastrar
          </button>
        </div>
        {/* Dashboard de Visão Geral */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-12  p-8">
          {/* Card 1: Gráfico de Pizza/Pie */}
          <div className="flex-1 bg-white border  p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col ">
            <div className="flex items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Distribuição de Ativos vs Inativos
              </h3>
            </div>
            <div className="flex items-center justify-center italic text-gray-400">
              Página em desenvolvimento
            </div>
            <div className="flex-grow flex items-center justify-center min-h-[300px]"></div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden  m-8">
          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#268cff]/70 text-white text-base  font-black tracking-widest border-b border-gray-100">
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
                <th className="px-6 py-4">Instituição</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/5 transition-colors "
                >
                  <td className="px-6 py-4 text-base font-mono text-gray-500">
                    {aluno.codigo}
                  </td>
                  <td className="px-6 py-4 text-base font-medium text-gray-500">
                    {aluno.nome}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-500">
                    {aluno.classe}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-500">
                    {aluno.institution}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-bold border inline-block min-w-[80px] ${colorsSit(aluno.status)}`}
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
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-base px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
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
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-base px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Visualizar
                          </span>
                        </div>
                      </div>
                      <div className="group relative w-max">
                        <div className="flex ">
                          <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all shadow-sm">
                            <Trash2 size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-base px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
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
      </div>
    </div>
  );
}
