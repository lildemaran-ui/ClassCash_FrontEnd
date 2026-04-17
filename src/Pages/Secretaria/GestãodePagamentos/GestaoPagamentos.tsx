import Avatar from "@/components/Avatar/Avatar";
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
  Download,
  EyeIcon,
  FileText,
  Image,
  PencilIcon,
  Plus,
  Save,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface PagamentoRow {
  codigo: number;
  nome_estudante: string;
  classe: number | null;
  data: string | null;
  servico: string;
  valor: string;
  multa_estimada: string;
  status: string;
  comprovativo_url?: string | null;
  tipopagamento?: string | null;
}
interface Cards {
  total_pagamentos: string;
  confirmados: string;
  pendentes: string;
  atrasados: string;
  cancelados: string;
}
interface Estudante {
  idestudante: number;
  fk_estudante_usuario: number;
  nome_estudante: string;
  num_processo: number;
  classe: number | null;
}
interface Servico {
  idservico: number;
  idclasse: number;
  servico: string;
  classe: number;
  valorservico: string;
}

// ─── Helpers ────────────────────────────────────────────────────

const CardKpi = ({
  title,
  value,
  subtext,
  trend,
}: {
  title: string;
  value: string;
  subtext: string;
  trend?: "up" | "down";
}) => (
  <div className="bg-white px-3 py-4 rounded-2xl flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all duration-300">
    <p className="text-gray-400 text-xs font-medium mb-1 truncate w-full">
      {title}
    </p>
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-bold text-gray-800">{value}</span>
      {trend === "up" && <TrendingUp size={16} className="text-green-500" />}
      {trend === "down" && <TrendingDown size={16} className="text-red-500" />}
    </div>
    <p className="text-[11px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    confirmado: "bg-green-50 text-green-700 border-green-200",
    pendente: "bg-orange-50 text-orange-700 border-orange-200",
    atrasado: "bg-red-50 text-red-700 border-red-200",
    cancelado: "bg-gray-100 text-gray-600 border-gray-200",
    Confirmado: "bg-green-50 text-green-700 border-green-200",
    Pendente: "bg-orange-50 text-orange-700 border-orange-200",
    Atrasado: "bg-red-50 text-red-700 border-red-200",
    Cancelado: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${map[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {(status === "confirmado" || status === "Confirmado") && (
        <CheckCircle size={10} />
      )}
      {(status === "pendente" || status === "Pendente") && <Clock size={10} />}
      {(status === "atrasado" || status === "Atrasado") && (
        <AlertTriangle size={10} />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Componente: Visualizador de Comprovativo ────────────────────

const ComprovatvivoViewer = ({ url }: { url: string }) => {
  const isImage = /\.(png|jpe?g|gif|webp|bmp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);
  const isTransacaoId = !isImage && !isPdf; // ID de transação Multicaixa

  if (isTransacaoId) {
    return (
      <div className="bg-[#184d8a]/5 border border-[#184d8a]/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <ShieldCheck size={18} className="text-[#184d8a] shrink-0" />
        <div>
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            ID Transação Multicaixa
          </p>
          <p className="text-sm font-mono font-bold text-gray-800">{url}</p>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <img
          src={`http://localhost:5000/${url}`}
          alt="Comprovativo"
          className="w-full object-cover max-h-48"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect fill='%23f3f4f6' width='100' height='60'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3EImagem indisponível%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <a
        href={`http://localhost:5000/${url}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 hover:bg-red-100 transition-colors"
      >
        <FileText size={16} />
        <span className="text-sm font-semibold">Ver PDF do Comprovativo</span>
        <Download size={14} className="ml-auto" />
      </a>
    );
  }

  return null;
};

// ─── Modal: Detalhes + Validação ────────────────────────────────

const ModalDetalhes = ({
  row,
  onClose,
  onValidar,
}: {
  row: PagamentoRow;
  onClose: () => void;
  onValidar: () => void;
}) => {
  const [validando, setValidando] = useState(false);

  const handleValidar = async () => {
    setValidando(true);
    try {
      const res = await fetchComAuth(
        `${API}/gestaoPagamentos/${row.codigo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status: "Confirmado" }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao confirmar");
      toast.success("Pagamento confirmado com sucesso!");
      onValidar();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao confirmar");
    } finally {
      setValidando(false);
    }
  };

  const isPendente =
    row.status?.toLowerCase() === "pendente";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-white font-bold text-lg">
              {row.nome_estudante}
            </h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Pagamento #{row.codigo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: <BookOpen size={13} className="text-[#184d8a]" />,
                label: "Classe",
                val: row.classe ? `${row.classe}ª Classe` : "—",
              },
              {
                icon: <Calendar size={13} className="text-[#184d8a]" />,
                label: "Data",
                val: row.data ?? "—",
              },
              {
                icon: <FileText size={13} className="text-[#184d8a]" />,
                label: "Serviço",
                val: row.servico,
              },
              {
                icon: <User size={13} className="text-[#184d8a]" />,
                label: "Estado",
                val: <StatusBadge status={row.status} />,
              },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  {icon}
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">{val}</div>
              </div>
            ))}
          </div>

          {/* Tipo de pagamento */}
          {row.tipopagamento && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
              <DollarSign size={14} className="text-[#184d8a]" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tipo de Pagamento:
              </span>
              <span className="text-sm font-bold text-gray-700 ml-1">
                {row.tipopagamento}
              </span>
            </div>
          )}

          {/* Valores */}
          <div className="bg-[#184d8a]/5 rounded-2xl p-4 border border-[#184d8a]/10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[#184d8a]" />
                <span className="text-sm font-semibold text-gray-600">
                  Valor
                </span>
              </div>
              <span className="font-bold text-gray-800 text-lg">
                {Number(row.valor).toLocaleString("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                })}
              </span>
            </div>
            {Number(row.multa_estimada) > 0 && (
              <div className="flex justify-between items-center pt-3 border-t border-[#184d8a]/10">
                <span className="text-sm font-semibold text-red-500">
                  Multa
                </span>
                <span className="font-bold text-red-600">
                  {Number(row.multa_estimada).toLocaleString("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* ── Comprovativo ── */}
          {row.comprovativo_url ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Image size={14} className="text-[#184d8a]" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Comprovativo Submetido
                </span>
              </div>
              <ComprovatvivoViewer url={row.comprovativo_url} />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-amber-700">
              <AlertTriangle size={14} />
              <span className="text-xs font-semibold">
                Sem comprovativo submetido
              </span>
            </div>
          )}

          {/* ── Botão de Confirmação (só para pagamentos pendentes) ── */}
          {isPendente && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <ShieldCheck
                  size={18}
                  className="text-green-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-bold text-green-800">
                    Validar Pagamento
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Após verificar o comprovativo, confirme o pagamento. Esta
                    acção não pode ser desfeita.
                  </p>
                </div>
              </div>
              <button
                onClick={handleValidar}
                disabled={validando}
                className="w-full py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {validando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    A confirmar...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Confirmar Pagamento
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Fechar
          </button>
          <button className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200">
            Imprimir Recibo
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Editar ───────────────────────────────────────────────

const ModalEditar = ({
  row,
  onClose,
  onSave,
}: {
  row: PagamentoRow;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [form, setForm] = useState({
    status: row.status,
    data_vencimento: "",
    data_pagamento: "",
    meses: "1",
    fk_pagamentos_servico: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetchComAuth(`${API}/gestaoServicos`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setServicos(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Erro ao carregar serviços");
      }
    };
    carregar();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetchComAuth(`${API}/gestaoPagamentos/${row.codigo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          status: form.status,
          data_vencimento: form.data_vencimento || null,
          data_pagamento: form.data_pagamento || null,
          meses: parseInt(form.meses) || 1,
          fk_pagamentos_servico: form.fk_pagamentos_servico
            ? parseInt(form.fk_pagamentos_servico)
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao editar");
      toast.success("Pagamento atualizado com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao editar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-lg">Editar Pagamento</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {row.nome_estudante} · #{row.codigo}
            </p>
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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Estado
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
            >
              <option value="Pendente">Pendente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Serviço
            </label>
            <select
              value={form.fk_pagamentos_servico}
              onChange={(e) =>
                setForm({ ...form, fk_pagamentos_servico: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
            >
              <option value="">Manter serviço actual ({row.servico})</option>
              {servicos
                .filter((s) => !row.classe || s.classe === row.classe)
                .map((s) => (
                  <option key={s.idservico} value={s.idservico}>
                    {s.servico} — {s.classe}ª Classe (
                    {Number(s.valorservico).toLocaleString("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                    })}
                    )
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Meses
            </label>
            <input
              type="number"
              min="1"
              value={form.meses}
              onChange={(e) => setForm({ ...form, meses: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={form.data_vencimento}
                onChange={(e) =>
                  setForm({ ...form, data_vencimento: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Data de Pagamento
              </label>
              <input
                type="date"
                value={form.data_pagamento}
                onChange={(e) =>
                  setForm({ ...form, data_pagamento: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
              />
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                A guardar...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Adicionar ────────────────────────────────────────────

const ModalAdicionar = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) => {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [estudanteSelecionado, setEstudanteSelecionado] =
    useState<Estudante | null>(null);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(
    null,
  );
  const [form, setForm] = useState({
    status: "Pendente",
    data_vencimento: "",
    data_pagamento: "",
    multa: "",
    meses: "1",
    valor: "",
    tipopagamento: "3",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setLoadingDados(true);
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };
        const [resEst, resSer] = await Promise.all([
          fetchComAuth(`${API}/gestaoEstudantes`, { headers }),
          fetchComAuth(`${API}/gestaoServicos`, { headers }),
        ]);
        const dataEst = await resEst.json();
        const dataSer = await resSer.json();
        setEstudantes(dataEst.estudantes ?? []);
        setServicos(Array.isArray(dataSer) ? dataSer : []);
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoadingDados(false);
      }
    };
    carregar();
  }, []);

  const sugestoes =
    pesquisa.length >= 2
      ? estudantes
          .filter(
            (e) =>
              e.nome_estudante.toLowerCase().includes(pesquisa.toLowerCase()) ||
              String(e.num_processo).includes(pesquisa),
          )
          .slice(0, 6)
      : [];

  const selecionarEstudante = (e: Estudante) => {
    setEstudanteSelecionado(e);
    setPesquisa(e.nome_estudante);
    setMostrarSugestoes(false);
    setServicoSelecionado(null);
    setForm((f) => ({ ...f, valor: "" }));
  };

  const selecionarServico = (id: string) => {
    const s = servicos.find((s) => String(s.idservico) === id) ?? null;
    setServicoSelecionado(s);
    if (s) {
      const meses = parseInt(form.meses) || 1;
      setForm((f) => ({
        ...f,
        valor: String(parseFloat(s.valorservico) * meses),
      }));
    }
  };

  const handleSave = async () => {
    if (!estudanteSelecionado) {
      toast.error("Seleccione um estudante");
      return;
    }
    if (!servicoSelecionado) {
      toast.error("Seleccione um serviço");
      return;
    }
    if (!form.valor) {
      toast.error("Valor é obrigatório");
      return;
    }
    setSaving(true);
    try {
      const res = await fetchComAuth(`${API}/gestaoPagamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          fk_pagamentos_usuario: estudanteSelecionado.fk_estudante_usuario,
          fk_pagamentos_servico: servicoSelecionado.idservico,
          fk_pagamentos_tipopagamento: parseInt(form.tipopagamento),
          valor: parseFloat(form.valor),
          status: form.status,
          data_vencimento: form.data_vencimento || null,
          data_pagamento: form.data_pagamento || null,
          multa: form.multa ? parseFloat(form.multa) : 0,
          meses: parseInt(form.meses) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao guardar");
      toast.success("Pagamento criado com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-[#184d8a] px-6 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-white font-bold text-lg">Novo Pagamento</h2>
            <p className="text-blue-200 text-sm">
              Preencha os dados do pagamento
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {loadingDados ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#184d8a]">
            <div className="w-5 h-5 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">A carregar dados...</span>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Pesquisa estudante */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Estudante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou nº processo..."
                  value={pesquisa}
                  onChange={(e) => {
                    setPesquisa(e.target.value);
                    setEstudanteSelecionado(null);
                    setMostrarSugestoes(true);
                  }}
                  onFocus={() => setMostrarSugestoes(true)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
                />
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    {sugestoes.map((e) => (
                      <button
                        key={e.idestudante}
                        type="button"
                        onClick={() => selecionarEstudante(e)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#184d8a]/5 transition-colors text-left"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {e.nome_estudante}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          #{e.num_processo}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {estudanteSelecionado && (
                <div className="mt-2 flex items-center justify-between bg-[#184d8a]/5 border border-[#184d8a]/20 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-xs font-bold text-[#184d8a]">
                      {estudanteSelecionado.nome_estudante}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Nº {estudanteSelecionado.num_processo}
                      {estudanteSelecionado.classe
                        ? ` · ${estudanteSelecionado.classe}ª Classe`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEstudanteSelecionado(null);
                      setPesquisa("");
                    }}
                    className="p-1 rounded-lg hover:bg-[#184d8a]/10 text-[#184d8a] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Tipo de Pagamento
              </label>
              <select
                value={form.tipopagamento}
                onChange={(e) =>
                  setForm({ ...form, tipopagamento: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
              >
                <option value="1">Digital</option>
                <option value="2">ATM</option>
                <option value="3">Pagamento Físico</option>
              </select>
            </div>

            {/* Serviço */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Serviço <span className="text-red-500">*</span>
              </label>
              <select
                value={servicoSelecionado?.idservico ?? ""}
                onChange={(e) => selecionarServico(e.target.value)}
                disabled={!estudanteSelecionado}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!estudanteSelecionado
                    ? "Seleccione primeiro um estudante..."
                    : "Seleccionar serviço..."}
                </option>
                {servicos
                  .filter(
                    (s) =>
                      !estudanteSelecionado ||
                      s.classe === estudanteSelecionado.classe,
                  )
                  .map((s) => (
                    <option
                      key={`${s.idservico}-${s.idclasse}`}
                      value={s.idservico}
                    >
                      {s.servico} — {s.classe}ª Classe (
                      {Number(s.valorservico).toLocaleString("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      })}
                      )
                    </option>
                  ))}
              </select>
              {estudanteSelecionado &&
                servicos.filter((s) => s.classe === estudanteSelecionado.classe)
                  .length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Nenhum serviço disponível para a{" "}
                    {estudanteSelecionado.classe}ª Classe
                  </p>
                )}
            </div>

            {/* Valor + Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Valor (AOA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
                />
                {servicoSelecionado && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Padrão:{" "}
                    {Number(servicoSelecionado.valorservico).toLocaleString(
                      "pt-AO",
                      { style: "currency", currency: "AOA" },
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Atrasado">Atrasado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={form.data_vencimento}
                  onChange={(e) =>
                    setForm({ ...form, data_vencimento: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  value={form.data_pagamento}
                  onChange={(e) =>
                    setForm({ ...form, data_pagamento: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] cursor-pointer transition-all"
                />
              </div>
            </div>

            {/* Multa + Meses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Multa (AOA)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.multa}
                  onChange={(e) => setForm({ ...form, multa: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Meses
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.meses}
                  onChange={(e) => setForm({ ...form, meses: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loadingDados}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                A guardar...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Página Principal ────────────────────────────────────────────

export default function GestaoPagamentos() {
  const [modalEditar, setModalEditar] = useState<PagamentoRow | null>(null);
  const [tabela, setTabela] = useState<PagamentoRow[]>([]);
  const [cards, setCards] = useState<Cards>({
    total_pagamentos: "0",
    confirmados: "0",
    pendentes: "0",
    atrasados: "0",
    cancelados: "0",
  });
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [selectedRow, setSelectedRow] = useState<PagamentoRow | null>(null);
  const [showAdicionar, setShowAdicionar] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const s = exigirSessao();
    if (s) setUser(s.usuario);
  }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/gestaoPagamentos`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setCards(data.cards ?? cards);
      setTabela(data.tabela ?? []);
    } catch {
      toast.error("Erro ao carregar pagamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    // Polling a cada 30s para apanhar novos pagamentos submetidos por estudantes
    const interval = setInterval(carregar, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = () => {
    const ordenados = [...tabela].sort((a, b) =>
      ordemCrescente
        ? a.nome_estudante.localeCompare(b.nome_estudante)
        : b.nome_estudante.localeCompare(a.nome_estudante),
    );
    setTabela(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const tabelaFiltrada = tabela.filter(
    (r) =>
      !filtroEstado || r.status.toLowerCase() === filtroEstado.toLowerCase(),
  );

  // Contagem de pendentes para badge de atenção
  const totalPendentes = tabela.filter(
    (r) => r.status.toLowerCase() === "pendente",
  ).length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Gestão de Pagamentos"
          usuario={
            user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null
          }
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <CardKpi
              title="Total Recebido"
              value={cards.total_pagamentos}
              subtext="este mês"
              trend="up"
            />
            <CardKpi
              title="Confirmados"
              value={cards.confirmados}
              subtext="validados"
            />
            <CardKpi
              title="Pendentes"
              value={cards.pendentes}
              subtext="aguardam validação"
              trend="down"
            />
            <CardKpi
              title="Em Atraso"
              value={cards.atrasados}
              subtext="vencidos"
              trend="down"
            />
            <CardKpi
              title="Cancelados"
              value={cards.cancelados}
              subtext="estornados"
            />
          </div>

          {/* Banner de atenção quando há pendentes */}
          {totalPendentes > 0 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">
                  {totalPendentes} pagamento
                  {totalPendentes > 1 ? "s" : ""} aguarda
                  {totalPendentes > 1 ? "m" : ""} validação
                </p>
                <p className="text-xs text-amber-600">
                  Clique no ícone{" "}
                  <EyeIcon
                    size={10}
                    className="inline"
                  />{" "}
                  para ver o comprovativo e confirmar
                </p>
              </div>
              <button
                onClick={() => setFiltroEstado("pendente")}
                className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ver todos
              </button>
            </div>
          )}

          {/* Filtros + Botão Adicionar */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#184d8a] cursor-pointer min-w-[130px]"
              >
                <option value="">Todos</option>
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Em Atraso</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <button
              onClick={() => setShowAdicionar(true)}
              className="flex items-center gap-2 bg-[#184d8a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 active:scale-95"
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700">
                Histórico de Transações
              </h3>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border">
                {tabelaFiltrada.length} registos
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#184d8a] text-white text-[13px] font-semibold">
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
                    <th className="px-4 py-3.5">Serviço</th>
                    <th className="px-4 py-3.5">Valor</th>
                    <th className="px-4 py-3.5">Comprovativo</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#184d8a] border-t-transparent rounded-full animate-spin" />
                          A carregar...
                        </div>
                      </td>
                    </tr>
                  ) : tabelaFiltrada.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        Nenhum pagamento encontrado
                      </td>
                    </tr>
                  ) : (
                    tabelaFiltrada.map((row, i) => (
                      <tr
                        key={i}
                        className={`hover:bg-[#184d8a]/3 transition-colors ${
                          row.status.toLowerCase() === "pendente" &&
                          row.comprovativo_url
                            ? "bg-amber-50/40"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-sm font-mono text-gray-400">
                          {row.codigo}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                          {row.nome_estudante}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {row.classe ? `${row.classe}ª` : "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {row.servico}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                          {Number(row.valor).toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}
                        </td>
                        {/* Indicador de comprovativo */}
                        <td className="px-4 py-4">
                          {row.comprovativo_url ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle size={10} /> Submetido
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-gray-50 text-gray-400 border border-gray-200">
                              — Sem ficheiro
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedRow(row)}
                              className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all"
                              title="Ver detalhes e validar"
                            >
                              <EyeIcon size={16} />
                            </button>
                            <button
                              onClick={() => setModalEditar(row)}
                              className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                              title="Editar"
                            >
                              <PencilIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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
              ) : (
                tabelaFiltrada.map((row, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">
                          {row.nome_estudante}
                        </p>
                        <p className="text-xs text-gray-400">{row.servico}</p>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {Number(row.valor).toLocaleString("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          })}
                        </p>
                        {row.comprovativo_url && (
                          <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                            ✓ Comprovativo submetido
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedRow(row)}
                        className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all"
                      >
                        <EyeIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedRow && (
        <ModalDetalhes
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onValidar={carregar}
        />
      )}
      {modalEditar && (
        <ModalEditar
          row={modalEditar}
          onClose={() => setModalEditar(null)}
          onSave={carregar}
        />
      )}
      {showAdicionar && (
        <ModalAdicionar
          onClose={() => setShowAdicionar(false)}
          onSave={carregar}
        />
      )}
    </div>
  );
}