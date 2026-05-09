// src/Pages/Administrador/PermissoesAcessos.tsx
import Avatar from '@/components/Avatar/Avatar'
import { Header } from '@/components/Header/header'
import MenuAdmin from '@/components/Menu/MenuAdmin'
import { fetchComAuth } from '@/types/global/fetchComAuth'
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from '@/types/global/sessao'
import {
  ChevronRight,
  RefreshCw,
  UserPlus,
  Search,
  UserX,
  Lock,
  Unlock,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { UtilizadorDetalhes } from './Modaldetalhesutilizador'
import ModalDetalhesUtilizador from './Modaldetalhesutilizador'

const API_BASE = 'http://localhost:5000/api'

// Adicionado "Suspenso" para suportar as sanções automáticas futuramente
type Perfil = 'Encarregado' | 'Estudante' | 'Instituição'
type StatusAcesso = 'Ativo' | 'Inativo' | 'Bloqueado' | 'Suspenso'

interface Utilizador {
  id: number
  nome: string
  email: string
  perfil: Perfil
  instituicao: string
  status: StatusAcesso
  planoActivo: boolean
  ultimoAcesso: string
}

const MODULOS_PREMIUM = [
  { id: 'pagamentos', label: 'Pagamentos', requerPlano: false },
  { id: 'propinas', label: 'Propinas', requerPlano: true },
  { id: 'multas', label: 'Módulo de Multas', requerPlano: true },
  { id: 'relatorios', label: 'Relatórios', requerPlano: true },
]

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 w-10 h-5 ${checked ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function PermissoesAcessos() {
  const [abaAtiva, setAbaAtiva] = useState<'acessos' | 'permissoes'>('acessos')
  const [filtroPerfil, setFiltroPerfil] = useState<string>('Todos')
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState('')
  const [user, setUser] = useState<SessaoUsuario | null>(null)
  const [utilizadorSelecionado, setUtilizadorSelecionado] =
    useState<UtilizadorDetalhes | null>(null)

  const fetchDados = useCallback(async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetchComAuth(`${API_BASE}/PermissoesAcesso`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const rows = await res.json()
      const mapped: Utilizador[] = rows.map((r: any) => ({
        id: r.idusuario,
        nome: r.nome,
        email: r.email,
        perfil: r.perfil, // Certifique-se que a API envia exatamente "Instituição"
        instituicao: r.instituicao || '—',
        status: r.status || 'Ativo',
        planoActivo: r.plano_ativo === 'Ativo',
        ultimoAcesso: r.ultimo_acesso
          ? new Date(r.ultimo_acesso).toLocaleDateString()
          : '—',
      }))
      setUtilizadores(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const sessao = exigirSessao()
    if (sessao) {
      setUser(sessao.usuario)
      fetchDados()
    }
  }, [fetchDados])

  const handleToggleStatus = (id: number) => {
    setUtilizadores((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : u,
      ),
    )
  }

  const handleTogglePlano = (id: number) => {
    setUtilizadores((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, planoActivo: !u.planoActivo } : u,
      ),
    )
  }

  // CORREÇÃO DO FILTRO: Usando normalização para evitar erro com acentos
  const listaFiltrada = utilizadores.filter((u) => {
    const matchBusca =
      u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.email.toLowerCase().includes(termoBusca.toLowerCase())

    // Normaliza para comparar sem acentos se necessário
    const perfilUsuario = u.perfil
    const matchPerfil =
      filtroPerfil === 'Todos' || perfilUsuario === filtroPerfil

    return matchBusca && matchPerfil
  })

  const listaRestritos = utilizadores.filter((u) => u.status !== 'Ativo')

  const getPerfilStyle = (perfil: string) => {
    if (perfil.includes('Institu'))
      return 'bg-blue-50 text-blue-700 border-blue-200'
    if (perfil.includes('Estudante'))
      return 'bg-green-50 text-green-700 border-green-200'
    if (perfil.includes('Encarregado'))
      return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  if (!user) return null

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <MenuAdmin />

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          titulo="Gestão de Permissões"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex gap-8 border-b border-gray-200 mb-4">
            <button
              onClick={() => setAbaAtiva('acessos')}
              className={`pb-3 text-sm font-bold transition-all ${abaAtiva === 'acessos' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
            >
              Acessos
            </button>
            <button
              onClick={() => setAbaAtiva('permissoes')}
              className={`pb-3 text-sm font-bold transition-all ${abaAtiva === 'permissoes' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
            >
              Permissões
            </button>
          </div>

          {abaAtiva === 'acessos' && (
            <section className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-4xl">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botões de Filtro com Strings exatas para bater com o Perfil da DB */}
                    {[
                      { label: 'Todos', value: 'Todos' },
                      { label: 'Estudantes', value: 'Estudante' },
                      { label: 'Encarregados', value: 'Encarregado' },
                      { label: 'Instituições', value: 'Instituição' },
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setFiltroPerfil(btn.value)}
                        className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                          filtroPerfil === btn.value
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white text-primary border-primary/30 hover:border-primary'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => fetchDados()}
                    className="p-2 bg-white border rounded-xl hover:bg-gray-50"
                  >
                    <RefreshCw
                      className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`}
                    />
                  </button>
                  <button className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-primary/90 shadow-sm">
                    <UserPlus className="w-4 h-4" /> Novo Admin
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide border-b border-gray-100">
                      <th className="px-6 py-4 text-left">Utilizador</th>
                      <th className="px-6 py-4 text-left">Perfil</th>
                      <th className="px-6 py-4 text-left">Instituição</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Plano</th>
                      <th className="px-6 py-4 text-left">Último Acesso</th>
                      <th className="px-6 py-4 text-center">Activo</th>
                      <th className="px-6 py-4 text-center">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {listaFiltrada.length > 0 ? (
                      listaFiltrada.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-800 text-sm">
                              {u.nome}
                            </p>
                            <p className="text-[13px] text-gray-400">
                              {u.email}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold border ${getPerfilStyle(u.perfil)}`}
                            >
                              {u.perfil}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[12px] text-gray-500">
                            {u.instituicao}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                u.status === 'Ativo'
                                  ? 'bg-green-100 text-green-700'
                                  : u.status === 'Suspenso'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Toggle
                              checked={u.planoActivo}
                              onChange={() => handleTogglePlano(u.id)}
                            />
                          </td>
                          <td className="px-6 py-4 text-left text-[12px] text-gray-500">
                            {u.ultimoAcesso}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Toggle
                              checked={u.status === 'Ativo'}
                              onChange={() => handleToggleStatus(u.id)}
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setUtilizadorSelecionado(u)}
                              className="text-[12px] font-bold text-[#184d8a] border border-[#184d8a]/30 px-4 py-1.5 rounded-lg hover:bg-[#184d8a] hover:text-white transition-all inline-flex items-center gap-2"
                            >
                              Ver <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-gray-400 italic"
                        >
                          Nenhum registo encontrado para este filtro.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {abaAtiva === 'permissoes' && (
            <section className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                  Módulos do Plano Premium
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MODULOS_PREMIUM.map((aba) => (
                    <div
                      key={aba.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {aba.requerPlano ? (
                          <Lock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Unlock className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm font-bold text-gray-700">
                          {aba.label}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${aba.requerPlano ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {aba.requerPlano ? 'Premium' : 'Grátis'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                  <UserX className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-gray-800">
                    Utilizadores Restritos (Inativos/Bloqueados)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-[11px] text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                        <th className="px-6 py-4 text-left">Utilizador</th>
                        <th className="px-6 py-4 text-center">Status Atual</th>
                        <th className="px-6 py-4 text-center">Restaurar</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {listaRestritos.length > 0 ? (
                        listaRestritos.map((u) => (
                          <tr key={u.id} className="hover:bg-red-50/5">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 text-sm">
                                {u.nome}
                              </p>
                              <p className="text-[12px] text-gray-400">
                                {u.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`text-[10px] font-black px-3 py-1 rounded-full ${u.status === 'Bloqueado' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Toggle
                                checked={u.status === 'Ativo'}
                                onChange={() => handleToggleStatus(u.id)}
                              />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setUtilizadorSelecionado(u)}
                                className="text-[12px] font-bold text-[#184d8a] border border-[#184d8a]/30 px-4 py-1.5 rounded-lg hover:bg-[#184d8a] hover:text-white transition-all"
                              >
                                Ver Detalhes
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-10 text-center text-gray-400 italic"
                          >
                            Nenhum utilizador restrito encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {utilizadorSelecionado && (
        <ModalDetalhesUtilizador
          utilizador={utilizadorSelecionado}
          onClose={() => setUtilizadorSelecionado(null)}
          onUpdated={fetchDados}
        />
      )}
    </div>
  )
}
