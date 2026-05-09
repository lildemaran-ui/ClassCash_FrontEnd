// src/Pages/Secretaria/Secretaria.tsx
import Avatar from '@/components/Avatar/Avatar'
import { MonthlyBarChart } from '@/components/Charts/MonthlyBarChart'
import { Header } from '@/components/Header/header'
import MenuSecretaria from '@/components/Menu/MenuSecretaria'
import { BannerAviso } from '@/components/Sancoes/BannerAviso'
import { ModalRestricao } from '@/components/Sancoes/ModalRestricao'
import { BloqueioTotal } from '@/components/Sancoes/BloqueioTotal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchComAuth } from '@/types/global/fetchComAuth'
import {
  exigirSessao,
  getToken,
  type SessaoUsuario,
} from '@/types/global/sessao'

import { Download, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const API = 'http://localhost:5000/api'

// ─── Tipos ─────────────────────────────────────────────────────────────────
interface PainelData {
  statusFinanceiro?: string // Campo para controlar a sanção
  estudantesRecentes: {
    nome_estudante: string
    num_processo: string
    classe: number | null
    status: string
  }[]
  contagemUltimoMes: {
    total_estudantes_mes: number
    total_encarregados_mes: number
  }
  statusEstudantes: { status: string; total: number }[]
  listaAlunos: {
    nome_estudante: string
    num_processo: string
    classe: number | null
  }[]
  faturamentoMensal: { mes: string; valor: number }[]
  faturamentoAnual: { ano: string; valor: number }[]
  metodosMaisUsados: { metodo: string; total: number }[]
}

const CardKpi = ({
  title,
  value,
  subtext,
  trend,
}: {
  title: string
  value: string
  subtext: string
  trend?: 'up' | 'down'
}) => (
  <div className="bg-white p-4 rounded-xl flex flex-col items-center text-center border">
    <p className="text-gray-400 text-xs sm:text-sm mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-lg sm:text-xl font-bold text-gray-800">
        {value}
      </span>
      {trend === 'up' && <TrendingUp className="text-green-500" size={18} />}
      {trend === 'down' && <TrendingDown className="text-red-500" size={18} />}
    </div>
    <p className="text-xs text-gray-400 mt-1">{subtext}</p>
  </div>
)

// ─── Página ────────────────────────────────────────────────────────────────
export default function Secretaria() {
  const [user, setUser] = useState<SessaoUsuario | null>(null)
  const [painel, setPainel] = useState<PainelData | null>(null)
  const [loading, setLoading] = useState(true)

  // Lógica de Datas para Sanções
  const hoje = 17 // Simula dia 5
  const emAtraso = true

  useEffect(() => {
    const sessao = exigirSessao()
    if (!sessao) return
    setUser(sessao.usuario)

    const carregar = async () => {
      setLoading(true)
      const token = getToken()

      try {
        const res = await fetchComAuth(`${API}/painelSecretaria`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Erro ao carregar painel')
        const data: PainelData = await res.json()
        setPainel(data)
      } catch {
        toast.error('Erro ao carregar dados do painel')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  if (!user) return null

  // Verificação de Bloqueio Total (Dia 21 em diante)
  if (emAtraso && hoje > 20) {
    return <BloqueioTotal />
  }

  const totalEstudantes =
    painel?.statusEstudantes?.reduce((s, r) => s + Number(r.total), 0) ?? 0
  const ativos =
    painel?.statusEstudantes?.find((s) => s.status === 'Aceite')?.total ?? 0
  const inativos = totalEstudantes - ativos
  const totalEncarregados =
    painel?.contagemUltimoMes?.total_encarregados_mes ?? 0

  const faturamentoMensal = painel?.faturamentoMensal ?? []
  const ultimoFaturamento = faturamentoMensal.at(-1)
  const faturamentoAnualTotal = painel?.faturamentoAnual?.[0]?.valor ?? 0

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      <MenuSecretaria />
      <main className="flex-1 overflow-y-auto min-w-0 top-0">
        {/* ETAPA 1: Banner Amarelo (Dia 2 ao 15) */}
        {emAtraso && hoje >= 2 && hoje <= 15 && <BannerAviso />}

        {/* ETAPA 2: Modal Laranja (Dia 16 ao 20) */}
        {emAtraso && hoje > 15 && hoje <= 20 && <ModalRestricao />}

        <Header
          titulo="Painel Geral"
          usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Filtros + PDF */}
          <section className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <div className="flex flex-wrap gap-3">
                {['Ano', 'Semestre', 'Mês'].map((filtro) => (
                  <div key={filtro} className="w-40">
                    <label className="block text-xs text-gray-500 mb-1">
                      {filtro}
                    </label>
                    <Select>
                      <SelectTrigger className="w-full border-2 rounded-lg h-10 text-xs px-3">
                        <SelectValue placeholder="Sem filtro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem-filtro">Sem filtro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/80 transition-all duration-500 w-full sm:w-auto">
                Gerar PDF <Download size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <CardKpi
                title="Total de estudantes"
                value={loading ? '...' : String(totalEstudantes)}
                subtext="no último mês"
                trend="up"
              />
              <CardKpi
                title="Total de Encarregados"
                value={loading ? '...' : String(totalEncarregados)}
                subtext="no último mês"
                trend="up"
              />
              <CardKpi
                title="Estudantes ativos"
                value={loading ? '...' : String(ativos)}
                subtext="no último mês"
              />
              <CardKpi
                title="Estudantes Inativos"
                value={loading ? '...' : String(inativos)}
                subtext="no último mês"
                trend="down"
              />
            </div>
          </section>

          {/* Métodos mais usados */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-gray-700 font-bold mb-4 text-sm sm:text-base">
              Serviços mais utilizados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {loading
                ? ['—', '—', '—'].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 sm:p-6 rounded-xl border text-center animate-pulse h-20"
                    />
                  ))
                : (painel?.metodosMaisUsados?.length
                    ? painel.metodosMaisUsados.slice(0, 3)
                    : [
                        { metodo: 'Multicaixa Express', total: 0 },
                        { metodo: 'Unitel Money', total: 0 },
                        { metodo: 'PayPay', total: 0 },
                      ]
                  ).map((s) => (
                    <div
                      key={s.metodo}
                      className="bg-white p-4 sm:p-6 rounded-xl border text-center"
                    >
                      <p className="font-bold text-gray-700 mb-3 text-sm sm:text-base">
                        {s.metodo}
                      </p>
                      <div className="h-2 w-4 bg-primary rounded-full mb-2 mx-auto" />
                      <p className="text-xs sm:text-sm text-gray-400">
                        {s.total} transações
                      </p>
                    </div>
                  ))}
            </div>
          </section>

          {/* Lista de alunos */}
          <section className="mb-6 sm:mb-8">
            <h3 className="text-gray-700 font-bold mb-4 text-sm sm:text-base">
              Alunos Cadastrados
            </h3>
            <div className="flex flex-col gap-1 border font-medium rounded overflow-hidden">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 sm:p-4 bg-gray-100 animate-pulse h-14"
                    />
                  ))
                : (painel?.listaAlunos?.slice(0, 3) ?? []).map((aluno, i) => (
                    <div
                      key={i}
                      className={`p-3 sm:p-4 ${i % 2 === 0 ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                    >
                      <p className="font-bold text-xs sm:text-sm">
                        {aluno.nome_estudante}
                      </p>
                      <p className="text-xs sm:text-sm opacity-80">
                        {aluno.classe ? `Classe: ${aluno.classe}ª | ` : ''}Nº de
                        processo: {aluno.num_processo}
                      </p>
                    </div>
                  ))}
            </div>
            <Link to="/GestaoAlunos">
              <button className="mt-4 bg-primary text-white px-6 py-2 rounded text-sm hover:px-7 transition-all duration-500 font-bold shadow-md">
                Ver mais
              </button>
            </Link>
          </section>

          {/* Faturamento */}
          <section className="bg-white p-4 sm:p-6 rounded-xl border mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 border-b pb-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Faturamento mensal
                </p>
                <p className="text-[#184d8a] font-bold text-sm sm:text-base">
                  {ultimoFaturamento
                    ? Number(ultimoFaturamento.valor).toLocaleString('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                      })
                    : '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500">Mês</p>
                <p className="text-blue-900 font-bold text-sm sm:text-base">
                  {ultimoFaturamento?.mes ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Faturamento anual
                </p>
                <p className="text-[#184d8a] font-bold text-sm sm:text-base">
                  {faturamentoAnualTotal
                    ? Number(faturamentoAnualTotal).toLocaleString('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                      })
                    : '—'}
                </p>
              </div>
            </div>
            <div style={{ width: '100%', height: 288 }}>
              <MonthlyBarChart dados={faturamentoMensal} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
