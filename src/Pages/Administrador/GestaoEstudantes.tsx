import { colorsSit } from "@/lib/utils";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import {
  ArrowDown, ArrowUp, Bell, CircleUser,
  EyeIcon, PencilIcon, Plus, Trash2
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function GestaoEstudantes() {
  const [dadosAlunos, setDadosAlunos] = useState([
    { codigo: "DVS-2025-KS", nome: "Dário Valente de Sousa", classe: "10ª Classe", institution: "Kibangas", status: "Ativo" },
    { codigo: "EPJ-2025-AL", nome: "Eduarda Paula João", classe: "10ª Classe", institution: "Kibangas", status: "Ativo" },
    { codigo: "LSN-2025-EF", nome: "Luana da Silva Ngola", classe: "7ª Classe", institution: "Kibangas", status: "Inativo" },
    { codigo: "FMC-2025-KS", nome: "Felisberto Manuel Costa", classe: "8ª Classe", institution: "Kibangas", status: "Inativo" },
    { codigo: "DCG-2025-EF", nome: "Diana Cristina Geraldo", classe: "10ª Classe", institution: "Kibangas", status: "Ativo" },
  ]);

  const [ordemCrescente, setOrdemCrescente] = useState(true);

  // ✅ handleSort fora do useEffect — estava incorrectamente aninhado
  const handleSort = (chave: "nome" | "codigo") => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) =>
      ordemCrescente ? a[chave].localeCompare(b[chave]) : b[chave].localeCompare(a[chave])
    );
    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      <MenuSecretaria />

      <div className="flex flex-col flex-1 overflow-y-auto min-w-0">

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

          {/* Filtros */}
          <section className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div className="flex flex-wrap gap-3">
                {["Nome/Código", "Instituição", "Classe"].map((filtro) => (
                  <div key={filtro}>
                    <label className="block text-xs text-gray-500 mb-1">{filtro}</label>
                    <select className="bg-white border rounded-lg px-3 sm:px-6 py-2 text-sm text-gray-400 outline-none hover:border-[#268cff] cursor-pointer">
                      <option>Sem filtro</option>
                    </select>
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center gap-2 bg-[#268cff] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all duration-500 shadow-md w-full sm:w-auto">
                <Plus size={20} /> Cadastrar
              </button>
            </div>
          </section>

          {/* Card distribuição */}
          <div className="bg-white border p-6 rounded-3xl shadow-sm mb-8">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-4">
              Distribuição de Ativos vs Inativos
            </h3>
            <div className="flex items-center justify-center italic text-gray-400 min-h-[150px] sm:min-h-[200px]">
              Página em desenvolvimento
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#268cff]/70 text-white text-sm font-bold tracking-wide border-b border-gray-100">
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("nome")}>
                      <div className="flex items-center justify-center gap-1">
                        Nome {ordemCrescente ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </div>
                    </th>
                    <th className="px-4 py-3">Classe</th>
                    <th className="px-4 py-3">Instituição</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dadosAlunos.map((aluno, index) => (
                    <tr key={index} className="hover:bg-[#268cff]/5 transition-colors">
                      <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">{aluno.codigo}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">{aluno.nome}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">{aluno.classe}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-500">{aluno.institution}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block min-w-[70px] ${colorsSit(aluno.status)}`}>
                          {aluno.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <div className="group relative">
                            <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                              <PencilIcon size={16} />
                            </div>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                              Editar
                            </span>
                          </div>
                          <div className="group relative">
                            <Link to="/DashboardEstud" className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm block">
                              <EyeIcon size={16} />
                            </Link>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                              Visualizar
                            </span>
                          </div>
                          <div className="group relative">
                            <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                              <Trash2 size={16} />
                            </div>
                            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
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
      </div>
    </div>
  );
}