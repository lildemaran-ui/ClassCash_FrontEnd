import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao } from "@/types/global/sessao";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Configuracoes {
  temainterface: string;
  metodopagamento: string;
  notificacoesativas: boolean;
}

const SettingItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 px-6 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b last:border-b-0 border-gray-100"
  >
    <span className="text-gray-700 font-medium text-base">{label}</span>
    <ChevronRight size={18} className="text-gray-500" />
  </div>
);

export default function ConfiguracaoGeral() {
  const sessao = exigirSessao();
  const token = sessao?.token;

  const [configs, setConfigs] = useState<Configuracoes | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Carregar configurações actuais
  useEffect(() => {
    fetch("http://localhost:5000/api/configuracoes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((dados) => setConfigs(dados))
      .catch((err) => console.error("Erro ao carregar configurações:", err))
      .finally(() => setCarregando(false));
  }, []);

  // Função genérica para actualizar uma configuração
  const actualizarConfig = async (campo: Partial<Configuracoes>) => {
    try {
      const response = await fetchComAuth("http://localhost:5000/api/usuario-configuracoes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campo),
      });

      if (response.ok) {
        toast.success("Configuração atualizada!");
        setConfigs((prev) => (prev ? { ...prev, ...campo } : prev));
      } else {
        const erro = await response.json();
        toast.error(`Erro: ${erro.error}`);
      }
    } catch (err) {
      console.error("Erro ao actualizar configuração:", err);
      toast.error("Não foi possível conectar ao servidor.");
    }
  };

  const alternarNotificacoes = () => {
    const novoValor = !(configs?.notificacoesativas ?? true);
    actualizarConfig({ notificacoesativas: novoValor });
  };

  const alterarTema = () => {
    const novoTema = configs?.temainterface === "escuro" ? "claro" : "escuro";
    actualizarConfig({ temainterface: novoTema });
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto space-y-10 mt-10">

        {/* Grupo: Perfil e Preferências */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingItem label="Editar perfil" />
            <SettingItem
              label={
                carregando
                  ? "Preferências de cor"
                  : `Preferências de cor (${configs?.temainterface ?? "claro"})`
              }
              onClick={alterarTema}
            />
            <SettingItem
              label={
                carregando
                  ? "Notificações"
                  : `Notificações (${configs?.notificacoesativas ? "Ativas" : "Desativadas"})`
              }
              onClick={alternarNotificacoes}
            />
          </div>
        </section>

        {/* Grupo: Configurações de Pagamento */}
        <section>
          <h1 className="font-bold text-xl mb-4">Configurações de Pagamento</h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingItem
              label={
                carregando
                  ? "Métodos de pagamentos salvos"
                  : `Métodos de pagamentos salvos (${configs?.metodopagamento ? "1 método" : "Nenhum método"})`
              }
            />
            <SettingItem label="Definir método padrão" />
            <SettingItem label="Ver histórico de transações automáticas" />
          </div>
        </section>

        {/* Grupo: Segurança */}
        <section>
          <h1 className="font-bold text-xl mb-4">Segurança</h1>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingItem label="Alterar Senha" />
            <SettingItem label="Ver dispositivos conectados" />
          </div>
        </section>
      </div>

      <footer className="mt-20 mb-20 text-center">
        <p className="text-[10px] text-gray-400">
          © 2025 ClassCash, S.A. - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}