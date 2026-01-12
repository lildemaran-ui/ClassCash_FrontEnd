import {
  Settings,
  Download,
  CreditCard,
  Shirt,
  Coins,
  CheckCircle,
} from "lucide-react";
export default function DadosDashEstd() {
      const StatusCard = ({
    icon,
    title,
    progress,
  }: {
    icon: React.ReactNode;
    title: string;
    progress: number;
  }) => (
    <div className="bg-white p-6 rounded-2xl  border-2 border-gray-100 flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h4 className="font-bold text-gray-800 mb-4">{title}</h4>
      <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
        <div
          className="bg-[#268cff] h-full rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs font-bold text-gray-500">Pago</span>
    </div>
  );
    const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold">{value}</span>
    </div>
  );
  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`}></div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
  return (
    <div>
      <header className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-6">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-sm  ">
            <img
              src="/api/placeholder/150/150"
              alt="Estudante"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Nome
            </h2>
            <p className="text-lg font-bold">Dário Valente de Sousa</p>
            <p className="text-sm text-gray-600">
              Email: dario.valente@gmail.com
            </p>
            <p className="text-sm text-gray-600">Nº de processo: 22354</p>
          </div>
        </div>

        <div className="text-right">
          <button className="text-[#268cff] text-sm font-medium flex items-center gap-2 mb-4 ml-auto">
            <Settings size={16} /> EDITAR PERFIL
          </button>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-w-[250px] flex items-center gap-4">
            <div>
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                Situação Financeira
              </h3>
              <p className="text-green-600 text-sm font-medium">
                Financeiramente está estável
              </p>
              <p className="text-xs text-gray-400">Sem pagamentos em atraso</p>
            </div>
          </div>
        </div>
      </header>

      <hr className="mb-8 border-gray-200" />

      {/* Status Cards */}
      <div className="grid grid-cols-3  gap-6 mb-8">
        <div>
          <StatusCard
            icon={<CreditCard className="text-gray-600" />}
            title="Cartão Escolar"
            progress={60}
          />
        </div>
        <StatusCard
          icon={<Shirt className="text-gray-600" />}
          title="Uniformes"
          progress={85}
        />
        <StatusCard
          icon={<Coins className="text-gray-600" />}
          title="Propinas"
          progress={100}
        />
      </div>

      {/* Financial Summary & Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-gray-800">Resumo Financeiro:</h3>
          <div className="space-y-4">
            <SummaryRow label="Último pagamento:" value="09/11/2025" />
            <SummaryRow label="Próximo vencimento:" value="09/12/2025" />
            <SummaryRow label="Total pago no mês:" value="Kz 55.300,00" />
            <SummaryRow label="Total pago no ano:" value="Kz 313.000,00" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-[20px] border-blue-500 border-l-blue-400 border-t-blue-00  flex items-center justify-center">
            <div className="text-xs font-bold text-gray-400 ">
              Serviços Solicitados
            </div>
          </div>
          <div className="ml-8 space-y-2">
            <LegendItem color="bg-blue-400" label="Propinas" />
            <LegendItem color="bg-blue-600" label="Uniformes" />
            <LegendItem color="bg-blue-800" label="Cartão Escolar" />
          </div>
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
                <td className="p-4 font-medium text-gray-900">Kz 31.300,00</td>
                <td className="p-4 text-gray-400">Kz 0,00</td>
                <td className="p-4 text-green-500 font-medium italic">
                  Em dia
                </td>
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
    </div>
  );
}
