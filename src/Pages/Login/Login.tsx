import Fundo from "../../assets/fundoLogin.jpg";
import Logo55 from "../../assets/Logo5.5.png";
import { Link } from "react-router-dom";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

export default function Login() {
  const [emailDigitado, setEmail] = useState<string>("");
  const [senhaDigitado, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrar] = useState<boolean>(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    const rawData = localStorage.getItem("UserExistente");
    const users = JSON.parse(rawData || "[]");

    // O find vai buscar exatamente o usuário que possui aquele e-mail E aquela senha
    const usuarioLogado = users.find(
      (u: any) =>
        u.email === emailDigitado.trim().toLowerCase() &&
        u.senha === senhaDigitado.trim()
    );

    if (usuarioLogado) {
      // Salva quem está logado no momento para usar nas outras telas
      localStorage.setItem("UsuarioAtivo", JSON.stringify(usuarioLogado));
      window.location.href = "/DashboardEstud";
    } else {
      alert("E-mail ou senha incorretos.");
    }
  };
  return (
    /*Tela de login*/

    <div className="flex h-screen ">
      <div
        className=" bg-cover bg-center w-1/2   "
        style={{ backgroundImage: `url(${Fundo})` }}
      >
        <Link to="/PaginaInicial">
          <div className="flex items-center ">
            <img src={Logo55} className="h-24 bg-center bg-cover" alt="Logo" />
            <p className="font-bold text-white text-xl">ClassCash</p>
          </div>
        </Link>

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
            <form className="rounded-xl" onSubmit={handleLogin}>
              <label className="flex text-sm mb-2 text-[#1e88e5]"> Email</label>
              <input
                required
                value={emailDigitado}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 rounded-lg h-10 w-80 mb-9 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-[#8fbdf1]"
                placeholder="exemploalguem@gmail.com"
                type="email"
              />
              <label className="text-sm mb-2 text-[#1e88e5]">
                {" "}
                Palavra-Passe{" "}
              </label>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  value={senhaDigitado}
                  onChange={(e) => setSenha(e.target.value)}
                  className="border-2 rounded-lg h-10 w-80 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-[#8fbdf1]"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="........"
                />
                <div
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                  onClick={() => setMostrar(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <EyeIcon size={24} className="text-[#268cffb2]" />
                  ) : (
                    <EyeOff size={24} className="text-[#268cffb2]" />
                  )}
                </div>
              </div>

              <button
                className="bg-[#1e88e5] mt-12 h-10 w-80 rounded-lg text-white hover:bg-blue-500"
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
