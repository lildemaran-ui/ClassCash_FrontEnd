import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Settings,
  LifeBuoy,
  Menu,
} from "lucide-react";
import logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";

import DadosDashEstd from "./DadosDashEstd";
export default function DashboardEstud() {
  const [menu, setMenu] = useState(false);

  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
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
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex flex-col">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <div className="flex items-center font-semibold">
              <img src={logo5} alt="Logo" className="w-16 h-16" />
              <span>ClassCash</span>
            </div>
            <button onClick={CloseMenu}>
              <Menu size={28} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2  ">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Página Inicial"
              active
            />

            <Link to="/Pagamentos"><NavItem icon={<Wallet size={20} />} label="Pagamentos" /></Link>

            <NavItem icon={<MessageSquare size={20} />} label="Reclamações" />
            <NavItem icon={<Settings size={20} />} label="Configurações" />
            <NavItem icon={<LifeBuoy size={20} />} label="Suporte" />
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={28} className="text-[#268cff]" />
          </button>
        )}
        <DadosDashEstd />
      </main>
    </div>
  );
}
