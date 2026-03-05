import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function TelaLogin() {
      const [emailDigitado, setEmail] = useState<string>("");
  const [senhaDigitado, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrar] = useState<boolean>(false);

  const handleLogin = (event: React.FormEvent) => {
  event.preventDefault();
interface Usuario {
  email: string;
  senha: string;
  nome: string;
  tipo: 'estudante' | 'encarregado'; // A chave para a lógica
}
  const rawData = localStorage.getItem("UserExistente");
  const users: Usuario[] = JSON.parse(rawData || "[]");

  const usuarioLogado = users.find(
    (u) =>
      u.email === emailDigitado.trim().toLowerCase() &&
      u.senha === senhaDigitado.trim(),
  );

  if (usuarioLogado) {
    // Salva o usuário ativo
    localStorage.setItem("UsuarioAtivo", JSON.stringify(usuarioLogado));

    // Lógica de Redirecionamento baseada no TIPO
    if (usuarioLogado.tipo === "estudante") {
      window.location.href = "/DashboardEstud";
    } else if (usuarioLogado.tipo === "encarregado") {
      window.location.href = "/Encarregado"; // Ou a rota que você desejar
    } 
    
  } else {
    alert("E-mail ou senha incorretos.");
  }
};
  return (
    <div id="login" className="">
        <div className="">
          <div className="mx-auto items-center flex flex-col w-full justify-center space-y-6 roudend-md bg-white p-8 border rounded-lg sm:w-[390px] text-black">
            <div className="space-y-1">
              <p className="flex-1 text-center text-[#268cff]">
                {" "}
                Entre com a sua conta
              </p>
              <p className="text-xs text-gray-400">
                Insira os seus dados de utilizador abaixo para fazer login
              </p>
            </div>
            <form className="rounded-xl " onSubmit={handleLogin}>
              <label className="flex text-sm mb-2 "> Email</label>
              <input
                required
                value={emailDigitado}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 rounded-lg h-10 w-80 mb-9 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-gray-300"
                placeholder="exemploalguem@gmail.com"
                type="email"
              />
              <label className="text-sm mb-2 "> Palavra-Passe </label>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  value={senhaDigitado}
                  onChange={(e) => setSenha(e.target.value)}
                  className="border-2 rounded-lg h-10 w-80 text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-gray-400"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="........"
                />
                <div
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                  onClick={() => setMostrar(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <EyeIcon size={22} className="text-[#268cffb2]" />
                  ) : (
                    <EyeOff size={22} className="text-[#268cffb2]" />
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
              <p className="text-xs ">
                Não tem conta?
                <Link
                  to="/Cadastro"
                  className="text-[#1e88e5] hover:underline "
                >
                  {" "}
                  Cadastre-se
                </Link>
              </p>
              <p className="text-xs ">
                Esqueceu a senha?
                <a className="text-[#1e88e5] hover:underline" href="#">
                  Alterar a senha
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}