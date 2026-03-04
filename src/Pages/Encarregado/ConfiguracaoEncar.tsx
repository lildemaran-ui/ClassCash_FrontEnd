
import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  Settings,
  X,
  
} from "lucide-react";
import Avatar from "@/components/Avatar/Avatar";
import ConfiguracaoGeral from "@/components/Configuracoes/ConfiguracaoGeral";
import MenuEncar from "@/components/Menu/MenuEncar";
export default function ConfiguracaoEncar() {
  const [Modal, setModal] = useState(false);

  function ShowModal() {
    setModal(true);
  }

  function CloseModal() {
    setModal(false);
  }
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
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }
  
  return (
    <div className="flex overflow-hidden h-screen bg-[#f8fafc] font-sans transition-all duration-500">
      {/* Sidebar */}
      <MenuEncar/>
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
                <button
                  onClick={CloseModal}
                  className="text-[#268cff] cursor-pointer"
                >
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

      {/* Main Content */}
      <main className="flex-1   custom_scroll text-gray-700">
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
          <h1 className="text-xl font-bold text-[#268cff]">Configurações </h1>

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
        <div>
          <ConfiguracaoGeral />
        </div>
      </main>
    </div>
  );
}
