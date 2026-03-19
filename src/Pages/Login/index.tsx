import axios from "axios";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Services/api.ts";
export function TelaLogin() {
  const [emailDigitado, setEmail] = useState<string>("");
  const [senhaDigitado, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrar] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    try {
      const answer = await api.post("/login", {
        email: emailDigitado.trim().toLowerCase(),
        senha: senhaDigitado.trim(),
      });
      const { token, usuario } = answer.data;
      localStorage.setItem("@Projeto:token", token);
      localStorage.setItem("UsuarioAtivo", JSON.stringify(usuario));
      if (usuario.perfil === "Estudante") {
        navigate("/DashboardEstud");
      } else if (usuario.perfil === "Encarregado") {
        navigate("/Encarregado");
      }
    } catch (erro: unknown) {
      if (axios.isAxiosError(erro) && erro.response) {
        toast.error("E-mail ou senha incorretos." 
        );
      } else {
        toast.error("Não foi possível conectar ao servidor." );
      }
    }
  };

  return (
<div>
      <div
      id="login"
      className="min-h-screen flex items-center justify-center px-4  "
    >
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 sm:p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="space-y-1 text-center">
          <p className="text-[#268cff] font-medium text-base sm:text-lg">
            Entre com a sua conta
          </p>
          <p className="text-xs text-gray-400">
            Insira os seus dados de utilizador abaixo para fazer login
          </p>
        </div>

        {/* Formulário */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Email</label>
            <input
              required
              value={emailDigitado}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 rounded-lg h-10 w-full text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-gray-300"
              placeholder="exemploalguem@gmail.com"
              type="email"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Palavra-Passe</label>
            <div className="relative">
              <input
                required
                minLength={6}
                value={senhaDigitado}
                onChange={(e) => setSenha(e.target.value)}
                className="border-2 rounded-lg h-10 w-full text-xs px-4 focus:outline-none focus:border-[#1e88e5] placeholder:text-gray-400"
                type={mostrarSenha ? "text" : "password"}
                placeholder="........"
              />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setMostrar(!mostrarSenha)}
              >
                {mostrarSenha ? (
                  <EyeIcon size={20} className="text-[#268cffb2]" />
                ) : (
                  <EyeOff size={20} className="text-[#268cffb2]" />
                )}
              </div>
            </div>
          </div>

          {/* Botão */}
          <button
            className="bg-[#1e88e5] mt-2 h-10 w-full rounded-lg text-white hover:bg-blue-500 transition-colors duration-300"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs">
            Não tem conta?{" "}
            <Link to="/Cadastro" className="text-[#1e88e5] hover:underline">
              Cadastre-se
            </Link>
          </p>
          <p className="text-xs">
            Esqueceu a senha?{" "}
            <a className="text-[#1e88e5] hover:underline" href="#">
              Alterar a senha
            </a>
          </p>
        </div>
      </div>
      
    </div>
    <div className="flex justify-end ">
  
  
</div>
</div>
  );
}
