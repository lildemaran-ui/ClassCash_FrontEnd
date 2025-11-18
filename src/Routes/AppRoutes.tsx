import { Routes, Route, Navigate } from "react-router-dom";
import Cadastro from "../Pages/Cadastro";
import Login from "../Pages/Login";
import PaginaInicial from "../Pages/Index";
import Pagamento from "../Pages/Pagamento";

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
    </Routes>
  );
}
