import {
  Receipt,
  Users,
  LayoutDashboard,
  Menu,
  MessageSquare,
  type LucideIcon,
  Settings,
  CheckCircle,
  Download,
  X,
  Pen,
  LogOut,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ChartEstud from "@/components/Charts/ChartEstud";

export default function Encarregado() {
  const [Modal, setModal] = useState(false);

  function ShowModal() {
    setModal(true);
  }

  function CloseModal() {
    setModal(false);
  }
  const [menu, setMenu] = useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold">{value}</span>
    </div>
  );

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }

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

  return (
    <div className="flex overflow-hidden h-screen bg-white font-sans transition-all duration-500">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-16 h-16 "
              />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={22} className="text-white" onClick={CloseMenu} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1 text-white">
            <Link to="/Encarregado">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={window.location.pathname === "/Encarregado"}
              />
            </Link>
            <Link to="/PagamentoEncar">
              <SidebarItem
                icon={Receipt}
                label="Pagamento"
                active={window.location.pathname === "/PagamentoEncar"}
              />
            </Link>

            <Link to="/DashboardEstud">
              <SidebarItem
                icon={Users}
                label="Painel do seu Educando"
                active={window.location.pathname === "/DashboardEstud"}
              />
            </Link>
            <Link to="/ReclamacoesEncar">
              <SidebarItem
                icon={MessageSquare}
                label="Reclamações"
                active={window.location.pathname === "/ReclamacoesEncar"}
              />
            </Link>
            <Link to="/ConfiguracaoEncar">
              <SidebarItem
                icon={Settings}
                label="Definições"
                active={window.location.pathname === "/ConfiguracaoEncar"}
              />
            </Link>
          </nav>
          <Link
            to="/Login"
            className="hover:bg-blue-400 px-4 rounded-sm  border border-white/10 bg-blue-500/50  transition-all duration-700 p-3 group"
          >
            <div className="flex justify-between  items-center ">
              <span className="text-sm font-medium text-white group-hover:text-blue-700">
                Terminar sessão
              </span>
              <LogOut
                size={22}
                className="text-white font-medium group-hover:text-blue-700"
              />
            </div>
          </Link>
        </aside>
      )}
      <main className="flex-1 p-8 custom_scroll transition-all duration-500">
        <div>
          {!menu && (
            <button onClick={OpenMenu}>
              <Menu size={22} className="text-[#268cff]" />
            </button>
          )}
         <button
            onClick={ShowModal}
            className="text-[#268cff] text-[16px] font-medium flex items-center gap-2 mb-4 ml-auto transition-all duration-500"
          >
            <Pen size={18} /> EDITAR PERFIL
          </button> 
        </div>
        {/* Main Content */}
        <header className="flex justify-between items-start mb-8 transition-all duration-500">
          <div className="flex items-center gap-6">
            <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gray-100">
              {user.foto ? (
                <img
                  loading="lazy"
                  src={user.foto}
                  alt={user.nome}
                  className="w-full h-full object-cover"
                  // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                  // você pode opcionalmente adicionar um onError aqui.
                />
              ) : (
                // Fallback: Iniciais do nome
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                  {(user.nome || "User")
                    .trim()
                    .split(" ")

                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-lg font-bold">{user.nome}</p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nome do seu Educando:</strong> {user.nomeEstudante}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Relação Parental:</strong> {user.relacao}
              </p>
              {user.perfil === "Estudante" && (
                <p className="text-sm text-gray-600">
                  <strong>Classe:</strong> {user.classe}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="bg-white p-8 rounded-xl border  min-w-[250px] flex items-center gap-4">
              <div>
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <div className="flex flex-col ">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Situação Financeira do seu Educando
                </h3>
                <p className="text-green-600 text-sm font-medium">
                  Financeiramente está estável
                </p>
                <p className="text-xs text-gray-400">
                  Sem pagamentos em atraso
                </p>
              </div>
            </div>
          </div>
        </header>

        <hr className="mb-8 border-gray-200" />
        {/*Modal de Edição do Perfil*/}
        {Modal && (
          <div className="  bg-translucido2 fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold ">Editar Perfil</h1>
                  <p className="text-xs text-gray-400">
                    Edite suas informações a baixo
                  </p>
                </div>
                <div>
                  <button onClick={CloseModal} className="text-[#268cff]">
                    <X size={22} />
                  </button>
                </div>
              </div>
              <form className="space-y-4">
                <div className="w-48 h-48 rounded-full flex justify-center items-center mx-auto overflow-hidden border border-gray-400 shadow-sm group  ">
                  {user.foto ? (
                    <img
                      loading="lazy"
                      src={user.foto}
                      alt={user.nome}
                      className="w-full h-full object-cover"
                      // Caso a URL exista mas a imagem falhe ao carregar (erro 404),
                      // você pode opcionalmente adicionar um onError aqui.
                    />
                  ) : (
                    // Fallback: Iniciais do nome
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-6xl font-bold">
                      {(user.nome || "User")
                        .trim()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user.nome || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    value={user?.email || ""}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <div className="w-24">
                    <label className="block text-sm mb-1">Classe</label>
                    <select
                      required
                      value={user?.classe || ""}
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                    >
                      <option value="" disabled>
                        Grau
                      </option>
                      <option value="7ª">7ª</option>
                      <option value="8ª">8ª</option>
                      <option value="9ª">9ª</option>
                      <option value="10ª">10ª</option>
                      <option value="11ª">11ª</option>
                      <option value="12ª">12ª</option>
                    </select>
                  </div>
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1">
                      {" "}
                      Nº de Processo
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 rounded-lg h-10 text-base px-4 outline-none focus:border-[#268cff]"
                      value={user?.processo || ""}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="flex justify-end gap-2
                  mt-20"
                  >
                    <div className="">
                      <button
                        type="button"
                        className="bg-white text-[#268cff] px-4 py-2 rounded-md border border-[#268cff] hover:bg-gray-100/50 transition-colors duration-500"
                        onClick={CloseModal}
                      >
                        Cancelar
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-500"
                        onClick={CloseModal}
                      >
                        Concluído
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Financial Summary & Charts */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl  border ">
            <h3 className="font-bold mb-6 text-gray-800">Resumo Financeiro:</h3>
            <div className="space-y-4">
              <SummaryRow label="Último pagamento:" value="09/11/2025" />
              <SummaryRow label="Próximo vencimento:" value="09/12/2025" />
              <SummaryRow label="Total pago no mês:" value="Kz 55.300,00" />
              <SummaryRow label="Total pago no ano:" value="Kz 313.000,00" />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <ChartEstud />
          </div>
        </div>

        {/* Tabela de Histórico de Pagamentos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Histórico de pagamentos referente ao período selecionado
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#268cff] text-white text-sm">
              <tr>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Serviço</th>
                <th className="p-4 font-medium">Valor</th>
                <th className="p-4 font-medium">Multas</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="text-sm text-gray-600">
                  <td className="p-4">09/11/2025</td>
                  <td className="p-4">Propina</td>
                  <td className="p-4 font-medium text-gray-900">
                    Kz 31.300,00
                  </td>
                  <td className="p-4 text-gray-400">Kz 0,00</td>
                  <td className="p-4 text-green-500 font-medium ">Em dia</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-[#268cff] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-500">
            <Download size={18} /> Gerar PDF
          </button>
        </div>
      </main>
    </div>
  );
}
