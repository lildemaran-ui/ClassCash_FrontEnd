import {
  ArrowLeft,
  Bell,
  Eye,
  EyeOff,
  Grid,
  HelpCircle,
  Home,
  MessageSquare,
  PiIcon,
  Settings,
  Wallet
} from "lucide-react";
import React from "react";

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
  <div className="bg-white p-6 rounded-sm shadow-sm mb-4 relative border border-gray-100">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-gray-800 text-sm">{titulo}</h3>
      <span className="text-[10px] text-gray-400">{data}</span>
    </div>
    <div className="space-y-1">
      <p className="text-xs text-gray-500">
        <span className="font-medium">Remetente:</span> {remetente}
      </p>
      <p className="text-xs text-gray-500">
        <span className="font-medium">Assunto:</span> {assunto}
      </p>
      <p className="text-xs text-gray-500 mt-4">
        <span className="font-medium">Solicitação:</span> {status}
      </p>
    </div>
    <div className="absolute right-6 bottom-6 text-gray-400">
      {isPublica ? <Eye size={18} /> : <EyeOff size={18} />}
    </div>
  </div>
);

// Componente Sidebar
const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-8 py-4 cursor-pointer transition-colors ${
      active ? "bg-white/20 border-l-4 border-white" : "hover:bg-white/10"
    }`}
  >
    {Icon ?? <PiIcon size={20} className="text-white" />}
    <span className="text-white font-medium text-sm">{label}</span>
  </div>
);

export default function Reclamacoes() {
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

  return (
    <div className="flex min-h-screen bg-[#f0f5fa] font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-[#268cff] flex flex-col py-8 fixed h-full">
        <div className="flex flex-col items-center mb-10 px-6">
          <div className="bg-white p-3 rounded-2xl mb-2">
            <div className="w-10 h-10 bg-[#268cff] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              $
            </div>
          </div>
          <h1 className="text-white font-bold text-lg">ClassCash</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={<Home size={20} className="text-white" />} label="Página Inicial" />
          <SidebarItem icon={<Wallet size={20} className="text-white" />} label="Pagamentos" />
          <SidebarItem icon={<MessageSquare size={20} className="text-white" />} label="Reclamações" active />
          <SidebarItem icon={<Settings size={20} className="text-white" />} label="Configurações" />
          <SidebarItem icon={<HelpCircle size={20} className="text-white" />} label="Suporte" />
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 ml-64 p-10">
        {/* Header Superior */}
        <header className="flex justify-between items-center mb-8">
          <button className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-800" />
          </button>
          <div className="flex items-center gap-4">
            <Grid size={20} className="text-gray-300" />
            <div className="relative">
              <Bell size={20} className="text-gray-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f0f5fa]"></div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                src="https://via.placeholder.com/40"
                alt="Perfil"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Instruções */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-gray-800 font-bold text-[13px] leading-relaxed">
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
            <p className="text-gray-800 font-bold text-sm">
              Tem uma reclamação a fazer?
            </p>
            <p className="text-gray-800 text-sm">Escreve-a aqui:</p>
          </div>
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative">
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
            <button className="absolute bottom-6 right-6 bg-[#268cff] text-white px-8 py-2 rounded-full text-xs font-bold hover:bg-blue-600 transition-colors shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
