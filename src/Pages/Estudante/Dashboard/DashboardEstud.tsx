import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Settings,
  LifeBuoy,
  Menu,
} from "lucide-react";
import logo5 from "../../../assets/Logo5.5.png";
import { Link } from "react-router-dom";

import DadosDashEstd from "./DadosDashEstd";
export default function DashboardEstud() {
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
  const NavItem = ({
    icon,
    label,
    active = false,
  }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 mt-2 rounded-lg cursor-pointer transition-all duration-300 ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans transition-all duration-500">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex flex-col h-sreen top-0 sticky">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <div className="flex items-center font-semibold">
              <img
                loading="lazy"
                src={logo5}
                alt="Logo"
                className="w-16 h-16"
              />
              <span>ClassCash</span>
            </div>
            <button onClick={CloseMenu}>
              <Menu size={22} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2  ">
            <NavItem
              icon={<LayoutDashboard size={22} />}
              label="Painel"
              active={true}
            />

            <Link to="/Pagamentos" className=" block w-full">
              <NavItem
                icon={<Wallet size={22} />}
                label="Pagamentos"
                active={false}
              />
            </Link>
            <Link to="/reclamacoes">
              <NavItem
                icon={<MessageSquare size={22} />}
                label="Reclamações"
                active={false}
              />
            </Link>
            <Link to="/Config">
              <NavItem
                icon={<Settings size={22} />}
                label="Configurações"
                active={false}
              />
            </Link>
            <NavItem
              icon={<LifeBuoy size={22} />}
              label="Suporte"
              active={false}
            />
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll ">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={22} className="text-[#268cff]" />
          </button>
        )}
        <DadosDashEstd />
      </main>
    </div>
  );
}
