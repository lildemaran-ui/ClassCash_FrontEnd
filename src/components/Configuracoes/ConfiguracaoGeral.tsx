import { ChevronRight } from "lucide-react";

// Componente para os itens de lista das configurações
const SettingItem = ({ label }: { label: string }) => (
  <div className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b last:border-b-0 border-gray-100">
    <span className="text-gray-700 font-medium text-base">{label}</span>
    <ChevronRight size={18} className="text-gray-500" />
  </div>
);

export default function ConfiguracaoGeral() {
  return (
    <div>
      <div className="max-w-3xl mx-auto space-y-10 mt-10">
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
          <h1 className=" font-bold text-xl mb-4">
            Configurações de Pagamento
          </h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingItem label="Métodos de pagamentos salvos" />
            <SettingItem label="Definir método padrão" />
            <SettingItem label="Ver histórico de transações automáticas" />
          </div>
        </section>

        {/* Grupo: Segurança */}
        <section>
          <h1 className=" font-bold text-xl mb-4">Segurança</h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingItem label="Alterar Senha" />
            <SettingItem label="Ver dispositivos conectados" />
          </div>
        </section>
      </div>

      {/* Footer Copyright Simples */}
      <footer className="mt-20 mb-20 text-center">
        <p className="text-[10px] text-gray-400">
          © 2025 ClassCash, S.A. - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
