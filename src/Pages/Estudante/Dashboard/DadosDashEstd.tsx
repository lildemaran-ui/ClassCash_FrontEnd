import Avatar from "@/components/Avatar/Avatar";
import ChartEstud from "@/components/Charts/ChartEstud";
import ContentLoader from "@/components/contentLoader";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Download,
  Filter,
  Loader2,
  Pen,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

interface ResumoFinanceiro {
  ultimo_pagamento: string | null;
  proximo_vencimento: string | null;
  total_pago_mes: number | null;
  total_acumulado: number | null;
}

interface Transacao {
  data: string | null;
  servico: string;
  valor_total: number;
  multa: number;
  meses_referencia: string | null; // ← NOVO
  status: string;
}

function formatarData(data: string | null): string {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-PT");
}

function formatarValor(valor: number | null): string {
  if (valor === null || valor === undefined) return "Kz 0,00";
  return `Kz ${Number(valor).toLocaleString("pt-PT")},00`;
}

export default function DadosDashEstd() {
  const location = useLocation();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [historico, setHistorico] = useState<Transacao[]>([]);
  const [contaRegularizada, setContaRegularizada] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [gerandoPDF, setGerandoPDF] = useState(false);

  const [searchServico, setSearchServico] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "todos" | "Confirmado" | "Pendente" | "Cancelado"
  >("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;
    setUser(sessao.usuario);

    fetchComAuth(`${API_BASE}/dashboardEstud`, {
      headers: { Authorization: `Bearer ${sessao.token}` },
    })
      .then((r) => r.json())
      .then((dados) => {
        if (dados.resumo_financeiro) setResumo(dados.resumo_financeiro);
        if (dados.historico_transacoes)
          setHistorico(dados.historico_transacoes);
        if (dados.conta_regularizada !== undefined)
          setContaRegularizada(dados.conta_regularizada);
      })
      .catch((err) => console.error("Erro ao carregar dashboard:", err))
      .finally(() => setCarregando(false));
  }, [location]);

  const historicoFiltrado = useMemo(() => {
    return historico.filter((t) => {
      const matchServico = t.servico
        .toLowerCase()
        .includes(searchServico.toLowerCase());
      const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
      const matchDataInicio =
        !dataInicio || (t.data && new Date(t.data) >= new Date(dataInicio));
      const matchDataFim =
        !dataFim || (t.data && new Date(t.data) <= new Date(dataFim));
      return matchServico && matchStatus && matchDataInicio && matchDataFim;
    });
  }, [historico, searchServico, filtroStatus, dataInicio, dataFim]);

  const limparFiltros = () => {
    setSearchServico("");
    setFiltroStatus("todos");
    setDataInicio("");
    setDataFim("");
  };

  const temFiltrosActivos =
    searchServico !== "" ||
    filtroStatus !== "todos" ||
    dataInicio !== "" ||
    dataFim !== "";

  if (!user)
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin text-[#184d8a]" />
      </div>
    );

  const gerarPDF = async () => {
    const elemento = pdfRef.current;
    if (!elemento) return;
    setGerandoPDF(true);
    try {
      const canvas = await html2canvas(elemento, { scale: 2, useCORS: true });
      const imagem = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const largura = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const alturaImagem = (canvas.height * largura) / canvas.width;
      let posY = 0;
      while (posY < alturaImagem) {
        if (posY > 0) pdf.addPage();
        pdf.addImage(imagem, "PNG", 0, -posY, largura, alturaImagem);
        posY += alturaPagina;
      }
      pdf.save(
        `relatorio_${user.nome?.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setGerandoPDF(false);
    }
  };

  const SummaryRow = ({
    label,
    value,
    isLast,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center py-3 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <span className="text-gray-400 font-medium text-sm">{label}</span>
      <span className="text-gray-800 font-bold text-base">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 bg-[#f8fafc] mb-8">
      {/* Acções topo */}
      <div className="flex items-center justify-end mt-3">
        <Link to="/config">
          <button className="text-[#184d8a] hover:scale-110 transition-all p-1">
            <Settings size={20} className="sm:hidden" />
            <Settings size={24} className="hidden sm:block" />
          </button>
        </Link>
        {/* Sino de notificações */}
        <div className="relative cursor-pointer group p-1">
          <Bell
            size={20}
            className="text-[#184d8a] group-hover:scale-110 transition-transform sm:hidden"
          />
          <Bell
            size={24}
            className="text-[#184d8a] group-hover:scale-110 transition-transform hidden sm:block"
          />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white" />
        </div>
      </div>

      <div ref={pdfRef} className="space-y-8">
        <ContentLoader>
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar src={user.foto} name={user.nome ?? ""} size="xl" />
              <button
                onClick={() => setModal(true)}
                className="absolute -bottom-0.5 -right-0.5 bg-white p-2 rounded-xl shadow-lg text-[#184d8a] hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <Pen size={16} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <span className="bg-blue-100 text-[#184d8a] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                {user.perfil}
              </span>
              <h1 className="text-3xl font-black text-gray-800 mt-2 tracking-tight">
                {user.nome}
              </h1>
              <div className="flex flex-col justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-gray-600 text-sm">
                <p>
                  <strong>ID:</strong>{" "}
                  {user.codigo_plataforma ?? user.processo ?? "—"}
                </p>
                <p>
                  <strong>Classe:</strong> {user.classe ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-gradient-to-br p-4 rounded-2xl border flex items-center gap-4 shadow-sm min-w-[280px] ${contaRegularizada ? "from-emerald-50 to-white border-emerald-100" : "from-amber-50 to-white border-amber-100"}`}
          >
            <div
              className={`p-2 rounded-xl text-white ${contaRegularizada ? "bg-emerald-500" : "bg-amber-500"}`}
            >
              {contaRegularizada ? (
                <CheckCircle size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>
            <div>
              <h3
                className={`text-sm font-bold ${contaRegularizada ? "text-emerald-900" : "text-amber-900"}`}
              >
                Situação Financeira
              </h3>
              <p
                className={`text-xs font-semibold ${contaRegularizada ? "text-emerald-600" : "text-amber-600"}`}
              >
                {contaRegularizada
                  ? "Conta Regularizada"
                  : "Pagamentos em atraso"}
              </p>
            </div>
          </div>
        </header>

        {/* Botão exportar */}
        <div className="mt-8 flex justify-end mb-6">
          <button
            onClick={gerarPDF}
            disabled={gerandoPDF}
            className="bg-primary text-white px-4 py-2.5 rounded-lg flex items-center gap-3 hover:bg-primary/80 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 disabled:opacity-60"
          >
            {gerandoPDF ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            <span className="font-bold">
              {gerandoPDF ? "A gerar PDF..." : "Exportar Relatório"}
            </span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Resumo Financeiro
            </h3>
            {carregando ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-[#184d8a]" />
              </div>
            ) : (
              <div className="flex flex-col">
                <SummaryRow
                  label="Último pagamento"
                  value={formatarData(resumo?.ultimo_pagamento ?? null)}
                />
                <SummaryRow
                  label="Próximo vencimento"
                  value={formatarData(resumo?.proximo_vencimento ?? null)}
                />
                <SummaryRow
                  label="Total pago (Mês)"
                  value={formatarValor(resumo?.total_pago_mes ?? null)}
                />
                <SummaryRow
                  label="Total acumulado"
                  value={formatarValor(resumo?.total_acumulado ?? null)}
                  isLast
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Serviços pagos
            </h3>
            <div className="h-[250px] w-full">
              <ChartEstud />
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="font-bold text-gray-800">Histórico de Transações</h3>
            <button
              onClick={() => setMostrarFiltros((v) => !v)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                mostrarFiltros || temFiltrosActivos
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              <Filter size={13} />
              <span>Filtros</span>
              {temFiltrosActivos && (
                <span className="bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Painel de filtros */}
          {mostrarFiltros && (
            <div className="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[160px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Pesquisar serviço..."
                    value={searchServico}
                    onChange={(e) => setSearchServico(e.target.value)}
                    className="pl-8 pr-3 py-2 w-full rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(
                    ["todos", "Confirmado", "Pendente", "Cancelado"] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFiltroStatus(s)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                        filtroStatus === s
                          ? s === "Confirmado"
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : s === "Pendente"
                              ? "bg-amber-500 text-white border-amber-500"
                              : s === "Cancelado"
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-primary text-white border-primary"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {s === "todos"
                        ? "Todos"
                        : s === "Confirmado"
                          ? "Pago"
                          : s}
                    </button>
                  ))}
                </div>

                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />

                {temFiltrosActivos && (
                  <button
                    onClick={limparFiltros}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <X size={13} /> Limpar
                  </button>
                )}
              </div>
              {temFiltrosActivos && (
                <p className="text-xs text-gray-400 mt-2">
                  A mostrar <strong>{historicoFiltrado.length}</strong> de{" "}
                  <strong>{historico.length}</strong> transações
                </p>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary/80">
                <tr className="text-white text-xs uppercase tracking-widest">
                  <th className="px-8 py-4 font-semibold">Data</th>
                  <th className="px-8 py-4 font-semibold">Serviço</th>
                  <th className="px-8 py-4 font-semibold">Meses</th>
                  <th className="px-8 py-4 font-semibold">Valor Total</th>
                  <th className="px-8 py-4 font-semibold">Multa</th>
                  <th className="px-8 py-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {carregando ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-10 text-center text-sm text-gray-400"
                    >
                      <Loader2 className="animate-spin inline mr-2" size={16} />{" "}
                      A carregar...
                    </td>
                  </tr>
                ) : historicoFiltrado.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-10 text-center text-sm text-gray-400"
                    >
                      {temFiltrosActivos
                        ? "Nenhuma transação corresponde aos filtros aplicados."
                        : "Sem transações registadas."}
                    </td>
                  </tr>
                ) : (
                  historicoFiltrado.map((t, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-8 py-5 text-sm font-medium text-gray-600">
                        {formatarData(t.data)}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-800">
                        {t.servico}
                      </td>
                      {/* Meses de referência — mostra os meses pagos se existir */}
                      <td className="px-8 py-5 text-sm text-gray-500">
                        {t.meses_referencia ? (
                          <span
                            title={t.meses_referencia}
                            className="truncate max-w-[120px] block"
                          >
                            {t.meses_referencia}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-900">
                        {formatarValor(t.valor_total)}
                      </td>
                      <td className="px-8 py-5 text-sm">
                        {t.multa > 0 ? (
                          <span className="text-red-500 font-semibold">
                            {formatarValor(t.multa)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            t.status === "Confirmado"
                              ? "bg-emerald-100 text-emerald-700"
                              : t.status === "Pendente"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {t.status === "Confirmado"
                            ? "PAGO"
                            : t.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </ContentLoader>
      </div>

      <ProfileEditModal
        isOpen={Modal}
        onClose={() => setModal(false)}
        user={user}
        onSave={(updated) =>
          setUser((prev) =>
            prev
              ? ({
                  ...prev,
                  ...(updated as Partial<SessaoUsuario>),
                } as SessaoUsuario)
              : prev,
          )
        }
      />
    </div>
  );
}
