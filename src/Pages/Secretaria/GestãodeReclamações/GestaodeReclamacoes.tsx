import {
  Download,
  Plus,
  Users,
  Menu,
  FileText,
  AlertOctagon,
  Settings,
  MessageSquare,
  Receipt,
  CreditCard,
  LayoutDashboard,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo555 from "../../../assets/logo555.png";
import { useState } from "react";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";
export default function GestaodeReclamacoes() {
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      {/* Sidebar */}
      <MenuSecretaria />
      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll bg-gray-50">
        {/* Header e Ação rápida */}
        <div className="flex justify-between items-center mb-10">
          <div>
            {!menu && (
              <button>
                <Menu
                  className="text-[#184d8a] flex items-start"
                  size={22}
                  onClick={OpenMenu}
                ></Menu>
              </button>
            )}
            <h1 className="text-xl font-bold text-[#184d8a]">
              Gestão de Reclamações
            </h1>
            <p className="text-gray-400 text-sm ">
              Escute, resolva e melhore a experiência escolar.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#184d8a]  text-white hover:bg-blue-500   px-4 py-2 rounded-xl font-bold transition-all duration-500">
              <Download size={18} /> Exportar Relatório
            </button>
          </div>
        </div>

        {/* Cards de Resumo de Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border-l-4 border-orange-400 shadow-sm">
            <p className="text-sm font-medium text-gray-400  ">Em Tratamento</p>
            <h3 className="text-3xl font-bold text-gray-800">01</h3>
            <span className="text-orange-400 text-xs font-bold">Pendente</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm">
            <p className="text-sm font-medium text-gray-400  ">Respondidas</p>
            <h3 className="text-3xl font-bold text-gray-800"> 45</h3>
            <span className="text-green-500 text-xs font-bold">+12 hoje</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-purple-500 shadow-sm">
            <p className="text-sm font-medium text-gray-400  ">
              Satisfação Média
            </p>
            <h3 className="text-3xl font-bold text-gray-800">4.2/5</h3>
            <span className="text-purple-500 text-xs font-bold">
              Baseado em feedbacks
            </span>
          </div>
        </div>

        {/* Filtros Inteligentes */}
        <div className="flex gap-4 mb-6">
          {[
            "Todas",
            "Propinas",
            "Uniformes",
            "Justificativos",
            "Certificados",
            " Transferências",
            "Cartão Escolar",
          ].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-500 hover:border-[#184d8a] hover:text-[#184d8a] transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabela de Reclamações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#184d8a]/70 text-white text-[14px]   font-black  border-b border-gray-100 text-center">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Encarregado/Aluno</th>
                <th className="px-6 py-4">Assunto</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 cursor-default">
              {/* Exemplo de Linha */}
              <tr className="hover:bg-blue-50/30 transition-colors text-center">
                <td className="px-6 py-4 text-sm text-gray-500">22 Jan 2024</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-700">
                    João Manuel
                  </div>
                  <div className="text-[10px] text-gray-400 italic">
                    Pai do Aluno: Pedro Manuel
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  Demora na entrega dos uniformes
                </td>
                <td className="px-6 py-4">
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black  ">
                    Alta
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-bold border bg-orange-50 text-orange-600 border-orange-100">
                      Pendente
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 justify-center mx-auto cursor-pointer">
                    <div className="group relative w-max  ">
                      <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
                        <MessageSquare size={18} />
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
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
