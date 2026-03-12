
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Services/api.ts";
export function TelaLogin() {
      const [emailDigitado, setEmail] = useState<string>("");
  const [senhaDigitado, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrar] = useState<boolean>(false);

  const navigate = useNavigate( ); // Hook para redirecionar sem recarregar a página

  // Mudando para async para poder usar o await na API
  const handleLogin = async (event: React.BaseSyntheticEvent) => {
  event.preventDefault();

  try {
      // Fazendo a requisição para o backend real
      const answer = await api.post('/login', {
        email: emailDigitado.trim().toLowerCase(),
        senha: senhaDigitado.trim()
      });

      //  O backend responde com os dados do utilizador e o token
      const { token, usuario } = answer.data;

      //  Guardamos as informações importantes
      localStorage.setItem("@Projeto:token", token);
      localStorage.setItem("UsuarioAtivo", JSON.stringify(usuario));

      

      // Lógica de Redirecionamento baseada no TIPO vindo do banco de dados
      if (usuario.perfil === "Estudante") {
        navigate("/DashboardEstud");
      } else if (usuario.perfil === "Encarregado") {
        navigate("/Encarregado");
      }

    } catch (erro: unknown) {
      const e = erro as any; 
      // Tratamento de erro (se a senha estiver errada ou o servidor desligado)
      if (e.response) {
        // O servidor respondeu com um erro (ex: 401 Unauthorized)
        alert(e.response?.data.mensagem || "E-mail ou senha incorretos.");
      } else {
        // Erro de rede (servidor desligado)
        alert("Não foi possível conectar ao servidor. Verifica se o backend está ligado!");
      }
    }
  };
  return (
    <div id="login" className="">
        <div className="">
          <div className="mx-auto items-center flex flex-col w-full justify-center space-y-6 roudend-md bg-white p-8 border border-gray-200 rounded-lg sm:w-[390px] text-black">
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