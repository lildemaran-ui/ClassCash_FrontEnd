import ItemsDoCabeçalho from "@/components/ItemsDoCabeçalho/ItemsDoCabeçalho";
import {
  AlertOctagon,
  ArrowDown,
  ArrowUp,
  CreditCard,
  EyeIcon,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Plus,
  Receipt,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo5 from "../../../assets/Logo5.5.png";
import MenuSecretaria from "@/components/Menu/MenuSecretaria";

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
  const CardKpi = ({
    title,
    value,
    subtext,
    trend,
  }: {
    title: string;
    value: string;
    subtext: string;
    trend?: "up" | "down";
  }) => (
    <div className="bg-white px-2 py-4 rounded-xl flex flex-col items-center text-center border ">
      <p className="text-gray-400 text-base mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-800">{value}</span>
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
      </div>
      <p className="text-[14px] text-gray-400 mt-1">{subtext}</p>
    </div>
  );
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      {/* Sidebar */}
      <MenuSecretaria />
      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll">
        {/* Header Superior */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {!menu && (
              <button onClick={OpenMenu} className="text-[#268cff]">
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#268cff]">
              Gestão de Pagamentos
            </h1>
          </div>
          <ItemsDoCabeçalho />
        </header>

        {/* Filtros e Botão */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-4">
              {["Mês", "Estado", "Classe"].map((filtro) => (
                <div key={filtro}>
                  <label className=" flex text-sm text-gray-500 mb-1">
                    {filtro}
                  </label>
                  <select className="bg-white border  rounded-lg px-10 py-2 text-sm text-gray-400  outline-none cursor-pointer hover:border-[#268cff]">
                    <option>Todos</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={22} /> Adicionar
            </button>
          </div>

          {/* Cards KPI */}
          <div className="grid grid-cols-5 gap-4 cursor-default">
            <CardKpi
              title="Total recebido"
              value="KZ 50.000,00"
              subtext="este mês"
              trend="up"
            />
            <CardKpi title="Confirmados" value="30" subtext="validados" />
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
            <h1 className="text-gray-700 font-bold">Histórico de Transações</h1>
          </div>

          <table className="w-full text-center border-collapse cursor-default">
            <thead>
              <tr className="bg-[#268cff]/70  text-white text-[14px]   font-black tracking-widest border-b border-gray-100">
                <th className="px-4 py-4">Código</th>
                <th
                  className="px-4 py-4 cursor-pointer hover:text-[#268cff]"
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center justify-center gap-1 cursor-pointer">
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
            <tbody className="divide-y divide-gray-50 cursor-default">
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/5 hover:border-b hover:border-dashed hover:border-[#268cff] transition-colors  "
                >
                  <td className="px-4 py-4 text-sm font-mono text-gray-500 ">
                    {aluno.codigo}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-700">
                    {aluno.nome}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {aluno.classe}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {aluno.servico}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-800">
                    {aluno.Valor}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${
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
                    <div className="group relative w-max items-center mx-auto cursor-pointer">
                      <div className="flex ">
                        <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
                          <EyeIcon size={18} />
                        </div>
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                          Visualizar
                        </span>
                      </div>
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
