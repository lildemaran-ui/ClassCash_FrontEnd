import {
  FileText,
  InfoIcon,
  KeyIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  ScrollText,
  SettingsIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo555 from "../../assets/logo5.5.png";
import { handleLogout } from "@/lib/logout";
export default function MenuAdmin() {

  const [menu, setMenu] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const saved = localStorage.getItem("menu_encar_aberto");
      return saved !== "false";
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        const saved = localStorage.getItem("menu_encar_aberto");
        setMenu(saved !== "false");
      } else {
        setMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_encar_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_encar_aberto", "false");
  }

  const links = [
    { to: "/Administradores",     icon: LayoutDashboard, label: "Painel Geral" },
    { to: "/GestaoDeInstituicao", icon: School,          label: "Gestão de Instituição" },
    { to: "/GestaoDeRelatorio",   icon: FileText,        label: "Gestão de Relatórios" },
    { to: "/PermissoesAcessos",   icon: KeyIcon,         label: "Permissões e Acessos" },
    { to: "/GestaoLogs",          icon: ScrollText,      label: "Gestão de Logs" },
    { to: "/SuporteAjuda",        icon: InfoIcon,        label: "Suporte e Ajuda" },
    { to: "/Configuracoes",       icon: SettingsIcon,    label: "Configurações" },
  ];

  const isCollapsed = !isMobile && !menu;

  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
    collapsed = false,
  }: {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    collapsed?: boolean;
  }) => (
    <div
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-300 group relative
        ${collapsed ? "justify-center p-3" : "p-3"}
        ${active ? "bg-white/20" : "hover:bg-white/10"}
      `}
    >
      <Icon size={22} className="text-white shrink-0" />
      {!collapsed && (
        <span className="text-white font-medium text-sm whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && menu && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={CloseMenu} />
      )}

      {/* Botão hambúrguer — apenas mobile quando fechado */}
      {isMobile && !menu && (
        <button
          onClick={OpenMenu}
          className="fixed top-3.5 left-4 z-[60] p-1 rounded-lg border border-[#184d8a]/50 focus:border-[#184d8a] text-[#184d8a]"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        style={{ height: "100dvh" }}
        className={`
          bg-[#184d8a] text-white flex flex-col
          transition-all duration-700 translate-all ease-in-out shrink-0 
          ${isMobile
            ? menu
              ? "fixed top-0 left-0 w-72 z-50"
              : "hidden"
            : isCollapsed
              ? "sticky top-0 w-[68px]"
              : "sticky top-0 w-64"
          }
        `}
      >
        {/* Header */}
        <div className={`pt-4 mb-6 flex items-center shrink-0 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <img loading="lazy" src={logo555} alt="Logo" className="w-14 h-14" />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
          )}
          <button
            onClick={isCollapsed ? OpenMenu : CloseMenu}
            className="p-1.5 rounded hover:bg-white/10 transition shrink-0"
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isMobile
              ? <X size={22} className="text-white" />
              : <Menu size={22} className="text-white" />
            }
          </button>
        </div>

        {/* Logo colapsado */}
        {isCollapsed && (
          <div className="flex justify-center mb-4 shrink-0">
            <img loading="lazy" src={logo555} alt="Logo" className="w-9 h-9" />
          </div>
        )}

        {/* Nav */}
        <nav className={`flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col gap-1 ${isCollapsed ? "px-1" : "px-3"}`}>
          {links.map(({ to, icon, label }) => (
            <Link key={label} to={to}>
              <SidebarItem
                icon={icon}
                label={label}
                active={window.location.pathname === to}
                collapsed={isCollapsed}
              />
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className={`shrink-0 py-4 border-t border-white/10 ${isCollapsed ? "px-1" : "px-3"}`}>
          {isCollapsed ? (
            <Link
              to="/Login"
              onClick={handleLogout}
              title="Terminar sessão"
              className="flex justify-center p-3 rounded-lg bg-blue-500/50 hover:bg-blue-400 transition-all duration-300 group relative"
            >
              <LogOut size={22} className="text-white" />
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                Terminar sessão
              </span>
            </Link>
          ) : (
            <Link
              to="/Login"
              onClick={handleLogout}
              className="flex justify-between items-center p-3 rounded-lg bg-blue-500/50 hover:bg-blue-400 transition-all duration-300 group"
            >
              <span className="text-sm font-medium text-white group-hover:text-blue-700">
                Terminar sessão
              </span>
              <LogOut size={22} className="text-white group-hover:text-blue-700" />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}