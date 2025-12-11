import Fundo from "../../assets/fundoLogin.jpg";
import Eyeoff from "../../assets/Eyeoff.png";
import Logo55 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";
export default function Login() {
  return (
    /*Tela de login*/

    <div className="flex h-screen">
      <div
        className=" bg-cover bg-center w-1/2 border-r-gray-300 border"
        style={{ backgroundImage: `url(${Fundo})` }}
      >
        <div className="flex items-center ">
          <img src={Logo55} className="h-24 bg-center bg-cover" alt="" />
          <p className="font-bold text-white text-xl">ClassCash</p>
        </div>

        <h1 className="text-start flex justify-start px-6 mt-[80%]  ">
          <FrasesRotativasLogin />
        </h1>
      </div>

      <div id="login" className="flex items-center bg-white  w-1/2">
        <div className="m-auto w-full lg:p-8">
          <div className="mx-auto items-center flex flex-col w-full justify-center space-y-6 roudend-md bg-white p-8 shadow-md sm:w-[390px] text-black">
            <div className="space-y-1">
              <p className="flex-1 text-center text-[#1e88e5]">
                {" "}
                Entre com a sua conta
              </p>
              <p className="text-xs text-[#8fbdf1]">
                Insira os seus dados de utilizador abaixo para fazer login
              </p>
            </div>
            <form className="rounded-xl">
              <label className="flex text-sm mb-2 text-[#1e88e5]"> Email</label>
              <input
                required
                className="border-2 rounded-lg h-10 w-80 mb-9 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-[#8fbdf1]"
                placeholder="exemploalguem@gmail.com"
                type="email"
                id=""
              />
              <label className="text-sm mb-2 text-[#1e88e5]">
                {" "}
                Palavra-Passe{" "}
              </label>
              <div className="relative">
                <input
                  required
                  className="border-2 rounded-lg h-10 w-80 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-[#8fbdf1]"
                  type="password"
                  placeholder="........"
                  id=""
                />
                <img
                  src={Eyeoff}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                />
              </div>
              <button
                className="bg-[#1e88e5] mt-12 h-10 w-80 rounded-lg text-white hover:bg-blue-600"
                type="submit"
              >
                Login
              </button>
            </form>

            <div className=" flex flex-wrap gap-1 justify-center  ">
              <p className="text-xs text-[#1e88e5]">
                Não tem conta?
                <Link
                  to="/Cadastro"
                  className="text-[#8fbdf1] hover:underline "
                >
                  {" "}
                  Cadastre-se
                </Link>
              </p>
              <p className="text-xs text-[#1e88e5]">
                Esqueceu a senha?
                <a className="text-[#8fbdf1] hover:underline" href="#">
                  Alterar a senha
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
