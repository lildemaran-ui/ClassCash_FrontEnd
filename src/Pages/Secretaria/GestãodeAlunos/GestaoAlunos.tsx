// src/Pages/Secretaria/GestaoAlunos.tsx
import Avatar from "@/components/Avatar/Avatar";
import ChartGestaoEstud from "@/components/Charts/ChartGestaoEstud";
import ChartGestaoEstud2 from "@/components/Charts/ChartGestaoEstud2";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { useClasses } from "@/Hooks/useClasses";
import { fetchComAuth } from "@/types/global/fetchComAuth";
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from "@/types/global/sessao";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  BookOpen,
  EyeIcon,
  Hash,
  PencilIcon,
  Plus,
  Trash2,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API = "http://localhost:5000/api";

interface Estudante {
  idestudante: number;
  nome_estudante: string;
  email: string;
  num_processo: number;
  classe: number | null;
  status: string;
}

interface DashboardData {
  estatisticas: {
    pizza: { status: string; total: string; percentual: string }[];
    linha: { mes: string; ativos: string; inativos: string }[];
  };
  estudantes: Estudante[];
}

type Aba = "pesquisar" | "gestao";

const colorsSit = (status: string) => {
  switch (status) {
    case "Aceite":
      return "text-green-600 bg-green-50 border-green-200";
    case "Pendente":
      return "text-orange-500 bg-orange-50 border-orange-200";
    case "Recusado":
      return "text-red-500 bg-red-50 border-red-200";
    default:
      return "text-gray-500 bg-gray-50 border-gray-200";
  }
};

interface FormCadastro {
  nome_estudante: string;
  email: string;
  num_processo: string;
  classe: string;
  status: string;
}
const FORM_VAZIO: FormCadastro = {
  nome_estudante: "",
  email: "",
  num_processo: "",
  classe: "",
  status: "Pendente",
};

