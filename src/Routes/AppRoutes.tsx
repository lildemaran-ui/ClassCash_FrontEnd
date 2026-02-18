import { Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "../Pages/Cadastros/Cadastro";
import Login from "../Pages/Login/Login";
import PaginaInicial from "../Pages/Index/Index";
import Pagamento from "../Pages/Pagamento/Pagamento";
import DashboardAdmin from "../Pages/Administrador/Administradores";
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
import Administradores from "../Pages/Administrador/Administradores";
import GestaoDeInstituicao from "@/Pages/Administrador/GestaoDeInstituicao";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/PaginaInicial" />}></Route>
      <Route
        path="/PaginaInicial"
        element={<PaginaInicial></PaginaInicial>}
      ></Route>
      <Route path="/Cadastro" element={<Cadastro></Cadastro>}></Route>
      <Route path="/Login" element={<Login></Login>}></Route>
      <Route path="/Pagamentos" element={<Pagamento></Pagamento>}></Route>
      <Route
        path="/DashboardAdmin"
        element={<DashboardAdmin></DashboardAdmin>}
      ></Route>

      <Route path="/AboutUs" element={<SobreNos></SobreNos>}></Route>
      <Route path="/Contacts" element={<Contactos></Contactos>}></Route>
      <Route
        path="/Instituições"
        element={<Instituicoes></Instituicoes>}
      ></Route>
      <Route path="/FAQ's" element={<FAQScreen></FAQScreen>}></Route>
      <Route path="/reclamacoes" element={<Reclamacoes></Reclamacoes>
      }></Route>
      <Route path="Config" element={<ConfigurationScreen></ConfigurationScreen>}></Route>
      <Route
        path="/DashboardEstud"
        element={<DashboardEstud></DashboardEstud>}
      ></Route>
      <Route path="/GestaoAlunos" element={<GestaoAlunos></GestaoAlunos>}></Route>
      <Route path="/Secretaria" element={<Secretaria></Secretaria>}></Route>
      <Route path="/GestaoPropinas" element={<GestaoPropinas></GestaoPropinas>}></Route>
      <Route path="/GestaoPagamentos" element={<GestaoPagamentos></GestaoPagamentos>}></Route>
      <Route path="/GestaodeEncarregados" element={<GestaodeEncarregados></GestaodeEncarregados>}></Route>
      <Route path="GestaodeServiços" element={<GestaodeServiços></GestaodeServiços>}></Route>
      <Route path="/GestaodeReclamacoes" element={<GestaodeReclamacoes></GestaodeReclamacoes>}></Route>
      <Route path="/ModulodeMulta" element={<ModulodeMulta></ModulodeMulta>}></Route>
      <Route path="/Relatorio" element={<Relatorio></Relatorio>}></Route>
      <Route path="/Configuracao" element={<Configuracao></Configuracao>}></Route>
      <Route path="/Encarregado" element={<Encarregado></Encarregado>}></Route>
      <Route path="/Administradores" element={<Administradores></Administradores>}></Route>
      <Route path="/GestaoDeInstituicao" element={<GestaoDeInstituicao></GestaoDeInstituicao>}></Route>
    </Routes>


  );
}
