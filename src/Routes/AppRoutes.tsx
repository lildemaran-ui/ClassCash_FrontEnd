import Administaradores from '@/Pages/Administrador/Administradores'
import Configuracoes from '@/Pages/Administrador/Configuracoes'
import DashboardAdmin from '@/Pages/Administrador/DashboardAdmin'
import GestaoDeInstituicao from '@/Pages/Administrador/GestaoInstituicaoAdmin/GestaoDeInstituicao'
import GestaoLogs from '@/Pages/Administrador/GestaoLogs'
import GestaoDeRelatorios from '@/Pages/Administrador/GestaoDeRelatorio'
import PermissoesAcessos from '@/Pages/Administrador/PermissoesAcessos'
import SuporteAjuda from '@/Pages/Administrador/SuporteAjuda'

import ConfiguracaoEncar from '@/Pages/Encarregado/ConfiguracaoEncar'
import Encarregado from '@/Pages/Encarregado/Encarregado'
import PagamentoEncar from '@/Pages/Encarregado/PagamentoEncar'
import ReclamacoesEncar from '@/Pages/Encarregado/ReclamacoesEncar'

import Config from '@/Pages/Estudante/Config'
import Reclamacoes from '@/Pages/Estudante/reclamacoes'
import DashboardEstud from '../Pages/Estudante/Dashboard/DashboardEstud'

import Configuracao from '@/Pages/Secretaria/Configuracao/Configuracao'
import GestaodeEncarregados from '@/Pages/Secretaria/GestaodeEncarregados/GestaodeEncarregados'
import GestaoAlunos from '@/Pages/Secretaria/GestãodeAlunos/GestaoAlunos'
import GestaoPagamentos from '@/Pages/Secretaria/GestãodePagamentos/GestaoPagamentos'
import GestaoPropinas from '@/Pages/Secretaria/GestãodePropinas/GestaoPropinas'
import GestaodeReclamacoes from '@/Pages/Secretaria/GestãodeReclamações/GestaodeReclamacoes'
import GestaodeServiços from '@/Pages/Secretaria/GestãodeServiços/GestaodeServiços'
import ModulodeMulta from '@/Pages/Secretaria/MódulodeMultas/ModulodeMulta'
import Relatorio from '@/Pages/Secretaria/Relatorio/Relatorio'
import Secretaria from '@/Pages/Secretaria/Secretaria'
import SolicitacoesCadastro from '@/Pages/Secretaria/Solicitacoes/SolicitacoesCadastro'

import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Cadastro from '../Pages/Cadastros/Cadastro'
import SobreNos from '../Pages/Index/AboutUs'
import Contactos from '../Pages/Index/Contacts'
import FAQScreen from "../Pages/Index/FAQ's"
import PaginaInicial from '../Pages/Index/PaginaInicial/Index'
import ClassMaps from '../Pages/Index/ClassMaps'
import Instituicoes from '../Pages/Instituições/Instituições'
import Login from '../Pages/Login/Login'
import Pagamento from '../Pages/Pagamento/Pagamento'
import RecuperacaodeSenha from '@/components/Recuperacao_de_senha/recuperacaodesenha'
import SolicitarRecuperacao from '@/Pages/Login/solicitarRecuperacao'
import { useEffect, useState } from 'react'
import Spinner from '@/components/spinner'

export default function AppRoutes() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [location]) // dispara toda vez que mudar de página

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/PaginaInicial" />} />
        <Route path="/PaginaInicial" element={<PaginaInicial />} />
        <Route path="/ClassMaps" element={<ClassMaps />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Pagamentos" element={<Pagamento />} />
        <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/AboutUs" element={<SobreNos />} />
        <Route path="/Contacts" element={<Contactos />} />
        <Route path="/Instituições" element={<Instituicoes />} />
        <Route path="/FAQ's" element={<FAQScreen />} />
        <Route path="/reclamacoes" element={<Reclamacoes />} />
        <Route path="/Config" element={<Config />} />
        <Route path="/DashboardEstud" element={<DashboardEstud />} />
        <Route path="/GestaoAlunos" element={<GestaoAlunos />} />
        <Route path="/Secretaria" element={<Secretaria />} />
        <Route path="/GestaoPropinas" element={<GestaoPropinas />} />
        <Route path="/GestaoPagamentos" element={<GestaoPagamentos />} />
        <Route
          path="/GestaodeEncarregados"
          element={<GestaodeEncarregados />}
        />
        <Route path="/GestaodeServiços" element={<GestaodeServiços />} />
        <Route path="/GestaodeReclamacoes" element={<GestaodeReclamacoes />} />
        <Route path="/ModulodeMulta" element={<ModulodeMulta />} />
        <Route path="/Relatorio" element={<Relatorio />} />
        <Route path="/Configuracao" element={<Configuracao />} />
        <Route path="/Encarregado" element={<Encarregado />} />
        <Route path="/Administradores" element={<Administaradores />} />
        <Route path="/GestaoDeInstituicao" element={<GestaoDeInstituicao />} />
        <Route path="/GestaoLogs" element={<GestaoLogs />} />
        <Route path="/Configuracoes" element={<Configuracoes />} />
        <Route path="/ConfiguracaoEncar" element={<ConfiguracaoEncar />} />
        <Route path="/ReclamacoesEncar" element={<ReclamacoesEncar />} />
        <Route path="/PagamentoEncar" element={<PagamentoEncar />} />
        <Route path="/PermissoesAcessos" element={<PermissoesAcessos />} />
        <Route path="/SuporteAjuda" element={<SuporteAjuda />} />
        <Route path="/GestaoDeRelatorio" element={<GestaoDeRelatorios />} />
        <Route
          path="/SolicitacoesCadastro"
          element={<SolicitacoesCadastro />}
        />
        <Route
          path="/recuperacaodesenha"
          element={<RecuperacaodeSenha />}
        ></Route>
        <Route
          path="/solicitarRecuperacao"
          element={<SolicitarRecuperacao />}
        ></Route>
      </Routes>
    </>
  )
}
