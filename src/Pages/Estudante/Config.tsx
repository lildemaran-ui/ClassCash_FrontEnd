import React from "react";
import {
  Wallet,
  MessageSquare,
  Settings,
  ChevronRight,
  Menu,
  LifeBuoy,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Componente para os itens de lista das configurações
const SettingItem = ({ label }: { label: string }) => (
  <div className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b last:border-b-0 border-gray-100">
    <span className="text-gray-700 font-medium text-base">{label}</span>
    <ChevronRight size={18} className="text-gray-500" />
  </div>
);

// Sub-componentes auxiliares
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
    className={`flex items-center gap-3 mt-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
      active ? "bg-white/10" : "hover:bg-white/5"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default function ConfigurationScreen() {
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
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex flex-col ">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <Link to="/DashboardEstud">
              <div className="flex items-center font-semibold">
                <img src={logo5} alt="Logo" className="w-16 h-16" />
                <span>ClassCash</span>
              </div>
            </Link>
            <button onClick={CloseMenu}>
              <Menu size={28} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2  ">
            <Link to="/DashboardEstud">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Painel"
              active={false}
            />

            </Link>
            <Link to="/Pagamentos" className=" block w-full">
              <NavItem
                icon={<Wallet size={20} />}
                label="Pagamentos"
                active={false}
              />
            </Link>
            <Link to="/reclamacoes">
              <NavItem
                icon={<MessageSquare size={20} />}
                label="Reclamações"
                active={false}
              />
            </Link>
            <Link to="/Config">
              <NavItem
                icon={<Settings size={20} />}
                label="Configurações"
                active={true}
              />
            </Link>
            <NavItem
              icon={<LifeBuoy size={20} />}
              label="Suporte"
              active={false}
            />
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8  overflow-y-auto text-gray-700">
          {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={28} className="text-[#268cff]" />
          </button>
        )}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={24} className="text-[#268cff]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f0f5fa]"></div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm bg-center bg-cover">
              {user.foto && (
                <img
                  src={user.foto}
                  alt="Estudante"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </header>
      
        <div className="max-w-3xl mx-auto space-y-10 mt-20">
          {/* Grupo: Perfil e Preferências */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Editar perfil" />
              <SettingItem label="Preferências de cor" />
              <SettingItem label="Notificações" />
            </div>
          </section>

          {/* Grupo: Configurações de Pagamento */}
          <section>
            <h2 className=" font-bold text-xl mb-4">
              Configurações de Pagamento
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Métodos de pagamentos salvos" />
              <SettingItem label="Definir método padrão" />
              <SettingItem label="Ver histórico de transações automáticas" />
            </div>
          </section>

          {/* Grupo: Segurança */}
          <section>
            <h2 className=" font-bold text-xl mb-4">Segurança</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Alterar Senha" />
              <SettingItem label="Ver dispositivos conectados" />
            </div>
          </section>
        </div>

        {/* Footer Copyright Simples */}
        <footer className="mt-20 text-center">
          <p className="text-[10px] text-gray-400">
            © 2025 ClassCash, S.A. - Todos os direitos reservados
          </p>
        </footer>
      </main>
    </div>
  );
}
