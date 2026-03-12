import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function TelaCadastro() {
  // 1. TODOS OS STATES DEVEM FICAR AQUI DENTRO
  const [mostrarSenha, setMostrar] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contacto, setContacto] = useState<string>("");
  const [idInstituicao, setInstituicao] = useState<number|string>("");
  const [proc, setProc] = useState<string>("");
  const [classe, setClasse] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [nomeEstudante, setNomeEstudante] = useState<string>("");
  const [relacao, setRelacao] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const MudarPerfil = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const novoPerfil = event.target.value;
    setPerfil(novoPerfil);
    {
      /*Limpando os campos ao mudar perfil*/
    }
    setNome("");
    setProc("");
    setClasse("");
    setEmail("");
    setContacto("");
    setSenha("");
    setNomeEstudante("");
    setRelacao("");
    setImage(null);
  };

  // 2. A FUNÇÃO DE CADASTRO TAMBÉM FICA AQUI DENTRO
  const DadosCadastro = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    // Criar o objeto com TODOS os campos necessários
    const novoUsuario = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),
      numProcesso: proc.trim(),
      idInstituicao: 3,
      perfil,
      numTel: contacto,
      foto: image, // Salva a string base64 da foto
      classe: perfil === "Estudante" ? classe : "N/A",
      nomeEstudante: perfil === "Encarregado" ? nomeEstudante : null,
      relacao: perfil === "Encarregado" ? relacao : null,
    };

    try {
      const resposta = await fetch(
        "http://localhost:5000/api/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoUsuario),
        },
      );

      const data = await resposta.json();
      if (!resposta.ok) {
        throw new Error(data.error || "Erro ao cadastrar usuário");
      } 
      
      if (data.token) {
        localStorage.setItem("Token", data.token); 
      }
      alert("Cadastro realizado com sucesso!");
        window.location.href="/Login"

    } catch (error) {
      console.error("Erro no Servidor", error);
      alert("Servidor indisponível. Tente novamente mais tarde.");
      
    }
  };

  return (
    <div>
      <div>
        <div className="mx-auto border border-gray-150 rounded-lg flex flex-col w-full justify-center space-y-6 bg-white p-8 shadow-sm sm:w-[390px]">
          <div className="space-y-1 text-center">
            <p className="text-[#268cff] font-bold">Crie a sua Conta</p>
            <p className="text-xs text-gray-400">Insira os seus dados abaixo</p>
          </div>

          <form className="flex flex-col gap-4 w-80" onSubmit={DadosCadastro}>
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">
                Perfil de Usuário
              </label>
              <select
                value={perfil}
                onChange={MudarPerfil}
                className="border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#1e88e5]"
                required
              >
                <option value="" disabled>
                  Selecione o seu perfil
                </option>
                <option value="Estudante">Estudante</option>
                <option value="Encarregado">Encarregado</option>
              </select>
            </div>

            {perfil && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {/* Nome e Processo */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Nome Completo</label>
                    <input
                      required
                      value={nome}
                      onChange={(e) =>
                        setNome(e.target.value.replace(/[0-9]/g, ""))
                      }
                      type="text"
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm mb-1">Nº Proc.</label>
                    <input
                      required
                      value={proc}
                      onChange={(e) =>
                        setProc(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={5}
                      type="text"
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    />
                  </div>
                </div>

                {/* Instituição e Classe - AQUI ESTAVA O ERRO DE VALUE VAZIO */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Instituição</label>
                    <select
                      required
                      value={idInstituicao}
                      onChange={(e) => setInstituicao(parseInt(e.target.value))}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    >
                        <option value="" disabled>
                          Selecione a instituição
                        </option>
                        <option value={1}>Instituição A</option>
                        <option value={2}>Instituição B</option>
                        <option value={3}>Instituição C
                        </option>
                     
                      
                    </select>
                  </div>
                  {perfil === "Estudante" && (
                    <div className="w-24">
                      <label className="block text-sm mb-1">Classe</label>
                      <select
                        required
                        value={classe}
                        onChange={(e) => setClasse(e.target.value)}
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                      >
                        <option value="" disabled>
                          Grau
                        </option>
                        <option value="7ª">7ª</option>
                        <option value="8ª">8ª</option>
                        <option value="9ª">9ª</option>
                        <option value="10ª">10ª</option>
                        <option value="11ª">11ª</option>
                        <option value="12ª">12ª</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* E-mail e Contacto */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Contacto</label>
                    <input
                      value={contacto}
                      onChange={(e) =>
                        setContacto(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={9}
                      type="tel"
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Palavra-Passe</label>
                  <div className="relative">
                    <input
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      type={mostrarSenha ? "text" : "password"}
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setMostrar(!mostrarSenha)}
                    >
                      {mostrarSenha ? (
                        <EyeIcon size={22} className="text-[#268cffb2]" />
                      ) : (
                        <EyeOff size={22} className="text-[#268cffb2]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Campos do Encarregado */}
                {perfil === "Encarregado" && (
                  <>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Nome do Educando</label>
                      <input
                        required
                        value={nomeEstudante}
                        onChange={(e) =>
                          setNomeEstudante(e.target.value.replace(/[0-9]/g, ""))
                        }
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">Relação Parental</label>
                      <input
                        required
                        value={relacao}
                        onChange={(e) =>
                          setRelacao(e.target.value.replace(/[0-9]/g, ""))
                        }
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                      />
                    </div>
                  </>
                )}

                {/* Upload de Foto */}
                <div className="flex items-center gap-4 py-2 border-t mt-2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50">
                    {image ? (
                      <img
                        loading="lazy"
                        src={image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px]">Foto</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-[10px] file:bg-blue-50 file:px-3 file:py-2 file:border-none file:rounded-xl file:text-blue-700 file:font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1e88e5] h-10 w-full rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </form>

          <div className="text-center">
            <p className="text-xs">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#1e88e5] hover:underline">
                Faça o Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
