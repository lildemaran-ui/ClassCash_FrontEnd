import React from 'react';
import { 
  Home, Wallet, MessageSquare, Settings as SettingsIcon, 
  HelpCircle, ChevronRight, ArrowLeft 
} from 'lucide-react';

// Componente para os itens de lista das configurações
const SettingItem = ({ label }: { label: string }) => (
  <div className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b last:border-b-0 border-gray-100">
    <span className="text-blue-900 font-medium text-sm">{label}</span>
    <ChevronRight size={18} className="text-gray-400" />
  </div>
);

// Componente para a Sidebar simplificada da imagem
const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-8 py-4 cursor-pointer transition-colors ${active ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10'}`}>
    <Icon size={22} className="text-white" />
    <span className="text-white font-semibold text-sm">{label}</span>
  </div>
);

export default function ConfigurationScreen() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-[#268cff] flex flex-col py-10">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-white p-3 rounded-2xl mb-4 shadow-lg">
             {/* Simulação do logo da imagem */}
             <div className="w-12 h-12 bg-[#268cff] rounded-lg flex items-center justify-center text-white font-bold text-2xl">$</div>
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight">ClassCash</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={Home} label="Página Inicial" />
          <SidebarItem icon={Wallet} label="Pagamentos" />
          <SidebarItem icon={MessageSquare} label="Reclamações" />
          <SidebarItem icon={SettingsIcon} label="Configurações" active />
          <SidebarItem icon={HelpCircle} label="Suporte" />
        </nav>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 p-12">
        <header className="mb-10">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
        </header>

        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Grupo: Perfil e Preferências */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Editar perfil" />
              <SettingItem label="Preferências de cor" />
              <SettingItem label="Notificações" />
            </div>
          </section>

          {/* Grupo: Configurações de Pagamento */}
          <section>
            <h2 className="text-blue-900 font-bold text-lg mb-4">Configurações de Pagamento</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Métodos de pagamentos salvos" />
              <SettingItem label="Definir método padrão" />
              <SettingItem label="Ver histórico de transações automáticas" />
            </div>
          </section>

          {/* Grupo: Segurança */}
          <section>
            <h2 className="text-blue-900 font-bold text-lg mb-4">Segurança</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SettingItem label="Alterar Senha" />
              <SettingItem label="Ver dispositivos conectados" />
            </div>
          </section>

        </div>

        {/* Footer Copyright Simples */}
        <footer className="mt-20 text-center">
          <p className="text-[10px] text-gray-300">
            © 2025 ClassCash, S.A. - Todos os direitos reservados
          </p>
        </footer>
      </main>
    </div>
  );
}