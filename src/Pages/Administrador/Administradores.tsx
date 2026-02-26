import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Settings,
  MessageSquare,
  AlertOctagon,
  FileText,
  ScrollText,
  KeyIcon,
  School,
  InfoIcon,
  Search,
  Bell,
  CircleUser,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import DashboardAdmin from "./DashboardAdmin";
export default function Administaradores() {
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500  ${
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
    <div className="flex h-screen bg-gray-50 font-sans custom_scroll transition-all duration-500">
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
            <Link to="">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={true}
              />
            </Link>

            <div className="flex flex-col gap-1 text-white">
              <Link to="/GestaoEstudantes">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Estudantes"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Encarregados"
                  active={false}
                />
              </Link>
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
              <Link to="">
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
                  icon={MessageSquare}
                  label="Gestão de Reclamações"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={AlertOctagon}
                  label="Gestão de Multas"
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
              <Link to="">
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
              <Link to="">
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
      {/* Conteúdo Principal */}
      <div className=" flex-col flex-1">
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
            <h1 className="text-xl font-bold  text-[#268cff]">Painel Geral</h1>
          </div>
          {/* Header (Topo) */}
          <header className=" ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
              {/* Campo de Pesquisa */}
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none transition-all"
                />
              </div>

              {/* Ícones de Notificação e Perfil */}
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
            </div>
          </header>
        </div>
        {/* Renderiza o conteúdo da página ativa */}
        {}
        <DashboardAdmin />
      </div>
    </div>
  );
}
