import Avatar from "@/components/Avatar/Avatar";
import HelpButton from "@/components/Botoes/helpbutton";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  EyeIcon,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface PropinaRow {
  codigo: string;
  idpagamento: number;
  nome_estudante: string;
  classe: number | null;
  data: string | null;
  servico: string;
  valor: string;
  multa_real: string; // ← gravada no pagamento
  multa_estimada: string; // ← calculada em tempo real
  meses_referencia?: string | null;
  status: string;
}

interface Cards {
  total_pagas: string;
  total_pendentes: string;
  total_atrasadas: string;
}

const formatarData = (data: string | null) => {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CardKpi = ({
  title,
  value,
  subtext,
  trend,
  color,
}: {
  title: string;
  value: string;
  subtext: string;
  trend?: "up" | "down";
  color: "green" | "orange" | "red";
}) => (
  <div className="p-5 rounded-2xl flex flex-col items-center text-center border transition-all duration-300 hover:shadow-md">
    <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">{value}</span>
      {trend === "up" && <TrendingUp size={18} className="text-green-500" />}
      {trend === "down" && <TrendingDown size={18} className="text-red-500" />}
    </div>
    <p className="text-xs text-gray-400 mt-1">{subtext}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { text: string; icon: React.ReactNode }> = {
    Paga: { text: "text-green-700", icon: <CheckCircle size={12} /> },
    Pendente: { text: "text-orange-700", icon: <Clock size={12} /> },
    Atrasada: { text: "text-red-700", icon: <AlertTriangle size={12} /> },
  };
  const s = map[status] ?? { text: "text-gray-600", icon: null };
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${s.text}`}
    >
      {s.icon} {status}
    </span>
  );
};

// ─── Modal de Detalhes ─────────────────────────────────────────
const ModalDetalhes = ({
  row,
  onClose,
}: {
  row: PropinaRow;
  onClose: () => void;
}) => {
  // Usa multa_real se foi efectivamente cobrada, senão mostra a estimada
  const multaExibida =
    Number(row.multa_real) > 0
      ? Number(row.multa_real)
      : Number(row.multa_estimada);
  const labelMulta =
    Number(row.multa_real) > 0 ? "Multa cobrada" : "Multa estimada";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-lg">
              {row.nome_estudante}
            </h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Propina #{row.codigo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`px-6 py-3 border-b ${
            row.status === "Paga"
              ? "bg-green-50"
              : row.status === "Pendente"
                ? "bg-orange-50"
                : "bg-red-50"
          }`}
        >
          <StatusBadge status={row.status} />
        </div>

        {/* Detalhes */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <User size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Estudante
                </span>
              </div>
              <p className="font-bold text-gray-700 text-sm">
                {row.nome_estudante}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Classe
                </span>
              </div>
              <p className="font-bold text-gray-700 text-sm">
                {row.classe ? `${row.classe}ª Classe` : "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Data
                </span>
              </div>
              <p className="font-bold text-gray-700 text-sm">
                {formatarData(row.data)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Serviço
                </span>
              </div>
              <p className="font-bold text-gray-700 text-sm">{row.servico}</p>
            </div>
          </div>

          {/* Meses de referência */}
          {row.meses_referencia && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Meses Pagos
                </span>
              </div>
              <p className="font-bold text-gray-700 text-sm">
                {row.meses_referencia}
              </p>
            </div>
          )}

          {/* Valores */}
          <div className="bg-primary/5 rounded-2xl p-5 space-y-3 border border-[#184d8a]/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign size={15} className="text-[#184d8a]" />
                <span className="text-sm font-semibold text-gray-600">
                  Valor da Propina
                </span>
              </div>
              <span className="font-bold text-gray-800 text-lg">
                {Number(row.valor).toLocaleString("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                })}
              </span>
            </div>

            {multaExibida > 0 && (
              <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-500">
                    {labelMulta}
                  </span>
                </div>
                <span className="font-bold text-red-600 text-lg">
                  {multaExibida.toLocaleString("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
              <span className="text-sm font-bold text-gray-600">Total</span>
              <span className="font-bold text-[#184d8a] text-xl">
                {(Number(row.valor) + multaExibida).toLocaleString("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Página Principal ──────────────────────────────────────────
export default function GestaoPropinas() {
  const [tabela, setTabela] = useState<PropinaRow[]>([]);
  const [cards, setCards] = useState<Cards>({
    total_pagas: "0",
    total_pendentes: "0",
    total_atrasadas: "0",
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [ordemCrescente, setOrdem] = useState(true);
  const [selectedRow, setSelectedRow] = useState<PropinaRow | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroClasse, setFiltroClasse] = useState("");

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const res = await fetchComAuth(`${API}/gestaoPropinas`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Erro ao carregar propinas");
        const data = await res.json();
        setCards(data.cards ?? cards);
        setTabela(data.tabela ?? []);
      } catch {
        toast.error("Erro ao carregar propinas");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#184d8a]">
          <div className="w-5 h-5 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">A verificar autenticação...</span>
        </div>
      </div>
    );

  const handleSort = () => {
    setTabela(
      [...tabela].sort((a, b) =>
        ordemCrescente
          ? a.nome_estudante.localeCompare(b.nome_estudante)
          : b.nome_estudante.localeCompare(a.nome_estudante),
      ),
    );
    setOrdem(!ordemCrescente);
  };

  const tabelaFiltrada = tabela.filter((row) => {
    const matchStatus = !filtroStatus || row.status === filtroStatus;
    const matchClasse = !filtroClasse || String(row.classe) === filtroClasse;
    return matchStatus && matchClasse;
  });

  const classes = [
    ...new Set(tabela.map((r) => r.classe).filter(Boolean)),
  ].sort();

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Gestão de Propinas"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <CardKpi
              title="Propinas Pagas"
              value={loading ? "—" : cards.total_pagas}
              subtext="no último mês"
              trend="up"
              color="green"
            />
            <CardKpi
              title="Propinas Pendentes"
              value={loading ? "—" : cards.total_pendentes}
              subtext="no último mês"
              color="orange"
            />
            <CardKpi
              title="Propinas em Atraso"
              value={loading ? "—" : cards.total_atrasadas}
              subtext="no último mês"
              trend="down"
              color="red"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex flex-col gap-1 min-w-[130px]">
              <label className="text-xs font-semibold text-gray-400 ml-1">
                Estado
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="Paga">Paga</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasada">Atrasada</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[130px]">
              <label className="text-xs font-semibold text-gray-400 ml-1">
                Classe
              </label>
              <select
                value={filtroClasse}
                onChange={(e) => setFiltroClasse(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="">Todas</option>
                {classes.map((c) => (
                  <option key={c} value={String(c)}>
                    {c}ª Classe
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2 bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Tabela de Propinas</h3>
              <span className="text-xs text-gray-400 font-medium bg-white px-3 py-1 rounded-full border">
                {tabelaFiltrada.length} registo
                {tabelaFiltrada.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-primary text-white text-[13px] font-semibold">
                    <th className="px-4 py-3.5">Código</th>
                    <th
                      className="px-4 py-3.5 cursor-pointer hover:bg-[#1a5fad] transition-colors"
                      onClick={handleSort}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Nome{" "}
                        {ordemCrescente ? (
                          <ArrowDown size={13} />
                        ) : (
                          <ArrowUp size={13} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Classe</th>
                    <th className="px-4 py-3.5">Data</th>
                    <th className="px-4 py-3.5">Meses</th>
                    <th className="px-4 py-3.5">Valor</th>
                    <th className="px-4 py-3.5">Multa</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />{" "}
                          A carregar...
                        </div>
                      </td>
                    </tr>
                  ) : tabelaFiltrada.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        Nenhuma propina encontrada
                      </td>
                    </tr>
                  ) : (
                    tabelaFiltrada.map((row, i) => {
                      const multaExibida =
                        Number(row.multa_real) > 0
                          ? Number(row.multa_real)
                          : Number(row.multa_estimada);
                      return (
                        <tr
                          key={i}
                          className="hover:bg-primary/3 transition-colors group"
                        >
                          <td className="px-4 py-4 text-sm font-mono text-gray-400 whitespace-nowrap">
                            {row.codigo}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                            {row.nome_estudante}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {row.classe ? `${row.classe}ª` : "—"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {formatarData(row.data)}
                          </td>
                          {/* Meses de referência na tabela */}
                          <td className="max-w-[200px] truncate px-4 py-4 text-sm text-gray-500 whitespace-nowrap w-2 ">
                            {row.meses_referencia ? (
                              <span
                                title={row.meses_referencia}
                                className=" block mx-auto"
                              >
                                {row.meses_referencia}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                            {Number(row.valor).toLocaleString("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold">
                            {multaExibida > 0 ? (
                              <span className="text-red-500">
                                {multaExibida.toLocaleString("pt-AO", {
                                  style: "currency",
                                  currency: "AOA",
                                })}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setSelectedRow(row)}
                              className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all duration-200 shadow-sm mx-auto block"
                              title="Visualizar"
                            >
                              <EyeIcon size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-100">
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  A carregar...
                </div>
              ) : tabelaFiltrada.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  Nenhuma propina encontrada
                </div>
              ) : (
                tabelaFiltrada.map((row, i) => {
                  const multaExibida =
                    Number(row.multa_real) > 0
                      ? Number(row.multa_real)
                      : Number(row.multa_estimada);
                  return (
                    <div
                      key={i}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-700 text-sm">
                            {row.nome_estudante}
                          </p>
                          <p className="text-xs text-gray-400">
                            {row.servico} ·{" "}
                            {row.classe ? `${row.classe}ª` : "—"}
                          </p>
                        </div>
                        <StatusBadge status={row.status} />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {Number(row.valor).toLocaleString("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </p>
                          {multaExibida > 0 && (
                            <p className="text-xs text-red-500 font-medium">
                              +{" "}
                              {multaExibida.toLocaleString("pt-AO", {
                                style: "currency",
                                currency: "AOA",
                              })}{" "}
                              multa
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedRow(row)}
                          className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          <EyeIcon size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <HelpButton/>
      </main>

      {selectedRow && (
        <ModalDetalhes row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}
