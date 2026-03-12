import MenuAdmin from "@/components/Menu/MenuAdmin";
import { Bell, CircleUser, Menu, Search, type LucideIcon } from "lucide-react";
import { useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
export default function Administaradores() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  return (
    <div className="flex bg-gray-50 font-sans  transition-all duration-500">
      {/* Sidebar */}

      <MenuAdmin />
      {/* Conteúdo Principal */}
      <div className=" flex-col flex-1">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 mb-5 bg-translucido">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold  text-[#268cff]">Painel Geral</h1>
          </div>
          {/* Header (Topo) */}
          <header className=" ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
              {/* Campo de Pesquisa */}
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none transition-all"
                />
              </div>

              {/* Ícones de Notificação e Perfil */}
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
            </div>
          </header>
        </div>
        {/* Renderiza o conteúdo da página ativa */}
        {}
        <DashboardAdmin />
      </div>
    </div>
  );
}
