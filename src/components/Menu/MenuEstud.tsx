import { handleLogout } from "@/lib/logout";
import {
  LayoutDashboard, LifeBuoy, LogOut, Menu,
  MessageSquare, Settings, Wallet, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo555 from "../../assets/Logo5.5.png";
type MenuMode = "open" | "collapsed" | "hidden";

export default function MenuEstud() {
 
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  // desktop: "open" | "collapsed"   mobile: "open" | "hidden"
  const [mode, setMode] = useState<MenuMode>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      return (localStorage.getItem("menu_estud_modo") as MenuMode) ?? "open";
    }
    return "hidden";
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setMode("hidden");
      else setMode((localStorage.getItem("menu_estud_modo") as MenuMode) ?? "open");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function openMenu() {
    const next: MenuMode = "open";
    setMode(next);
    localStorage.setItem("menu_estud_modo", next);
  }
  function collapseOrClose() {
    // mobile → esconde totalmente | desktop → colapsa para ícones
    const next: MenuMode = isMobile ? "hidden" : "collapsed";
    setMode(next);
    localStorage.setItem("menu_estud_modo", next);
  }

  const links = [
    { to: "/DashboardEstud", icon: LayoutDashboard, label: "Painel Geral" },
    { to: "/Pagamentos",      icon: Wallet,          label: "Pagamentos" },
    { to: "/Reclamacoes",     icon: MessageSquare,   label: "Reclamações" },
    { to: "/Config",          icon: Settings,        label: "Configurações" },
    { to: "",                 icon: LifeBuoy,        label: "Ajuda e Suporte" },
  ];

  const isOpen      = mode === "open";
  const isCollapsed = mode === "collapsed";
  const isHidden    = mode === "hidden";

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={collapseOrClose} />
      )}

      {/* Botão hambúrguer — só aparece quando sidebar está escondida (mobile) */}
      {isHidden && (
        <button
          onClick={openMenu}
          className="fixed top-3.5 left-4 z-[60] p-1 rounded-lg border border-[#184d8a]/50 focus:border-[#184d8a] text-[#184d8a] "
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        style={{ height: "100dvh" }}
        className={`
          bg-[#184d8a] text-white flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden shrink-0
          ${isHidden
            ? "hidden"
            : isMobile && isOpen
              ? "fixed top-0 left-0 z-50 w-72"
              : isCollapsed
                ? "sticky top-0 w-16"   // ← modo ícones
                : "sticky top-0 w-64"   // ← modo aberto
          }
        `}
      >
        {/* Header do sidebar */}
        <div className="px-3 pt-4 mb-8 flex items-center justify-between shrink-0">
          {/* Logo e nome só no modo aberto */}
          {isOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <img loading="lazy" src={logo555} alt="Logo" className="w-10 h-10 shrink-0" />
              <p className="text-white font-semibold whitespace-nowrap">ClassCash</p>
            </div>
          )}

          {/* Botão toggle */}
          <button
            onClick={isOpen ? collapseOrClose : openMenu}
            className={`p-1 rounded hover:bg-white/10 transition ml-auto`}
          >
            {isMobile && isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col gap-1 px-2">
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={label} to={to}>
              <div
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  transition-colors duration-300
                  ${window.location.pathname === to ? "bg-white/20" : "hover:bg-white/10"}
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={22} className="text-white shrink-0" />
                {/* Label só no modo aberto */}
                {isOpen && (
                  <span className="text-white font-medium text-sm whitespace-nowrap">
                    {label}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="shrink-0 px-2 py-4 border-t border-white/10">
          <Link
            to="/Login"
            onClick={handleLogout}
            className={`
              flex items-center p-3 rounded-lg bg-blue-500/50
              hover:bg-blue-400 transition-all duration-300 group
              ${isCollapsed ? "justify-center" : "justify-between"}
            `}
            title={isCollapsed ? "Terminar sessão" : undefined}
          >
            {isOpen && (
              <span className="text-sm font-medium text-white group-hover:text-blue-700">
                Terminar sessão
              </span>
            )}
            <LogOut size={22} className="text-white group-hover:text-blue-700" />
          </Link>
        </div>
      </aside>
    </>
  );
}