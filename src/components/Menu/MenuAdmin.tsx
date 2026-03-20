import { FileText, InfoIcon, KeyIcon, LayoutDashboard, LogOut, Menu, School, ScrollText, Settings, Users, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo5 from "../../assets/Logo5.5.png";
export default function MenuAdmin() {
      // Componente SidebarItem atualizado com as novas medidas
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500  ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );

  const [menu, setMenu] = useState(true);
  function CloseMenu() {
    setMenu(false);
  }
  function OpenMenu() {
    setMenu(true);
  }
    return(
        <div>
             {menu ? (
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
                active={window.location.pathname === "/Administradores"}
              />
            </Link>

            <div className="flex flex-col gap-1 text-white">
              <Link to="/GestaoDeInstituicao">
                <SidebarItem
                  icon={School}
                  label="Gestão de Instituições"
                  active={window.location.pathname === "/GestaoDeInstituicao"}
                />
              </Link>
              <Link to="/GestaoDeUsuarios">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Usuarios"
                  active={window.location.pathname === "/GestaoDeUsuarios"
                  }
                />
              </Link>


              <Link to="/GestaoDeRelatorio">
                <SidebarItem
                  icon={FileText}
                  label="Gestão de Relatórios"
                  active={window.location.pathname === "/GestaoDeRelatorio"}
                />
              </Link>
              <Link to="/PermissoesAcessos">
                <SidebarItem
                  icon={KeyIcon}
                  label="Permissões e Acessos"
                  active={window.location.pathname === "/PermissoesAcessos"}
                />
              </Link>
              <Link to="/GestaoLogs">
                <SidebarItem
                  icon={ScrollText}
                  label="Logs de Atividades"
                  active={window.location.pathname === "/GestaoLogs"}
                />
              </Link>
              <Link to="/SuporteAjuda">
                <SidebarItem
                  icon={InfoIcon}
                  label="Suporte e Ajuda"
                  active={window.location.pathname === "/SuporteAjuda"}
                />
              </Link>
              <Link to="/Configuracoes">
                <SidebarItem
                  icon={Settings}
                  label="Configurações"
                  active={window.location.pathname === "/Configuracoes"}
                />
              </Link>
            </div>
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
      ): ( <Menu size={22}className="text-[#268cff]" onClick={OpenMenu}/>)}
        </div>
    )
}