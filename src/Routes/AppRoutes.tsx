import Administaradores from "@/Pages/Administrador/Administradores";
import Configuracoes from "@/Pages/Administrador/Configuracoes";
import DashboardAdmin from "@/Pages/Administrador/DashboardAdmin";
import GestaoDeUsuarios from "@/Pages/Administrador/GestaoDeUsuarios";
import GestaoEstudantes from "@/Pages/Administrador/GestaoEstudantes";
import GestaoDeInstituicao from "@/Pages/Administrador/GestaoInstituicaoAdmin/GestaoDeInstituicao";
import GestaoLogs from "@/Pages/Administrador/GestaoLogs";
import GestaoPropinasAdmin from "@/Pages/Administrador/GestaoPropinasAdmin";
import ConfiguracaoEncar from "@/Pages/Encarregado/ConfiguracaoEncar";
import Encarregado from "@/Pages/Encarregado/Encarregado";
import PagamentoEncar from "@/Pages/Encarregado/PagamentoEncar";
import ReclamacoesEncar from "@/Pages/Encarregado/ReclamacoesEncar";
import Config from "@/Pages/Estudante/Config";
import Reclamacoes from "@/Pages/Estudante/reclamacoes";
import Configuracao from "@/Pages/Secretaria/Configuracao/Configuracao";
import GestaodeEncarregados from "@/Pages/Secretaria/GestaodeEncarregados/GestaodeEncarregados";
import GestaoAlunos from "@/Pages/Secretaria/GestãodeAlunos/GestaoAlunos";
import GestaoPagamentos from "@/Pages/Secretaria/GestãodePagamentos/GestaoPagamentos";
import GestaoPropinas from "@/Pages/Secretaria/GestãodePropinas/GestaoPropinas";
import GestaodeReclamacoes from "@/Pages/Secretaria/GestãodeReclamações/GestaodeReclamacoes";
import GestaodeServiços from "@/Pages/Secretaria/GestãodeServiços/GestaodeServiços";
import ModulodeMulta from "@/Pages/Secretaria/MódulodeMultas/ModulodeMulta";
import Relatorio from "@/Pages/Secretaria/Relatorio/Relatorio";
import Secretaria from "@/Pages/Secretaria/Secretaria";
import { Navigate, Route, Routes } from "react-router-dom";
import Cadastro from "../Pages/Cadastros/Cadastro";
import DashboardEstud from "../Pages/Estudante/Dashboard/DashboardEstud";
import SobreNos from "../Pages/Index/AboutUs";
import Contactos from "../Pages/Index/Contacts";
import FAQScreen from "../Pages/Index/FAQ's";
import PaginaInicial from "../Pages/Index/Index";
import Instituicoes from "../Pages/Instituições/Instituições";
import Login from "../Pages/Login/Login";
import Pagamento from "../Pages/Pagamento/Pagamento";
import GestaoDeRelatorios from "@/Pages/Administrador/GestaoDeRelatorio";
import PermissoesAcessos from "@/Pages/Administrador/PermissoesAcessos";
import SuporteAjuda from "@/Pages/Administrador/SuporteAjuda";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/PaginaInicial" />}></Route>
      <Route path="/PaginaInicial" element={<PaginaInicial/>}></Route>
      <Route path="/Cadastro" element={<Cadastro/>}></Route>
      <Route path="/Login" element={<Login/>}></Route>
      <Route path="/Pagamentos" element={<Pagamento/>}></Route>
      <Route path="/DashboardAdmin" element={<DashboardAdmin/>}></Route>  
      <Route path="/AboutUs" element={<SobreNos/>}></Route>
      <Route path="/Contacts" element={<Contactos/>}></Route>
      <Route path="/Instituições" element={<Instituicoes/>}></Route>
      <Route path="/FAQ's" element={<FAQScreen/>}></Route>
      <Route path="/reclamacoes" element={<Reclamacoes/>}></Route>
      <Route path="/Config" element={<Config/>}></Route>
      <Route path="/DashboardEstud" element={<DashboardEstud/>}></Route>
      <Route path="/GestaoAlunos" element={<GestaoAlunos/>}></Route>
      <Route path="/Secretaria" element={<Secretaria/>}></Route>
      <Route path="/GestaoPropinas" element={<GestaoPropinas/>}></Route>
      <Route path="/GestaoPagamentos" element={<GestaoPagamentos/>}></Route>
      <Route path="/GestaodeEncarregados" element={<GestaodeEncarregados/>}></Route>
      <Route path="/GestaodeServiços" element={<GestaodeServiços/>}></Route>
      <Route path="/GestaodeReclamacoes" element={<GestaodeReclamacoes/>}></Route>
      <Route path="/ModulodeMulta" element={<ModulodeMulta/>}></Route>
      <Route path="/Relatorio" element={<Relatorio/>}></Route>
      <Route path="/Configuracao" element={<Configuracao/>}></Route>
      <Route path="/Encarregado" element={<Encarregado/>}></Route>
      <Route path="/Administradores" element={<Administaradores/>}></Route>
      <Route path="/GestaoDeInstituicao" element={<GestaoDeInstituicao/>}></Route>
      <Route path="/GestaoEstudantes" element={<GestaoEstudantes/>}></Route>
      <Route path="/GestaoDeUsuarios" element={<GestaoDeUsuarios/>}></Route>
      <Route path="/GestaoLogs" element={<GestaoLogs/>}></Route>
      <Route path="/GestaoPropinasAdmin" element={<GestaoPropinasAdmin/>}></Route>
      <Route path="/Configuracoes" element={<Configuracoes/>}></Route>
      <Route path="/ConfiguracaoEncar" element={<ConfiguracaoEncar/>}></Route>
      <Route path="/ReclamacoesEncar" element={<ReclamacoesEncar/>}></Route>
      <Route path="/PagamentoEncar" element={<PagamentoEncar/>}></Route>
      <Route path="/PermissoesAcessos" element={<PermissoesAcessos/>}></Route>
      <Route path="/SuporteAjuda" element={<SuporteAjuda/>}></Route>
      <Route path="/GestaoDeRelatorio" element={<GestaoDeRelatorios/>}></Route>
    </Routes>


  );
}
