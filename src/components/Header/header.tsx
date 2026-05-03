import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProfileEditModal } from '../profile_edit_modal'
import { Link } from 'react-router-dom'
import { NotificationBell } from '../Sancoes/NotificationBell'

// 1. Definição do formato do Usuário para o TypeScript não reclamar do "any"
interface User {
  idinstituicao: number
  idInstituicao?: number
  id_instituicao?: number // Adicionado para evitar o erro
  nome?: string
  email?: string
}
// 2. Definição das propriedades que o Header recebe
interface HeaderProps {
  titulo: string
  usuario: React.ReactNode
}

export function Header(props: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem('UsuarioAtivo')
    if (dadosDoLogin) {
      const parsedUser = JSON.parse(dadosDoLogin)
      console.log('Dados do usuário logado:', parsedUser) // ADICIONE ISSO
      setUser(parsedUser)
    }
  }, [])

  // Se o usuário ainda não carregou, não renderiza o Header para evitar erros de undefined
  if (!user) return null

  return (
    <div
      className="flex items-center justify-between top-0 
      px-4 sm:px-6 lg:px-8
      py-3 sm:py-4
      w-full bg-translucido backdrop-blur-sm border-b border-gray-100 sticky z-10"
    >
      {/* Título dinâmico */}
      <h1 className="text-base sm:text-lg lg:text-xl pl-10 lg:pl-0 font-bold text-[#184d8a] truncate max-w-[60%] sm:max-w-none">
        {props.titulo}
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Botão de Configurações */}
        <Link to="/Configuracao">
          <button className="text-[#184d8a] hover:scale-110 transition-all p-1">
            <Settings size={20} className="sm:hidden" />
            <Settings size={24} className="hidden sm:block" />
          </button>
        </Link>

        {/* --- NOVO SININHO COM PUSHER --- */}
        <NotificationBell
          idInstituicao={
            user.idinstituicao ||
            user.idInstituicao ||
            user.id_instituicao ||
            35
          }
        />
        {/* Modal de Edição de Perfil */}
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
        />

        {/* Avatar/Usuário */}
        <div
          className="avatar cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {props.usuario}
        </div>
      </div>
    </div>
  )
}
