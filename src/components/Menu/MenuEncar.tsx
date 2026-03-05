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
     className={`flex items-center gap-3 p-3 mt-2 rounded-lg cursor-pointer transition-all duration-300   ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
  return (
    <div  className="flex w-[18%] h-full">
         {menu ? (
        <aside className="flex flex-col w-full  bg-[#268cff] text-white top-0 sticky">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <div className=" flex items-center font-semibold">
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

          <nav className="flex-1 px-4 space-y-2 ">
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
                label="Configurações"
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
      ):(
        <Menu size={22} className="text-[#268cff] m-8" onClick={OpenMenu} />
      )}
    </div>
  )}