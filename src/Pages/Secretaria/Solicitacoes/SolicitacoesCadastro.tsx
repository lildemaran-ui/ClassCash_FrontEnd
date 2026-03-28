// src/Pages/Secretaria/SolicitacoesCadastro/SolicitacoesCadastro.tsx

import MenuSecretaria from "@/components/Menu/MenuSecretaria"; // ajusta o caminho
import {
  AlertCircle,
  Bell,
  CheckCircle,
  CircleUser,
  Clock,
  Eye,
  Key,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Solicitacao {
  tipo: "estudante" | "encarregado";
  id: number;
  nome: string;
  email: string;
  contacto: string | null;
  num_processo: string;
  status: string;
  codigo_plataforma: string | null;
  instituicao: string;
  classe?: number;
  grau_parentesco?: string;
  nome_educando?: string;
}

// ─── Modal de detalhes + aprovação ───────────────────────────────────────────
function ModalDetalhes({
  item,
  onClose,
  onApproved,
  onRejected,
}: {
  item: Solicitacao;
  onClose: () => void;
  onApproved: (id: number, tipo: string, codigo: string) => void;
  onRejected: (id: number, tipo: string) => void;
}) {
  const [codigo, setCodigo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tab, setTab] = useState<"detalhes" | "aprovar" | "recusar">(
    "detalhes",
  );

  const aprovar = async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`${API}/aprovacao/aprovar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: item.tipo,
          id: item.id,
          codigoCustom: codigo,
        }),
      });
      const data = (await res.json()) as { codigo?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao aprovar");
      onApproved(item.id, item.tipo, data.codigo ?? "");
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  const recusar = async () => {
    if (!motivo.trim()) {
      setErro("Indica o motivo da recusa.");
      return;
    }
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`${API}/aprovacao/recusar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: item.tipo, id: item.id, motivo }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Erro ao recusar");
      onRejected(item.id, item.tipo);
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="font-bold text-gray-800">Solicitação de Cadastro</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.nome} · {item.instituicao}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(["detalhes", "aprovar", "recusar"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
                tab === t
                  ? "border-b-2 border-[#184d8a] text-[#184d8a]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "detalhes"
                ? "Ver Dados"
                : t === "aprovar"
                  ? "✅ Aprovar"
                  : "❌ Recusar"}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab: Detalhes */}
          {tab === "detalhes" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Nome", item.nome],
                  ["Email", item.email],
                  ["Contacto", item.contacto ?? "—"],
                  ["Nº Processo", item.num_processo],
                  ["Instituição", item.instituicao],
                  [
                    "Tipo",
                    item.tipo === "estudante" ? "Estudante" : "Encarregado",
                  ],
                  ...(item.classe ? [["Classe", `${item.classe}ª`]] : []),
                  ...(item.grau_parentesco
                    ? [["Parentesco", item.grau_parentesco]]
                    : []),
                  ...(item.nome_educando
                    ? [["Educando", item.nome_educando]]
                    : []),
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  A senha <strong>não é visível</strong> por segurança. Apenas
                  os dados de identificação são mostrados.
                </p>
              </div>
            </div>
          )}

          {/* Tab: Aprovar */}
          {tab === "aprovar" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-800">
                    Aprovar cadastro
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Ao aprovar, será gerado um código único para este utilizador
                    e um email de confirmação será enviado automaticamente.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Código personalizado
                  (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: CC-2026-A1B2 — deixe vazio para gerar automaticamente"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Se deixar vazio, o sistema gera um código único
                  automaticamente.
                </p>
              </div>

              {erro && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                  {erro}
                </p>
              )}

              <button
                onClick={aprovar}
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                {loading ? "A aprovar..." : "Confirmar Aprovação"}
              </button>
            </div>
          )}

          {/* Tab: Recusar */}
          {tab === "recusar" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <UserX className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Recusar cadastro
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    O utilizador receberá um email a informar que o cadastro não
                    foi aprovado com o motivo indicado.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da recusa <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Dados incorrectos, estudante não reconhecido..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none"
                />
              </div>

              {erro && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                  {erro}
                </p>
              )}

              <button
                onClick={recusar}
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserX className="w-4 h-4" />
                {loading ? "A recusar..." : "Confirmar Recusa"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function SolicitacoesCadastro() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<
    "todos" | "estudante" | "encarregado"
  >("todos");
  const [selected, setSelected] = useState<Solicitacao | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/aprovacao/pendentes`);
      const data = (await res.json()) as {
        estudantes: Solicitacao[];
        encarregados: Solicitacao[];
      };
      setSolicitacoes([...data.estudantes, ...data.encarregados]);
    } catch (e) {
      console.error("Erro ao carregar pendentes", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleApproved = (id: number, tipo: string, codigo: string) => {
    setSolicitacoes((prev) =>
      prev.filter((s) => !(s.id === id && s.tipo === tipo)),
    );
  };

  const handleRejected = (id: number, tipo: string) => {
    setSolicitacoes((prev) =>
      prev.filter((s) => !(s.id === id && s.tipo === tipo)),
    );
  };

  const filtradas = solicitacoes.filter((s) => {
    const matchTipo = filtroTipo === "todos" || s.tipo === filtroTipo;
    const matchSearch =
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.instituicao.toLowerCase().includes(search.toLowerCase());
    return matchTipo && matchSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between p-6 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#184d8a]">
              Solicitações de Cadastro
            </h1>
            {solicitacoes.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {solicitacoes.length} pendentes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none text-sm"
              />
            </div>
            <div className="relative cursor-pointer">
              <Bell className="text-[#184d8a]" />
              {solicitacoes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
              )}
            </div>
            <CircleUser className="w-8 h-8 text-[#184d8a]" />
          </div>
        </div>

        <main className="p-6 md:p-8 space-y-5">
          {/* Filtros */}
          <div className="flex gap-2">
            {(["todos", "estudante", "encarregado"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltroTipo(f)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors capitalize ${
                  filtroTipo === f
                    ? "bg-[#184d8a] text-white border-[#184d8a]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#184d8a] hover:text-[#184d8a]"
                }`}
              >
                {f === "todos"
                  ? "Todos"
                  : f === "estudante"
                    ? "Estudantes"
                    : "Encarregados"}
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Clock className="w-6 h-6 animate-spin mr-2" /> A carregar
              solicitações...
            </div>
          ) : filtradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <CheckCircle className="w-12 h-12 mb-3 opacity-30 text-green-500" />
              <p className="text-sm font-medium">
                Nenhuma solicitação pendente
              </p>
              <p className="text-xs mt-1">
                Todas as solicitações foram tratadas.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 text-sm">
                  Solicitações Pendentes
                </h2>
                <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full border border-amber-200">
                  {filtradas.length} por tratar
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {filtradas.map((s) => (
                  <div
                    key={`${s.tipo}-${s.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        s.tipo === "estudante"
                          ? "bg-blue-50 border border-blue-100"
                          : "bg-purple-50 border border-purple-100"
                      }`}
                    >
                      <CircleUser
                        className={`w-5 h-5 ${s.tipo === "estudante" ? "text-blue-500" : "text-purple-500"}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">
                          {s.nome}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.tipo === "estudante"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {s.tipo === "estudante" ? "Estudante" : "Encarregado"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {s.email} · {s.instituicao}
                      </p>
                      {s.nome_educando && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Educando: {s.nome_educando}
                        </p>
                      )}
                    </div>

                    {/* Acções rápidas */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelected(s)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver dados
                      </button>
                      <button
                        onClick={() => {
                          setSelected(s);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Aprovar
                      </button>
                      <button
                        onClick={() => {
                          setSelected(s);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" /> Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {selected && (
        <ModalDetalhes
          item={selected}
          onClose={() => setSelected(null)}
          onApproved={handleApproved}
          onRejected={handleRejected}
        />
      )}
    </div>
  );
}
