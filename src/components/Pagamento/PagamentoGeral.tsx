'use client'

import { useState, useEffect } from 'react'
import img1 from '../../assets/Plain credit card-amico.svg'
import { ImagePlus, Wallet, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  idusuario: number
  nome: string
  email: string
  numTel?: string
  perfil?: string
  numProcesso?: string
  idInstituicao?: number
  instituicao?: string
  codigo_plataforma?: string
}

const PRECOS_SERVICOS: { [key: string]: number } = {
  Propina: 15000,
  Justificativo: 2000,
  Transferência: 5000,
  Certificado: 2000,
  CartãodeEstudante: 1000,
  Uniforme: 12000,
}

const mesesDoAno = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const servicoMap: { [key: string]: string } = {
  Propina: '2',
  Justificativo: '8',
  Transferência: '9',
  Certificado: '5',
  CartãodeEstudante: '6',
  Uniforme: '3',
}

export default function PagamentoGeral() {
  const [showModal, setShowModal] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // ESTADOS PARA PAGAMENTO DIGITAL AUTOMÁTICO
  const [isDigitalSuccess, setIsDigitalSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState('')

  const [pagamento, setPagamento] = useState({
    metodo: '',
    servico: 'Propina',
    mesInicial: 'Janeiro',
    mesFinal: 'Janeiro',
    plataforma: 'Multicaxa Express',
  })

  // 1. CAPTURAR RETORNO DA API MULTICAIXA NA URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const txn = params.get('txn')

    if (status === 'success' && txn) {
      setIsDigitalSuccess(true)
      setTransactionId(txn)
      setPagamento((prev) => ({ ...prev, metodo: 'De forma digital' }))
      toast.success('Pagamento confirmado via Multicaixa Express!')
    }
  }, [])

  // 2. CARREGAR USUÁRIO
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem('UsuarioAtivo')
    if (dadosDoLogin && dadosDoLogin !== 'undefined') {
      try {
        const parsed = JSON.parse(dadosDoLogin)
        setUser({
          idusuario: parsed.usuario?.idusuario ?? parsed.idusuario,
          nome: parsed.usuario?.nome ?? parsed.nome,
          email: parsed.usuario?.email ?? parsed.email,
          numTel: parsed.usuario?.numTel,
          perfil: parsed.perfil,
          numProcesso: parsed.numProcesso,
          idInstituicao: parsed.idInstituicao,
          instituicao: parsed.instituicao,
          codigo_plataforma: parsed.codigo_plataforma,
        })
      } catch {
        // window.location.href = '/Login'
      }
    } else {
      // window.location.href = '/Login'
    }
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setPagamento((prev) => ({ ...prev, [name]: value }))
    if (name === 'metodo' && value === 'Dinheiro Físico') {
      setShowModal(true)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // 3. SUBMISSÃO UNIFICADA (DIGITAL VS MANUAL)
  const handleSubmit = async () => {
    if (!user) return

    // FLUXO A: PAGAMENTO DIGITAL (Redireciona para API Externa)
    if (pagamento.metodo === 'De forma digital' && !isDigitalSuccess) {
      const ibanInstituicao = 'AO060000123456789101112' // Exemplo
      const urlMulticaixa = `http://localhost:3000/?iban=${ibanInstituicao}&valor=${valorTotal}&ref=${user.codigo_plataforma}`

      toast.info('Redirecionando para o Multicaixa Express...')
      setTimeout(() => {
        window.location.href = urlMulticaixa
      }, 1500)
      return
    }

    // FLUXO B: PAGAMENTO MANUAL OU FINALIZAÇÃO DO DIGITAL
    try {
      const formData = new FormData()
      formData.append('usuarioId', String(user.idusuario))
      formData.append('servicoId', servicoMap[pagamento.servico] ?? '2')
      formData.append('meses', String(quantidadeMeses))
      formData.append(
        'tipoPagamentoId',
        pagamento.metodo === 'De forma digital' ? '1' : '2',
      )

      if (isDigitalSuccess) {
        // Se for digital, o "comprovativo" é o ID da transação (texto)
        formData.append('comprovativo_digital_id', transactionId)
      } else if (imageFile) {
        formData.append('comprovativo', imageFile)
      } else {
        toast.error('Por favor, anexe o comprovativo.')
        return
      }

      const response = await fetch('http://localhost:5000/api/pagamento', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Pagamento registado com sucesso no sistema!')
        setIsDigitalSuccess(false)
        setImage(null)
        // Limpar URL para não repetir o sucesso ao dar F5
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        )
      }
    } catch {
      toast.error('Erro ao conectar ao servidor Node.js.')
    }
  }

  const precoBase = PRECOS_SERVICOS[pagamento.servico] || 0
  const indexInicio = mesesDoAno.indexOf(pagamento.mesInicial)
  const indexFim = mesesDoAno.indexOf(pagamento.mesFinal)
  const quantidadeMeses =
    indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1
  const valorTotal = precoBase * quantidadeMeses

  // Validação: No digital sucesso, o formulário já é válido por padrão
  const formularioValido =
    isDigitalSuccess ||
    (pagamento.metodo !== '' && imageFile !== null && indexFim >= indexInicio)

  if (!user) return <span>A carregar...</span>

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex bg-gray-50 w-full lg:w-1/2 font-sans">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* COLUNA ESQUERDA: Configurações */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block mb-1 font-bold text-gray-700">
                    Código do Aluno
                  </label>
                  <input
                    type="text"
                    value={user.codigo_plataforma ?? 'Aguardando aprovação'}
                    readOnly
                    className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>

                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <label className="block mb-3 font-bold text-gray-700">
                    Método de Pagamento
                  </label>
                  <div className="flex flex-col gap-3">
                    {['De forma digital', 'No banco', 'Dinheiro Físico'].map(
                      (m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="metodo"
                            value={m}
                            checked={pagamento.metodo === m}
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#184d8a]"
                          />
                          <span
                            className={`text-sm ${pagamento.metodo === m ? 'font-semibold text-[#184d8a]' : 'text-gray-600'}`}
                          >
                            {m}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {pagamento.metodo && pagamento.metodo !== 'Dinheiro Físico' && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <label className="font-bold text-gray-800">
                      Serviço e Período
                    </label>
                    <select
                      name="servico"
                      value={pagamento.servico}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                    >
                      {Object.keys(PRECOS_SERVICOS).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <select
                        name="mesInicial"
                        value={pagamento.mesInicial}
                        onChange={handleChange}
                        className="flex-1 border rounded-lg p-2 text-xs"
                      >
                        {mesesDoAno.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <span className="text-gray-400">à</span>
                      <select
                        name="mesFinal"
                        value={pagamento.mesFinal}
                        onChange={handleChange}
                        className="flex-1 border rounded-lg p-2 text-xs"
                      >
                        {mesesDoAno.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA: Resumo e Comprovativo */}
              <div className="flex flex-col gap-6">
                {pagamento.metodo && pagamento.metodo !== 'Dinheiro Físico' && (
                  <div className="flex flex-col gap-6 animate-in fade-in">
                    <div className="bg-[#184d8a] p-5 rounded-xl text-white shadow-inner">
                      <label className="block text-[10px] uppercase opacity-70 font-bold">
                        Total a Liquidar
                      </label>
                      <div className="text-2xl font-black">
                        KZ {valorTotal.toLocaleString('pt-PT')},00
                      </div>
                    </div>

                    <div>
                      <label className="font-medium block mb-2 text-gray-700">
                        Comprovativo
                      </label>

                      {isDigitalSuccess ? (
                        /* COMPROVATIVO DIGITAL AUTOMÁTICO */
                        <div className="border-2 border-orange-400 bg-orange-50 rounded-xl p-6 flex flex-col items-center text-center shadow-md animate-in zoom-in-95">
                          <CheckCircle className="text-orange-500 w-10 h-10 mb-2" />
                          <p className="text-[10px] font-bold text-orange-700 uppercase tracking-tighter">
                            Confirmado via Express
                          </p>
                          <p className="text-sm font-mono font-bold text-gray-800 mt-2">
                            {transactionId}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-4 italic">
                            O documento foi anexado automaticamente ao seu
                            processo.
                          </p>
                        </div>
                      ) : (
                        /* UPLOAD MANUAL */
                        <>
                          <label
                            htmlFor="fotoInput"
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#184d8a] cursor-pointer"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt="preview"
                                className="h-20 object-contain"
                              />
                            ) : (
                              <>
                                <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-[10px] text-gray-500">
                                  {pagamento.metodo === 'De forma digital'
                                    ? 'O comprovativo aparecerá aqui após o pagamento'
                                    : 'Clique para carregar o talão do banco'}
                                </p>
                              </>
                            )}
                          </label>
                          <input
                            id="fotoInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={pagamento.metodo === 'De forma digital'}
                          />
                        </>
                      )}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!formularioValido && !isDigitalSuccess}
                      className={`py-4 rounded-xl font-bold transition-all transform active:scale-95 ${
                        formularioValido || isDigitalSuccess
                          ? 'bg-[#184d8a] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {pagamento.metodo === 'De forma digital' &&
                      !isDigitalSuccess
                        ? 'Ir para Multicaixa Express'
                        : 'Confirmar Pagamento'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-50 p-8 border-l">
        <img
          src={img1}
          alt="Credit Card"
          className="w-full max-w-sm opacity-80"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <Wallet className="w-12 h-12 text-blue-900 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">
              Pagamento na Secretaria
            </h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Dirija-se à instituição com o valor em mãos para obter o seu
              recibo físico.
            </p>
            <button
              onClick={() => {
                setShowModal(false)
                setPagamento((p) => ({ ...p, metodo: '' }))
              }}
              className="w-full bg-[#184d8a] text-white py-3 rounded-lg font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
