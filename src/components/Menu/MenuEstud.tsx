import {
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo5 from "../../assets/Logo5.5.png";
import { useState } from "react";
export default function MenuEstud() {
  const [menu, setMenu] = useState<boolean>(() => {
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
    <div className="flex w-[15%] h-full">
      {menu ? (
        <aside className="flex flex-col w-full  bg-[#268cff] text-white top-0 sticky">
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
            <Link to="/DashboardEstud">
              <NavItem
                icon={<LayoutDashboard size={22} />}
                label="Painel"
                active={window.location.pathname === "/DashboardEstud"}
              />
            </Link>

            <Link to="/Pagamentos" className=" block w-full">
              <NavItem
                icon={<Wallet size={22} />}
                label="Pagamentos"
                active={window.location.pathname === "/Pagamentos"}
              />
            </Link>
            <Link to="/reclamacoes">
              <NavItem
                icon={<MessageSquare size={22} />}
                label="Reclamações"
                active={window.location.pathname === "/reclamacoes"}
              />
            </Link>
            <Link to="/Config">
              <NavItem
                icon={<Settings size={22} />}
                label="Configurações"
                active={window.location.pathname === "/Config"}
              />
            </Link>
            <NavItem
              icon={<LifeBuoy size={22} />}
              label="Suporte"
              active={false}
            />
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
      ) : (
        <Menu size={22} className="text-[#268cff] m-8" onClick={OpenMenu} />
      )}
    </div>
  );
}
