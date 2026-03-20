


import MenuAdmin from "@/components/Menu/MenuAdmin";
import {
  Bell, CircleUser, Search, Shield, UserPlus,
  ToggleLeft, ToggleRight, Crown, Lock, Unlock,
  ChevronDown, X, Check, AlertCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Perfil = "Super Admin" | "Admin Local" | "Secretaria";
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

// ─── Dados mock ───────────────────────────────────────────────────────────────
const UTILIZADORES_MOCK: Utilizador[] = [
  { id: 1, nome: "Paula Garra",      email: "paula@classcash.ao",     perfil: "Super Admin",  instituicao: "—",           status: "Ativo",    planoActivo: true,  ultimoAcesso: "Hoje, 14:30" },
  { id: 2, nome: "João Baptista",    email: "joao@kibangas.ao",       perfil: "Admin Local",  instituicao: "Kibangas",     status: "Ativo",    planoActivo: true,  ultimoAcesso: "Hoje, 11:00" },
  { id: 3, nome: "Maria Filomena",   email: "maria@caracol.ao",       perfil: "Admin Local",  instituicao: "Colégio Caracol", status: "Ativo", planoActivo: false, ultimoAcesso: "Ontem, 09:15" },
  { id: 4, nome: "Pedro Santos",     email: "pedro@maptess.ao",       perfil: "Secretaria",   instituicao: "MAPTESS",      status: "Ativo",    planoActivo: true,  ultimoAcesso: "Hoje, 08:50" },
  { id: 5, nome: "Ana Correia",      email: "ana@kiesse.ao",          perfil: "Secretaria",   instituicao: "Kiesse",       status: "Inativo",  planoActivo: false, ultimoAcesso: "15/11/2025" },
  { id: 6, nome: "Carlos Mendes",    email: "carlos@insutec.ao",      perfil: "Admin Local",  instituicao: "INSUTEC",      status: "Ativo",    planoActivo: true,  ultimoAcesso: "Ontem, 16:30" },
  { id: 7, nome: "Sofia Lopes",      email: "sofia@elizangela.ao",    perfil: "Secretaria",   instituicao: "Elizângela F.", status: "Bloqueado",planoActivo: false, ultimoAcesso: "20/10/2025" },
];

const ABAS_SECRETARIA = [
  { id: "pagamentos",   label: "Pagamentos",         requerPlano: false },
  { id: "alunos",       label: "Gestão de Alunos",   requerPlano: false },
  { id: "propinas",     label: "Propinas",            requerPlano: true  },
  { id: "multas",       label: "Módulo de Multas",   requerPlano: true  },
  { id: "relatorios",   label: "Relatórios",          requerPlano: true  },
  { id: "reclamacoes",  label: "Reclamações",         requerPlano: false },
  { id: "encarregados", label: "Encarregados",        requerPlano: false },
];

const BADGE: Record<Perfil, { cor: string; icon: React.ElementType }> = {
  "Super Admin": { cor: "bg-purple-100 text-purple-700", icon: Crown   },
  "Admin Local": { cor: "bg-blue-100 text-blue-700",     icon: Shield  },
  "Secretaria":  { cor: "bg-gray-100 text-gray-600",     icon: Lock    },
};

const STATUS_COR: Record<StatusAcesso, string> = {
  "Ativo":     "bg-green-100 text-green-700",
  "Inativo":   "bg-gray-100 text-gray-500",
  "Bloqueado": "bg-red-100 text-red-600",
};

// ─── Modal Novo Admin ─────────────────────────────────────────────────────────
function ModalNovoAdmin({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-bold text-gray-800">Adicionar Novo Administrador</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" placeholder="Nome do administrador"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="email@classcash.ao"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perfil</label>
            <div className="relative">
              <select className="appearance-none w-full border border-gray-300 rounded-lg py-2.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Super Admin</option>
                <option>Admin Local</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe Provisória</label>
            <input type="password" placeholder="Mín. 8 caracteres"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t rounded-b-2xl">
          <button onClick={onClose} className="text-gray-600 text-sm font-medium py-2 px-5 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
          <button className="bg-[#268cff] text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors shadow">Criar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function PermissoesAcessos() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>(UTILIZADORES_MOCK);
  const [modalAdmin,   setModalAdmin]   = useState(false);
  const [filtro,       setFiltro]       = useState<Perfil | "Todos">("Todos");
  const [search,       setSearch]       = useState("");

  const filtered = utilizadores.filter((u) => {
    const matchFiltro = filtro === "Todos" || u.perfil === filtro;
    const matchSearch = u.nome.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const toggleStatus = (id: number) => {
    setUtilizadores((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === "Ativo" ? "Inativo" : "Ativo" } : u
    ));
  };

  const togglePlano = (id: number) => {
    setUtilizadores((prev) => prev.map((u) =>
      u.id === id ? { ...u, planoActivo: !u.planoActivo } : u
    ));
  };

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#268cff]">Permissões e Acessos</h1>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Pesquisar utilizador..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none text-sm" />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="text-[#268cff]" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
            </div>
            <CircleUser className="w-8 h-8 text-[#268cff]" />
          </div>
        </div>

        <main className="p-6 md:p-8 space-y-6">

          {/* Acções */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filtros de perfil */}
            <div className="flex gap-2 flex-wrap">
              {(["Todos", "Super Admin", "Admin Local", "Secretaria"] as const).map((p) => (
                <button key={p} onClick={() => setFiltro(p)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${
                    filtro === p
                      ? "bg-[#268cff] text-white border-[#268cff]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#268cff] hover:text-[#268cff]"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setModalAdmin(true)}
              className="flex items-center gap-2 bg-[#268cff] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
              <UserPlus className="w-4 h-4" /> Novo Administrador
            </button>
          </div>

          {/* Tabela de utilizadores */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-sm">Utilizadores e Permissões</h2>
              <span className="text-xs bg-[#268cff]/10 text-[#268cff] font-semibold px-3 py-1 rounded-full">
                {filtered.length} utilizadores
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Utilizador</th>
                    <th className="px-6 py-3 text-left">Perfil</th>
                    <th className="px-6 py-3 text-left">Instituição</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Plano Activo</th>
                    <th className="px-6 py-3 text-left">Último Acesso</th>
                    <th className="px-6 py-3 text-center">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => {
                    const BadgeIcon = BADGE[u.perfil].icon;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">{u.nome}</p>
                            <p className="text-gray-400 text-xs">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[u.perfil].cor}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {u.perfil}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-600">{u.instituicao}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COR[u.status]}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={() => togglePlano(u.id)}
                            className={`flex items-center gap-1 mx-auto text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                              u.planoActivo
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}>
                            {u.planoActivo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {u.planoActivo ? "Activo" : "Inactivo"}
                          </button>
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-500">{u.ultimoAcesso}</td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={() => toggleStatus(u.id)}
                            title={u.status === "Ativo" ? "Desactivar" : "Activar"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === "Ativo"
                                ? "text-green-600 hover:bg-green-50"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}>
                            {u.status === "Ativo"
                              ? <ToggleRight className="w-5 h-5" />
                              : <ToggleLeft className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Controlo de abas da Secretaria */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">Controlo de Acesso — Secretaria</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  As abas marcadas com <Lock className="w-3 h-3 inline text-amber-500" /> requerem plano activo para acesso.
                  Quando o plano está inactivo, a secretaria vê a aba bloqueada.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ABAS_SECRETARIA.map((aba) => (
                <div key={aba.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    aba.requerPlano
                      ? "border-amber-200 bg-amber-50"
                      : "border-gray-100 bg-gray-50"
                  }`}>
                  <div className="flex items-center gap-2">
                    {aba.requerPlano
                      ? <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      : <Unlock className="w-4 h-4 text-green-500 shrink-0" />}
                    <span className="text-xs font-semibold text-gray-700">{aba.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    aba.requerPlano
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {aba.requerPlano ? "Pago" : "Gratuito"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {modalAdmin && <ModalNovoAdmin onClose={() => setModalAdmin(false)} />}
    </div>
  );
}
