<<<<<<< HEAD
// src/Pages/Secretaria/SolicitacoesCadastro/SolicitacoesCadastro.tsx
import MenuSecretaria from '@/components/Menu/MenuSecretaria'
import {
  Bell,
  CheckCircle,
  CircleUser,
  Eye,
  Search,
  UserCheck,
  UserX,
  X,
} from 'lucide-react' // Removidos: AlertCircle, Clock, Key
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

const API = 'http://localhost:5000/api'

interface Solicitacao {
  tipo: 'estudante' | 'encarregado'
  id: number
  nome: string
  email: string
  contacto: string | null
  num_processo: string
  status: string
  codigo_plataforma: string | null
  instituicao: string
  classe?: number
  grau_parentesco?: string
  nome_educando?: string
}

// --- MODAL DE DETALHES, APROVAÇÃO E RECUSA ---
function ModalDetalhes({
  item,
  onClose,
  onApproved,
  onRejected,
}: {
  item: Solicitacao
  onClose: () => void
  onApproved: (id: number, tipo: string, codigo: string) => void
  onRejected: (id: number, tipo: string) => void
}) {
  const [codigo, setCodigo] = useState('')
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [tab, setTab] = useState<'detalhes' | 'aprovar' | 'recusar'>('detalhes')

  const token = localStorage.getItem('Token')

  const aprovar = async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch(`${API}/aprovacao/aprovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: item.tipo,
          id: item.id,
          codigoCustom: codigo,
        }),
      })
      const data = (await res.json()) as { codigo?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Erro ao aprovar')
      onApproved(item.id, item.tipo, data.codigo ?? '')
      onClose()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  const recusar = async () => {
    if (!motivo.trim()) {
      setErro('Indica o motivo da recusa.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const res = await fetch(`${API}/aprovacao/recusar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: item.tipo, id: item.id, motivo }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Erro ao recusar')
      onRejected(item.id, item.tipo)
      onClose()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              Analisar Solicitação
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.nome} · {item.tipo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex border-b bg-gray-50/50">
          {(['detalhes', 'aprovar', 'recusar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                tab === t
                  ? 'bg-white border-b-2 border-[#184d8a] text-[#184d8a]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'detalhes'
                ? 'Dados'
                : t === 'aprovar'
                  ? 'Aprovar'
                  : 'Recusar'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'detalhes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Nome Completo', item.nome],
                  ['Email', item.email],
                  ['Contacto', item.contacto ?? 'Não fornecido'],
                  ['Nº Processo', item.num_processo],
                  ['Instituição', item.instituicao],
                  ...(item.classe
                    ? [['Classe', `${item.classe}ª Classe`]]
                    : []),
                  ...(item.grau_parentesco
                    ? [['Grau Parentesco', item.grau_parentesco]]
                    : []),
                  ...(item.nome_educando
                    ? [['Educando Associado', item.nome_educando]]
                    : []),
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'aprovar' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 leading-relaxed">
                  Ao confirmar, o sistema enviará as credenciais de acesso para{' '}
                  <strong>{item.email}</strong>.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  Código da Plataforma
                </label>
                <input
                  type="text"
                  placeholder="Deixe vazio para gerar CC-2026-XXXX"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#184d8a]/20 outline-none transition-all"
                />
              </div>
              {erro && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                  {erro}
                </p>
              )}
              <button
                onClick={aprovar}
                disabled={loading}
                className="w-full bg-[#184d8a] text-white font-bold py-3.5 rounded-xl hover:bg-[#123a69] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Confirmar e Enviar Acesso'}
              </button>
            </div>
          )}

          {tab === 'recusar' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <UserX className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 leading-relaxed">
                  Indique o motivo para que o usuário saiba por que o cadastro
                  foi rejeitado.
                </p>
              </div>
              <textarea
                rows={4}
                placeholder="Ex: O número de processo não condiz com os nossos registos..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-400/20 outline-none resize-none"
              />
              {erro && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
                  {erro}
                </p>
              )}
              <button
                onClick={recusar}
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Recusando...' : 'Confirmar Recusa'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
=======
import DadosDasSolicitacoes from "./DadosDasSolicitacoes";
>>>>>>> 8b3a2f00c786e404eeb4f2f2b347331a68e8136c

