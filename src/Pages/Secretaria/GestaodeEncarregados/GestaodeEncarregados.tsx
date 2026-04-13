// src/Pages/Secretaria/GestaodeEncarregados.tsx
import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import {
  ArrowDown,
  ArrowUp,
  EyeIcon,
  Phone,
  Plus,
  UserCircle2,
  Users2,
  X,
  Mail,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { colorsSit } from "@/lib/utils";
import { toast } from "sonner";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import { useClasses } from "@/Hooks/useClasses";

const API = "http://localhost:5000/api";

interface Encarregado {
  idencarregado: number;
  encarregado: string;
  contacto: string;
  nomedoeducando: string;
  parentesco: string;
  estado: string;
  email?: string;
}

interface FormData {
  nomeEncarregado: string;
  emailEncarregado: string;
  numTelEncarregado: string;
  senhaEncarregado: string;
  nomeEducando: string;
  numProcesso: string;
  idClasse: string;
  grauParentesco: string;
}

const FORM_INICIAL: FormData = {
  nomeEncarregado: "",
  emailEncarregado: "",
  numTelEncarregado: "",
  senhaEncarregado: "",
  nomeEducando: "",
  numProcesso: "",
  idClasse: "",
  grauParentesco: "",
};

type Aba = "pesquisar" | "gestao";

// ─── Modal Cadastro (melhorado) ───────────────────────────────────────────────
function ModalCadastro({
  onClose,
  onSucesso,
}: {
  onClose: () => void;
  onSucesso: () => void;
}) {
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const classes = useClasses()

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/GestaoEncarregados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...form,
          idClasse: form.idClasse ? parseInt(form.idClasse) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");
      toast.success("Encarregado e educando cadastrados com sucesso!");
      onSucesso();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  // Campos obrigatórios do step 1 preenchidos?
  const step1Valido =
    form.nomeEncarregado.trim() !== "" &&
    form.emailEncarregado.trim() !== "" &&
    form.numTelEncarregado.trim() !== "" &&
    form.senhaEncarregado.trim() !== "" &&
    form.grauParentesco.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex bg-[#184d8a] items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-white">
              Cadastrar Encarregado
            </h2>
            <p className="text-xs text-gray-300">Passo {step} de 2</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Indicador de passos */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                step >= n ? "bg-[#184d8a]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={submeter} className="p-6 flex flex-col gap-4">
          {/* ── PASSO 1: Dados do Encarregado ── */}
          {step === 1 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCircle2 size={14} /> Dados do Encarregado
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Nome Completo
                  </label>
                  <input
                    required
                    name="nomeEncarregado"
                    value={form.nomeEncarregado}
                    onChange={handle}
                    placeholder="Ex: Maria João Silva"
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="emailEncarregado"
                    value={form.emailEncarregado}
                    onChange={handle}
                    placeholder="email@exemplo.com"
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Contacto
                  </label>
                  <input
                    required
                    name="numTelEncarregado"
                    value={form.numTelEncarregado}
                    maxLength={9}
                    placeholder="9XX XXX XXX"
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        numTelEncarregado: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Palavra-Passe
                  </label>
                  <input
                    required
                    type="password"
                    name="senhaEncarregado"
                    value={form.senhaEncarregado}
                    onChange={handle}
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Grau de Parentesco
                  </label>
                  <input
                    required
                    name="grauParentesco"
                    placeholder="Ex: Pai, Mãe..."
                    value={form.grauParentesco}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        grauParentesco: e.target.value.replace(/[0-9]/g, ""),
                      }))
                    }
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!step1Valido}
                  onClick={() => setStep(2)}
                  className="flex-1 h-10 rounded-xl bg-[#184d8a] text-white text-sm font-bold hover:bg-[#184d8a]/80 transition-colors disabled:opacity-40"
                >
                  Próximo →
                </button>
              </div>
            </>
          )}

          {/* ── PASSO 2: Dados do Educando ── */}
          {step === 2 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users2 size={14} /> Dados do Educando
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Nome do Educando
                  </label>
                  <input
                    required
                    name="nomeEducando"
                    value={form.nomeEducando}
                    onChange={handle}
                    placeholder="Ex: Pedro Silva"
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Nº Processo
                  </label>
                  <input
                    required
                    name="numProcesso"
                    value={form.numProcesso}
                    maxLength={6}
                    placeholder="123456"
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        numProcesso: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 font-medium">
                    Classe (opcional)
                  </label>
                  <select
                    value={form.idClasse}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, idClasse: e.target.value }))
                    }
                    className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] bg-white transition-colors"
                  >
                    <option value="">Selecionar classe</option>
                    {classes.map((c) => (
                      <option key={c.idclasse} value={c.idclasse.toString()}>
                        {c.nivel}ª Classe
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resumo do encarregado */}
              <div className="bg-[#184d8a]/5 rounded-xl p-3 border border-[#184d8a]/10">
                <p className="text-xs text-gray-500 mb-1 font-medium">
                  Encarregado a associar
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {form.nomeEncarregado}
                </p>
                <p className="text-xs text-gray-500">
                  {form.emailEncarregado} · {form.grauParentesco}
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 rounded-xl bg-[#184d8a] text-white text-sm font-bold hover:bg-[#184d8a]/80 transition-colors disabled:opacity-60"
                >
                  {loading ? "A cadastrar..." : "Cadastrar"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Modal Visualizar ─────────────────────────────────────────────────────────
function ModalVisualizar({
  enc,
  onClose,
}: {
  enc: Encarregado;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#184d8a]">
            Detalhes do Encarregado
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Avatar destaque */}
        <div className="flex flex-col items-center gap-2 pt-6 pb-4 bg-gradient-to-b from-[#184d8a]/5 to-white px-6">
          <div className="w-16 h-16 rounded-full bg-[#184d8a]/10 flex items-center justify-center">
            <UserCircle2 size={36} className="text-[#184d8a]" />
          </div>
          <p className="text-base font-bold text-gray-800">{enc.encarregado}</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${colorsSit(enc.estado)}`}
          >
            {enc.estado}
          </span>
        </div>

        {/* Info grid */}
        <div className="px-6 pb-2 grid grid-cols-2 gap-3">
          <EncInfoItem
            icon={<Phone size={14} />}
            label="Contacto"
            value={enc.contacto}
          />
          <EncInfoItem
            icon={<Heart size={14} />}
            label="Parentesco"
            value={enc.parentesco}
          />
          {enc.email && (
            <div className="col-span-2">
              <EncInfoItem
                icon={<Mail size={14} />}
                label="Email"
                value={enc.email}
              />
            </div>
          )}
        </div>

        {/* Educando associado */}
        <div className="mx-6 mb-6 mt-3 bg-[#184d8a]/5 rounded-xl p-4 border border-[#184d8a]/10">
          <div className="flex items-center gap-2 mb-2">
            <Users2 size={14} className="text-[#184d8a]" />
            <p className="text-xs font-bold text-[#184d8a] uppercase tracking-wider">
              Educando Associado
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {enc.nomedoeducando}
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-[#184d8a] text-white text-sm font-bold hover:bg-[#184d8a]/80 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function EncInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function GestaodeEncarregados() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [encarregados, setEncarregados] = useState<Encarregado[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState<Encarregado | null>(
    null,
  );
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pesquisar");

  const carregarEncarregados = async () => {
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/GestaoEncarregados`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar encarregados");
      const data = await res.json();
      setEncarregados(data);
    } catch {
      toast.error("Erro ao carregar encarregados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) {
      setUser(sessao.usuario);
      carregarEncarregados();
    }
  }, []);

  const handleSort = () => {
    const ordenados = [...encarregados].sort((a, b) =>
      ordemCrescente
        ? a.encarregado.localeCompare(b.encarregado)
        : b.encarregado.localeCompare(a.encarregado),
    );
    setEncarregados(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const filtrados = encarregados.filter(
    (e) =>
      e.encarregado.toLowerCase().includes(pesquisa.toLowerCase()) ||
      e.nomedoeducando.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  if (!user) return null;

  const abas: { id: Aba; label: string }[] = [
    { id: "pesquisar", label: "Pesquisar" },
    { id: "gestao", label: "Gestão Geral" },
  ];

  // Estatísticas simples para a aba de gestão
  const total = encarregados.length;
  const ativos = encarregados.filter(
    (e) => e.estado === "Activo" || e.estado === "Ativo",
  ).length;
  const pendentes = encarregados.filter((e) => e.estado === "Pendente").length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      {showModal && (
        <ModalCadastro
          onClose={() => setShowModal(false)}
          onSucesso={carregarEncarregados}
        />
      )}
      {modalVisualizar && (
        <ModalVisualizar
          enc={modalVisualizar}
          onClose={() => setModalVisualizar(null)}
        />
      )}

      <main className="flex-1 overflow-y-auto min-w-0">
        <Header
          titulo="Gestão de Encarregados"
          usuario={<Avatar name={user.nome} src={user?.foto} size="sm" />}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Sub-abas */}
          <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  abaAtiva === aba.id
                    ? "bg-[#184d8a] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          {/* ── ABA: PESQUISAR ── */}
          {abaAtiva === "pesquisar" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-700">
                    Lista de Encarregados
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Gerencie os dados de contacto e alunos associados
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Pesquisa inline */}
                  <div className="relative w-full sm:w-56">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                      type="search"
                      placeholder="Pesquisar..."
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#184d8a]/20 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#184d8a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95 w-full sm:w-auto"
                  >
                    <Plus size={20} />
                    <span>Cadastrar</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#184d8a]/70 text-white text-sm font-bold border-b border-gray-200 text-center">
                      <th
                        className="px-4 py-3 cursor-pointer"
                        onClick={handleSort}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Encarregado{" "}
                          {ordemCrescente ? (
                            <ArrowDown size={13} />
                          ) : (
                            <ArrowUp size={13} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3">Educando (Aluno)</th>
                      <th className="px-4 py-3">Parentesco</th>
                      <th className="px-4 py-3">Contacto</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-sm text-gray-400"
                        >
                          A carregar...
                        </td>
                      </tr>
                    ) : filtrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-sm text-gray-400"
                        >
                          {pesquisa
                            ? "Nenhum resultado encontrado"
                            : "Nenhum encarregado cadastrado"}
                        </td>
                      </tr>
                    ) : (
                      filtrados.map((enc) => (
                        <tr
                          key={enc.idencarregado}
                          className="hover:bg-[#184d8a]/5 transition-colors text-center"
                        >
                          <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">
                            {enc.encarregado}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-gray-600">
                            {enc.nomedoeducando}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-gray-600">
                            {enc.parentesco}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">
                            {enc.contacto}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[70px] ${colorsSit(enc.estado)}`}
                            >
                              {enc.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="group relative w-max mx-auto">
                              <div
                                onClick={() => setModalVisualizar(enc)}
                                className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                              >
                                <EyeIcon size={16} />
                              </div>
                              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                Visualizar
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ABA: GESTÃO E GRÁFICOS ── */}
          {abaAtiva === "gestao" && (
            <div className="flex flex-col gap-6 mb-8">
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Total
                  </p>
                  <p className="text-3xl font-bold ">{total}</p>
                  <p className="text-xs text-gray-400">
                    encarregados registados
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Ativos
                  </p>
                  <p className="text-3xl font-bold ">{ativos}</p>
                  <p className="text-xs text-gray-400">com acesso ativo</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Pendentes
                  </p>
                  <p className="text-3xl font-bold ">{pendentes}</p>
                  <p className="text-xs text-gray-400">aguardam validação</p>
                </div>
              </div>

              {/* Distribuição por parentesco */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-700 mb-4">
                  Distribuição por Grau de Parentesco
                </h3>
                {encarregados.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Sem dados disponíveis
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {Object.entries(
                      encarregados.reduce(
                        (acc, e) => {
                          const p = e.parentesco || "Outro";
                          acc[p] = (acc[p] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([parentesco, count]) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div
                            key={parentesco}
                            className="flex items-center gap-3"
                          >
                            <p className="text-sm text-gray-600 w-28 shrink-0">
                              {parentesco}
                            </p>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#184d8a] rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 w-10 text-right">
                              {count}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
