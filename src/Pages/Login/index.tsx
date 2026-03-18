import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Services/api.ts";
import axios from "axios";
export function TelaLogin() {
  const [emailDigitado, setEmail] = useState<string>("");
  const [senhaDigitado, setSenha] = useState<string>("");
  const [mostrarSenha, setMostrar] = useState<boolean>(false);
  const [msg, setMsg] = useState<{texto: string, tipo: "sucesso" | "erro"} | null>(null);
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
        setMsg({
          texto: erro.response?.data.mensagem || "E-mail ou senha incorretos.",
          tipo: "erro",
        });
      } else {
        setMsg({
          texto: "Não foi possível conectar ao servidor.",
          tipo: "erro",
        });
      }
    }
  };

  return (
    <div
      id="login"
      className="min-h-screen flex items-center justify-center px-4 py-10 "
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
       {msg && (
      <div className={`${msg?.tipo === "sucesso" ? "bg-green-100 border border-green-400  text-green-700 px-4 py-3 rounded relative" : "bg-red-100 border border-red-400  text-red-700 px-4 py-3 rounded relative"} `} role="alert">
        <strong className="font-bold">{msg?.tipo === "sucesso" ? "Sucesso!" : "Erro!"} </strong>
        <span className="block sm:inline">{msg?.texto}</span>
      </div>
    )}
    </div>
  );
}
