import { Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "../Pages/Cadastros/Cadastro";
import Login from "../Pages/Login/Login";
import PaginaInicial from "../Pages/Index/Index";
import Pagamento from "../Pages/Pagamento/Pagamento";
import SobreNos from "../Pages/Index/AboutUs";
import Contactos from "../Pages/Index/Contacts";
import Instituicoes from "../Pages/Instituições/Instituições";
import FAQScreen from "../Pages/Index/FAQ's";
import DashboardEstud from "../Pages/Estudante/Dashboard/DashboardEstud";
import Secretaria from "@/Pages/Secretaria/Secretaria";
import GestaoAlunos from "@/Pages/Secretaria/GestãodeAlunos/GestaoAlunos";
import GestaoPropinas from "@/Pages/Secretaria/GestãodePropinas/GestaoPropinas";
import GestaoPagamentos from "@/Pages/Secretaria/GestãodePagamentos/GestaoPagamentos";
import Reclamacoes from "@/Pages/Estudante/reclamacoes";
import ConfigurationScreen from "@/Pages/Estudante/Config";
import GestaodeEncarregados from "@/Pages/Secretaria/GestaodeEncarregados/GestaodeEncarregados";
import GestaodeServiços from "@/Pages/Secretaria/GestãodeServiços/GestaodeServiços";
import ModulodeMulta from "@/Pages/Secretaria/MódulodeMultas/ModulodeMulta";
import GestaodeReclamacoes from "@/Pages/Secretaria/GestãodeReclamações/GestaodeReclamacoes";
import Relatorio from "@/Pages/Secretaria/Relatorio/Relatorio";
import Configuracao from "@/Pages/Secretaria/Configuracao/Configuracao";
import Encarregado from "@/Pages/Encarregado/Encarregado";
import GestaoDeInstituicao from "@/Pages/Administrador/GestaoDeInstituicao";
import GestaoEstudantes from "@/Pages/Administrador/GestaoEstudantes";
import GestaoDeUsuarios from "@/Pages/Administrador/GestaoDeUsuarios";
import DashboardAdmin from "@/Pages/Administrador/DashboardAdmin";
import Administaradores from "@/Pages/Administrador/Administradores";
import GestaoLogs from "@/Pages/Administrador/GestaoLogs";
import GestaoPropinasAdmin from "@/Pages/Administrador/GestaoPropinasAdmin";
import Configuracoes from "@/Pages/Administrador/Configuracoes";




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
      <Route path="/Config" element={<ConfigurationScreen/>}></Route>
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
    </Routes>


  );
}
