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
  UserCog,
  Bell,
  Search,
  ArrowDown,
  ArrowUp,
  Plus,
  EyeIcon,
} from "lucide-react";
import Logo5 from "../../../assets/Logo5.5.png";
import { useState } from "react";

export default function GestaoPropinas() {
  const [ordemCrescente, setOrdemCrescente] = useState(true);
  const [dadosAlunos, setDadosAlunos] = useState([
    {
      codigo: "DVS-2025-KS",
      nome: "Dário Valente de Sousa",
      classe: "10ª Classe",
      data: "15/08/2023",
      Valor: "KZ 35.000",
      multa: "----",
      Estado: "Confimado",
      Serviço: "Propina"
    },
    {
      codigo: "EPJ-2025-AL",
      nome: "Eduarda Paula João",
      classe: "10ª Classe",
      data: "15/08/2023",
      Valor: "KZ 30.000",
      multa: "----",
      Estado: "Pendente",
      Serviço: "Propina"
    },
    {
      codigo: "LSN-2025-EF",
      nome: "Luana da Silva Ngola",
      classe: "7ª Classe",
      data: "15/08/2023",
      Valor: "KZ 25.000",
      multa: "----",
      Estado: "Pendente",
      Serviço: "Propina"
    },
    {
      codigo: "FMC-2025-KS",
      nome: "Felisberto Manuel Costa",
      classe: "8ª Classe",
      data: "15/08/2023",
      Valor: "KZ 20.000",
      multa: "KZ 5.000",
      Estado: "Em atraso",
      Serviço: "Propina"
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
    <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border ">
      <p className="text-gray-400 text-base mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {trend === "up" && (
          <span className="text-green-500 text-base">
            <ArrowUp></ArrowUp>
          </span>
        )}
        {trend === "down" && (
          <span className="text-red-500 text-xs">
            <ArrowDown></ArrowDown>
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
                icon={LayoutDashboard }
                label="Painel Geral"
                active={false}
              />
            </Link>
            <Link to="/GestaoAlunos">
            <SidebarItem
              icon={Users }
              label="Gestão de Alunos"
              active={false}
            />
            </Link>

            <Link to="/GestaodeEncarregados">
            <SidebarItem
              icon={Users }
              label="Gestão de Encarregados"
              active={false}
            />
            </Link>
            <Link to="/GestaoPropinas">
              <SidebarItem
                icon={CreditCard }
                label="Gestão de Propinas"
                active={true}
              />
            </Link>
            <Link to="/GestaoPagamentos">
              <SidebarItem
                icon={Receipt }
                label="Gestão de Pagamentos"
                active={false}
              />
            </Link>

           <Link to="GestaodeServiços">
            <SidebarItem
              icon={Settings }
              label="Gestão de Serviços"
              active={false}
            />
           </Link>
            <SidebarItem
              icon={MessageSquare }
              label="Gestão de Reclamações"
              active={false}
            />
            <SidebarItem
              icon={AlertOctagon }
              label="Gestão de Multas"
              active={false}
            />

            <SidebarItem
              icon={FileText }
              label="Relatório"
              active={false}
            />

            <SidebarItem
              icon={Settings }
              label="Configurações"
              active={false}
            />
          </nav>
        </aside>
      )}
      {/* Main Content */}
      {/* Main Content */}
      <main className="flex-1 p-8 ">
        <div className="flex gap-6">
          {!menu && (
            <button>
              <Menu
                className="text-[#268cff] flex items-start"
                size={28}
                onClick={OpenMenu}
              ></Menu>
            </button>
          )}
          <h2 className="text-lg font-bold text-[#268cff]">
            Gestão de Propinas
          </h2>
        </div>
        {/* Header */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex">
            <div className="relative w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por um código"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-MeuAzul/20 focus:border-none"
              />
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="relative">
                <Bell className="text-[#268cff] cursor-pointer" />
                <div className="absolute bg-red-500 w-3 h-3 flex -top-1 -right-1 rounded-full border border-white"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border overflow-hidden">
                <img src="https://via.placeholder.com/40" alt="User" />
              </div>
            </div>
          </div>
        </header>
        {/*Filtros*/}
        <section className="mb-8">
          <div className="flex justify-start">
            <div className="flex gap-4">
              {["Mês", "Classe", "Estado"].map((filtro) => (
                <div key={filtro}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {filtro}
                  </label>
                  <select className="bg-white border  rounded-md px-3 py-1 text-sm text-gray-400 outline-none">
                    <option>Sem filtro</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-10">
            <CardKpi
              title="Propinas Pagas"
              value="70"
              subtext="no último mês"
              trend="up"
            />
            <CardKpi
              title="Propinas Pendentes"
              value="30"
              subtext="no último mês"
              trend="plus"
            />
            <CardKpi
              title="Propinas em Atraso"
              value="50"
              subtext="no último mês"
              trend="down"
            />
          </div>
        </section>
        {/* Tabela de Dados */}
        <div className="mt-16">
          <h2 className="mb-2 text-gray-500 text-base font-semibold">
            Tabela de Propinas
          </h2>
          <table className="w-full border-collapse border border-gray-300   ">
            <thead>
              <tr className="bg-[#268cff]/80 text-white">
                <th className="border border-gray-300 px-4 py-2">Código</th>
                <th className="border border-gray-300 px-4 py-2 ">
                  <div
                    className="flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => handleSort("nome")}
                  >
                    Nome
                    {ordemCrescente ? (
                      <ArrowDown size={18} />
                    ) : (
                      <ArrowUp size={20} />
                    )}
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2">Classe</th>
                <th className="border border-gray-300 px-4 py-2">Data</th>
                <th className="border border-gray-300 px-4 py-2">Serviço</th>
                <th className="border border-gray-300 px-4 py-2">Valor</th>
                <th className="border border-gray-300 px-4 py-2">Multa</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#268cff]/10 even:bg-[#268cff]/20 hover:border hover:border-dashed hover:border-black text-center"
                >
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.codigo}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.nome}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.classe}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.data}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.Serviço}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.Valor}
                  </td>
                  <td className=" px-4 py-2 border-r border-l border-gray-300">
                    {aluno.multa}
                  </td>
                  <div className="flex  justify-between items-center">
                    <div className="flex justify-center mx-auto">
                      <td className={`px-4 py-2 ${colorsSit(aluno.Estado)}`}>
                        {aluno.Estado}
                      </td>
                    </div>
                    <button className=" justify-end flex items-end mr-5 bg-[#268cff]/50 px-3 rounded-lg">
                      <EyeIcon className="text-white" />
                    </button>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
