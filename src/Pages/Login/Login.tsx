import { Link } from "react-router-dom";
import { TelaLogin } from ".";
import Fundo from "../../assets/Reset password-rafiki.svg";
import Logo55 from "../../assets/Logo5.5.png";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";

export default function Login() {

  return (
    /*Tela de login*/

    <div className="flex h-screen ">
      <div
        className=" bg-cover bg-center w-1/2 flex flex-col justify-between p-8  border-r border-gray-200"
        style={{ backgroundImage: `url(${Fundo})` }}
      >
        <Link to="/PaginaInicial">
          <div className="flex items-center ">
            <img
              loading="lazy"
              src={Logo55}
              className="h-24 bg-center bg-cover"
              alt="Logo"
            />
            <p className="font-bold text-white text-xl">ClassCash</p>
          </div>
        </Link>

        <h1 className="text-start flex justify-start    ">
          <FrasesRotativasLogin />
        </h1>
      </div>

      <div id="login" className="flex items-center bg-white  w-1/2">
        <div className="m-auto w-full lg:p-8">
          <TelaLogin />
        </div>
      </div>
    </div>
  );
}
