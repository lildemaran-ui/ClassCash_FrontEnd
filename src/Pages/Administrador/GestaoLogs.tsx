import {
  Bell,
  ChevronDown,
  CircleUser,
  Clock,
  FileText,
  InfoIcon,
  KeyIcon,
  LayoutDashboard,
  Menu,
  School,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo5 from "../../assets/Logo5.5.png";
export default function GestaoLogs() {
  // Função auxiliar para determinar a cor do tag de nível de log
  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return "bg-blue-100 text-blue-800";
      case "AVISO":
        return "bg-yellow-100 text-yellow-800";
      case "ERRO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // --- DADOS MOCK (Simulação de Dados para Logs) ---

  interface LogEntry {
    id: number;
    timestamp: string;
    level: "INFO" | "AVISO" | "ERRO";
    user: string;
    action: string;
    details: string;
  }

  const mockLogs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-11-28 14:30:00",
      level: "INFO",
      user: "Paula Garra (Admin)",
      action: "Criação de Conta",
      details: "Instituição 'Novo Horizonte' adicionada com sucesso.",
    },
    {
      id: 2,
      timestamp: "2024-11-28 14:05:22",
      level: "AVISO",
      user: "Sistema",
      action: "Falha de Login",
      details:
        "Tentativa falhada de login para 'joao.viana@email.com' (IP: 192.168.1.1).",
    },
    {
      id: 3,
      timestamp: "2024-11-27 09:15:45",
      level: "ERRO",
      user: "Sistema",
      action: "Processamento de Pagamento",
      details:
        "Falha ao processar pagamento KZ 50,000 para 'Colégio Caracol'. Código de erro: P_004.",
    },
    {
      id: 4,
      timestamp: "2024-11-26 18:50:10",
      level: "INFO",
      user: "Pedro Tomás (Admin)",
      action: "Atualização de Status",
      details: "Status de 'Filomena Silva' alterado para 'Bloqueado'.",
    },
    {
      id: 5,
      timestamp: "2024-11-25 10:00:00",
      level: "INFO",
      user: "Sistema",
      action: "Backup Diário",
      details: "Backup da base de dados concluído com sucesso.",
    },
    {
      id: 6,
      timestamp: "2024-11-24 16:20:05",
      level: "AVISO",
      user: "Marta Correia (Admin)",
      action: "Modificação de Dados",
      details:
        "Email da Instituição 'Kibangas' alterado para 'impc.novo@gmail.com'.",
    },
  ];

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

  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }

  // --- CONTEÚDO DA PÁGINA: LOGS DO SISTEMA ---
  return (
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
                active={false}
              />
            </Link>

            <div className="flex flex-col gap-1 text-white">
              <Link to="/GestaoDeInstituicao">
                <SidebarItem
                  icon={School}
                  label="Gestão de Instituições"
                  active={false}
                />
              </Link>
              <Link to="/GestaoDeUsuarios">
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
                  active={true}
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
                  active={false}
                />
              </Link>
            </div>
          </nav>
        </aside>
      )}
      <main className="p-6  flex flex-1 flex-col">
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
              Gestão de Logs
            </h1>
          </div>
          {/* Header (Topo) */}
          <header className="  ">
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

        {/* Filtros Simples (Data e Nível) */}
        <div className="flex space-x-4 mb-6">
          <div className="relative">
            <label className="sr-only">Filtrar por Nível</label>
            <select
              className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue="Todos os Níveis"
            >
              <option>Todos os Níveis</option>
              <option>INFO</option>
              <option>AVISO</option>
              <option>ERRO</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <label className="sr-only">Filtrar por Data</label>
            <input
              type="date"
              className="block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* Tabela de Logs */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Data/Hora", "Nível", "Utilizador", "Ação", "Detalhes"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getLevelColor(log.level)}`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
