import { Link } from "react-router-dom";
import Fundo from "../../assets/Computer login-bro.svg";
import Logo55 from "../../assets/Logo5.png";
import TelaLogin from ".";

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Lado Esquerdo — escondido em mobile */}
      <div className="hidden lg:flex bg-blue-50 lg:w-1/2 flex-col border-r border-gray-200">
        <Link to="/PaginaInicial">
          <div className="flex items-center p-4">
            <img loading="lazy" src={Logo55} className="h-12 md:h-16" alt="Logo" />
            <p className="font-bold text-[#268cff] text-lg md:text-xl">ClassCash</p>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-center p-8">
          <img src={Fundo} alt="" className="w-[80%] object-contain" />
        </div>
      </div>

      {/* Lado Direito — Login */}
      <div id="login" className="flex flex-col items-center justify-center bg-white w-full lg:w-1/2 min-h-screen px-4 ">
        
       

        <div className="w-full max-w-md ">
          <TelaLogin/>
        </div>
      </div>

    </div>
  );
}