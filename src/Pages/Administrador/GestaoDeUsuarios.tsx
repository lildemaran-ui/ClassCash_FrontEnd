import {
  Bell,
  CircleUser,
  Minus,
  MoreVertical,
  Plus,
  Menu,
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Receipt,
  MessageSquare,
  AlertOctagon,
  FileText,
  KeyIcon,
  ScrollText,
  InfoIcon,
  School,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo5 from "../../assets/Logo5.5.png";

// Componente SidebarItem atualizado com as novas medidas
const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center gap-4 p-4 rounded-xl ml-3 cursor-pointer transition-all duration-300 ${
      active ? "bg-white/20 w-full" : "hover:bg-white/10 w-full"
    }`}
  >
    {/* Ícones aumentados para 28 */}
    <Icon size={22} className="text-white shrink-0" />
    {/* Texto aumentado para text-xl */}
    <span className="text-white font-medium text-xl whitespace-nowrap">
      {label}
    </span>
  </div>
);

export default function GestaoDeUsuarios() {
  const [menuOpen, setMenuOpen] = useState(true);

  const mockAdministrators = [
    {
      id: 1,
      name: "Paula Garra",
      email: "paula.garra@email.com",
      institution: "Kibangas",
      status: "Ativo",
      contact: "927863909",
    },
    {
      id: 2,
      name: "João Viana",
      email: "joao.viana@email.com",
      institution: "Colégio Caracol",
      status: "Ativo",
      contact: "923123456",
    },
    {
      id: 3,
      name: "Filomena Silva",
      email: "filomena.silva@email.com",
      institution: "Elizângela Filomena",
      status: "Bloqueado",
      contact: "911987654",
    },
    {
      id: 4,
      name: "Pedro Tomás",
      email: "pedro.tomas@email.com",
      institution: "MAPTESS",
      status: "Ativo",
      contact: "922555777",
    },
    {
      id: 5,
      name: "Marta Correia",
      email: "marta.correia@email.com",
      institution: "Kibangas",
      status: "Pendente",
      contact: "933444111",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* SIDEBAR - Largura aumentada para w-80 (320px) ou w-96 (384px) dependendo da sua preferência. Usei w-80. */}
      {menuOpen && (
        <aside className="w-80 bg-[#268cff] flex flex-col h-screen transition-all shadow-2xl z-20">
          <div className="px-4 py-8 mb-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Logo aumentada para w-24 h-24 */}
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-24 h-24 object-contain"
              />
              {/* ClassCash aumentado para text-xl */}
              <p className="text-white font-bold text-xl tracking-tight">
                ClassCash
              </p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:bg-white/10 p-1 rounded-full"
            >
              {/* Ícone do menu aumentado para 34 */}
              <Menu size={34} />
            </button>
          </div>

          <nav className="flex-1 custom_scroll flex flex-col gap-2 pb-6 scrollbar-hide flex-nowrap">
            <Link to="/Adiministradores">
              <SidebarItem icon={LayoutDashboard} label="Painel Geral" />
            </Link>
            <Link to="">
              <SidebarItem
                icon={Users}
                label=" Gestão de Estudantes"
                active={true}
              />
            </Link>
            <Link to="">
              <SidebarItem icon={Users} label="Gestão de Encarregados" />
            </Link>
            <Link to="/GestaoDeInstituicao">
              <SidebarItem icon={School} label="Gestão de Instituições" />
            </Link>
            <Link to="/GestaoDeUsuarios">
              <SidebarItem icon={Users} label="Gestão Usuários" />
            </Link>
            <Link to="">
              <SidebarItem icon={CreditCard} label="Gestão de Propinas" />
            </Link>
            <Link to="">
              <SidebarItem icon={Receipt} label="Gestão de Pagamentos" />
            </Link>
            <Link to="">
              <SidebarItem icon={Settings} label="Gestão de Serviços" />
            </Link>
            <Link to="">
              <SidebarItem icon={MessageSquare} label="Gestão de Reclamações" />
            </Link>
            <Link to="">
              <SidebarItem icon={AlertOctagon} label="Gestão de Multas" />
            </Link>
            <Link to="">
              <SidebarItem icon={FileText} label="Gestão de Relatórios" />
            </Link>
            <Link to="">
              <SidebarItem icon={KeyIcon} label=" Permissões" />
            </Link>
            <Link to="">
              <SidebarItem icon={ScrollText} label="Logs" />
            </Link>
            <Link to="">
              <SidebarItem icon={InfoIcon} label=" Suporte" />
            </Link>
            <Link to="">
              <SidebarItem icon={Settings} label="Configurações" />
            </Link>
          </nav>
        </aside>
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between p-6  bg-translucido sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {!menuOpen && (
              <button
                onClick={() => setMenuOpen(true)}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={34} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-[#268cff]">
              Gestão de Usuários
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer group">
              <Bell
                size={22}
                className="text-[#268cff] group-hover:scale-110 transition-transform"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
            </div>
            <CircleUser className="w-10 h-10 text-[#268cff] cursor-pointer hover:text-blue-600 transition-colors" />
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-10 custom_scroll">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-end space-x-4 mb-8">
              <button className="flex items-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 shadow-md">
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 shadow-sm">
                <Minus className="w-5 h-5 mr-2 text-red-500" />
                Remover
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Nome",
                      "Email",
                      "Instituição",
                      "Status",
                      "Contacto",
                      "",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-bold text-gray-400 uppercase tracking-widest"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockAdministrators.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                        {admin.name}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {admin.email}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {admin.institution}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-4 py-1.5 text-xs font-black rounded-full uppercase ${
                            admin.status === "Ativo"
                              ? "bg-green-100 text-green-700"
                              : admin.status === "Pendente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {admin.contact}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button className="text-gray-300 hover:text-gray-600 p-2">
                          <MoreVertical size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
