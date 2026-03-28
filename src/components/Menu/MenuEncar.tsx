import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Receipt,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo555 from "../../assets/logo5.5.png";
import { useState, useEffect } from "react";

export default function MenuEncar() {
  const [menu, setMenu] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const saved = localStorage.getItem("menu_aberto");
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
        const saved = localStorage.getItem("menu_aberto");
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
    localStorage.setItem("menu_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  }

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
      className={`flex items-center gap-3 p-3 mt-2 rounded-lg cursor-pointer transition-all duration-300 ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && menu && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={CloseMenu} />
      )}

      {/* Botão hambúrguer — quando fechado */}
      {!menu && (
        <button
          onClick={OpenMenu}
          className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[#184d8a] text-white shadow-lg"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-[#184d8a] text-white
          transition-all duration-300 ease-in-out
          ${
            !menu
              ? "hidden"
              : isMobile
                ? "flex flex-col fixed top-0 left-0 h-screen w-72 z-50"
                : "flex flex-col sticky top-0 h-screen w-[220px] shrink-0"
          }
        `}
        style={{ height: "100dvh" }}
      >
        {/* Header */}
        <div className="mb-10 pt-4 flex justify-between items-center px-4 shrink-0">
          <div className="flex items-center font-semibold">
            <img
              loading="lazy"
              src={logo555}
              alt="Logo"
              className="w-14 h-14"
            />
            <p className="text-white font-semibold">ClassCash</p>
          </div>
          <button
            onClick={CloseMenu}
            className="p-1 rounded hover:bg-white/10 transition"
          >
            {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 transition-all duration-500 text-white max-h-screen custom_scroll">
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

          <Link to="/DashboardEstud" state={{ fromEncarregado: true }}>
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

        {/* Logout */}
        <div className="shrink-0">
          <Link
            to="/Login"
            className="hover:bg-blue-400 px-4 rounded-sm border border-white/10 bg-blue-500/50 transition-all duration-700 p-3 group block"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white group-hover:text-blue-700">
                Terminar sessão
              </span>
              <LogOut
                size={22}
                className="text-white font-medium group-hover:text-blue-700"
              />
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
