import { LayoutDashboard, LogOut, Menu, MessageSquare, Receipt, Settings, Users, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import logo5 from "../../assets/Logo5.5.png";
import { useState } from "react";
export default function MenuEncar() {
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
  return (
    <div>
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
    </div>
  )}