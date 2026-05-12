import { Lock } from 'lucide-react'

export function BloqueioTotal() {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center space-y-6 shadow-2xl">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Lock className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Instituição Suspensa
        </h1>
        <p className="text-gray-600 text-sm">
          O acesso ao <strong>Classcash</strong> foi interrompido. Regularize o
          pagamento da mensalidade para reativar todos os serviços.
        </p>
        <button className="w-full bg-[#184d8a] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
          Gerar Referência de Pagamento
        </button>
      </div>
    </div>
  )
}
