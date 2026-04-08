// ════════════════════════════════════════════════════════════════
// FICHEIRO: src/Pages/Secretaria/Configuracao.tsx
// Melhorias: Tabs funcionais, responsividade, validação de formulário,
//            modal de confirmação de alterações
// ════════════════════════════════════════════════════════════════
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import {
  Bell, DollarSign, Lock, Settings, Users, X,
  CheckCircle, Eye, EyeOff, Save, AlertTriangle, Plus, Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TabId = "geral" | "pagamentos" | "usuarios" | "seguranca" | "notificacoes";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "geral", label: "Geral", icon: <Settings size={16} /> },
  { id: "pagamentos", label: "Taxas e Multas", icon: <DollarSign size={16} /> },
  { id: "usuarios", label: "Utilizadores", icon: <Users size={16} /> },
  { id: "seguranca", label: "Segurança", icon: <Lock size={16} /> },
  { id: "notificacoes", label: "Notificações", icon: <Bell size={16} /> },
];

/* ── Modal de Confirmação de Guardar ── */
const ModalConfirmar = ({ onClose, onConfirm, saving }: {
  onClose: () => void; onConfirm: () => void; saving: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={24} className="text-green-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Guardar Alterações</h2>
      <p className="text-gray-500 text-sm mb-6">As alterações serão aplicadas imediatamente em todo o sistema. Confirmas?</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">Cancelar</button>
        <button onClick={onConfirm} disabled={saving} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#184d8a] hover:bg-[#1a5fad] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          Guardar
        </button>
      </div>
    </div>
  </div>
);

/* ── Tab: Taxas e Multas ── */
const TabPagamentos = () => {
  const [form, setForm] = useState({ percentual: "10", carencia: "5", jurosCompostos: true, moeda: "AOA" });
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Configurações de pagamento guardadas!");
    setSaving(false);
    setShowModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Configuração de Taxas e Multas</h3>
          <p className="text-xs text-gray-400">Defina os valores automáticos aplicados ao sistema.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 ml-1">Percentual de Multa (%)</label>
            <input
              type="number"
              placeholder="Ex: 10"
              value={form.percentual}
              onChange={e => setForm({ ...form, percentual: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
            <p className="text-[11px] text-gray-400 ml-1">Percentual aplicado após {form.carencia || "N"} dias de atraso.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 ml-1">Dias de Carência</label>
            <input
              type="number"
              placeholder="Ex: 5"
              value={form.carencia}
              onChange={e => setForm({ ...form, carencia: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
            <p className="text-[11px] text-gray-400 ml-1">Dias antes de a multa ser aplicada.</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
          <div>
            <p className="text-sm font-bold text-blue-900">Aplicar juros compostos?</p>
            <p className="text-[11px] text-blue-700/70 font-medium mt-0.5">Os juros serão calculados sobre o valor acumulado.</p>
          </div>
          <button
            onClick={() => setForm({ ...form, jurosCompostos: !form.jurosCompostos })}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.jurosCompostos ? "bg-[#184d8a]" : "bg-gray-300"}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${form.jurosCompostos ? "right-1" : "left-1"}`} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">Moeda Padrão</label>
          <select
            value={form.moeda}
            onChange={e => setForm({ ...form, moeda: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#184d8a]/20 text-sm cursor-pointer"
          >
            <option value="AOA">Kwanza (KZ)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        {/* Preview */}
        {form.percentual && form.carencia && (
          <div className="bg-[#184d8a]/5 rounded-xl p-4 border border-[#184d8a]/10">
            <p className="text-xs font-bold text-[#184d8a] mb-2">Pré-visualização da Regra</p>
            <p className="text-sm text-gray-600">
              Após <strong>{form.carencia} dias</strong> de atraso, será aplicada uma multa de{" "}
              <strong>{form.percentual}%</strong> {form.jurosCompostos ? "com juros compostos" : "simples"} na moeda{" "}
              <strong>{form.moeda}</strong>.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setForm({ percentual: "10", carencia: "5", jurosCompostos: true, moeda: "AOA" })}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all text-sm"
          >
            Restaurar padrões
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#184d8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/50 transition-all text-sm flex items-center gap-2"
          >
            <Save size={15} /> Guardar
          </button>
        </div>
      </div>

      {showModal && <ModalConfirmar onClose={() => setShowModal(false)} onConfirm={handleSave} saving={saving} />}
    </>
  );
};

/* ── Tab: Geral ── */
const TabGeral = () => {
  const [form, setForm] = useState({ escola: "Escola Primária Exemplo", ano: "2024/2025", email: "secretaria@escola.ao", tel: "" });

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">Informações da Instituição</h3>
        <p className="text-xs text-gray-400">Dados gerais da escola visíveis nos documentos gerados.</p>
      </div>
      {[
        { label: "Nome da Escola", key: "escola", placeholder: "Nome da instituição" },
        { label: "Ano Lectivo", key: "ano", placeholder: "Ex: 2024/2025" },
        { label: "Email de Contacto", key: "email", placeholder: "secretaria@escola.ao" },
        { label: "Telefone", key: "tel", placeholder: "+244 900 000 000" },
      ].map(({ label, key, placeholder }) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={(form as any)[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
          />
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button className="bg-[#184d8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/50 transition-all text-sm flex items-center gap-2">
          <Save size={15} /> Guardar
        </button>
      </div>
    </div>
  );
};

/* ── Tab: Utilizadores ── */
const USERS_MOCK = [
  { id: 1, nome: "Admin Principal", email: "admin@escola.ao", role: "Administrador", ativo: true },
  { id: 2, nome: "Secretária Maria", email: "maria@escola.ao", role: "Secretária", ativo: true },
  { id: 3, nome: "Contabilidade João", email: "joao@escola.ao", role: "Financeiro", ativo: false },
];

const TabUtilizadores = () => {
  const [users, setUsers] = useState(USERS_MOCK);
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Utilizadores do Sistema</h3>
          <p className="text-xs text-gray-400">Gerencie os acessos ao sistema.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#184d8a] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1a5fad] transition-all">
          <Plus size={15} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#184d8a]/10 text-[#184d8a] rounded-xl flex items-center justify-center font-bold text-sm">
                {u.nome.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm">{u.nome}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#184d8a] bg-blue-50 px-2.5 py-1 rounded-full hidden sm:block">{u.role}</span>
              <div
                onClick={() => setUsers(prev => prev.map(p => p.id === u.id ? { ...p, ativo: !p.ativo } : p))}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${u.ativo ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${u.ativo ? "right-0.5" : "left-0.5"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Tab: Segurança ── */
const TabSeguranca = () => {
  const [show, setShow] = useState({ atual: false, nova: false, confirmar: false });
  const [form, setForm] = useState({ atual: "", nova: "", confirmar: "" });

  const handleChange = () => {
    if (!form.atual || !form.nova || !form.confirmar) { toast.error("Preencha todos os campos"); return; }
    if (form.nova !== form.confirmar) { toast.error("As palavras-passe não coincidem"); return; }
    if (form.nova.length < 8) { toast.error("A palavra-passe deve ter pelo menos 8 caracteres"); return; }
    toast.success("Palavra-passe alterada com sucesso!");
    setForm({ atual: "", nova: "", confirmar: "" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">Segurança da Conta</h3>
        <p className="text-xs text-gray-400">Altere a sua palavra-passe regularmente.</p>
      </div>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-orange-700">Use uma palavra-passe forte com letras, números e símbolos. Nunca a partilhe.</p>
      </div>
      {[
        { label: "Palavra-passe Actual", key: "atual", showKey: "atual" as const },
        { label: "Nova Palavra-passe", key: "nova", showKey: "nova" as const },
        { label: "Confirmar Nova Palavra-passe", key: "confirmar", showKey: "confirmar" as const },
      ].map(({ label, key, showKey }) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
          <div className="relative">
            <input
              type={show[showKey] ? "text" : "password"}
              placeholder="••••••••"
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] transition-all text-sm"
            />
            <button
              onClick={() => setShow(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all"
            >
              {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button onClick={handleChange} className="bg-[#184d8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/50 transition-all text-sm flex items-center gap-2">
          <Lock size={15} /> Alterar Palavra-passe
        </button>
      </div>
    </div>
  );
};

/* ── Tab: Notificações ── */
const TabNotificacoes = () => {
  const [prefs, setPrefs] = useState([
    { id: "propinas", label: "Propinas em atraso", desc: "Alerta quando uma propina passa da data limite", ativo: true },
    { id: "pagamentos", label: "Novos pagamentos", desc: "Notificação quando um pagamento é registado", ativo: true },
    { id: "reclamacoes", label: "Novas reclamações", desc: "Alerta quando uma reclamação é submetida", ativo: false },
    { id: "relatorios", label: "Relatórios semanais", desc: "Resumo semanal automático por email", ativo: true },
  ]);

  const toggle = (id: string) => setPrefs(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">Preferências de Notificação</h3>
        <p className="text-xs text-gray-400">Escolha que alertas deseja receber.</p>
      </div>
      <div className="space-y-3">
        {prefs.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex-1 mr-4">
              <p className="font-bold text-gray-700 text-sm">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => toggle(p.id)}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0 ${p.ativo ? "bg-[#184d8a]" : "bg-gray-300"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${p.ativo ? "right-1" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button onClick={() => toast.success("Preferências guardadas!")} className="bg-[#184d8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#1a5fad] shadow-lg shadow-blue-200/50 transition-all text-sm flex items-center gap-2">
          <Save size={15} /> Guardar
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  geral: <TabGeral />,
  pagamentos: <TabPagamentos />,
  usuarios: <TabUtilizadores />,
  seguranca: <TabSeguranca />,
  notificacoes: <TabNotificacoes />,
};

export default function Configuracao() {
  const [activeTab, setActiveTab] = useState<TabId>("pagamentos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <Header
          titulo="Configurações do Sistema"
          usuario={user ? <Avatar name={user.nome} src={user.foto} size="sm" /> : null}
        />


        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Mobile Tab Selector */}
          <div className="md:hidden px-4 pt-4 pb-2 overflow-x-auto flex gap-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#184d8a] text-white shadow-md"
                    : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex p-4 sm:p-6 lg:p-8 gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-56 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-1 flex-col flex-shrink-0 self-start">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-[#184d8a] text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </aside>

            {/* Content */}
            <section className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto">
              {TAB_CONTENT[activeTab]}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}