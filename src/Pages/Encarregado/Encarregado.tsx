import ChartEstud from "@/components/Charts/ChartEstud";
import MenuEncar from "@/components/Menu/MenuEncar";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import { CheckCircle, Download, Pen } from "lucide-react";
import { useEffect, useState } from "react";

export default function Encarregado() {
  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return <span>Carregado...</span>;

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold whitespace-nowrap">{value}</span>
    </div>
  );

  return (
    <div className="flex overflow-hidden h-screen bg-white font-sans">
      <MenuEncar />

      <main className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Botão editar perfil */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setModal(true)}
            className="text-[#184d8a] text-sm sm:text-base font-medium flex items-center gap-2 transition-all duration-500"
          >
            <Pen size={16} /> EDITAR PERFIL
          </button>
        </div>

        {/* Header perfil */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
          {/* Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gray-100 shrink-0">
              {user.foto ? (
                <img
                  loading="lazy"
                  src={user.foto}
                  alt={user.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#184d8a] text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                  {(user.nome || "User")
                    .trim()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1 text-center sm:text-left">
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

          {/* Situação financeira */}
          <div className="bg-white p-5 rounded-xl border w-full sm:min-w-[250px] sm:w-auto flex items-center gap-4">
            <CheckCircle size={40} className="text-green-600 shrink-0" />
            <div className="flex flex-col">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">
                Situação Financeira do seu Educando
              </h3>
              <p className="text-green-600 text-sm font-medium">
                Financeiramente está estável
              </p>
              <p className="text-xs text-gray-400">Sem pagamentos em atraso</p>
            </div>
          </div>
        </header>

        <hr className="mb-8 border-gray-200" />

        <ProfileEditModal
          isOpen={Modal}
          onClose={() => setModal(false)}
          user={user}
        />

        {/* Resumo + Gráfico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
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

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              Histórico de pagamentos referente ao período selecionado
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[#184d8a] text-white text-sm">
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
                    <td className="p-4 text-green-500 font-medium">Em dia</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botão PDF */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button className="bg-[#184d8a] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-500 w-full sm:w-auto justify-center">
            <Download size={18} /> Gerar PDF
          </button>
        </div>
      </main>
    </div>
  );
}
