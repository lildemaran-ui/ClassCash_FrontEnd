import Logo55 from "../../assets/Logo5.5.png";
import img from "../../assets/ImgCadstro.png";
import { Link } from "react-router-dom";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

export default function Cadastro() {
  // 1. TODOS OS STATES DEVEM FICAR AQUI DENTRO
  const [mostrarSenha, setMostrar] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contacto, setContacto] = useState<string>("");
  const [instituicao, setInstituicao] = useState<string>("");
  const [proc, setProc] = useState<string>("");
  const [classe, setClasse] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [nomeEstudante, setNomeEstudante] = useState<string>("");
  const [relacao, setRelacao] = useState<string>("");

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
  const DadosCadastro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userExistente = JSON.parse(
      localStorage.getItem("UserExistente") || "[]",
    );

    // Validação de E-mail Único
    const emailJaEmUso = userExistente.some(
      (u: { email: string }) =>
        u.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (emailJaEmUso) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    // Validação de Processo Único na mesma Instituição
    const processoJaEmUso = userExistente.some(
      (u: any) => u.processo === proc.trim() && u.instituicao === instituicao,
    );
    if (processoJaEmUso && perfil === "Estudante") {
      alert("Este número de processo já existe nesta instituição.");
      return;
    }

    // Criar o objeto com TODOS os campos necessários
    const novoUsuario = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),
      processo: proc.trim(),
      instituicao,
      perfil,
      contacto: contacto,
      foto: image, // Salva a string base64 da foto
      classe: perfil === "Estudante" ? classe : "N/A",
      nomeEstudante: perfil === "Encarregado" ? nomeEstudante : null,
      relacao: perfil === "Encarregado" ? relacao : null,
    };

    userExistente.push(novoUsuario);
    localStorage.setItem("UserExistente", JSON.stringify(userExistente));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "/login";
  };

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

  return (
    <div className="flex min-h-screen  ">
      {/* ... (Parte visual da Esquerda igual) ... */}
      <div
        className="  bg-cover bg-center w-1/2 flex flex-col justify-between p-8 "
        style={{ backgroundImage: `url(${img})` }}
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
        <h1 className="text-start flex justify-start px-6 mt-[80%]">
          <FrasesRotativasLogin />
        </h1>
      </div>

      <div className="flex items-center bg-white w-1/2">
        <div className="m-auto w-full lg:p-8">
          <div className="mx-auto border border-gray-150 rounded-lg flex flex-col w-full justify-center space-y-6 bg-white p-8 shadow-sm sm:w-[390px]">
            <div className="space-y-1 text-center">
              <p className="text-[#268cff] font-bold">Crie a sua Conta</p>
              <p className="text-xs text-gray-400">
                Insira os seus dados abaixo
              </p>
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
                      <label className="block text-sm mb-1">
                        Nome Completo
                      </label>
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
                        value={instituicao}
                        onChange={(e) => setInstituicao(e.target.value)}
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 outline-none focus:border-[#268cff]"
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        <option value="Makarenko">Makarenko</option>
                        <option value="Elizângela">Elizângela</option>
                        <option value="Colina">Colina</option>
                        <option value="MM">MM</option>
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
                            setNomeEstudante(
                              e.target.value.replace(/[0-9]/g, ""),
                            )
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
    </div>
  );
}
