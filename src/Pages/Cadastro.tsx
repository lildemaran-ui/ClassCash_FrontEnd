import Fundo1 from "../assets/fundo1.jpg";
import Logo55 from "../assets/Logo5.5.png";
import Logo5 from "../assets/Logo5.png";

import Eyeoff from "../assets/Eyeoff.png";

export default function Cadastro() {
  return (
    /*Tela de Cadastro*/

    <div className="flex h-screen">
      <div
        className=" bg-cover bg-center w-1/2  bg-[url(`$`)]"
        style={{ backgroundImage: `url(${Fundo1})` }}
      >
        <div className="flex items-center ">
        <img src={Logo55} className="h-24 bg-center bg-cover" alt="" />
        <p className="font-bold text-white text-xl">ClassCash</p>
      </div>
      </div>
      
      <div className="flex items-center bg-white  w-1/2">
        <div className="m-auto w-full lg:p-8">
          <div className="mx-auto items-center flex flex-col w-full justify-center space-y-6 roudend-md bg-white p-8 shadow-md sm:w-[390px] text-black">
            

            <div className="space-y-1">
            
              <p className="flex-1 text-center text"> Crie a sua Conta</p>
              <p className="text-xs text-gray-400">
                Insira os seus dados de utilizador abaixo para criar uma conta
              </p>
            </div>
            <form>
              <div className="flex space-x-16 ">
                <label className="flex text-sm mb-2">Nome Completo</label>
                <label className="flex text-sm mb-2">Nº de processo</label>
              </div>
              <div className="flex gap-3 ">
                <input
                  required
                  className="border-2 rounded-lg h-10 w-1/2 mb-5 text-xs px-4 focus:outline-none focus:border-[#1e88e5]"
                  placeholder="Digite aqui o seu nome"
                  type="text"
                />

                <input
                  className="border-2 rounded-lg h-10 w-1/2 mb-5 text-xs px-4 focus:outline-none focus:border-[#1e88e5]"
                  placeholder="0000 "
                  type="text"
                  required
                />
              </div>

              <label className="flex text-sm mb-2"> Instituição</label>
              <select
                className="  border-2 rounded-lg h-10 w-80 mb-5 text-xs px-4 pr-32 py-2 focus:outline-none focus:border-[#1e88e5]"
                required
              ></select>

              <div className="flex space-x-36 ">
                <label className="flex text-sm mb-2">Email</label>
                <label className="flex text-sm mb-2">Contacto</label>
              </div>
              <div className="flex gap-3">
                <input
                  className="border-2 rounded-lg h-10 w-1/2 mb-5 text-xs px-4 focus:outline-none focus:border-[#1e88e5]"
                  placeholder="exemploalguem@gmail.com"
                  type="email"
                  required
                />
                <input
                  className="border-2 rounded-lg h-10 w-1/2 mb-5 text-xs px-4 focus:outline-none focus:border-[#1e88e5]"
                  placeholder="Ex: 91-------"
                  required
                  type="tel"
                />
              </div>

              <label className="text-sm mb-2 "> Palavra-Passe </label>
              <div className="relative justify-between">
                <input
                  className=" border-2 rounded-lg h-10 w-80 mb-5 text-xs px-4  focus:outline-none focus:border-[#1e88e5] "
                  type="password"
                  placeholder="........"
                  required
                />
                <img
                  className="absolute right-3 top-3 pr-2  w-7 h-5"
                  src={Eyeoff}
                />
              </div>
              <button
                className="bg-[#1e88e5] h-10 w-80 rounded-lg text-white hover:bg-blue-600"
                type="submit"
              >
                Cadastrar
              </button>
            </form>

            <div className=" flex flex-wrap gap-1 justify-center  ">
              <p className="text-xs ">
                Já tem uma conta?
                <a className="text-[#1e88e5] hover:underline " href="#">
                  {" "}
                  Faça o Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
