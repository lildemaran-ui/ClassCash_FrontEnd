import Avatar from "@/components/Avatar/Avatar";
import ChartGestaoEstud from "@/components/Charts/ChartGestaoEstud";
import ChartGestaoEstud2 from "@/components/Charts/ChartGestaoEstud2";
import { Header } from "@/components/Header/header";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import {
  ArrowDown,
  ArrowUp,
  EyeIcon,
  PencilIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function GestaoAlunos() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const res = await fetch(`${API}/gestaoEstudantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao carregar estudantes");
      const data: DashboardData = await res.json();
      setEstudantes(data.estudantes ?? []);
    } catch {
      toast.error("Erro ao carregar estudantes");
    } finally {
      setLoading(false);
    }
  };
  const handleSort = (chave: "nome_estudante") => {
    const ordenados = [...estudantes].sort((a, b) =>
      ordemCrescente
        ? a[chave].localeCompare(b[chave])
        : b[chave].localeCompare(a[chave]),
    );
    setEstudantes(ordenados);
    setOrdemCrescente(!ordemCrescente);
  };
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) return null;

  const handleDelete = async (id: number) => {
    if (!confirm("Tens a certeza que queres remover este estudante?")) return;
    try {
      const token = localStorage.getItem("Token");
      const res = await fetch(`${API}/gestaoEstudantes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao remover");
      toast.success("Estudante removido com sucesso");
      carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover");
    }
  };

  const colorsSit = (status: string) => {
    switch (status) {
      case "Aceite":
        return "text-green-500";
      case "Pendente":
        return "text-orange-400";
      case "Recusado":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const filtrados = estudantes.filter(
    (e) =>
      e.nome_estudante.toLowerCase().includes(pesquisa.toLowerCase()) ||
      String(e.num_processo).includes(pesquisa),
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />

      <main className="flex-1 overflow-y-auto min-w-0">
        <Header
          titulo="Gestão de Estudantes"
          usuario={<Avatar name={user.nome} src={user?.foto} />}
        />
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por nº processo ou nome..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full sm:w-80 lg:w-96 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#184d8a]/20 transition-all text-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-[#184d8a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all duration-500 shadow-md w-full sm:w-auto">
              <Plus size={20} /> Cadastrar
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-4">
                Distribuição de Ativos vs Inativos
              </h3>
              <div className="flex-grow flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                <ChartGestaoEstud />
              </div>
            </div>
            <div className="bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-4">
                Evolução Mensal de Estudantes
              </h3>
              <div className="flex-grow flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                <ChartGestaoEstud2 />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#184d8a]/70 text-white text-sm font-bold tracking-wide border-b border-gray-100">
                    <th className="px-4 py-3">Nº Processo</th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("nome_estudante")}
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
                    <th className="px-4 py-3">Classe</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-sm text-gray-400"
                      >
                        A carregar...
                      </td>
                    </tr>
                  ) : filtrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-sm text-gray-400"
                      >
                        Nenhum estudante encontrado
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((aluno) => (
                      <tr
                        key={aluno.idestudante}
                        className="hover:bg-[#184d8a]/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">
                          {aluno.num_processo}
                        </td>
                        <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">
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
                              <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                                <PencilIcon size={16} />
                              </div>
                              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                Editar
                              </span>
                            </div>
                            <div className="group relative">
                              <Link
                                to="/DashboardEstud"
                                className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-300 shadow-sm block"
                              >
                                <EyeIcon size={16} />
                              </Link>
                              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                Visualizar
                              </span>
                            </div>
                            <div className="group relative">
                              <div
                                onClick={() => handleDelete(aluno.idestudante)}
                                className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
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
        </div>
      </main>
    </div>
  );
}
