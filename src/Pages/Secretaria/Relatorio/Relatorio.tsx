// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/Relatorio.tsx
// Melhorias: Design refinado, responsividade, modal de exportação
// ════════════════════════════════════════════════════════════════
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import {
  Download,
  RefreshCcw,
  AlertTriangle,
  Users,
  FileText,
  X,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* ── Modal de Exportação ── */
const ModalExportar = ({
  titulo,
  onClose,
}: {
  titulo: string;
  onClose: () => void;
}) => {
  const [formato, setFormato] = useState("pdf");
  const [periodo, setPeriodo] = useState("ano");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(`${titulo} exportado em formato ${formato.toUpperCase()}!`);
    setExporting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-primary px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">Exportar Relatório</h2>
            <p className="text-blue-200 text-sm">{titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Período
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "mes", label: "Este Mês" },
                { val: "trimestre", label: "Trimestre" },
                { val: "ano", label: "Ano Lectivo" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setPeriodo(val)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    periodo === val
                      ? "bg-primary text-white border-[#184d8a]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#184d8a]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Formato
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["pdf", "xlsx", "csv"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormato(f)}
                  className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                    formato === f
                      ? "bg-primary text-white border-[#184d8a]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#184d8a]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} className="text-blue-500" />
              <p className="text-xs font-semibold text-blue-700">
                Pronto para exportar
              </p>
            </div>
            <p className="text-xs text-blue-600">
              {titulo} · Período:{" "}
              {periodo === "mes"
                ? "Este Mês"
                : periodo === "trimestre"
                  ? "1º Trimestre"
                  : "Ano Lectivo 2024"}{" "}
              · Formato: {formato.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                A exportar...
              </>
            ) : (
              <>
                <Download size={16} /> Exportar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const RELATORIOS = [
  {
    id: "receita",
    icon: <FileText size={20} />,
    bgIcon:
      "bg-blue-50 text-[#184d8a] group-hover:bg-primary group-hover:text-white",
    titulo: "Relatório de Receita",
    desc: "Propinas, multas e serviços extras liquidados.",
    badge: { text: "+12.5%", cls: "bg-green-50 text-green-700" },
  },
  {
    id: "alunos",
    icon: <Users size={20} />,
    bgIcon:
      "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
    titulo: "Fluxo de Alunos",
    desc: "Novas matrículas vs. desistências e transferências.",
    badge: { text: "248 alunos", cls: "bg-blue-50 text-blue-700" },
  },
  {
    id: "inadimplencia",
    icon: <AlertTriangle size={20} />,
    bgIcon:
      "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white",
    titulo: "Inadimplência Crítica",
    desc: "Lista de encarregados com mais de 2 meses de atraso.",
    badge: { text: "7 casos", cls: "bg-red-50 text-red-700" },
  },
];

/* ── Mini bar chart (visual puro) ── */
const MiniBarChart = () => {
  const meses = ["Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar"];
  const valores = [65, 72, 58, 80, 75, 88, 92];
  const max = Math.max(...valores);
  return (
    <div className="flex items-end gap-2 h-full">
      {meses.map((m, i) => (
        <div key={m} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-primary/20 relative overflow-hidden"
            style={{ height: `${(valores[i] / max) * 160}px` }}
          >
            <div
              className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all duration-700"
              style={{ height: "100%" }}
            />
          </div>
          <span className="text-[10px] text-gray-400">{m}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function Relatorio() {
  const [periodo, setPeriodo] = useState("Ano Lectivo 2024");
  const [modalExportar, setModalExportar] = useState<string | null>(null);
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;
    setUser(sessao.usuario);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
          <Header
            titulo="Centro de Relatórios"
            usuario={
              user ? (
                <Avatar name={user.nome} src={user.foto} size="sm" />
              ) : null
            }
          />
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
            <div className="flex flex-col px-2">
              <label className="text-[10px] font-bold text-gray-400">
                Período
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="text-sm font-bold text-gray-700 outline-none cursor-pointer bg-transparent"
              >
                <option>Ano Lectivo 2024</option>
                <option>Últimos 30 dias</option>
                <option>1º Trimestre</option>
              </select>
            </div>
            <button className="bg-primary text-white p-2 rounded-lg hover:bg-[#1a5fad] transition-all">
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPI Resumo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              {
                label: "Receita Total",
                val: "12.4M AOA",
                icon: <TrendingUp size={14} />,
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                label: "Alunos Activos",
                val: "248",
                icon: <Users size={14} />,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                label: "Taxa de Pagamento",
                val: "87%",
                icon: <BarChart2 size={14} />,
                color: "text-[#184d8a]",
                bg: "bg-blue-50",
              },
              {
                label: "Em Inadimplência",
                val: "7",
                icon: <TrendingDown size={14} />,
                color: "text-red-500",
                bg: "bg-red-50",
              },
            ].map(({ label, val, icon, color, bg }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                <div
                  className={`w-8 h-8 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}
                >
                  {icon}
                </div>
                <p className="text-xs text-gray-400 font-medium mb-1">
                  {label}
                </p>
                <p className={`text-xl font-bold ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Cards de Download */}
          <h3 className="font-bold text-gray-700 mb-4">
            Relatórios Disponíveis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {RELATORIOS.map((rel) => (
              <div
                key={rel.id}
                onClick={() => setModalExportar(rel.titulo)}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-xl transition-all ${rel.bgIcon}`}
                  >
                    {rel.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${rel.badge.cls}`}
                    >
                      {rel.badge.text}
                    </span>
                    <Download
                      size={15}
                      className="text-gray-300 group-hover:text-gray-500 transition-all"
                    />
                  </div>
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-1">
                  {rel.titulo}
                </h4>
                <p className="text-xs text-gray-400">{rel.desc}</p>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <h3 className="font-bold text-gray-700 mb-4">Análise Visual</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de barras */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-gray-700">
                    Crescimento de Receita
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Últimos 7 meses
                  </p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  +12.5%
                </span>
              </div>
              <div className="h-48">
                <MiniBarChart />
              </div>
            </div>

            {/* Gráfico de donut */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-gray-700">
                    Distribuição por Categoria
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ano lectivo 2024
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-36 h-36 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke="#184d8a"
                      strokeWidth="3"
                      strokeDasharray="75 25"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeDasharray="15 85"
                      strokeDashoffset="-75"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="10 90"
                      strokeDashoffset="-90"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-gray-400 text-center leading-tight">
                      Total
                      <br />
                      100%
                    </p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { color: "bg-primary", label: "Propinas", pct: "75%" },
                    { color: "bg-orange-400", label: "Multas", pct: "15%" },
                    { color: "bg-red-400", label: "Outros", pct: "10%" },
                  ].map(({ color, label, pct }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-xs font-semibold text-gray-600">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {modalExportar && (
        <ModalExportar
          titulo={modalExportar}
          onClose={() => setModalExportar(null)}
        />
      )}
    </div>
  );
}
