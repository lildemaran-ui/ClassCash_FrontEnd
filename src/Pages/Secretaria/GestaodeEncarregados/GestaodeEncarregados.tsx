import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Bell, CircleUser, EyeIcon, Plus, Search } from "lucide-react";
import { useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
import { colorsSit } from "@/lib/utils";

export default function GestaodeEncarregados() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    { nome: "Valente de Sousa", nomedoeducando: "Dário Valente de Sousa", parentesco: "Pai", Contacto: "924576878", Estado: "Ativo" },
    { nome: "Eduarda João", nomedoeducando: "Eduarda Paula João", parentesco: "Mãe", Contacto: "924576878", Estado: "Ativo" },
    { nome: "Luana Ngola", nomedoeducando: "Luana da Silva Ngola", parentesco: "Mãe", Contacto: "924576878", Estado: "Inativo" },
    { nome: "Felisberto Costa", nomedoeducando: "Felisberto Manuel Costa", parentesco: "Pai", Contacto: "924576878", Estado: "Ativo" },
  ]);

  const handleSort = (chave: "nome") => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) =>
      ordemCrescente ? a[chave].localeCompare(b[chave]) : b[chave].localeCompare(a[chave])
    );
    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">

      <MenuSecretaria />

      <main className="flex-1 overflow-y-auto min-w-0">

        {/* Header sticky */}
        <div className="flex items-center justify-between sticky top-0 z-10 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <h1 className="text-base sm:text-xl font-bold text-[#268cff] pl-10 lg:pl-0 truncate">
            Gestão de Encarregados
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Pesquisa — oculta no mobile */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="pl-9 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none text-sm transition-all"
              />
            </div>
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-[#268cff]" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
            <CircleUser size={26} className="text-[#268cff] hover:text-blue-600" />
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

          {/* Tabela */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            
            {/* Cabeçalho tabela */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-700">Lista de Encarregados</h3>
                <p className="text-xs sm:text-sm text-gray-400">Gerencie os dados de contacto e alunos associados</p>
              </div>
              <button className="flex items-center justify-center gap-2 bg-[#268cff] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95 w-full sm:w-auto">
                <Plus size={20} />
                <span>Cadastrar</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#268cff]/70 text-white text-sm font-bold border-b border-gray-200 text-center">
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("nome")}>
                      <div className="flex items-center justify-center gap-1">
                        Encarregado {ordemCrescente ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
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
                  {dadosAlunos.map((aluno, index) => (
                    <tr key={index} className="hover:bg-[#268cff]/5 transition-colors text-center">
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">{aluno.nome}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-600">{aluno.nomedoeducando}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-600">{aluno.parentesco}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500">{aluno.Contacto}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block min-w-[70px] ${colorsSit(aluno.Estado)}`}>
                          {aluno.Estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="group relative w-max mx-auto">
                          <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                            <EyeIcon size={16} />
                          </div>
                          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                            Visualizar
                          </span>
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