// --- COMPONENTE PRINCIPAL ---
export default function SolicitacoesCadastro() {
<<<<<<< HEAD
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<
    'todos' | 'estudante' | 'encarregado'
  >('todos')
  const [selected, setSelected] = useState<Solicitacao | null>(null)
  const [notifAnim, setNotifAnim] = useState(false)

  const carregar = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('Token')
      const res = await fetch(`${API}/aprovacao/pendentes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSolicitacoes([...data.estudantes, ...data.encarregados])
    } catch (e) {
      console.error('Erro ao carregar', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
    const pusher = new Pusher('TUA_KEY_AQUI', { cluster: 'TUA_CLUSTER_AQUI' })
    const user = JSON.parse(localStorage.getItem('UsuarioAtivo') || '{}')
    const idInst = user.id_instituicao || user.idInstituicao

    if (idInst) {
      const channel = pusher.subscribe(`instituicao-${idInst}`)
      channel.bind('nova-solicitacao', (nova: Solicitacao) => {
        setSolicitacoes((prev) => [nova, ...prev])
        setNotifAnim(true)
        setTimeout(() => setNotifAnim(false), 2000)
      })
      return () => {
        channel.unbind_all()
        channel.unsubscribe()
      }
    }
  }, [])

  const handleApproved = (id: number, tipo: string) => {
    setSolicitacoes((prev) =>
      prev.filter((s) => !(s.id === id && s.tipo === tipo)),
    )
  }

  const filtradas = solicitacoes.filter((s) => {
    const matchTipo = filtroTipo === 'todos' || s.tipo === filtroTipo
    const searchLower = search.toLowerCase()
    const matchSearch =
      s.nome.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower)
    return matchTipo && matchSearch
  })

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <MenuSecretaria />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Solicitações</h1>
            {solicitacoes.length > 0 && (
              <div className="bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter animate-pulse">
                {solicitacoes.length} Pendentes
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#184d8a]" />
              <input
                type="text"
                placeholder="Procurar aluno ou encarregado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-[#184d8a]/5 outline-none transition-all"
              />
            </div>
            <div
              className={`relative p-2 rounded-full transition-all ${notifAnim ? 'bg-red-50 scale-125' : ''}`}
            >
              <Bell
                className={`w-6 h-6 ${notifAnim ? 'text-red-500 animate-bounce' : 'text-gray-400'}`}
              />
              {solicitacoes.length > 0 && (
                <span className="absolute top-2 right-2 bg-red-600 w-2.5 h-2.5 rounded-full border-2 border-white" />
              )}
            </div>
            <CircleUser className="w-8 h-8 text-[#184d8a] cursor-pointer" />
          </div>
        </header>

        <main className="p-8 overflow-y-auto custom_scroll">
          <div className="flex gap-2 mb-8">
            {(['todos', 'estudante', 'encarregado'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltroTipo(f)}
                className={`text-xs font-bold px-5 py-2 rounded-xl border transition-all capitalize ${
                  filtroTipo === f
                    ? 'bg-[#184d8a] text-white border-[#184d8a] shadow-lg shadow-blue-900/20'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f}s
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4">
              <div className="w-10 h-10 border-4 border-[#184d8a]/20 border-t-[#184d8a] rounded-full animate-spin" />
              <p className="text-sm font-medium">
                A sincronizar solicitações...
              </p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 flex flex-col items-center border border-dashed border-gray-200">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
              </div>
              <p className="text-gray-900 font-bold">Tudo em dia!</p>
              <p className="text-gray-400 text-sm">
                Não há novos cadastros para validar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtradas.map((s) => (
                <div
                  key={`${s.tipo}-${s.id}`}
                  className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all flex items-center gap-4 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      s.tipo === 'estudante'
                        ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                        : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                    }`}
                  >
                    <CircleUser className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {s.nome}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{s.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {s.tipo}
                      </span>
                      {s.num_processo && (
                        <span className="text-[10px] font-bold text-gray-400">
                          Proc: {s.num_processo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(s)}
                      title="Ver Detalhes"
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#184d8a] hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelected(s)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 font-bold text-xs hover:bg-green-600 hover:text-white transition-all"
                    >
                      <UserCheck className="w-4 h-4" /> Validar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {selected && (
        <ModalDetalhes
          item={selected}
          onClose={() => setSelected(null)}
          onApproved={handleApproved}
          onRejected={handleApproved}
        />
      )}
    </div>
=======
  return(
    <DadosDasSolicitacoes/>
>>>>>>> 8b3a2f00c786e404eeb4f2f2b347331a68e8136c
  )
}
