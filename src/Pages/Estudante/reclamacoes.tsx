import {
  Bell,
  Eye,
  EyeOff,
  MessageSquare,
  Settings,
  Wallet,
  LayoutDashboard,
  LifeBuoy,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import logo5 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";

// Interface para os dados das reclamações
interface ReclamacaoProps {
  titulo: string;
  remetente: string;
  assunto: string;
  data: string;
  status: string;
  isPublica: boolean;
}

// Componente para cada card de reclamação
const ReclamacaoCard = ({
  titulo,
  remetente,
  assunto,
  data,
  status,
  isPublica,
}: ReclamacaoProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-2 relative border border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-gray-800 text-base">{titulo}</h3>
      <span className="text-[12px] text-gray-400">{data}</span>
    </div>
    <div className="space-y-1 ">
      <p className=" text-gray-500">
        <span className="font-medium">Remetente:</span> {remetente}
      </p>
      <p className=" text-gray-500">
        <span className="font-medium">Assunto:</span> {assunto}
      </p>
      <p className=" text-gray-500 mt-4">
        <span className="font-medium">Solicitação:</span> {status}
      </p>
    </div>
    <div className="absolute right-6 bottom-6 text-gray-400">
      {isPublica ? (
        <Eye size={24} className="text-[#268cffb2]" />
      ) : (
        <EyeOff size={24} className="text-[#268cffb2]" />
      )}
    </div>
  </div>
);

export default function Reclamacoes() {
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  function OpenMenu() {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  }
  function CloseMenu() {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  }
  // Sub-componentes auxiliares
  const NavItem = ({
    icon,
    label,
    active = false,
  }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 mt-3 rounded-lg cursor-pointer transition-all duration-500 ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
  const listaReclamacoes = [
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Deyse Valente Petra",
      assunto: "Problema com o IBAN",
      data: "07/09/2025",
      status: "Atendida",
      isPublica: true,
    },
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Anônimo",
      assunto: "Latência na chegada do e-mail",
      data: "08/10/2025",
      status: "Atendida",
      isPublica: false,
    },
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Anônimo",
      assunto: "Dificuldade no cadastro do educando",
      data: "01/11/2025",
      status: "Atendida",
      isPublica: false,
    },
  ];
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
  return (
    <div className="flex min-h-screen bg-white font-sans transition-all duration-500">
      {/* Sidebar Lateral */}
      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex flex-col">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <Link to="/DashboardEstud">
              <div className="flex items-center font-semibold">
                <img src={logo5} alt="Logo" className="w-16 h-16" />
                <span>ClassCash</span>
              </div>
            </Link>
            <button onClick={CloseMenu}>
              <Menu size={28} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2  ">
            <Link to="/DashboardEstud">
              <NavItem
                icon={<LayoutDashboard size={20} />}
                label="Painel"
                active={false}
              />
            </Link>

            <Link to="/Pagamentos" className=" block w-full">
              <NavItem
                icon={<Wallet size={20} />}
                label="Pagamentos"
                active={false}
              />
            </Link>
            <Link to="/reclamacoes">
              <NavItem
                icon={<MessageSquare size={20} />}
                label="Reclamações"
                active={true}
              />
            </Link>
            <Link to="/Config">
              <NavItem
                icon={<Settings size={20} />}
                label="Configurações"
                active={false}
              />
            </Link>
            <NavItem
              icon={<LifeBuoy size={20} />}
              label="Suporte"
              active={false}
            />
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto transition-all duration-500">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={28} className="text-[#268cff]" />
          </button>
        )}
        {/* Header Superior */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={24} className="text-[#268cff]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f0f5fa]"></div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-center bg-cover">
              {user.foto && (
                <img
                  src={user.foto}
                  alt="Estudante"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </header>

        {/* Instruções */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-gray-400 font-medium text-[13px] leading-relaxed">
            As suas reclamações podem ser anónimas ou públicas. Basta deixar o
            ícone do olho na lateral direita aberto,
            <br />
            para reclamação pública, ou fechado, para reclamação anónima.
          </p>
        </div>

        {/* Lista de Reclamações */}
        <div className="max-w-5xl mx-auto mb-12">
          {listaReclamacoes.map((item, index) => (
            <ReclamacaoCard key={index} {...item} />
          ))}
        </div>

        {/* Formulário de Nova Reclamação */}
        <div className="max-w-5xl mx-auto flex gap-8 items-start">
          <div className="w-1/4">
            <p className="text-gray-800 font-bold text-base">
              Tem uma reclamação a fazer?
            </p>
            <p className="text-gray-800 text-sm">Escreve-a aqui:</p>
          </div>
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative border">
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">Remetente:</span>
                <input
                  type="text"
                  className="flex-1 outline-none text-sm text-gray-800"
                />
              </div>
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">Assunto:</span>
                <input
                  type="text"
                  className="flex-1 outline-none text-sm text-gray-800"
                />
              </div>
            </div>
            <button className="absolute bottom-6 right-6 bg-[#268cff] text-white px-8 py-2 rounded-full text-xs font-bold hover:bg-blue-500 transition-all duration-500 shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
