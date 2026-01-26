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
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
export default function GestaodeReclamacoes() {
  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: any;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={20} className="text-white" />
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden overflow-y-auto">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img src={Logo5} alt="Logo" className="w-16 h-16 " />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={28} className="text-white" onClick={CloseMenu} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1 text-white">
            <Link to="/Secretaria">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={false}
              />
            </Link>

            <Link to="/GestaoAlunos">
              <SidebarItem
                icon={Users}
                label="Gestão de Alunos"
                active={false}
              />
            </Link>

            <Link to="/GestaodeEncarregados">
              <SidebarItem
                icon={Users}
                label="Gestão de Encarregados"
                active={false}
              />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={CreditCard}
                label="Gestão de Propinas"
                active={false}
              />
            </Link>
            <Link to="/GestaoPagamentos">
              <SidebarItem
                icon={Receipt}
                label="Gestão de Pagamentos"
                active={false}
              />
            </Link>

            <Link to="/GestaodeServiços">
              <SidebarItem
                icon={Settings}
                label="Gestão de Serviços"
                active={false}
              />
            </Link>
            <Link to="/GestaodeReclamacoes">
              <SidebarItem
                icon={MessageSquare}
                label="Gestão de Reclamações"
                active={true}
              />
            </Link>
            <Link to="/ModulodeMulta">
              <SidebarItem
                icon={AlertOctagon}
                label="Gestão de Multas"
                active={false}
              />
            </Link>
            <Link to="/Relatorio">
              <SidebarItem
                icon={FileText}
                label="Centro de Relatório"
                active={false}
              />
            </Link>
            <Link to="/Configuracao">
              <SidebarItem
                icon={Settings}
                label="Configurações"
                active={false}
              />
            </Link>
          </nav>
        </aside>
      )}
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {/* Header e Ação rápida */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-[#268cff]">
              Gestão de Reclamações
            </h2>
            <p className="text-gray-400 text-sm italic">
              Escute, resolva e melhore a experiência escolar.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-[#268cff] border border-[#268cff] px-4 py-2 rounded-xl font-bold hover:bg-blue-50 transition-all">
              <Download size={18} /> Exportar Relatório
            </button>
            <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] shadow-md">
              <Plus size={20} /> Nova Reclamação
            </button>
          </div>
        </div>

        {/* Cards de Resumo de Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Críticas Urgentes
            </p>
            <h3 className="text-3xl font-black text-gray-800">12</h3>
            <span className="text-red-500 text-xs font-bold">
              Aguardando resposta
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-orange-400 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Em Tratamento
            </p>
            <h3 className="text-3xl font-black text-gray-800">08</h3>
            <span className="text-orange-400 text-xs font-bold">
              Processando
            </span>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Resolvidas
            </p>
            <h3 className="text-3xl font-black text-gray-800">145</h3>
            <span className="text-green-500 text-xs font-bold">+12 hoje</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-purple-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Satisfação Média
            </p>
            <h3 className="text-3xl font-black text-gray-800">4.2/5</h3>
            <span className="text-purple-500 text-xs font-bold">
              Baseado em feedbacks
            </span>
          </div>
        </div>

        {/* Filtros Inteligentes */}
        <div className="flex gap-4 mb-6">
          {[
            "Todas",
            "Financeiro",
            "Pedagógico",
            "Infraestrutura",
            "Alimentação",
          ].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-500 hover:border-[#268cff] hover:text-[#268cff] transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabela de Reclamações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-[11px] uppercase font-black tracking-widest border-b border-gray-100 text-center">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Encarregado/Aluno</th>
                <th className="px-6 py-4">Assunto/Título</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
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
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
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
                  <button className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all">
                    <MessageSquare size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
