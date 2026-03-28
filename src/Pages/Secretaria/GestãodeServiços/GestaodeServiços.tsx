import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  AlertOctagon,
  Menu,
  Settings,
  MessageSquare,
  FileText,
  ArrowDown,
  ArrowUp,
  Plus,
  Pen,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import logo555 from "../../../assets/logo555.png";
import { useState } from "react";
import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";

export default function GestaodeServiços() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "-----",
    },
    {
      servico: "Justificativo",
      classe: "10ª Classe",
      Valor: "KZ 5.000",
      multa: "-----",
    },
    {
      servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "5.000",
    },
    {
      servico: "Propina Escolar",
      classe: "10ª Classe",
      Valor: "KZ 35.000",
      multa: "5.000",
    },
  ]);

  {
    /*Função de ordenação**/
  }
  const handleSort = (chave: "servico") => {
    const dadosOrdenados = [...dadosAlunos].sort((a, b) => {
      if (ordemCrescente) {
        return a[chave].localeCompare(b[chave]);
      } else {
        return b[chave].localeCompare(a[chave]);
      }
    });

    setDadosAlunos(dadosOrdenados);
    setOrdemCrescente(!ordemCrescente);
  };
  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: LucideIcon;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500 ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll ">
      {/* Sidebar */}
      <MenuSecretaria />
      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {!menu && (
              <button onClick={OpenMenu} className="text-[#184d8a]">
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#184d8a]">
              Gestão de Serviços
            </h1>
          </div>
          <ItemsDoCabeçalho />
        </div>

        {/* Filtros e Botão Adicionar */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1 ">
                Filtrar por Mês
              </label>
              <select className="bg-white border  rounded-lg px-4 py-2 text-sm text-gray-400 outline-none cursor-pointer hover:border-[#184d8a]">
                <option>Sem filtro</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-[#184d8a] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={22} /> Adicionar
            </button>
          </div>
        </section>

        {/* Tabela de Dados com Container para Margem */}
        <div className="mb-20">
          {" "}
          {/* Aqui a margem inferior vai funcionar! */}
          <h1 className="mb-4 text-gray-700 text-lg font-bold">
            Tabela de Serviços
          </h1>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-center border-collapse cursor-default">
              <thead>
                <tr className="bg-[#184d8a]/70 text-white text-[14px] font-black  border-b border-gray-200 text-center">
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-[#184d8a]"
                    onClick={() => handleSort("servico")}
                  >
                    <div className="flex items-center justify-center gap-1 cursor-pointer">
                      Serviço{" "}
                      {ordemCrescente ? (
                        <ArrowDown size={14} />
                      ) : (
                        <ArrowUp size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Classe</th>
                  <th className="px-6 py-4">Valor Base</th>
                  <th className="px-6 py-4">Multa Estimada</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dadosAlunos.map((aluno, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#184d8a]/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {aluno.servico}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {aluno.classe}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-800">
                      {aluno.Valor}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-500 font-medium">
                      {aluno.multa}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-center mx-auto cursor-pointer">
                        <div className="group relative w-max  ">
                          <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                            <Pen size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Editar
                          </span>
                        </div>
                        <div className=" group relative w-max ">
                          <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                            <Trash2 size={18} />
                          </div>
                          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                            Deletar
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
      </main>
    </div>
  );
}
