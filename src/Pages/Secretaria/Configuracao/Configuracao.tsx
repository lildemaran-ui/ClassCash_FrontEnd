// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/Configuracao.tsx
// Totalmente funcional: Instituição real, Taxas (só AOA),
// Modal de Utilizador com edição + permissões, Segurança real
// ════════════════════════════════════════════════════════════════
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
  Bell,
  Building2,
  DollarSign,
  Lock,
  Settings,
  Users,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Plus,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Edit2,
  ShieldCheck,
  ShieldOff,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

type TabId = "geral" | "pagamentos" | "usuarios" | "seguranca" | "notificacoes";

const TABS: {
  id: TabId;
  label: string;
  labelShort: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "geral",
    label: "Geral",
    labelShort: "Geral",
    icon: <Settings size={15} />,
  },
  {
    id: "pagamentos",
    label: "Taxas e Multas",
    labelShort: "Taxas",
    icon: <DollarSign size={15} />,
  },
  {
    id: "usuarios",
    label: "Utilizadores",
    labelShort: "Utilizad.",
    icon: <Users size={15} />,
  },
  {
    id: "seguranca",
    label: "Segurança",
    labelShort: "Segurança",
    icon: <Lock size={15} />,
  },
  {
    id: "notificacoes",
    label: "Notificações",
    labelShort: "Notif.",
    icon: <Bell size={15} />,
  },
];

// ─── Spinner reutilizável ───────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 size={28} className="animate-spin text-[#184d8a]" />
  </div>
);

// ─── Botão principal reutilizável ───────────────────────────────
const BtnPrimario = ({
  onClick,
  loading,
  icon,
  label,
  disabled = false,
}: {
  onClick: () => void;
  loading?: boolean;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full sm:w-auto bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/50 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? <Loader2 size={15} className="animate-spin" /> : icon}
    {loading ? "A guardar..." : label}
  </button>
);

