// src/Pages/Administrador/GestaoLogs.tsx
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import { ChevronDown, Clock, Loader2, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

interface LogEntry {
  datahora: string;
  nivel: "INFO" | "AVISO" | "ERRO";
  usuario: string;
  acao: string;
  detalhe: string;
}

const getLevelColor = (level: LogEntry["nivel"]) => {
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

export default function GestaoLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroNivel, setFiltroNivel] = useState("Todos os Níveis");
  const [filtroData, setFiltroData] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/logsAtividades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar logs");
      const data: LogEntry[] = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user, fetchLogs]);

  if (!user) return null;

  // Filtragem client-side
  const filtered = logs.filter((log) => {
    const nivelOk =
      filtroNivel === "Todos os Níveis" || log.nivel === filtroNivel;
    const dataOk =
      !filtroData ||
      new Date(log.datahora).toLocaleDateString("pt-AO") ===
        new Date(filtroData).toLocaleDateString("pt-AO");
    const searchOk =
      !search ||
      log.usuario.toLowerCase().includes(search.toLowerCase()) ||
      log.acao.toLowerCase().includes(search.toLowerCase()) ||
      log.detalhe.toLowerCase().includes(search.toLowerCase());
    return nivelOk && dataOk && searchOk;
  });

  // Card para mobile
  const LogCard = ({ log }: { log: LogEntry }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getLevelColor(log.nivel)}`}
        >
          {log.nivel}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(log.datahora).toLocaleString("pt-AO", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900">{log.acao}</p>
        <p className="text-xs text-gray-500 mt-0.5">{log.usuario}</p>
      </div>
      <p className="text-xs text-gray-400 line-clamp-2">{log.detalhe}</p>
    </div>
  );

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          titulo="Logs de Atividade"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Filtros */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Pesquisa */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por utilizador, ação ou detalhe..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a]"
                />
              </div>

              <div className="flex gap-2 sm:gap-3">
                {/* Filtro nível */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    className="appearance-none block w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-[#184d8a] focus:border-[#184d8a]"
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                  >
                    <option>Todos os Níveis</option>
                    <option>INFO</option>
                    <option>AVISO</option>
                    <option>ERRO</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Filtro data */}
                <input
                  type="date"
                  className="block bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-[#184d8a] focus:border-[#184d8a] text-gray-700"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                />

                {/* Refresh */}
                <button
                  onClick={fetchLogs}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#184d8a] hover:border-[#184d8a] transition-colors shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contagem */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {filtered.length} registo{filtered.length !== 1 ? "s" : ""}{" "}
                encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
              {(filtroNivel !== "Todos os Níveis" || filtroData || search) && (
                <button
                  onClick={() => {
                    setFiltroNivel("Todos os Níveis");
                    setFiltroData("");
                    setSearch("");
                  }}
                  className="text-xs text-[#184d8a] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#184d8a]" />
            </div>
          ) : (
            <>
              {/* Tabela desktop */}
              <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200 text-center">
                  <thead className="bg-primary/70">
                    <tr>
                      {[
                        "Data/Hora",
                        "Nível",
                        "Utilizador",
                        "Ação",
                        "Detalhes",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-bold text-white tracking-widest"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-gray-400 text-sm">
                          Nenhum log encontrado.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((log, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center justify-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400 shrink-0" />
                              {new Date(log.datahora).toLocaleString("pt-AO", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm">
                            <span
                              className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getLevelColor(log.nivel)}`}
                            >
                              {log.nivel}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {log.usuario}
                          </td>
                          <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {log.acao}
                          </td>
                          <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-500 max-w-xs truncate text-left">
                            {log.detalhe}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards mobile */}
              <div className="sm:hidden space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhum log encontrado.
                  </div>
                ) : (
                  filtered.map((log, i) => <LogCard key={i} log={log} />)
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
