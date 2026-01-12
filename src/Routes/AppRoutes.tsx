import { Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "../Pages/Cadastros/Cadastro";
import Login from "../Pages/Login/Login";
import PaginaInicial from "../Pages/Index/Index";
import Pagamento from "../Pages/Pagamento/Pagamento";
import DashboardAdmin from "../Pages/Administrador/DashboardAdmin";
import SobreNos from "../Pages/Index/AboutUs";
import Contactos from "../Pages/Index/Contacts";
import Instituicoes from "../Pages/Instituições/Instituições";
import FAQScreen from "../Pages/Index/FAQ's";
import DashboardEstud from "../Pages/Dashboard/DashboardEstud";
import type DadosDashEstd from "../Pages/Dashboard/DadosDashEstd";

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
        path="/DashboardAdmin" element={<DashboardAdmin></DashboardAdmin>}></Route>
       
      <Route path="/AboutUs" element={<SobreNos></SobreNos>}></Route>
      <Route path="/Contacts" element={<Contactos></Contactos>}></Route>
      <Route path="/Instituições" element={<Instituicoes></Instituicoes>}></Route>
      <Route path="/FAQ's" element={<FAQScreen></FAQScreen>}></Route>
      <Route path="/DashboardEstud" element={<DashboardEstud></DashboardEstud>}></Route>
    
      
    </Routes>
  );
}
