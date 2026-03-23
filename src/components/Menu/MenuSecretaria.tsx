import {
  AlertOctagon, CreditCard, FileText, LayoutDashboard,
  LogOut, Menu, MessageSquare, Receipt, Settings, Users, X,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo5 from "../../assets/Logo5.5.png";
import { useState, useEffect } from "react";

export default function MenuSecretaria() {
  const [menu, setMenu] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      const saved = localStorage.getItem("menu_secretaria_aberto");
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
        const saved = localStorage.getItem("menu_secretaria_aberto");
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
    localStorage.setItem("menu_secretaria_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_secretaria_aberto", "false");
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
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
      active ? "bg-white/20" : "hover:bg-white/10"
    }`}>
      <Icon size={22} className="text-white shrink-0" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );

  const links = [
    { to: "/Secretaria", icon: LayoutDashboard, label: "Painel Geral" },
    { to: "/GestaoAlunos", icon: Users, label: "Gestão de Estudantes" },
    { to: "/GestaodeEncarregados", icon: Users, label: "Gestão de Encarregados" },
    { to: "/SolicitacoesCadastro", icon: Users, label: "Solicitações de Cadastro" },
    { to: "/GestaoPropinas", icon: CreditCard, label: "Gestão de Propinas" },
    { to: "/GestaoPagamentos", icon: Receipt, label: "Gestão de Pagamentos" },
    { to: "/GestaodeServiços", icon: Settings, label: "Gestão de Serviços" },
    { to: "/GestaodeReclamacoes", icon: MessageSquare, label: "Gestão de Reclamações" },
    { to: "/ModulodeMulta", icon: AlertOctagon, label: "Gestão de Multas" },
    { to: "/Relatorio", icon: FileText, label: "Centro de Relatório" },
    { to: "/Configuracao", icon: Settings, label: "Configurações" },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && menu && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={CloseMenu} />
      )}

      {/* Botão hambúrguer */}
      {!menu && (
        <button
          onClick={OpenMenu}
          className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[#268cff] text-white shadow-lg"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        style={{ height: '100dvh' }}
        className={`
          bg-[#268cff] text-white
          transition-all duration-300 ease-in-out
          ${!menu
            ? "hidden"
            : isMobile
              ? "flex flex-col fixed top-0 left-0 w-72 z-50"
              : "flex flex-col sticky top-0 w-64 shrink-0"
          }
        `}
      >
        {/* Header */}
        <div className="px-4 pt-4 mb-8 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <img loading="lazy" src={Logo5} alt="Logo" className="w-14 h-14" />
            <p className="text-white font-semibold">ClassCash</p>
          </div>
          <button onClick={CloseMenu} className="p-1 rounded hover:bg-white/10 transition">
            {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col gap-1 px-3">
          {links.map(({ to, icon, label }) => (
            <Link key={label} to={to}>
              <SidebarItem
                icon={icon}
                label={label}
                active={window.location.pathname === to}
              />
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="shrink-0 px-3 py-4 border-t border-white/10">
          <Link
            to="/Login"
            className="flex justify-between items-center p-3 rounded-lg bg-blue-500/50 hover:bg-blue-400 transition-all duration-300 group"
          >
            <span className="text-sm font-medium text-white group-hover:text-blue-700">
              Terminar sessão
            </span>
            <LogOut size={22} className="text-white group-hover:text-blue-700" />
          </Link>
        </div>
      </aside>
    </>
  );
}