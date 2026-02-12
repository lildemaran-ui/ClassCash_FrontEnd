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
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";
import ItemsDoCabeçalho from "@/Componentes/ItemsDoCabeçalho/ItemsDoCabeçalho";

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
    icon: any;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500 ${
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden overflow-y-auto ">
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
                label="Gestão de Estudantes"
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
                active={true}
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {!menu && (
              <button onClick={OpenMenu} className="text-[#268cff]">
                <Menu size={28} />
              </button>
            )}
            <h2 className="text-xl font-bold text-[#268cff]">
              Gestão de Serviços
            </h2>
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
              <select className="bg-white border  rounded-lg px-4 py-2 text-sm text-gray-400 outline-none cursor-pointer hover:border-[#268cff]">
                <option>Sem filtro</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-[#268cff] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1a76db] transition-all shadow-md active:scale-95">
              <Plus size={20} /> Adicionar 
            </button>
          </div>

        </section>

        {/* Tabela de Dados com Container para Margem */}
        <div className="mb-20">
          {" "}
          {/* Aqui a margem inferior vai funcionar! */}
          <h2 className="mb-4 text-gray-700 text-lg font-bold">
            Tabela de Serviços
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-center border-collapse cursor-default">
              <thead>
                <tr className="bg-[#268cff]/70 text-white text-[14px] font-black  border-b border-gray-200 text-center">
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-[#268cff]"
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
                    className="hover:bg-[#268cff]/5 transition-colors"
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
                        <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
                          <Pen size={18} />
                        </div>
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white border  text-xs px-2 py-2 opacity-0 group-hover:opacity-100  transition-all duration-500">
                          Editar
                        </span>
                      </div>
                      <div className=" group relative w-max ">
                        <div className="p-2 bg-[#268cff]/10 text-[#268cff] rounded-lg hover:bg-[#268cff] hover:text-white transition-all duration-500 shadow-sm">
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
