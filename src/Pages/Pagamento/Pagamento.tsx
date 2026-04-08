'use client'

import { useEffect, useState } from 'react'
// Comentei estes temporariamente para isolar o erro
// import { Layout } from '../layout'
// import { Header } from '@/components/Header/header'
import PagamentoGeral from '@/components/Pagamento/PagamentoGeral'

export default function Pagamentos() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Garante que o código só corre no navegador (evita erros de Hydration)
    setIsClient(true)
  }, [])

  if (!isClient) return <div className="p-20 text-center">Carregando...</div>

  return (
    <div className="w-full min-h-screen bg-white text-gray-900">
      {/* Removi o Layout e o Header por agora. 
         Se a página aparecer, o erro está num deles.
      */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h1 className="font-bold text-[#184d8a]">Classcash - Modo de Teste</h1>
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
          Layout Desativado
        </span>
      </div>

      <main className="flex-1">
        <PagamentoGeral />
      </main>
    </div>
  )
}
