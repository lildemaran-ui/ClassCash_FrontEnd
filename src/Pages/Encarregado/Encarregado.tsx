import { Receipt, Users, LayoutDashboard, Menu, Bell } from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import { useState } from "react";
export default function Encarregado() {
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll ">
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
                active={true}
              />
            </Link>
            <Link to="/Pagamentos">
              <SidebarItem icon={Receipt} label="Pagamento" active={false} />
            </Link>

            <Link to="/DashboardEstud">
              <SidebarItem
                icon={Users}
                label="Painel do seu Educando"
                active={false}
              />
            </Link>
          </nav>
        </aside>
      )}
      {/* Main Content */}
      <main className="flex-1 p-8 custom_scroll">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#268cff]">Painel Geral</h1>
          </div>

          <header className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-[#268cff] cursor-pointer" />
              <span className="absolute bg-red-500 w-2.5 h-2.5 -top-1 -right-1 rounded-full border-2 border-white"></span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#268cff]/20 overflow-hidden shadow-sm">
              <img
                loading="lazy"
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </header>
        </div>
      </main>
    </div>
  );
}
