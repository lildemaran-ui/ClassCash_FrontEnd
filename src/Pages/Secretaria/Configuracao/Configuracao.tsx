import {
  DollarSign,
  Lock,
  Bell,
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
export default function Configuracao() {
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
                active={true}
              />
            </Link>
          </nav>
        </aside>
      )}
      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
            <p className="text-gray-400 text-sm">
              Gerencie as preferências da instituição e controle de acessos.
            </p>
          </header>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex min-h-[600px]">
            {/* Menu Lateral de Configurações */}
            <aside className="w-64 bg-gray-50/50 border-r border-gray-100 p-6 space-y-2">
              {[
                { id: "geral", label: "Geral", icon: <Settings size={18} /> },
                {
                  id: "pagamentos",
                  label: "Taxas e Multas",
                  icon: <DollarSign size={18} />,
                },
                {
                  id: "usuarios",
                  label: "Utilizadores",
                  icon: <Users size={18} />,
                },
                {
                  id: "seguranca",
                  label: "Segurança",
                  icon: <Lock size={18} />,
                },
                {
                  id: "notificacoes",
                  label: "Notificações",
                  icon: <Bell size={18} />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    item.id === "pagamentos"
                      ? "bg-[#268cff] text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </aside>

            {/* Área de Formulário */}
            <section className="flex-1 p-10">
              <div className="mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-700">
                  Configuração de Taxas e Multas
                </h3>
                <p className="text-xs text-gray-400">
                  Defina os valores automáticos aplicados ao sistema.
                </p>
              </div>

              <div className="space-y-6">
                {/* Campo 1 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-gray-500 uppercase ml-1">
                      Percentual de Multa (%)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 10"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#268cff]/20 focus:border-[#268cff] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-gray-500 uppercase ml-1">
                      Dias de Carência
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 5"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#268cff]/20 focus:border-[#268cff] transition-all"
                    />
                  </div>
                </div>

                {/* Campo 2 - Switch Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Aplicar juros compostos?
                    </p>
                    <p className="text-[10px] text-blue-700/60 font-medium">
                      Os juros serão calculados sobre o valor acumulado.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-[#268cff] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                {/* Campo 3 - Multi-Select Simulado */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-500 uppercase ml-1">
                    Moeda Padrão
                  </label>
                  <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#268cff]/20">
                    <option>Kwanza (KZ)</option>
                    <option>Dólar (USD)</option>
                    <option>Euro (EUR)</option>
                  </select>
                </div>

                <div className="pt-10 flex justify-end gap-4">
                  <button className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-all">
                    Cancelar
                  </button>
                  <button className="bg-[#268cff] text-white px-10 py-2.5 rounded-xl font-bold hover:bg-[#1a76db] shadow-lg shadow-blue-200 transition-all">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
