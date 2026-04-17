// src/Pages/Administrador/PermissoesAcessos.tsx
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
  AlertCircle,
  ChevronDown,
  Crown,
  Loader2,
  Lock,
  RefreshCw,
  Shield,
  Unlock,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

// ─── Toggle Switch ────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean;
  onChange: () => void;
  size?: "sm" | "md";
}) {
  const track = size === "sm" ? "w-8 h-4" : "w-11 h-6";
  const thumb =
    size === "sm" ? "w-3 h-3 top-0.5 left-0.5" : "w-4 h-4 top-1 left-1";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${track} ${checked ? "bg-[#184d8a]" : "bg-gray-200"}`}
    >
      <span
        className={`pointer-events-none inline-block rounded-full bg-white transform transition-transform duration-200 ease-in-out absolute ${thumb} ${checked ? translate : "translate-x-0"}`}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
      />
    </button>
  );
}

// ─── Tipos ────────────────────────────────────────────────────
type Perfil = "Encarregado" | "Estudante" | "Instituição";
type StatusAcesso = "Ativo" | "Inativo" | "Bloqueado";

interface Utilizador {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  instituicao: string;
  status: StatusAcesso;
  planoActivo: boolean;
  ultimoAcesso: string;
}

const ABAS_Instituição = [
  { id: "pagamentos", label: "Pagamentos", requerPlano: false },
  { id: "alunos", label: "Gestão de Alunos", requerPlano: false },
  { id: "propinas", label: "Propinas", requerPlano: true },
  { id: "multas", label: "Módulo de Multas", requerPlano: true },
  { id: "relatorios", label: "Relatórios", requerPlano: true },
  { id: "reclamacoes", label: "Reclamações", requerPlano: false },
  { id: "encarregados", label: "Encarregados", requerPlano: false },
];

const BADGE: Record<Perfil, { cor: string; icon: React.ElementType }> = {
  Encarregado: { cor: "bg-purple-100 text-purple-700", icon: Crown },
  Estudante: { cor: "bg-blue-100 text-blue-700", icon: Shield },
  Instituição: { cor: "bg-gray-100 text-gray-600", icon: Lock },
};

const STATUS_COR: Record<StatusAcesso, string> = {
  Ativo: "bg-green-100 text-green-700",
  Inativo: "bg-gray-100 text-gray-500",
  Bloqueado: "bg-red-100 text-red-600",
};

// ─── Modal Novo Admin ─────────────────────────────────────────
function ModalNovoAdmin({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "Encarregado",
  });
  const [loading, setLoading] = useState(false);

  const handleCriar = async () => {
    if (!form.nome || !form.email || !form.senha) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/cadastroAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Erro ao criar administrador",
        );
      toast.success("Administrador criado com sucesso!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 sm:p-5 border-b">
          <h2 className="font-bold text-gray-800 text-sm sm:text-base">
            Adicionar Novo Administrador
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          {[
            {
              label: "Nome Completo",
              key: "nome",
              type: "text",
              placeholder: "Nome do administrador",
            },
            {
              label: "Email",
              key: "email",
              type: "email",
              placeholder: "email@classcash.ao",
            },
            {
              label: "Palavra-passe Provisória",
              key: "senha",
              type: "password",
              placeholder: "Mín. 8 caracteres",
            },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] outline-none transition-all"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tipo de Perfil
            </label>
            <div className="relative">
              <select
                value={form.perfil}
                onChange={(e) => setForm({ ...form, perfil: e.target.value })}
                className="appearance-none w-full border border-gray-200 rounded-xl py-2.5 pl-3 pr-8 text-xs sm:text-sm focus:ring-2 focus:ring-[#184d8a]/20 focus:border-[#184d8a] outline-none transition-all"
              >
                <option>Encarregado</option>
                <option>Estudante</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 sm:p-5 bg-gray-50 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-600 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleCriar}
            disabled={loading}
            className="flex items-center gap-2 bg-[#184d8a] text-white text-xs sm:text-sm font-medium py-2 px-4 sm:px-5 rounded-xl hover:bg-[#184d8a]/80 transition-colors shadow disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {loading ? "A criar..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card mobile ──────────────────────────────────────────────
function UtilizadorCard({
  u,
  onToggleStatus,
  onTogglePlano,
}: {
  u: Utilizador;
  onToggleStatus: () => void;
  onTogglePlano: () => void;
}) {
  const BadgeIcon = BADGE[u.perfil]?.icon ?? Lock; // ✅ fallback
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-xs sm:text-sm truncate">
            {u.nome}
          </p>
          <p className="text-xs text-gray-400 truncate">{u.email}</p>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${STATUS_COR[u.status] ?? "bg-gray-100 text-gray-500"}`}
        >
          {u.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[u.perfil]?.cor ?? "bg-gray-100 text-gray-600"}`}
        >
          {" "}
          {/* ✅ fallback */}
          <BadgeIcon className="w-3 h-3" />
          {u.perfil}
        </span>
        {u.instituicao !== "—" && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full truncate max-w-[140px]">
            {u.instituicao}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 gap-4">
        <div className="flex items-center gap-2">
          <Toggle checked={u.planoActivo} onChange={onTogglePlano} size="sm" />
          <span
            className={`text-xs font-medium ${u.planoActivo ? "text-[#184d8a]" : "text-gray-400"}`}
          >
            Plano {u.planoActivo ? "activo" : "inactivo"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{u.ultimoAcesso}</span>
          <Toggle
            checked={u.status === "Ativo"}
            onChange={onToggleStatus}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────
export default function PermissoesAcessos() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAdmin, setModalAdmin] = useState(false);
  const [filtro, setFiltro] = useState<Perfil | "Todos">("Todos");
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  const fetchPermissoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetchComAuth(`${API_BASE}/PermissoesAcesso`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar permissões");
      const rows = await res.json();

      // Mapear resposta do backend para o tipo Utilizador
      const mapped: Utilizador[] = rows.map((r: any, i: number) => ({
        id: r.idusuario ?? i,
        nome: r.nome,
        email: r.email,
        perfil: r.perfil as Perfil,
        instituicao: r.instituicao || "—",
        status: (r.status as StatusAcesso) || "Ativo",
        planoActivo: r.plano_ativo === "Ativo",
        ultimoAcesso: r.ultimo_acesso
          ? new Date(r.ultimo_acesso).toLocaleString("pt-AO", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "—",
      }));
      setUtilizadores(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchPermissoes();
  }, [user, fetchPermissoes]);

  if (!user) return null;

  const filtered = utilizadores.filter(
    (u) => filtro === "Todos" || u.perfil === filtro,
  );

  // Toggles locais (sem endpoint específico, apenas UI)
  const toggleStatus = (id: number) =>
    setUtilizadores((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Ativo" ? "Inativo" : "Ativo" }
          : u,
      ),
    );

  const togglePlano = (id: number) =>
    setUtilizadores((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, planoActivo: !u.planoActivo } : u,
      ),
    );

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          titulo="Permissões e Acessos"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Acções */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {(
                ["Todos", "Encarregado", "Estudante", "Instituição"] as const
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setFiltro(p)}
                  className={`flex-shrink-0 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border transition-colors ${
                    filtro === p
                      ? "bg-[#184d8a] text-white border-[#184d8a]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#184d8a] hover:text-[#184d8a]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPermissoes}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-[#184d8a] hover:border-[#184d8a] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalAdmin(true)}
                className="flex items-center justify-center gap-2 bg-[#184d8a] text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-xl hover:bg-[#184d8a]/80 transition-colors shadow-md w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Novo Administrador</span>
                <span className="xs:hidden">Novo Admin</span>
              </button>
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
              {/* ── Tabela desktop ── */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-sm">
                    Utilizadores e Permissões
                  </h2>
                  <span className="text-xs bg-[#184d8a]/10 text-[#184d8a] font-semibold px-3 py-1 rounded-full">
                    {filtered.length} utilizadores
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        <th className="px-6 py-3 text-left">Utilizador</th>
                        <th className="px-6 py-3 text-left">Perfil</th>
                        <th className="px-6 py-3 text-left">Instituição</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-center">Plano</th>
                        <th className="px-6 py-3 text-left">Último Acesso</th>
                        <th className="px-6 py-3 text-center">Activo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((u) => {
                        const BadgeIcon = BADGE[u.perfil]?.icon ?? Lock;
                        return (
                          <tr
                            key={u.id}
                            className="hover:bg-gray-50/60 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900 text-xs">
                                {u.nome}
                              </p>
                              <p className="text-gray-400 text-xs">{u.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[u.perfil]?.cor ?? "bg-gray-100 text-gray-600"}`}
                              >
                                <BadgeIcon className="w-3 h-3" />
                                {u.perfil}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600">
                              {u.instituicao}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COR[u.status]}`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Toggle
                                  checked={u.planoActivo}
                                  onChange={() => togglePlano(u.id)}
                                />
                                <span
                                  className={`text-xs font-medium w-14 ${u.planoActivo ? "text-[#184d8a]" : "text-gray-400"}`}
                                >
                                  {u.planoActivo ? "Activo" : "Inactivo"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {u.ultimoAcesso}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Toggle
                                  checked={u.status === "Ativo"}
                                  onChange={() => toggleStatus(u.id)}
                                />
                                <span
                                  className={`text-xs font-medium ${u.status === "Ativo" ? "text-green-600" : "text-gray-400"}`}
                                >
                                  {u.status === "Ativo" ? "On" : "Off"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      Nenhum utilizador encontrado.
                    </div>
                  )}
                </div>
              </div>

              {/* ── Cards mobile ── */}
              <div className="md:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-sm">
                    Utilizadores
                  </h2>
                  <span className="text-xs bg-[#184d8a]/10 text-[#184d8a] font-semibold px-3 py-1 rounded-full">
                    {filtered.length}
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhum utilizador encontrado.
                  </div>
                ) : (
                  filtered.map((u) => (
                    <UtilizadorCard
                      key={u.id}
                      u={u}
                      onToggleStatus={() => toggleStatus(u.id)}
                      onTogglePlano={() => togglePlano(u.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* Controlo de abas da Instituição */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-xs sm:text-sm">
                  Controlo de Acesso — Instituição
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  As abas marcadas com{" "}
                  <Lock className="w-3 h-3 inline text-amber-500" /> requerem
                  plano activo.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {ABAS_Instituição.map((aba) => (
                <div
                  key={aba.id}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border ${
                    aba.requerPlano
                      ? "border-amber-200 bg-amber-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {aba.requerPlano ? (
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-gray-700 truncate">
                      {aba.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1 ${
                      aba.requerPlano
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {aba.requerPlano ? "Pago" : "Grátis"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {modalAdmin && (
        <ModalNovoAdmin
          onClose={() => setModalAdmin(false)}
          onCreated={fetchPermissoes}
        />
      )}
    </div>
  );
}
