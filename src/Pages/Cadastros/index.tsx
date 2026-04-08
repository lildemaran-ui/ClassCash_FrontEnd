import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CircleAlert,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// --- Tipos ---
interface PreSelectedInstitution {
  idinstituicao: number
  nome: string
}

interface RouterState {
  preSelectedInstitution?: PreSelectedInstitution
  fromInstitutions?: boolean
}

interface Instituicao {
  idinstituicao: number
  nome: string
}

interface Classe {
  idclasse: number
  nivel: number
}

// --- Modal de Aviso ---
function InstitutionCheckModal({
  onGoCheck,
  onClose,
}: {
  onGoCheck: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#184d8a] to-[#1a6fd4] p-6 pb-8 relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <TriangleAlert className="w-8 h-8 text-white" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6 -mt-4 relative">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-5 text-center">
            <p className="text-sm font-bold text-gray-800">Atenção!</p>
            <p className="text-xs text-gray-500">
              Para se cadastrar, a sua instituição precisa estar registada.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onGoCheck}
              className="w-full flex items-center justify-center gap-2 bg-[#184d8a] text-white py-3 rounded-xl font-bold hover:bg-[#184d8a]/80 transition-all"
            >
              Verificar Instituição <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm py-2 hover:bg-blue-50 rounded-xl transition-all"
            >
              Já verifiquei, continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TelaCadastro() {
  const location = useLocation()
  const navigate = useNavigate()
  const routerState = location.state as RouterState | null
  const preSelected = routerState?.preSelectedInstitution ?? null
  const fromInstitutions = routerState?.fromInstitutions ?? false

  const [showModal, setShowModal] = useState(
    !fromInstitutions && preSelected === null,
  )
  const [mostrarSenha, setMostrar] = useState(false)
  const [perfil, setPerfil] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [contacto, setContacto] = useState('')
  const [senha, setSenha] = useState('')
  const [idInstituicao, setInstituicao] = useState<string>(
    preSelected?.idinstituicao.toString() ?? '',
  )
  const [idClasse, setidClasse] = useState<string>('')
  const [numProcesso, setNumProcesso] = useState('')
  const [nomeEstudante, setNomeEstudante] = useState('')
  const [grauParentesco, setGrauParentesco] = useState('')
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])
  const [classes, setClasses] = useState<Classe[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)

  // 1. Carregar Instituições
  useEffect(() => {
    fetch('http://localhost:5000/api/cadastro-instituicao')
      .then((r) => r.json())
      .then((data: Instituicao[]) => {
        setInstituicoes(data)
        if (preSelected) {
          const found = data.find(
            (i) => i.idinstituicao === preSelected.idinstituicao,
          )
          if (found) setInstituicao(found.idinstituicao.toString())
        }
      })
      .catch(() => toast.error('Erro ao carregar instituições'))
  }, [preSelected])

  // 2. Carregar Classes (RETIFICADO PARA EVITAR DUPLICAÇÃO)
  useEffect(() => {
    // Se mudar a instituição, resetamos a classe selecionada e a lista
    setidClasse('')
    setClasses([])

    if (!idInstituicao) return

    setLoadingClasses(true)
    fetch(`http://localhost:5000/api/classes/${idInstituicao}`)
      .then((res) => res.json())
      .then((data) => {
        // Garantimos que o estado seja SUBSTITUÍDO e não acumulado
        if (Array.isArray(data)) {
          setClasses(data)
        } else {
          setClasses([])
        }
      })
      .catch((err) => {
        console.error('Erro no fetch de classes:', err)
        setClasses([])
      })
      .finally(() => setLoadingClasses(false))
  }, [idInstituicao])

  const MudarPerfil = (value: string) => {
    setPerfil(value)
    setNumProcesso('')
    setidClasse('')
    setNomeEstudante('')
    setGrauParentesco('')
  }

  const DadosCadastro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idInstituicao) return toast.error('Selecione uma instituição')
    if (!perfil) return toast.error('Selecione um perfil')
    if (!idClasse) return toast.error('Selecione a classe')

    const body = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),
      numTel: contacto || '000000000',
      numProcesso: numProcesso.trim(),
      idInstituicao: parseInt(idInstituicao),
      idClasse: parseInt(idClasse), // Enviando como número puro
      ...(perfil === 'Encarregado' && {
        nomeEstudante: nomeEstudante.trim(),
        grauParentesco: grauParentesco.trim(),
      }),
    }

    const rota =
      perfil === 'Estudante'
        ? 'http://localhost:5000/api/cadastroEstudante'
        : 'http://localhost:5000/api/cadastroEncarregado'

    try {
      const res = await fetch(rota, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar.')

      toast.success('Cadastro realizado com sucesso!')
      setTimeout(() => navigate('/Login'), 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no servidor.')
    }
  }

  return (
    <>
      {showModal && (
        <InstitutionCheckModal
          onGoCheck={() => navigate('/Instituições')}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="py-10 bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="mx-auto border border-gray-200 rounded-xl flex flex-col w-full max-w-[450px] space-y-6 bg-white p-8 shadow-lg">
          <div className="space-y-1 text-center">
            <h1 className="text-[#184d8a] font-extrabold text-2xl tracking-tight">
              Classcash
            </h1>
            <p className="text-sm text-gray-500">
              Crie a sua conta de {perfil || 'usuário'}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={DadosCadastro}>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Eu sou...
              </label>
              <Select value={perfil} onValueChange={MudarPerfil}>
                <SelectTrigger className="w-full h-12 border-2">
                  <SelectValue placeholder="Escolha o seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estudante">Estudante</SelectItem>
                  <SelectItem value="Encarregado">Encarregado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {perfil && (
              <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">
                    Nome Completo
                  </label>
                  <input
                    required
                    value={nome}
                    type="text"
                    onChange={(e) =>
                      setNome(e.target.value.replace(/[0-9]/g, ''))
                    }
                    className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-[2]">
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Instituição
                    </label>
                    {preSelected ? (
                      <div className="flex items-center gap-2 w-full border-2 border-blue-100 bg-blue-50/50 rounded-lg h-11 text-xs px-4 text-[#184d8a] font-medium">
                        <Building2 className="w-4 h-4" /> {preSelected.nome}
                      </div>
                    ) : (
                      <Select
                        value={idInstituicao}
                        onValueChange={setInstituicao}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {instituicoes.map((i) => (
                            <SelectItem
                              key={i.idinstituicao}
                              value={i.idinstituicao.toString()}
                            >
                              {i.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Classe
                    </label>
                    <Select value={idClasse} onValueChange={setidClasse}>
                      <SelectTrigger className="h-11">
                        <SelectValue
                          placeholder={loadingClasses ? '...' : 'Grau'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.length > 0 ? (
                          classes.map((c) => (
                            <SelectItem
                              key={c.idclasse}
                              value={c.idclasse.toString()}
                            >
                              {c.nivel}ª Classe
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="none">
                            Nenhuma
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Nº de Processo
                    </label>
                    <input
                      required
                      value={numProcesso}
                      maxLength={10}
                      onChange={(e) =>
                        setNumProcesso(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Telemóvel
                    </label>
                    <input
                      required
                      type="tel"
                      maxLength={9}
                      value={contacto}
                      onChange={(e) =>
                        setContacto(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">
                    Palavra-Passe
                  </label>
                  <div className="relative">
                    <input
                      required
                      value={senha}
                      type={mostrarSenha ? 'text' : 'password'}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrar(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {mostrarSenha ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                {perfil === 'Encarregado' && (
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2 text-amber-600">
                      <CircleAlert className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Dados do Educando
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Nome do Aluno
                      </label>
                      <input
                        required
                        value={nomeEstudante}
                        onChange={(e) =>
                          setNomeEstudante(e.target.value.replace(/[0-9]/g, ''))
                        }
                        className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Grau de Parentesco
                      </label>
                      <input
                        required
                        value={grauParentesco}
                        onChange={(e) =>
                          setGrauParentesco(
                            e.target.value.replace(/[0-9]/g, ''),
                          )
                        }
                        className="w-full border-2 rounded-lg h-11 text-sm px-4 outline-none focus:border-[#184d8a]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-[#184d8a] h-12 w-full rounded-lg text-white font-bold text-sm shadow-md hover:bg-[#113a69] transition-all mt-2 active:scale-[0.98]"
                >
                  Finalizar Cadastro
                </button>
              </div>
            )}
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Já faz parte?{' '}
              <Link
                to="/Login"
                className="text-[#184d8a] font-bold hover:underline"
              >
                Entrar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
