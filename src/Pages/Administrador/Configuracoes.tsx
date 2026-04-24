// src/Pages/Secretaria/Configuracao.tsx
// ════════════════════════════════════════════════════════════════
// ClassCash — Configurações do Sistema
// Design: clean, professional, totalmente responsivo
// ════════════════════════════════════════════════════════════════
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuAdmin from "@/components/Menu/MenuAdmin";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle,
  DollarSign,
  Edit2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  ShieldOff,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

type TabId = "geral" | "pagamentos" | "usuarios" | "seguranca" | "notificacoes";

const TABS: {
  id: TabId;
  label: string;
  labelShort: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: "geral",
    label: "Informações Gerais",
    labelShort: "Geral",
    icon: <Building2 size={16} />,
    desc: "Dados da instituição",
  },
  {
    id: "pagamentos",
    label: "Taxas e Multas",
    labelShort: "Taxas",
    icon: <DollarSign size={16} />,
    desc: "Regras financeiras",
  },
  {
    id: "usuarios",
    label: "Utilizadores",
    labelShort: "Utilizad.",
    icon: <Users size={16} />,
    desc: "Acessos e perfis",
  },
  {
    id: "seguranca",
    label: "Segurança",
    labelShort: "Segurança",
    icon: <Lock size={16} />,
    desc: "Palavra-passe",
  },
  {
    id: "notificacoes",
    label: "Notificações",
    labelShort: "Notif.",
    icon: <Bell size={16} />,
    desc: "Alertas e avisos",
  },
];

const ROLES = [
  "Administrador",
  "Secretária",
  "Estudante",
  "Encarregado",
  "Auxiliar",
];

// ─── Componentes utilitários ────────────────────────────────────

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={28} className="animate-spin text-[#184d8a]" />
      <p className="text-xs text-gray-400">A carregar...</p>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
    <div>
      <h3 className="text-sm sm:text-base font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </div>
    {action}
  </div>
);

const Field = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
      {icon && <span className="text-[#184d8a]">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = "",
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  />
);

const SaveBtn = ({
  onClick,
  loading,
  label = "Guardar Alterações",
  disabled = false,
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className="flex items-center justify-center gap-2 bg-primary text-white px-5 sm:px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/40 transition-all text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? (
      <Loader2 size={14} className="animate-spin" />
    ) : (
      <Save size={14} />
    )}
    {loading ? "A guardar..." : label}
  </button>
);

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? "bg-primary" : "bg-gray-300"}`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? "right-1" : "left-1"}`}
    />
  </button>
);

