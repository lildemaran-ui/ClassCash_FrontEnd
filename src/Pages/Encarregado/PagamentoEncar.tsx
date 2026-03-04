import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Menu,
  Bell,
  LogOut,
  type LucideIcon,
  Receipt,
  Users,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import Avatar from "@/components/Avatar/Avatar";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";

export default function PagamentoEncar() {
  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  const OpenMenu = () => {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  };
  const CloseMenu = () => {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  };

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return <span>Carregado...</span>;

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
    <div className="flex overflow-hidden custom_scroll h-screen bg-gray-50 font-sans transition-all duration-500">
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
            <Link to="/Encarregado">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={window.location.pathname === "/Encarregado"}
              />
            </Link>
            <Link to="">
              <SidebarItem icon={Receipt} label="Pagamento" active={false} />
            </Link>

            <Link to="/DashboardEstud">
              <SidebarItem
                icon={Users}
                label="Painel do seu Educando"
                active={window.location.pathname === "/DashboardEstud"}
              />
            </Link>
            <Link to="/ReclamacoesEncar">
              <SidebarItem
                icon={MessageSquare}
                label="Reclamações"
                active={window.location.pathname === "/ReclamacoesEncar"}
              />
            </Link>
            <Link to="/ConfiguracaoEncar">
              <SidebarItem
                icon={Settings}
                label="Definições"
                active={window.location.pathname === "/ConfiguracaoEncar"}
              />
            </Link>
          </nav>
          <Link
            to="/Login"
            className="hover:bg-blue-400 px-4 rounded-sm  border border-white/10 bg-blue-500/50  transition-all duration-700 p-3 group"
          >
            <div className="flex justify-between  items-center ">
              <span className="text-sm font-medium text-white group-hover:text-blue-700">
                Terminar sessão
              </span>
              <LogOut
                size={22}
                className="text-white font-medium group-hover:text-blue-700"
              />
            </div>
          </Link>
        </aside>
      )}
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 bg-translucido">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={22}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h1 className="text-xl font-bold text-[#268cff]">Pagamentos </h1>

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
              <Avatar name={user.nome} src={user.foto} size="md" />
            </div>
          </header>
        </div>
        <div className="">
          <PagamentoGeral />
        </div>
      </div>
    </div>
  );
}