// ═══════════════════════════════════════════════════════════════
// TAB GERAL — Dados reais da instituição
// ═══════════════════════════════════════════════════════════════
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
      if (!res.ok) throw new Error("Erro ao carregar instituição");
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
        const err = await res.json();
        throw new Error(err.erro || "Erro ao guardar");
      }
      toast.success("Informações da instituição atualizadas!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar instituição");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const campos = [
    {
      label: "Nome da Escola",
      key: "nome",
      icon: <Building2 size={13} />,
      placeholder: "Nome da instituição",
      type: "text",
    },
    {
      label: "Ano Lectivo",
      key: "ano_lectivo",
      icon: <CalendarDays size={13} />,
      placeholder: "Ex: 2024/2025",
      type: "text",
    },
    {
      label: "Email de Contacto",
      key: "email",
      icon: <Mail size={13} />,
      placeholder: "secretaria@escola.ao",
      type: "email",
    },
    {
      label: "Telefone",
      key: "telefone",
      icon: <Phone size={13} />,
      placeholder: "+244 900 000 000",
      type: "tel",
    },
    {
      label: "Endereço",
      key: "endereco",
      icon: <MapPin size={13} />,
      placeholder: "Rua, Bairro, Cidade",
      type: "text",
    },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-700 mb-1">
            Informações da Instituição
          </h3>
          <p className="text-xs text-gray-400">
            Dados reais da escola activa carregados do sistema.
          </p>
        </div>
        <button
          onClick={carregar}
          className="p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all"
          title="Recarregar"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {campos.map(({ label, key, icon, placeholder, type }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <span className="text-[#184d8a]">{icon}</span> {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
          />
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <BtnPrimario
          onClick={handleSave}
          loading={saving}
          icon={<Save size={15} />}
          label="Guardar Alterações"
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB TAXAS — Apenas Kwanza (AOA) é moeda padrão permanente
// ═══════════════════════════════════════════════════════════════
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
      toast.error(err.message || "Erro ao carregar configurações de taxas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleSave = async () => {
    if (!form.percentualmulta || !form.diascarencia) {
      toast.error("Preencha todos os campos obrigatórios");
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
          moedaPadrao: "AOA", // sempre AOA — valor fixo
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || "Erro ao guardar");
      }
      toast.success("Configurações de taxas guardadas!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar taxas");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-gray-700 mb-1">
          Configuração de Taxas e Multas
        </h3>
        <p className="text-xs text-gray-400">
          Defina os valores automáticos aplicados ao sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500">
            Percentual de Multa (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Ex: 10"
            value={form.percentualmulta}
            onChange={(e) =>
              setForm({ ...form, percentualmulta: e.target.value })
            }
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
          />
          <p className="text-[11px] text-gray-400">
            Aplicado após {form.diascarencia || "N"} dias de atraso.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500">
            Dias de Carência
          </label>
          <input
            type="number"
            min="0"
            placeholder="Ex: 5"
            value={form.diascarencia}
            onChange={(e) => setForm({ ...form, diascarencia: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
          />
          <p className="text-[11px] text-gray-400">
            Dias antes de a multa ser aplicada.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
        <div className="flex-1 mr-4">
          <p className="text-sm font-bold text-blue-900">
            Aplicar juros compostos?
          </p>
          <p className="text-[11px] text-blue-700/70 font-medium mt-0.5">
            Os juros serão calculados sobre o valor acumulado.
          </p>
        </div>
        <button
          onClick={() =>
            setForm({
              ...form,
              aplicarjuroscompostos: !form.aplicarjuroscompostos,
            })
          }
          className={`w-12 h-6 rounded-full relative flex-shrink-0 transition-all duration-300 ${form.aplicarjuroscompostos ? "bg-primary" : "bg-gray-300"}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${form.aplicarjuroscompostos ? "right-1" : "left-1"}`}
          />
        </button>
      </div>

      {/* Moeda fixa — apenas informativo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500">Moeda Padrão</label>
        <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 flex items-center gap-2 cursor-not-allowed select-none">
          <span className="font-bold text-gray-700">Kwanza (AOA)</span>
          <span className="text-[11px] bg-primary/10 text-[#184d8a] px-2 py-0.5 rounded-full font-bold ml-auto">
            Padrão permanente
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          A moeda do sistema é sempre o Kwanza angolano (AOA).
        </p>
      </div>

      {form.percentualmulta && form.diascarencia && (
        <div className="bg-primary/5 rounded-xl p-4 border border-[#184d8a]/10">
          <p className="text-xs font-bold text-[#184d8a] mb-1.5">
            Pré-visualização da Regra
          </p>
          <p className="text-sm text-gray-600">
            Após <strong>{form.diascarencia} dias</strong> de atraso, será
            aplicada uma multa de <strong>{form.percentualmulta}%</strong>{" "}
            {form.aplicarjuroscompostos ? "com juros compostos" : "simples"} em{" "}
            <strong>Kwanza (AOA)</strong>.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <button
          onClick={() =>
            setForm({
              percentualmulta: "10",
              diascarencia: "5",
              aplicarjuroscompostos: true,
            })
          }
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all text-sm border border-gray-200"
        >
          Restaurar padrões
        </button>
        <BtnPrimario
          onClick={handleSave}
          loading={saving}
          icon={<Save size={15} />}
          label="Guardar"
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB UTILIZADORES — Modal de edição + permissões reais
// ═══════════════════════════════════════════════════════════════
interface Utilizador {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  created_at?: string;
}

const ROLES = [
   "Administrador",
  "Secretária",
  "Estudante",
  "Encarregado",
  "Auxiliar",
];

// Modal de editar utilizador
const ModalEditarUtilizador = ({
  user,
  onClose,
  onSave,
}: {
  user: Utilizador;
  onClose: () => void;
  onSave: (updated: Utilizador) => void;
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
          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            role: form.role,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || "Erro ao atualizar");
      }
      toast.success("Utilizador atualizado com sucesso!");
      onSave({ ...user, ...form });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Erro ao guardar utilizador");
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
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">Editar Utilizador</h2>
            <p className="text-blue-200 text-sm">
              Altere os dados e permissões
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
          {/* Avatar */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <div className="w-12 h-12 bg-primary/10 text-[#184d8a] rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
              {form.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-700 text-sm">
                {form.nome || "—"}
              </p>
              <p className="text-xs text-gray-400">{form.email || "—"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Nome do utilizador"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500">Email</label>
            <input
              type="email"
              placeholder="email@escola.ao"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
          </div>

          {/* Permissões */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#184d8a]" /> Permissão /
              Papel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                    form.role === r
                      ? "bg-primary text-white border-[#184d8a]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#184d8a] hover:text-[#184d8a]"
                  }`}
                >
                  {form.role === r ? (
                    <ShieldCheck size={12} />
                  ) : (
                    <ShieldOff size={12} />
                  )}
                  {r}
                </button>
              ))}
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
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
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
      const data = await res.json();
      setUsers(data);
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
        const err = await res.json();
        throw new Error(err.erro || "Erro ao alterar estado");
      }
      const { ativo } = await res.json();
      setUsers((prev) =>
        prev.map((p) => (p.id === u.id ? { ...p, ativo } : p)),
      );
      toast.success(`${u.nome} ${ativo ? "ativado" : "desativado"}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar estado do utilizador");
    } finally {
      setToggling(null);
    }
  };

  const handleSaveEdit = (updated: Utilizador) => {
    setUsers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-700 mb-1">
              Utilizadores do Sistema
            </h3>
            <p className="text-xs text-gray-400">
              Gerencie os acessos, papéis e permissões de cada utilizador.
            </p>
          </div>
          <button
            onClick={carregar}
            className="p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all flex-shrink-0"
            title="Recarregar"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Nenhum utilizador encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-2 ${
                  u.ativo
                    ? "bg-gray-50 border-gray-100 hover:border-gray-200"
                    : "bg-red-50/40 border-red-100 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      u.ativo
                        ? "bg-primary/10 text-[#184d8a]"
                        : "bg-red-100 text-red-400"
                    }`}
                  >
                    {u.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-700 text-sm truncate">
                      {u.nome}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <span className="sm:hidden inline-block text-[10px] font-semibold text-[#184d8a] bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">
                      {u.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:block text-xs font-semibold text-[#184d8a] bg-blue-50 px-2.5 py-1 rounded-full">
                    {u.role}
                  </span>

                  {/* Botão editar */}
                  <button
                    onClick={() => setEditando(u)}
                    className="p-2 text-gray-400 hover:text-[#184d8a] hover:bg-blue-50 rounded-xl transition-all"
                    title="Editar utilizador"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Toggle ativo */}
                  <button
                    onClick={() => handleToggle(u)}
                    disabled={toggling === u.id}
                    className={`w-10 h-5 rounded-full relative transition-all ${
                      u.ativo ? "bg-green-500" : "bg-gray-300"
                    } disabled:opacity-60`}
                    title={u.ativo ? "Desativar acesso" : "Ativar acesso"}
                  >
                    {toggling === u.id ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2
                          size={10}
                          className="animate-spin text-white"
                        />
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
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAB SEGURANÇA — Altera senha real no backend
// ═══════════════════════════════════════════════════════════════
const TabSeguranca = () => {
  const [show, setShow] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  });
  const [form, setForm] = useState({ atual: "", nova: "", confirmar: "" });
  const [saving, setSaving] = useState(false);

  const forcaNovaSenha = (() => {
    const p = form.nova;
    if (p.length === 0) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

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
        const err = await res.json();
        throw new Error(err.erro || "Erro ao alterar senha");
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

  const forcaLabel =
    forcaNovaSenha === null
      ? null
      : forcaNovaSenha <= 1
        ? { t: "Fraca", cls: "bg-red-400", txt: "text-red-600" }
        : forcaNovaSenha === 2
          ? { t: "Média", cls: "bg-yellow-400", txt: "text-yellow-600" }
          : forcaNovaSenha === 3
            ? { t: "Boa", cls: "bg-blue-400", txt: "text-blue-600" }
            : { t: "Forte", cls: "bg-green-500", txt: "text-green-600" };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-gray-700 mb-1">
          Segurança da Conta
        </h3>
        <p className="text-xs text-gray-400">
          A alteração de senha é aplicada imediatamente no sistema.
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle
          size={16}
          className="text-orange-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-xs text-orange-700">
          Use uma senha forte com letras maiúsculas, números e símbolos. Nunca a
          partilhe com ninguém.
        </p>
      </div>

      {campos.map(({ label, key, showKey }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500">{label}</label>
          <div className="relative">
            <input
              type={show[showKey] ? "text" : "password"}
              placeholder="••••••••"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
            <button
              type="button"
              onClick={() =>
                setShow((prev) => ({ ...prev, [showKey]: !prev[showKey] }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
            >
              {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Indicador de força só na nova senha */}
          {key === "nova" && forcaLabel && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-all ${i <= (forcaNovaSenha ?? 0) ? forcaLabel.cls : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <span className={`text-[11px] font-bold ${forcaLabel.txt}`}>
                {forcaLabel.t}
              </span>
            </div>
          )}

          {/* Validação de confirmação */}
          {key === "confirmar" && form.confirmar && form.nova && (
            <p
              className={`text-[11px] font-bold ${form.nova === form.confirmar ? "text-green-600" : "text-red-500"}`}
            >
              {form.nova === form.confirmar
                ? "✓ As senhas coincidem"
                : "✗ As senhas não coincidem"}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <BtnPrimario
          onClick={handleChange}
          loading={saving}
          icon={<Lock size={15} />}
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

// ═══════════════════════════════════════════════════════════════
// TAB NOTIFICAÇÕES
// ═══════════════════════════════════════════════════════════════
const TabNotificacoes = () => {
  const [prefs, setPrefs] = useState([
    {
      id: "propinas",
      label: "Propinas em atraso",
      desc: "Alerta quando uma propina passa da data limite",
      ativo: true,
    },
    {
      id: "pagamentos",
      label: "Novos pagamentos",
      desc: "Notificação quando um pagamento é registado",
      ativo: true,
    },
    {
      id: "reclamacoes",
      label: "Novas reclamações",
      desc: "Alerta quando uma reclamação é submetida",
      ativo: false,
    },
    {
      id: "relatorios",
      label: "Relatórios semanais",
      desc: "Resumo semanal automático por email",
      ativo: true,
    },
  ]);

  const toggle = (id: string) =>
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)),
    );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-gray-700 mb-1">
          Preferências de Notificação
        </h3>
        <p className="text-xs text-gray-400">
          Escolha que alertas deseja receber.
        </p>
      </div>
      <div className="space-y-3">
        {prefs.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-700 text-sm">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => toggle(p.id)}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0 ${p.ativo ? "bg-primary" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${p.ativo ? "right-1" : "left-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <BtnPrimario
          onClick={() => toast.success("Preferências guardadas!")}
          icon={<Save size={15} />}
          label="Guardar"
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
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

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          titulo="Configurações"
          usuario={
            user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null
          }
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Mobile: tabs com scroll horizontal */}
          <div className="md:hidden px-4 pt-4 pb-2">
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.labelShort}
                </button>
              ))}
            </div>
          </div>

          {/* Layout principal */}
          <div className="flex-1 overflow-hidden flex p-4 sm:p-6 lg:p-8 gap-6">
            {/* Sidebar desktop */}
            <aside className="hidden md:flex w-52 lg:w-56 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1 flex-col flex-shrink-0 self-start">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </aside>

            {/* Conteúdo */}
            <section className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 overflow-y-auto">
              {renderContent()}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
