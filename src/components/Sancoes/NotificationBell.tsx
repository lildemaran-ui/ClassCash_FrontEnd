import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { pusherClient } from '../../lib/pusher'

interface NotificationBellProps {
  idInstituicao: number
}

export function NotificationBell({ idInstituicao }: NotificationBellProps) {
  const [notificacaoCritica, setNotificacaoCritica] = useState(false)

  useEffect(() => {
    // IMPORTANTE: idInstituicao aqui deve vir da prop, não ser "1"
    const canalNome = `instituicao-${idInstituicao}`

    console.log('Sintonizado no canal:', canalNome)

    const channel = pusherClient.subscribe(canalNome)

    channel.bind('status-financeiro', (data: { status: string }) => {
      console.log('📢 Alerta recebido:', data)
      if (data.status === 'atrasado') {
        setNotificacaoCritica(true)
      }
    })

    return () => {
      pusherClient.unsubscribe(canalNome)
    }
  }, [idInstituicao]) // O efeito recarrega se o ID mudar

  return (
    <div className="relative p-2 flex items-center justify-center cursor-pointer">
      <Bell
        size={24}
        strokeWidth={2.5}
        className={`transition-all duration-300 ${
          notificacaoCritica ? 'text-red-500 animate-bounce' : 'text-[#184d8a]'
        }`}
      />

      {notificacaoCritica && (
        <span className="absolute -top-0 -right-0 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white shadow-lg"></span>
        </span>
      )}
    </div>
  )
}
