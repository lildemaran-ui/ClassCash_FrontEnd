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
  Bell,
  Search,
  ArrowDown,
  ArrowUp,
  Plus,
  EyeIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import ItemsDoCabeçalho from "@/Componentes/ItemsDoCabeçalho/ItemsDoCabeçalho";

export default function GestaoPagamentos() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      codigo: "DVS-2025-KS",
      nome: "Dário Valente de Sousa",
      classe: "10ª Classe",
      data: "15/08/2023",
      servico: "Propina Escolar",
      pagamento: "Dinheiro Físico",
      Valor: "KZ 35.000",
      multa: "----",
      Estado: "Confimado",
    },
    {
      codigo: "EPJ-2025-AL",
      nome: "Eduarda Paula João",
      classe: "10ª Classe",
      data: "15/08/2023",
      servico: "Justificativo de Ausência",
      pagamento: "Express",
      Valor: "KZ 30.000",
      multa: "----",
      Estado: "Pendente",
    },
    {
      codigo: "LSN-2025-EF",
      nome: "Luana da Silva Ngola",
      classe: "7ª Classe",
      data: "15/08/2023",
      servico: "Uniforme Escolar",
      pagamento: "Express",
      Valor: "KZ 25.000",
      multa: "----",
      Estado: "Pendente",
    },
    {
      codigo: "FMC-2025-KS",
      nome: "Felisberto Manuel Costa",
      classe: "8ª Classe",
      data: "15/08/2023",
      servico: "Propina Escolar",
      pagamento: "Express",
      Valor: "KZ 20.000",
      multa: "KZ 5.000",
      Estado: "Em atraso",
    },
  ]);
  const colorsSit = (Estado: string) => {
    switch (Estado) {
      case "Confimado":
        return "text-green-500";
      case "Pendente":
        return "text-orange-400";
      case "Em atraso":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  {
    /*Função de ordenação**/
  }
  const handleSort = (chave: "nome" | "codigo") => {
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
  const CardKpi = ({
    title,
    value,
    subtext,
    trend,
  }: {
    title: string;
    value: string;
    subtext: string;
    trend?: "up" | "down" | "plus";
  }) => (
    <div className="bg-white px-2 py-4 rounded-xl flex flex-col items-center text-center border ">
      <p className="text-gray-400 text-base mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {trend === "up" && (
          <span className="text-green-500 text-base">
            <TrendingUp />
          </span>
        )}
        {trend === "down" && (
          <span className="text-red-500 text-xs">
            <TrendingDown />
          </span>
        )}
        {trend === "plus" && (
          <span className="text-black/70">
            <Plus></Plus>
          </span>
        )}
      </div>
      <p className="text-[14px] text-gray-400 mt-1">{subtext}</p>
    </div>
  );
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
                active={true}
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
                active={false}
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
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Superior */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {!menu && (
              <button onClick={OpenMenu} className="text-[#268cff]">
                <Menu size={28} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-[#268cff]">
              Gestão de Pagamentos
            </h2>
          </div>
          <ItemsDoCabeçalho />
        </header>

        {/* Filtros e Botão */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-4">
              {["Mês", "Estado", "Classe"].map((filtro) => (
                <div key={filtro}>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                    {filtro}
                  </label>
                  <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none hover:border-[#268cff]">
                    <option>Todos</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={20} /> Adicionar Pagamento
            </button>
          </div>

          {/* Cards KPI */}
          <div className="grid grid-cols-5 gap-4">
            <CardKpi
              title="Total recebido"
              value="KZ 50.000,00"
              subtext="este mês"
              trend="up"
            />
            <CardKpi
              title="Confirmados"
              value="30"
              subtext="validados"
              trend="plus"
            />
            <CardKpi
              title="Pendentes"
              value="50"
              subtext="em análise"
              trend="down"
            />
            <CardKpi
              title="Em Atraso"
              value="50"
              subtext="vencidos"
              trend="down"
            />
            <CardKpi
              title="Cancelados"
              value="5"
              subtext="estornados"
              trend="down"
            />
          </div>
        </section>

        {/* Tabela de Dados */}
        <div className="mb-20 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-gray-700 font-bold">Histórico de Transações</h2>
          </div>

          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest border-b border-gray-100">
                <th className="px-4 py-4">Código</th>
                <th
                  className="px-4 py-4 cursor-pointer hover:text-[#268cff]"
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Nome{" "}
                    {ordemCrescente ? (
                      <ArrowDown size={14} />
                    ) : (
                      <ArrowUp size={14} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-4">Classe</th>
                <th className="px-4 py-4">Serviço</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-mono text-gray-500">
                    {aluno.codigo}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-gray-700">
                    {aluno.nome}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {aluno.classe}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {aluno.servico}
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-gray-800">
                    {aluno.Valor}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        aluno.Estado === "Confimado"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : aluno.Estado === "Pendente"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {aluno.Estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button className="p-2 text-gray-400 hover:text-[#268cff] hover:bg-blue-50 rounded-lg transition-all">
                        <EyeIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
