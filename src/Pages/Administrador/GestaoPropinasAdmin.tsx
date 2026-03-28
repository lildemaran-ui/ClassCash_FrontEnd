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
  EyeIcon,
  TrendingDown,
  TrendingUp,
  KeyIcon,
  ScrollText,
  InfoIcon,
  School,
  type LucideIcon,
} from "lucide-react";
import logo555 from "../../assets/logo555.png";
import { useState } from "react";

export default function GestaoPropinasAdmin() {
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
      Serviço: "Propina",
    },
    {
      codigo: "EPJ-2025-AL",
      nome: "Eduarda Paula João",
      classe: "10ª Classe",
      data: "15/08/2023",
      Valor: "KZ 30.000",
      multa: "----",
      Estado: "Pendente",
      Serviço: "Propina",
    },
    {
      codigo: "LSN-2025-EF",
      nome: "Luana da Silva Ngola",
      classe: "7ª Classe",
      data: "15/08/2023",
      Valor: "KZ 25.000",
      multa: "----",
      Estado: "Pendente",
      Serviço: "Propina",
    },
    {
      codigo: "FMC-2025-KS",
      nome: "Felisberto Manuel Costa",
      classe: "8ª Classe",
      data: "15/08/2023",
      Valor: "KZ 20.000",
      multa: "KZ 5.000",
      Estado: "Em atraso",
      Serviço: "Propina",
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
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500  ${
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
    <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border ">
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

      {menu && (
        <aside className="w-64 bg-[#184d8a] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img
                loading="lazy"
                src={logo555}
                alt="Logo"
                className="w-16 h-16 "
              />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={22} className="text-white" onClick={CloseMenu} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1 transition-all duration-500 text-white max-h-screen custom_scroll">
            <Link to="/Administradores">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={false}
              />
            </Link>

            <div className="flex flex-col gap-1 text-white">
              <Link to="/GestaoDeInstituicao">
                <SidebarItem
                  icon={School}
                  label="Gestão de Instituições"
                  active={false}
                />
              </Link>
              <Link to="/GestaoDeUsuarios">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Usuarios"
                  active={false}
                />
              </Link>
              <Link to="/GestaoPropinasAdmin">
                <SidebarItem
                  icon={CreditCard}
                  label="Gestão de Propinas"
                  active={true}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={Receipt}
                  label="Gestão de Pagamentos"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={FileText}
                  label="Gestão de Relatórios"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={KeyIcon}
                  label="Permissões e Acessos"
                  active={false}
                />
              </Link>
              <Link to="/GestaoLogs">
                <SidebarItem
                  icon={ScrollText}
                  label="Logs de Atividades"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={InfoIcon}
                  label="Suporte e Ajuda"
                  active={false}
                />
              </Link>
              <Link to="/Configuracoes">
                <SidebarItem
                  icon={Settings}
                  label="Configurações"
                  active={false}
                />
              </Link>
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll">
        {/* Header com Título e Search */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#184d8a] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#184d8a]">
              Gestão de Propinas
            </h1>
          </div>

          <header className="flex items-center gap-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="search"
                placeholder="Procurar por um código..."
                className="w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#184d8a]/20 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer group">
                <Bell className="text-[#184d8a] group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#184d8a]/20 p-0.5">
                <img
                  loading="lazy"
                  src="https://via.placeholder.com/40"
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </header>
        </div>

        {/* Filtros e KPIs */}
        <section className="mb-12">
          <div className="flex gap-4 mb-8">
            {["Mês", "Classe", "Estado"].map((filtro) => (
              <div key={filtro} className="flex flex-col gap-1">
                <label className="text-sm  text-gray-500 ml-1">{filtro}</label>
                <select className="bg-white border rounded-lg px-4 py-2 text-sm text-gray-400 outline-none focus:border-[#184d8a] min-w-[140px] cursor-pointer">
                  <option>Sem filtro</option>
                </select>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-default">
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-20">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-700">Tabela de Propinas</h3>
            <span className="text-xs text-gray-400 font-medium">
              {dadosAlunos.length} registros encontrados
            </span>
          </div>

          <table className="w-full border-collapse cursor-default">
            <thead>
              <tr className="bg-[#184d8a]/70 text-white text-[14px]   font-black  border-b border-gray-200">
                <th className="px-4 py-4">Código</th>
                <th
                  className="px-4 py-4 cursor-pointer hover:text-[#184d8a] transition-colors"
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
                <th className="px-4 py-4">Data</th>
                <th className="px-4 py-4">Serviço</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Multa Estimada</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dadosAlunos.map((aluno, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#184d8a]/5 transition-colors text-center hover:border-b hover:border-dashed hover:border-[#184d8a]"
                >
                  <td className="px-4 py-4 text-sm  text-gray-500">
                    {aluno.codigo}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-700">
                    {aluno.nome}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {aluno.classe}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {aluno.data}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {aluno.Serviço}
                  </td>
                  <td className="px-4 py-4 text-sm  text-gray-800">
                    {aluno.Valor}
                  </td>
                  <td className="px-4 py-4 text-sm  text-red-500">
                    {aluno.multa}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block min-w-[85px] ${colorsSit(aluno.Estado)}`}
                    >
                      {aluno.Estado}
                    </span>
                  </td>
                  <td className="px-4 py-4  ">
                    <div className="group w-max relative flex items-center mx-auto cursor-pointer">
                      <div className="flex ">
                        <div className="p-2 bg-[#184d8a]/10 text-[#184d8a] rounded-lg hover:bg-[#184d8a] hover:text-white transition-all duration-500 shadow-sm">
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
