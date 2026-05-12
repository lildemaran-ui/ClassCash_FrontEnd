import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

export function ModalRestricao() {
  const [aberto, setAberto] = useState(true)

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border-t-4 border-orange-500 relative">
        <button
          onClick={() => setAberto(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <AlertCircle className="text-orange-600" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Aviso Crítico</h3>
            <p className="text-sm text-gray-500 mt-2">
              O prazo limite de pagamento expirou. Para continuar a utilizar
              todas as funcionalidades da <strong>Classcash</strong>, efectue o
              pagamento hoje.
            </p>
          </div>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-colors">
            Ir para Pagamentos
          </button>
        </div>
      </div>
    </div>
  )
}