// ════════════════════════════════════════════════════════════════
// TAB GERAL
// ════════════════════════════════════════════════════════════════
const TabGeral = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    ano_lectivo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/instituicao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setForm({
        nome: data.nome || "",
        email: data.email || "",
        telefone: data.telefone || "",
        endereco: data.endereco || "",
        ano_lectivo: data.ano_lectivo || "",
      });
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar dados da instituição");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSave = async () => {
    if (!form.nome) {
      toast.error("O nome da instituição é obrigatório");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/instituicao`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.erro || "Erro ao guardar");
      }
      toast.success("Informações atualizadas com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHeader
        title="Informações da Instituição"
        desc="Dados de identificação e contacto da sua escola activa no sistema ClassCash."
        action={
          <button
            onClick={carregar}
            className="p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all"
            title="Recarregar dados"
          >
            <RefreshCw size={14} />
          </button>
        }
      />

      {/* Preview card */}
      <div className="bg-gradient-to-r from-[#184d8a]/5 to-blue-50/50 border border-[#184d8a]/10 rounded-2xl p-4 flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-md">
          <Building2 size={22} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">
            {form.nome || "Nome da Instituição"}
          </p>
          <p className="text-xs text-gray-500 truncate">{form.email || "—"}</p>
          <p className="text-xs text-[#184d8a] font-semibold mt-0.5">
            Ano Lectivo: {form.ano_lectivo || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome da Escola" icon={<Building2 size={12} />}>
          <Input
            placeholder="Ex: Colégio Caracol"
            value={form.nome}
            onChange={(v) => setForm({ ...form, nome: v })}
          />
        </Field>

        <Field label="Ano Lectivo" icon={<CalendarDays size={12} />}>
          <Input
            placeholder="Ex: 2024/2025"
            value={form.ano_lectivo}
            onChange={(v) => setForm({ ...form, ano_lectivo: v })}
          />
        </Field>

        <Field label="Email de Contacto" icon={<Mail size={12} />}>
          <Input
            type="email"
            placeholder="secretaria@escola.ao"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
        </Field>

        <Field label="Telefone" icon={<Phone size={12} />}>
          <Input
            type="tel"
            placeholder="+244 900 000 000"
            value={form.telefone}
            onChange={(v) => setForm({ ...form, telefone: v })}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Endereço / Localização" icon={<MapPin size={12} />}>
            <Input
              placeholder="Rua, Bairro, Município, Província"
              value={form.endereco}
              onChange={(v) => setForm({ ...form, endereco: v })}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <SaveBtn onClick={handleSave} loading={saving} />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// TAB TAXAS
// ════════════════════════════════════════════════════════════════
const TabPagamentos = () => {
  const [form, setForm] = useState({
    percentualmulta: "10",
    diascarencia: "5",
    aplicarjuroscompostos: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/taxas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar taxas");
      const data = await res.json();
      setForm({
        percentualmulta: String(data.percentualmulta ?? 10),
        diascarencia: String(data.diascarencia ?? 5),
        aplicarjuroscompostos: data.aplicarjuroscompostos ?? true,
      });
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar taxas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSave = async () => {
    if (!form.percentualmulta || !form.diascarencia) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/taxas`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          percentualMulta: Number(form.percentualmulta),
          diasCarencia: Number(form.diascarencia),
          aplicarJurosCompostos: form.aplicarjuroscompostos,
          moedaPadrao: "AOA",
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.erro || "Erro ao guardar");
      }
      toast.success("Configurações de taxas guardadas!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const multa = Number(form.percentualmulta) || 0;
  const dias = Number(form.diascarencia) || 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHeader
        title="Taxas e Multas"
        desc="Configure as regras de cobrança automática de propinas e multas por atraso."
      />

      {/* Aviso informativo */}
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <Info size={15} className="text-[#184d8a] mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          As regras definidas aqui são aplicadas automaticamente a todas as
          propinas da instituição. Alterações entram em vigor no próximo ciclo
          de faturação.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Percentual de Multa (%)">
          <Input
            type="number"
            placeholder="Ex: 10"
            value={form.percentualmulta}
            onChange={(v) => setForm({ ...form, percentualmulta: v })}
          />
          <p className="text-[11px] text-gray-400">
            Percentagem cobrada sobre o valor em atraso.
          </p>
        </Field>

        <Field label="Dias de Carência">
          <Input
            type="number"
            placeholder="Ex: 5"
            value={form.diascarencia}
            onChange={(v) => setForm({ ...form, diascarencia: v })}
          />
          <p className="text-[11px] text-gray-400">
            Dias sem multa após a data de vencimento.
          </p>
        </Field>
      </div>

      {/* Toggle juros compostos */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-800">
            Juros compostos
          </p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Juros calculados sobre o valor acumulado (incluindo multas
            anteriores).
          </p>
        </div>
        <Toggle
          checked={form.aplicarjuroscompostos}
          onChange={() =>
            setForm({
              ...form,
              aplicarjuroscompostos: !form.aplicarjuroscompostos,
            })
          }
        />
      </div>

      {/* Moeda fixa */}
      <Field label="Moeda Padrão do Sistema">
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-500 flex items-center gap-2 cursor-not-allowed">
          <span className="font-bold text-gray-700">Kwanza Angolano (AOA)</span>
          <span className="text-[11px] bg-primary/10 text-[#184d8a] px-2 py-0.5 rounded-full font-bold ml-auto shrink-0">
            Padrão permanente
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          A moeda não pode ser alterada no sistema ClassCash.
        </p>
      </Field>

      {/* Pré-visualização */}
      {form.percentualmulta && form.diascarencia && (
        <div className="bg-primary/5 rounded-2xl p-4 border border-[#184d8a]/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[#184d8a]" />
            <p className="text-xs font-bold text-[#184d8a]">
              Pré-visualização da Regra Activa
            </p>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Após{" "}
            <strong>
              {dias} {dias === 1 ? "dia" : "dias"}
            </strong>{" "}
            de atraso no pagamento, será aplicada uma multa de{" "}
            <strong>{multa}%</strong> sobre o valor em dívida, com juros{" "}
            <strong>
              {form.aplicarjuroscompostos ? "compostos" : "simples"}
            </strong>
            , em <strong>Kwanza (AOA)</strong>.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-1">
        <button
          onClick={() =>
            setForm({
              percentualmulta: "10",
              diascarencia: "5",
              aplicarjuroscompostos: true,
            })
          }
          className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all text-xs border border-gray-200"
        >
          Restaurar padrões
        </button>
        <SaveBtn onClick={handleSave} loading={saving} label="Guardar Taxas" />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// TAB UTILIZADORES
// ════════════════════════════════════════════════════════════════
interface Utilizador {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  created_at?: string;
}

const ModalEditarUtilizador = ({
  user,
  onClose,
  onSave,
}: {
  user: Utilizador;
  onClose: () => void;
  onSave: (u: Utilizador) => void;
}) => {
  const [form, setForm] = useState({
    nome: user.nome,
    email: user.email,
    role: user.role,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.nome || !form.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(
        `${API}/configuracoes/utilizadores/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.erro || "Erro ao atualizar");
      }
      toast.success("Utilizador atualizado!");
      onSave({ ...user, ...form });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-primary px-5 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-sm sm:text-base">
              Editar Utilizador
            </h2>
            <p className="text-blue-200 text-xs">
              Altere os dados e permissões
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-[#184d8a] rounded-xl flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
              {form.nome.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-700 text-xs sm:text-sm truncate">
                {form.nome || "—"}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                {form.email || "—"}
              </p>
            </div>
          </div>

          <Field label="Nome Completo">
            <Input
              placeholder="Nome do utilizador"
              value={form.nome}
              onChange={(v) => setForm({ ...form, nome: v })}
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              placeholder="email@escola.ao"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
          </Field>

          <Field label="Permissão / Papel">
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-1.5 ${
                    form.role === r
                      ? "bg-primary text-white border-[#184d8a]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#184d8a] hover:text-[#184d8a]"
                  }`}
                >
                  {form.role === r ? (
                    <ShieldCheck size={11} />
                  ) : (
                    <ShieldOff size={11} />
                  )}
                  {r}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all text-xs sm:text-sm disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            {saving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabUtilizadores = () => {
  const [users, setUsers] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Utilizador | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/utilizadores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar utilizadores");
      setUsers(await res.json());
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleToggle = async (u: Utilizador) => {
    setToggling(u.id);
    try {
      const token = getToken();
      const res = await fetchComAuth(
        `${API}/configuracoes/utilizadores/${u.id}/toggle`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.erro || "Erro ao alterar estado");
      }
      const { ativo } = await res.json();
      setUsers((prev) =>
        prev.map((p) => (p.id === u.id ? { ...p, ativo } : p)),
      );
      toast.success(`${u.nome} ${ativo ? "ativado" : "desativado"}`);
    } catch (err: any) {
      toast.error(err.message || "Erro");
    } finally {
      setToggling(null);
    }
  };

  if (loading) return <Spinner />;

  const ativos = users.filter((u) => u.ativo).length;

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <SectionHeader
          title="Utilizadores do Sistema"
          desc={`${users.length} utilizador${users.length !== 1 ? "es" : ""} registado${users.length !== 1 ? "s" : ""} · ${ativos} activo${ativos !== 1 ? "s" : ""}`}
          action={
            <button
              onClick={carregar}
              className="p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all"
              title="Recarregar"
            >
              <RefreshCw size={14} />
            </button>
          }
        />

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {ativos}
            </p>
            <p className="text-[11px] sm:text-xs text-green-600/70 font-medium mt-0.5">
              Activos
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-500">
              {users.length - ativos}
            </p>
            <p className="text-[11px] sm:text-xs text-red-500/70 font-medium mt-0.5">
              Inactivos
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center sm:col-span-1 col-span-2">
            <p className="text-xl sm:text-2xl font-bold text-[#184d8a]">
              {users.length}
            </p>
            <p className="text-[11px] sm:text-xs text-[#184d8a]/70 font-medium mt-0.5">
              Total
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs sm:text-sm">
            Nenhum utilizador encontrado.
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-2 ${
                  u.ativo
                    ? "bg-gray-50 border-gray-100 hover:border-gray-200"
                    : "bg-red-50/40 border-red-100 opacity-70"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm ${
                      u.ativo
                        ? "bg-primary/10 text-[#184d8a]"
                        : "bg-red-100 text-red-400"
                    }`}
                  >
                    {u.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-700 text-xs sm:text-sm truncate">
                      {u.nome}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {u.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="hidden sm:block text-[11px] sm:text-xs font-semibold text-[#184d8a] bg-blue-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {u.role}
                  </span>
                  <button
                    onClick={() => setEditando(u)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleToggle(u)}
                    disabled={toggling === u.id}
                    className={`w-9 sm:w-10 h-5 rounded-full relative transition-all ${u.ativo ? "bg-green-500" : "bg-gray-300"} disabled:opacity-60`}
                  >
                    {toggling === u.id ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={9} className="animate-spin text-white" />
                      </div>
                    ) : (
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${u.ativo ? "right-0.5" : "left-0.5"}`}
                      />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editando && (
        <ModalEditarUtilizador
          user={editando}
          onClose={() => setEditando(null)}
          onSave={(updated) => {
            setUsers((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p)),
            );
          }}
        />
      )}
    </>
  );
};

// ════════════════════════════════════════════════════════════════
// TAB SEGURANÇA
// ════════════════════════════════════════════════════════════════
const TabSeguranca = () => {
  const [show, setShow] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  });
  const [form, setForm] = useState({ atual: "", nova: "", confirmar: "" });
  const [saving, setSaving] = useState(false);

  const forca = (() => {
    const p = form.nova;
    if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const forcaInfo =
    forca === null
      ? null
      : forca <= 1
        ? { t: "Fraca", cls: "bg-red-400", txt: "text-red-600" }
        : forca === 2
          ? { t: "Média", cls: "bg-yellow-400", txt: "text-yellow-600" }
          : forca === 3
            ? { t: "Boa", cls: "bg-blue-400", txt: "text-blue-600" }
            : { t: "Forte", cls: "bg-green-500", txt: "text-green-600" };

  const handleChange = async () => {
    if (!form.atual || !form.nova || !form.confirmar) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (form.nova !== form.confirmar) {
      toast.error("As novas senhas não coincidem");
      return;
    }
    if (form.nova.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API}/configuracoes/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual: form.atual, novaSenha: form.nova }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.erro || "Erro ao alterar");
      }
      toast.success("Senha alterada com sucesso!");
      setForm({ atual: "", nova: "", confirmar: "" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar senha");
    } finally {
      setSaving(false);
    }
  };

  const campos = [
    { label: "Senha Actual", key: "atual" as const, showKey: "atual" as const },
    { label: "Nova Senha", key: "nova" as const, showKey: "nova" as const },
    {
      label: "Confirmar Nova Senha",
      key: "confirmar" as const,
      showKey: "confirmar" as const,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHeader
        title="Segurança da Conta"
        desc="Altere a sua palavra-passe para manter a conta segura. Recomendamos uma senha forte com letras, números e símbolos."
      />

      <div className="flex items-start gap-3 p-3 sm:p-4 bg-orange-50 border border-orange-100 rounded-2xl">
        <AlertTriangle size={15} className="text-orange-500 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs text-orange-700">
          Nunca partilhe a sua senha. A alteração entra em vigor imediatamente
          no sistema ClassCash.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {campos.map(({ label, key, showKey }) => (
          <Field key={key} label={label}>
            <div className="relative">
              <input
                type={show[showKey] ? "text" : "password"}
                placeholder="••••••••"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((p) => ({ ...p, [showKey]: !p[showKey] }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {key === "nova" && forcaInfo && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-7 sm:w-8 rounded-full transition-all ${i <= (forca ?? 0) ? forcaInfo.cls : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <span className={`text-[11px] font-bold ${forcaInfo.txt}`}>
                  {forcaInfo.t}
                </span>
              </div>
            )}

            {key === "confirmar" && form.confirmar && form.nova && (
              <p
                className={`text-[11px] font-bold ${form.nova === form.confirmar ? "text-green-600" : "text-red-500"}`}
              >
                {form.nova === form.confirmar
                  ? "✓ As senhas coincidem"
                  : "✗ As senhas não coincidem"}
              </p>
            )}
          </Field>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <SaveBtn
          onClick={handleChange}
          loading={saving}
          label="Alterar Senha"
          disabled={
            !form.atual ||
            !form.nova ||
            !form.confirmar ||
            form.nova !== form.confirmar
          }
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// TAB NOTIFICAÇÕES
// ════════════════════════════════════════════════════════════════
const TabNotificacoes = () => {
  const [prefs, setPrefs] = useState([
    {
      id: "propinas",
      label: "Propinas em atraso",
      desc: "Alerta quando uma propina ultrapassa a data limite",
      ativo: true,
      icon: <DollarSign size={14} className="text-red-500" />,
    },
    {
      id: "pagamentos",
      label: "Novos pagamentos",
      desc: "Notificação quando um pagamento é registado no sistema",
      ativo: true,
      icon: <CheckCircle size={14} className="text-green-500" />,
    },
    {
      id: "reclamacoes",
      label: "Novas reclamações",
      desc: "Alerta quando um encarregado submete uma reclamação",
      ativo: false,
      icon: <Bell size={14} className="text-amber-500" />,
    },
    {
      id: "relatorios",
      label: "Relatórios semanais",
      desc: "Resumo automático enviado por email toda a semana",
      ativo: true,
      icon: <Settings size={14} className="text-blue-500" />,
    },
  ]);

  const toggle = (id: string) =>
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)),
    );

  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionHeader
        title="Preferências de Notificação"
        desc="Escolha que alertas e avisos pretende receber enquanto utiliza o ClassCash."
      />

      <div className="space-y-2 sm:space-y-3">
        {prefs.map((p) => (
          <div
            key={p.id}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-3 ${
              p.ativo
                ? "bg-gray-50 border-gray-100"
                : "bg-white border-gray-100 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                {p.icon}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-700 text-xs sm:text-sm">
                  {p.label}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 line-clamp-2">
                  {p.desc}
                </p>
              </div>
            </div>
            <Toggle checked={p.ativo} onChange={() => toggle(p.id)} />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <SaveBtn
          onClick={() => toast.success("Preferências guardadas!")}
          label="Guardar Preferências"
        />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function Configuracao() {
  const [activeTab, setActiveTab] = useState<TabId>("geral");
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;
    setUser(sessao.usuario);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "geral":
        return <TabGeral />;
      case "pagamentos":
        return <TabPagamentos />;
      case "usuarios":
        return <TabUtilizadores />;
      case "seguranca":
        return <TabSeguranca />;
      case "notificacoes":
        return <TabNotificacoes />;
    }
  };

  const activeTabInfo = TABS.find((t) => t.id === activeTab);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <MenuAdmin />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          titulo="Configurações"
          usuario={
            user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null
          }
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* ── Mobile: tabs com scroll horizontal ── */}
          <div className="lg:hidden px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
            <div
              className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-400 border border-gray-200 hover:border-[#184d8a]/30"
                  }`}
                >
                  {tab.icon}
                  {tab.labelShort}
                </button>
              ))}
            </div>
          </div>

          {/* ── Layout principal ── */}
          <div className="flex-1 overflow-hidden flex p-3 sm:p-4 lg:p-6 xl:p-8 gap-4 sm:gap-5 lg:gap-6">
            {/* ── Sidebar desktop ── */}
            <aside className="hidden lg:flex w-56 xl:w-64 flex-col gap-1 flex-shrink-0 self-start">
              {/* Título */}
              <div className="px-4 pb-3 mb-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Menu
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl transition-all text-left group ${
                      activeTab === tab.id
                        ? "bg-primary shadow-md"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 shrink-0 ${activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-[#184d8a]"}`}
                    >
                      {tab.icon}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight ${activeTab === tab.id ? "text-white" : "text-gray-600 group-hover:text-gray-800"}`}
                      >
                        {tab.label}
                      </p>
                      <p
                        className={`text-[10px] mt-0.5 ${activeTab === tab.id ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Info do utilizador */}
              {user && (
                <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 text-[#184d8a] rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                      {user.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-700 text-xs truncate">
                        {user.nome}
                      </p>
                      <p className="text-[10px] text-gray-400">Sessão activa</p>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* ── Conteúdo ── */}
            <section className="flex-1 min-w-0 overflow-y-auto">
              {/* Breadcrumb / título da secção */}
              <div className="mb-4 sm:mb-5 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-[#184d8a]`}
                >
                  {activeTabInfo?.icon}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-800">
                    {activeTabInfo?.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {activeTabInfo?.desc}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6">
                {renderContent()}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
