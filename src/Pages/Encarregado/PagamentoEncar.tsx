import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Menu,
  Bell,
  LogOut,
  type LucideIcon,
  Receipt,
  Users,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import Avatar from "@/components/Avatar/Avatar";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";
import MenuEncar from "@/components/Menu/MenuEncar";

export default function PagamentoEncar() {
  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  const OpenMenu = () => {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  };
  const CloseMenu = () => {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  };

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return <span>Carregado...</span>;

  return (
    <div className="flex overflow-hidden custom_scroll h-screen bg-gray-50 font-sans transition-all duration-500">
      {/* Sidebar */}
     <MenuEncar />
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 bg-translucido">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={22}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h1 className="text-xl font-bold text-[#268cff]">Pagamentos </h1>

          {/* Header */}
          <header className="flex justify-between ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
              {/* Campo de Pesquisa */}

              {/* Ícones de Notificação e Perfil */}
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <Avatar name={user.nome} src={user.foto} size="md" />
            </div>
          </header>
        </div>
        <div className="">
          <PagamentoGeral />
        </div>
      </div>
    </div>
  );
}
