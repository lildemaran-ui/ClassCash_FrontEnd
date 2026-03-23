import { ArrowDown, ArrowUp, Bell, CircleUser, EyeIcon, PencilIcon, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import ChartGestaoEstud2 from "@/components/Charts/ChartGestaoEstud2";
import ChartGestaoEstud from "@/components/Charts/ChartGestaoEstud";

export default function GestaoAlunos() {
  const [dadosAlunos, setDadosAlunos] = useState([
    { codigo: "DVS-2025-KS", nome: "Dário Valente de Sousa", classe: "10ª Classe", status: "Ativo", situacao: "Estável" },
    { codigo: "EPJ-2025-AL", nome: "Eduarda Paula João", classe: "10ª Classe", status: "Ativo", situacao: "Razoável" },
    { codigo: "LSN-2025-EF", nome: "Luana da Silva Ngola", classe: "7ª Classe", status: "Inativo", situacao: "Sem assunto" },
    { codigo: "FMC-2025-KS", nome: "Felisberto Manuel Costa", classe: "8ª Classe", status: "Inativo", situacao: "Sem assunto" },
    { codigo: "DCG-2025-EF", nome: "Diana Cristina Geraldo", classe: "10ª Classe", status: "Ativo", situacao: "Em crise" },
  ]);

  const [ordemCrescente, setOrdemCrescente] = useState(true);

  const handleSort = (chave: "nome" | "codigo") => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) =>
      ordemCrescente ? a[chave].localeCompare(b[chave]) : b[chave].localeCompare(a[chave])
    );
    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };

  const colorsSit = (situacao: string) => {
    switch (situacao) {
      case "Estável": return "text-green-500";
      case "Razoável": return "text-orange-400";
      case "Em crise": return "text-red-500";
      case "Sem assunto": return "text-gray-500";
      default: return "text-black";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">

      <MenuSecretaria />

      <main className="flex-1 overflow-y-auto min-w-0">

        {/* Header sticky */}
        <div className="flex items-center justify-between sticky top-0 z-10 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <h1 className="text-base sm:text-xl font-bold text-[#268cff] pl-10 lg:pl-0 truncate">
            Gestão de Estudantes
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-[#268cff]" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
            <CircleUser size={26} className="text-[#268cff] hover:text-blue-600" />
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

          {/* Pesquisa + Cadastrar */}
          <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Procurar por código ou nome..."
                className="w-full sm:w-80 lg:w-96 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#268cff]/20 transition-all text-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-[#268cff] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all duration-500 shadow-md w-full sm:w-auto">
              <Plus size={20} /> Cadastrar
            </button>
          </section>

          {/* Gráficos */}
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

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#268cff]/70 text-white text-sm font-bold tracking-wide border-b border-gray-100">
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("nome")}>
                      <div className="flex items-center justify-center gap-1">
                        Nome {ordemCrescente ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </div>
                    </th>
                    <th className="px-4 py-3">Classe</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dadosAlunos.map((aluno, index) => (
                    <tr key={index} className="hover:bg-[#268cff]/5 transition-colors">
                      <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">{aluno.codigo}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">{aluno.nome}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">{aluno.classe}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block min-w-[70px] ${colorsSit(aluno.situacao)}`}>
                          {aluno.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <div className="group relative">
                            <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                              <PencilIcon size={16} />
                            </div>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                              Editar
                            </span>
                          </div>
                          <div className="group relative">
                            <Link to="/DashboardEstud" className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm block">
                              <EyeIcon size={16} />
                            </Link>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                              Visualizar
                            </span>
                          </div>
                          <div className="group relative">
                            <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                              <Trash2 size={16} />
                            </div>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                              Excluir
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}