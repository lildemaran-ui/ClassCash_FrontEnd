import {
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo5 from "../../assets/Logo5.5.png";
import { useState, useEffect } from "react";

export default function MenuEstud() {
  const [menu, setMenu] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const saved = localStorage.getItem("menu_aberto");
      return saved !== "false";
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        const saved = localStorage.getItem("menu_aberto");
        if (saved !== "false") setMenu(true);
      } else {
        setMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  }

  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  }

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
    < >
      {/* Overlay mobile */}
      {isMobile && menu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 "
          onClick={CloseMenu}
        />
      )}

      {/* Botão hambúrguer flutuante — só aparece quando sidebar está fechada */}
      {!menu && (
        <button
          onClick={OpenMenu}
          className={`z-50 p-2 rounded-lg bg-[#268cff] text-white shadow-lg fixed top-4 left-4 `}
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar — visibilidade controlada por hidden/flex, não por transform */}
      <aside
        className={`
           bg-[#268cff] text-white
          transition-all duration-300 ease-in-out
          ${!menu ? "hidden" : isMobile ? " flex flex-col fixed top-0 left-0 h-full z-50 w-72" : "flex flex-col sticky top-0 h-screen w-[220px] shrink-0"}
        `}
      >
        {/* Header */}
        <div className="mb-10 pt-4 flex justify-between items-center px-4 shrink-0">
          <div className="flex items-center font-semibold">
            <img
              loading="lazy"
              src={logo5}
              alt="Logo"
              className="w-14 h-14 lg:w-16 lg:h-16"
            />
            <span className="text-lg">ClassCash</span>
          </div>
          <button
            onClick={CloseMenu}
            className="p-1 rounded hover:bg-white/10 transition"
          >
            {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
          <Link to="/DashboardEstud">
            <NavItem
              icon={<LayoutDashboard size={22} />}
              label="Painel"
              active={window.location.pathname === "/DashboardEstud"}
            />
          </Link>
          <Link to="/Pagamentos" className="block w-full">
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
          <NavItem icon={<LifeBuoy size={22} />} label="Suporte" active={false} />
        </nav>

        {/* Logout */}
       <div className="shrink-0 mt-auto">
         <Link
          to="/Login"
          className="hover:bg-blue-400  rounded-sm transition-all duration-700 group"
        >
          <div className="flex justify-between items-center border-white/10 bg-blue-500/50 rounded-lg p-2">
            <span className="text-sm font-medium text-white group-hover:text-blue-700">
              Terminar sessão
            </span>
            <LogOut size={22} className="text-white font-medium group-hover:text-blue-700" />
          </div>
        </Link>
       </div>
      </aside>
    </>
  );
}