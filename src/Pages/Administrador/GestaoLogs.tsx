import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecret from "@/components/Menu/MenuAdmin";
import { ChevronDown, Clock } from "lucide-react";
import { useEffect, useState } from "react";
export default function GestaoLogs() {
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }

  /*   const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  } */

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

  // --- CONTEÚDO DA PÁGINA: LOGS DO SISTEMA ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <MenuSecret />
      <main className="p-6  flex flex-1 flex-col">
        <div className="mb-5">
          {/* <Header
            titulo="Gestão de Logs"
            usuario={<Avatar name={user.nome} src={user.foto} size="md"/>}
          /> */}
        </div>
        {/* Filtros Simples (Data e Nível) */}
        <div className="flex space-x-4 mb-6">
          <div className="relative">
            <label className="sr-only">Filtrar por Nível</label>
            <select
              className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-[#184d8a] focus:border-[#184d8a]"
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
              className="block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-3 text-sm focus:outline-none focus:ring-[#184d8a] focus:border-[#184d8a] text-gray-700"
            />
          </div>
        </div>

        {/* Tabela de Logs */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-[#184d8a]/70 ">
              <tr>
                {["Data/Hora", "Nível", "Utilizador", "Ação", "Detalhes"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-center text-sm font-bold text-white  tracking-widest cursor-default"
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