function ModalCadastrar({
  onClose,
  onSucesso,
}: {
  onClose: () => void;
  onSucesso: () => void;
}) {
  const [form, setForm] = useState<FormCadastro>(FORM_VAZIO);
  const [loading, setLoading] = useState(false);
  const classes = useClasses();

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/gestaoEstudantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nome: form.nome_estudante,
          email: form.email,
          numProcesso: parseInt(form.num_processo),
          idClasse: form.classe ? parseInt(form.classe) : null,
          status: form.status,
          numTel: "000000000",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");
      toast.success("Estudante cadastrado com sucesso!");
      onSucesso();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-primary px-6 py-5 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-lg font-bold text-white">Cadastrar Estudante</h2>
            <p className="text-xs text-blue-200">Preencha os dados do novo estudante</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
        <form onSubmit={submeter} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs mb-1 text-gray-600 font-medium">Nome Completo</label>
              <input
                required
                name="nome_estudante"
                value={form.nome_estudante}
                onChange={handle}
                placeholder="Ex: João Manuel Silva"
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Email</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="exemplo@email.com"
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Nº Processo</label>
              <input
                required
                name="num_processo"
                value={form.num_processo}
                maxLength={6}
                placeholder="123456"
                onChange={(e) =>
                  setForm((f) => ({ ...f, num_processo: e.target.value.replace(/\D/g, "") }))
                }
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Classe</label>
              <select
                name="classe"
                value={form.classe}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] bg-white transition-colors"
              >
                <option value="">Selecionar classe</option>
                {classes.filter((c) => c.nivel != null).map((c) => (
                  <option key={c.idclasse} value={String(c.idclasse)}>
                    {c.nivel}ª Classe
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] bg-white transition-colors"
              >
                <option value="Pendente">Pendente</option>
                <option value="Aceite">Aceite</option>
                <option value="Recusado">Recusado</option>
              </select>
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
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-60"
            >
              {loading ? "A cadastrar..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalEditar({
  estudante,
  onClose,
  onSucesso,
}: {
  estudante: Estudante;
  onClose: () => void;
  onSucesso: () => void;
}) {
  const [form, setForm] = useState({
    nome_estudante: estudante.nome_estudante,
    email: estudante.email,
    classe: estudante.classe?.toString() ?? "",
    status: estudante.status,
  });
  const [loading, setLoading] = useState(false);
  const classes = useClasses();

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchComAuth(
        `${API}/gestaoEstudantes/${estudante.idestudante}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            ...form,
            classe: form.classe ? parseInt(form.classe) : null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao editar");
      toast.success("Estudante atualizado com sucesso!");
      onSucesso();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao editar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#184d8a]">Editar Estudante</h2>
            <p className="text-xs text-gray-400">Nº Processo: {estudante.num_processo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={submeter} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs mb-1 text-gray-600 font-medium">Nome Completo</label>
              <input
                required
                name="nome_estudante"
                value={form.nome_estudante}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Email</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Nº Processo</label>
              <input
                disabled
                value={estudante.num_processo}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Classe</label>
              <select
                name="classe"
                value={form.classe}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] bg-white transition-colors"
              >
                <option value="">Sem classe</option>
                {classes.filter((c) => c.nivel != null).map((c) => (
                  <option key={c.idclasse} value={String(c.idclasse)}>
                    {c.nivel}ª Classe — {Number(c.valorservico).toLocaleString("pt-AO")} AOA
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 text-gray-600 font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handle}
                className="w-full border-2 rounded-xl h-10 text-sm px-3 outline-none focus:border-[#184d8a] bg-white transition-colors"
              >
                <option value="Pendente">Pendente</option>
                <option value="Aceite">Aceite</option>
                <option value="Recusado">Recusado</option>
              </select>
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
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-60"
            >
              {loading ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalVisualizar({
  estudante,
  onClose,
}: {
  estudante: Estudante;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#184d8a]">Detalhes do Estudante</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-6 pb-4 bg-gradient-to-b from-[#184d8a]/5 to-white px-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle2 size={36} className="text-[#184d8a]" />
          </div>
          <p className="text-base font-bold text-gray-800">{estudante.nome_estudante}</p>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorsSit(estudante.status)}`}>
            {estudante.status}
          </span>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <InfoItem icon={<Hash size={14} />} label="Nº Processo" value={String(estudante.num_processo)} />
          <InfoItem
            icon={<BookOpen size={14} />}
            label="Classe"
            value={estudante.classe ? `${estudante.classe}ª Classe` : "Não atribuída"}
          />
          <div className="col-span-2">
            <InfoItem icon={<BadgeCheck size={14} />} label="Email" value={estudante.email} />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
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

function ModalConfirmarDelete({
  estudante,
  onClose,
  onConfirmar,
}: {
  estudante: Estudante;
  onClose: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-red-500">Remover Estudante</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Tens a certeza que queres remover o estudante{" "}
            <span className="font-bold text-gray-800">{estudante.nome_estudante}</span>? Esta ação
            não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border-2 border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GestaoAlunos() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pesquisar");

  const [modalCadastrar, setModalCadastrar] = useState(false);
  const [modalEditar, setModalEditar] = useState<Estudante | null>(null);
  const [modalVisualizar, setModalVisualizar] = useState<Estudante | null>(null);
  const [modalDelete, setModalDelete] = useState<Estudante | null>(null);
  const [estatisticas, setEstatisticas] = useState<DashboardData["estatisticas"]>({
    pizza: [],
    linha: [],
  });

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await fetchComAuth(`${API}/gestaoEstudantes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar estudantes");
      const data: DashboardData = await res.json();
      setEstudantes(data.estudantes ?? []);
      setEstatisticas(data.estatisticas ?? { pizza: [], linha: [] });
    } catch {
      toast.error("Erro ao carregar estudantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) {
      setUser(sessao.usuario);
      carregar();
    }
  }, []);

  const handleSort = () => {
    const ordenados = [...estudantes].sort((a, b) =>
      ordemCrescente
        ? a.nome_estudante.localeCompare(b.nome_estudante)
        : b.nome_estudante.localeCompare(a.nome_estudante),
    );
    setEstudantes(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const handleDelete = async () => {
    if (!modalDelete) return;
    try {
      const res = await fetchComAuth(
        `${API}/gestaoEstudantes/${modalDelete.idestudante}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (!res.ok) throw new Error("Erro ao remover");
      toast.success("Estudante removido com sucesso");
      setModalDelete(null);
      carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover");
    }
  };

  if (!user) return null;

  const filtrados = estudantes.filter(
    (e) =>
      e.nome_estudante.toLowerCase().includes(pesquisa.toLowerCase()) ||
      String(e.num_processo).includes(pesquisa),
  );

  const abas: { id: Aba; label: string }[] = [
    { id: "pesquisar", label: "Pesquisar" },
    { id: "gestao", label: "Gestão e Gráficos" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      {modalCadastrar && (
        <ModalCadastrar onClose={() => setModalCadastrar(false)} onSucesso={carregar} />
      )}
      {modalEditar && (
        <ModalEditar
          estudante={modalEditar}
          onClose={() => setModalEditar(null)}
          onSucesso={carregar}
        />
      )}
      {modalVisualizar && (
        <ModalVisualizar estudante={modalVisualizar} onClose={() => setModalVisualizar(null)} />
      )}
      {modalDelete && (
        <ModalConfirmarDelete
          estudante={modalDelete}
          onClose={() => setModalDelete(null)}
          onConfirmar={handleDelete}
        />
      )}

      <main className="flex-1 overflow-y-auto min-w-0">
        <Header
          titulo="Gestão de Estudantes"
          usuario={<Avatar name={user.nome} src={user?.foto} size="sm" />}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Sub-abas */}
          <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
            {abas.map((aba) => (
              <button
                key={aba.id}
                type="button"
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  abaAtiva === aba.id
                    ? "bg-primary text-white shadow-md"
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
                    Lista de Estudantes
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Gerencie os dados dos seus estudantes
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* ✅ Corrigido: type="text" + onKeyDown para bloquear Enter */}
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
                      type="text"
                      placeholder="Pesquisar..."
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#184d8a]/20 text-sm"
                    />
                  </div>

                  {/* ✅ Corrigido: type="button" */}
                  <button
                    type="button"
                    onClick={() => setModalCadastrar(true)}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/80 transition-all duration-300 shadow-md w-full sm:w-auto"
                  >
                    <Plus size={20} /> Cadastrar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-primary/70 text-white text-sm font-bold tracking-wide border-b border-gray-100">
                      <th className="px-4 py-3">Nº Processo</th>
                      <th className="px-4 py-3 cursor-pointer" onClick={handleSort}>
                        <div className="flex items-center justify-center gap-1">
                          Nome{" "}
                          {ordemCrescente ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                        </div>
                      </th>
                      <th className="px-4 py-3">Classe</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                          A carregar...
                        </td>
                      </tr>
                    ) : filtrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                          {pesquisa ? "Nenhum resultado encontrado" : "Nenhum estudante encontrado"}
                        </td>
                      </tr>
                    ) : (
                      filtrados.map((aluno) => (
                        <tr key={aluno.idestudante} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">
                            {aluno.num_processo}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">
                            {aluno.nome_estudante}
                          </td>
                          <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">
                            {aluno.classe ? `${aluno.classe}ª` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border inline-block min-w-[70px] ${colorsSit(aluno.status)}`}
                            >
                              {aluno.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <div className="group relative">
                                <div
                                  onClick={() => setModalEditar(aluno)}
                                  className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                                >
                                  <PencilIcon size={16} />
                                </div>
                                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                  Editar
                                </span>
                              </div>
                              <div className="group relative">
                                <div
                                  onClick={() => setModalVisualizar(aluno)}
                                  className="p-2 bg-primary/10 text-[#184d8a] rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                                >
                                  <EyeIcon size={16} />
                                </div>
                                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                  Visualizar
                                </span>
                              </div>
                              <div className="group relative">
                                <div
                                  onClick={() => setModalDelete(aluno)}
                                  className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={16} />
                                </div>
                                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                  Excluir
                                </span>
                              </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total", value: estudantes.length, sub: "estudantes registados" },
                  {
                    label: "Aceites",
                    value: estudantes.filter((e) => e.status === "Aceite").length,
                    sub: "com acesso ativo",
                  },
                  {
                    label: "Pendentes",
                    value: estudantes.filter((e) => e.status === "Pendente").length,
                    sub: "aguardam validação",
                  },
                  {
                    label: "Recusados",
                    value: estudantes.filter((e) => e.status === "Recusado").length,
                    sub: "sem acesso",
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border p-5 flex flex-col gap-1">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-1">
                    Distribuição de Ativos vs Inativos
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Proporção atual por estado</p>
                  <div className="flex-grow flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                    <ChartGestaoEstud dados={estatisticas.pizza} />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-1">
                    Evolução Mensal de Estudantes
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Registo de entradas por mês</p>
                  <div className="flex-grow flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                    <ChartGestaoEstud2 dados={estatisticas.linha} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-700 mb-1">Distribuição por Classe</h3>
                <p className="text-xs text-gray-400 mb-5">
                  Número de estudantes registados por classe
                </p>

                {estudantes.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Sem dados disponíveis</p>
                ) : (
                  (() => {
                    const agrupado = estudantes.reduce(
                      (acc, e) => {
                        const c = e.classe ? `${e.classe}ª Classe` : "Sem classe";
                        acc[c] = (acc[c] || 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>,
                    );

                    const lista = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
                    const totalGeral = lista.reduce((s, [, v]) => s + v, 0);
                    const maximo = Math.max(...lista.map(([, v]) => v));
                    const cores = ["#185FA5", "#1D9E75", "#BA7517", "#888780"];

                    return (
                      <>
                        {lista.map(([classe, count], i) => {
                          const pct = Math.round((count / totalGeral) * 100);
                          const largura = Math.round((count / maximo) * 100);
                          return (
                            <div key={classe} className="mb-5">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-gray-700">{classe}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">{count} estudantes</span>
                                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                    {pct}%
                                  </span>
                                </div>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${largura}%`,
                                    backgroundColor: cores[i % cores.length],
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-400">Total geral</span>
                          <span className="text-sm font-bold text-gray-700">
                            {totalGeral} estudantes
                          </span>
                        </div>
                      </>
                    );
                  })()
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}