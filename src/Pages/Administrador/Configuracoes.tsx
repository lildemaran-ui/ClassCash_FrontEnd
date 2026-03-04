// --- CONTEÚDO DA PÁGINA: CONFIGURAÇÕES ---

import {
  AlertCircle,
  BellRing,
  ChevronDown,
  Lock,
  User,
  Bell,
  Menu,
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Receipt,
  MessageSquare,
  AlertOctagon,
  FileText,
  KeyIcon,
  ScrollText,
  InfoIcon,
  School,
  CircleUser,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import Logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";

export default function Configuracoes() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }
  const [activeSetting, setActiveSetting] = useState("Geral");

  const settingItems = [
    { key: "Geral", label: "Geral", icon: <Settings className="w-5 h-5" /> },
    {
      key: "Perfil",
      label: "Perfil e Acesso",
      icon: <User className="w-5 h-5" />,
    },
    {
      key: "Segurança",
      label: "Segurança",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      key: "Notificações",
      label: "Notificações",
      icon: <BellRing className="w-5 h-5" />,
    },
  ];

  const renderSettingContent = () => {
    switch (activeSetting) {
      case "Geral":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">
              Configurações Gerais do Sistema
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma do Sistema
              </label>
              <div className="relative w-full md:w-1/2">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Português (Angola)"
                >
                  <option>Português (Angola)</option>
                  <option>Inglês (EUA)</option>
                  <option>Português (Portugal)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuso Horário
              </label>
              <div className="relative w-full md:w-1/2">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="Africa/Luanda (UTC+1)"
                >
                  <option>Africa/Luanda (UTC+1)</option>
                  <option>Europe/Lisbon (UTC)</option>
                  <option>UTC (Coordinated Universal Time)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
              </div>
            </div>

            <div className="flex justify-start">
              <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Guardar Alterações
              </button>
            </div>
          </div>
        );
      case "Perfil":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">
              Gerir Perfil de Administrador
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  defaultValue="Nome do Administrador"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email de Contacto
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue="admin.classcash@email.com"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  defaultValue="+244 923 999 999"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Função
                </label>
                <input
                  type="text"
                  id="role"
                  defaultValue="Super Administrador"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Atualizar Perfil
              </button>
            </div>
          </div>
        );
      case "Segurança":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">
              Segurança da Conta
            </h3>

            <div className="p-4 rounded-lg border border-gray-200 bg-red-50">
              <p className="font-medium text-red-700 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Alterar Palavra-Passe
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="password"
                  placeholder="Palavra-passe Atual"
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="Nova Palavra-passe"
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirmar Nova Palavra-passe"
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div className="mt-4">
                <button className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-md">
                  Alterar Palavra-passe
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-green-50">
              <p className="font-medium text-green-700 mb-2">
                Autenticação de Dois Fatores (2FA)
              </p>
              <p className="text-sm text-gray-600">
                A autenticação de dois fatores está atualmente **Ativa**.
              </p>
              <div className="mt-3">
                <button className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                  Desativar 2FA
                </button>
              </div>
            </div>
          </div>
        );
      case "Notificações":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">
              Preferências de Notificação
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-700">
                    Alertas de Transações
                  </p>
                  <p className="text-sm text-gray-500">
                    Receber notificações quando novos pagamentos são
                    processados.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-700">
                    Alertas de Segurança
                  </p>
                  <p className="text-sm text-gray-500">
                    Notificações sobre logins em novos dispositivos ou
                    tentativas falhadas.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-700">
                    E-mails de Marketing
                  </p>
                  <p className="text-sm text-gray-500">
                    Receber notícias e ofertas promocionais (Mock).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Guardar Preferências
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // Componente SidebarItem atualizado com as novas medidas
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500  ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );

  return (
    <main className="">
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        {menu && (
          <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
            <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
              <div className=" flex items-center">
                <img
                  loading="lazy"
                  src={Logo5}
                  alt="Logo"
                  className="w-16 h-16 "
                />
                <p className="text-white font-semibold">ClassCash</p>
              </div>
              <button>
                <Menu size={22} className="text-white" onClick={CloseMenu} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 transition-all duration-500 text-white max-h-screen custom_scroll">
              <Link to="/Administradores">
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Painel Geral"
                  active={window.location.pathname === "/Administradores"}
                />
              </Link>

              <div className="flex flex-col gap-1 text-white">
                
               
                <Link to="/GestaoDeInstituicao">
                  <SidebarItem
                    icon={School}
                    label="Gestão de Instituições"
                    active={window.location.pathname === "/GestaoDeInstituicao"}
                  />
                </Link>
                <Link to="">
                  <SidebarItem
                    icon={Users}
                    label="Gestão de Usuarios"
                    active={false}
                  />
                </Link>
              

                <Link to="">
                  <SidebarItem
                    icon={Settings}
                    label="Gestão de Serviços"
                    active={false}
                  />
                </Link>
                
                <Link to="">
                  <SidebarItem
                    icon={FileText}
                    label="Gestão de Relatórios"
                    active={false}
                  />
                </Link>
                <Link to="">
                  <SidebarItem
                    icon={KeyIcon}
                    label="Permissões e Acessos"
                    active={false}
                  />
                </Link>
                <Link to="/GestaoLogs">
                  <SidebarItem
                    icon={ScrollText}
                    label="Logs de Atividades"
                    active={window.location.pathname === "/GestaoLogs"}
                  />
                </Link>
                <Link to="">
                  <SidebarItem
                    icon={InfoIcon}
                    label="Suporte e Ajuda"
                    active={false}
                  />
                </Link>
                <Link to="/Configuracoes">
                  <SidebarItem
                    icon={Settings}
                    label="Configurações"
                    active={window.location.pathname === "/Configuracoes"}
                  />
                </Link>
              </div>
            </nav>
          </aside>
        )}
        <div className="flex flex-1 flex-col ">
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
              <h1 className="text-xl font-bold  text-[#268cff]">
                Gestão de Usuários
              </h1>
            </div>
            {/* Header (Topo) */}
            <header className=" ">
              <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
              <div className="flex items-center space-x-4">
                {/* Ícones de Notificação e Perfil */}
                <div className="relative cursor-pointer">
                  <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                  <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
                </div>
                <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
              </div>
            </header>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col lg:flex-row min-h-[70vh] m-8">
            {/* Menu Lateral de Configurações */}
            <aside className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 border-gray-200 lg:pr-6 pb-4 lg:pb-0 mb-4 lg:mb-0 flex lg:block space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto">
              {settingItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSetting(item.key)}
                  className={`flex items-center w-full p-3 rounded-lg text-sm font-medium transition-colors duration-150 flex-shrink-0 ${
                    activeSetting === item.key
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                  {item.label}
                </button>
              ))}
            </aside>

            {/* Conteúdo da Configuração Ativa */}
            <section className="flex-1 lg:pl-6 pt-4 lg:pt-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeSetting}
              </h2>
              <div className="pb-8">{renderSettingContent()}</div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
