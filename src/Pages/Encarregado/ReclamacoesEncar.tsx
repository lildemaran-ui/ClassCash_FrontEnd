import {
  Bell,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Menu,
  type LucideIcon,
  Receipt,
  Users,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar/Avatar";
import ReclamacaoGeral from "@/components/Reclamacao/ReclamacaoGeral";

export default function ReclamacoesEncar() {
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  }
  // Sub-componentes auxiliares
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

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }
  return (
    <div className="flex overflow-hidden h-screen bg-white font-sans transition-all duration-500">
      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img
                loading="lazy"
                src={logo5}
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
            <Link to="/PagamentoEncar">
              <SidebarItem
                icon={Receipt}
                label="Pagamento"
                active={window.location.pathname === "/PagamentoEncar"}
              />
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

      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll transition-all duration-500">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={22} className="text-[#268cff]" />
          </button>
        )}
        {/* Header Superior */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={22} className="text-[#268cff]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f0f5fa]"></div>
            </div>
            <Avatar name={user.nome} src={user.foto} size="md" />
          </div>
        </header>
        <ReclamacaoGeral />
      </main>
    </div>
  );
}
