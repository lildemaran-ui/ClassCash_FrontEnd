import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Settings,
  LifeBuoy,
  Menu,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import Avatar from "@/components/Avatar/Avatar";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";

export default function Pagamentos() {
  const [Modal, setModal] = useState(false);

  function ShowModal() {
    setModal(true);
  }

  function CloseModal() {
    setModal(false);
  }
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
    <div className="flex overflow-hidden custom_scroll h-screen bg-gray-50 font-sans transition-all duration-500">
      {/* Sidebar */}
      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex-col flex">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <Link
              to="/DashboardEstud"
              className="flex items-center font-semibold"
            >
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-16 h-16"
              />
              <span>ClassCash</span>
            </Link>
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
      )}
      {/* Modal de edição de perfil */}
      {Modal && (
        <div className="  bg-translucido2 fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold ">Editar Perfil</h1>
                <p className="text-xs text-gray-400">
                  Edite suas informações a baixo
                </p>
              </div>
              <div>
                <button onClick={CloseModal} className="text-[#268cff]">
                  <X size={22} />
                </button>
              </div>
            </div>
            <form className="space-y-4">
              <div className="w-48 h-48 rounded-full flex justify-center items-center mx-auto overflow-hidden border border-gray-400 shadow-sm group  ">
                {user.foto ? (
                  <img
                    loading="lazy"
                    src={user.foto}
                    alt={user.nome}
                    className="w-full h-full object-cover"
                    // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                    // você pode opcionalmente adicionar um onError aqui.
                  />
                ) : (
                  // Fallback: Iniciais do nome
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                    {(user.nome || "User")
                      .trim()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                  value={user.nome || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                  value={user?.email || ""}
                />
              </div>
              <div className="flex justify-between gap-3">
                <div className="w-24">
                  <label className="block text-sm mb-1">Classe</label>
                  <select
                    required
                    value={user?.classe || ""}
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                  >
                    <option value="" disabled>
                      Grau
                    </option>
                    <option value="7ª">7ª</option>
                    <option value="8ª">8ª</option>
                    <option value="9ª">9ª</option>
                    <option value="10ª">10ª</option>
                    <option value="11ª">11ª</option>
                    <option value="12ª">12ª</option>
                  </select>
                </div>
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Nº de Processo
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user?.processo || ""}
                  />
                </div>
              </div>
              <div className="text-right">
                <div
                  className="flex justify-end gap-2
                  mt-20"
                >
                  <div className="">
                    <button
                      type="button"
                      className="bg-white text-[#268cff] px-4 py-2 rounded-md border border-[#268cff] hover:bg-gray-100/50 transition-colors duration-500"
                      onClick={CloseModal}
                    >
                      Cancelar
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-500"
                      onClick={CloseModal}
                    >
                      Concluído
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 ">
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
              <button
                onClick={ShowModal}
                className="text-[#268cff] text-[16px] font-medium flex  gap-2 ml-auto transition-all duration-500"
              >
                <Settings size={24} />
              </button>

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
