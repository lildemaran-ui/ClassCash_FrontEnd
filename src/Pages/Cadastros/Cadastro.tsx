import Logo55 from "../../assets/Logo5.5.png";
import img from "../../assets/ImgCadstro.png";
import Eyeoff from "../../assets/Eyeoff.png";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";
import { useState} from "react";

export default function Cadastro() {
const [image, setImage] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contacto, setContacto] = useState<string>("");
  const [instituicao, setInstituicao] = useState<string>("");
  const [proc, setProc] = useState<string>("");
  const [classe, setClasse] = useState<string>("");
  const [senha, setSenha] = useState<string>("");




  {
    /** Para salvar dados no localStorage */
  }
  const DadosCadastro = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dadosUsuario = {
      perfil: perfil,
      email: email,
      contacto: contacto,
      instituicao: instituicao,
      imagem: image,
      nome: nome,
      processo: proc,
      classe: classe,
    };

    localStorage.setItem('usuarioCadastrado', JSON.stringify(dadosUsuario))
    return(
      <div className="fixed flex justify-center items-center mx-auto border border-black w-32 h-32 bg-white "></div>
    )
  }
  {
    /** Fazendo a input de selecão de imagens */
  }
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Cria uma URL temporária para exibir a imagem no navegador
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const MudarPerfil = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valorSelecionado = event.target.value;
    setPerfil(valorSelecionado);

    if (valorSelecionado === "Estudante") {
      return null;
    } else if (valorSelecionado === "Encarregado") {
      return null;
    }
  };

  return (
    /*Tela de Cadastro*/

    <div className="flex h-screen">
      <div
        className=" bg-cover bg-center w-1/2  "
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="flex items-center ">
          <img src={Logo55} className="h-24 bg-center bg-cover" alt="" />
          <p className="font-bold text-white text-xl">ClassCash</p>
        </div>

        <h1 className="text-start flex justify-start px-6 mt-[80%]  ">
          <FrasesRotativasLogin />
        </h1>
      </div>

      {/*Formulário de Cadastro*/}
      <div className="flex items-center bg-white   w-1/2">
        <div className="m-auto w-full lg:p-8">
          <div className="mx-auto border border-gray-150 rounded-lg items-center flex flex-col w-full justify-center space-y-6 bg-white p-8 shadow-sm sm:w-[390px] text-black">
            <div className="space-y-1">
              <p className="flex-1 text-center text-[#268cff]">
                {" "}
                Crie a sua Conta
              </p>
              <p className="text-xs text-gray-400">
                Insira os seus dados de utilizador abaixo para criar uma conta
              </p>
            </div>
            <form className="flex flex-col gap-4 w-80" onSubmit={DadosCadastro}>
              {/* Perfil sempre visível */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">
                  Perfil de Usuário
                </label>
                <select
                  value={perfil}
                  onChange={MudarPerfil}
                  className="border-2 rounded-lg h-10 w-full text-xs px-4 focus:outline-none focus:border-[#1e88e5]"
                  required
                >
                  <option value="" disabled>
                    Selecione o seu perfil
                  </option>
                  <option value="Estudante">Estudante</option>
                  <option value="Encarregado">Encarregado</option>
                </select>
              </div>

              {perfil === "Estudante" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  {/* Linha 1: Nome e Processo */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">
                        Nome Completo
                      </label>
                      <input
                        required
                       
                        type="text"
                        placeholder="Nome"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm mb-1">Nº Proc.</label>
                      <input
                        required
                       
                        type="text"
                        placeholder="0000"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                  </div>

                  {/* Linha 2: Instituição e Classe */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Instituição</label>
                      <select
                        required
                        
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      >
                        <option value="">Makarenka</option>
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-sm mb-1">Classe</label>
                      <select
                        required
                       
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      >
                        <option value="">6ª</option>
                        <option value="">7ª</option>
                        <option value="">8ª</option>
                        <option value="">9ª</option>
                        <option value="">10ª</option>
                        <option value="">11ª</option>
                        <option value="">12ª</option>
                      </select>
                    </div>
                  </div>

                  {/* Linha 3: Email e Contato */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Email</label>
                      <input
                      
                        type="email"
                        placeholder="email@gmail.com"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Contacto</label>
                      <input
                      
                        required
                        type="tel"
                        placeholder="91-------"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                  </div>

                  {/* Palavra-Passe */}
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">Palavra-Passe</label>
                    <div className="relative">
                      <input
                     
                        required
                        type="password"
                        placeholder="........"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                      <img
                        src={Eyeoff}
                        className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer"
                        alt="ver senha"
                      />
                    </div>
                  </div>

                  {/* Foto de Perfil - O segredo do layout está aqui */}
                  <div className="flex items-center gap-4 py-2 border-t border-gray-100 mt-2">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                      {image ? (
                        <img
                          src={image}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">Foto</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-[10px] file:bg-blue-50 file:text-blue-700 file:text-sm file:border-none file:px-4 file:py-2 file:rounded-full file:cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1e88e5] h-10 w-full rounded-lg text-white font-medium hover:bg-blue-600 transition-colors mt-2"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
              {perfil === "Encarregado" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  {/* Linha 1: Nome e Processo */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">
                        Nome Completo
                      </label>
                      <input
                     
                        required
                        type="text"
                        placeholder="Nome"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                  </div>

                  {/* Linha 2: Instituição e Classe */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Instituição</label>
                      <select
                    
                        required
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      >
                        <option value="">Makarenko</option>
                      </select>
                    </div>
                  </div>

                  {/* Linha 3: Email e Contato */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Email</label>
                      <input
                    
                        type="email"
                        placeholder="email@gmail.com"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Contacto</label>
                      <input
                      
                        required
                        type="tel"
                        placeholder="91-------"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                    </div>
                  </div>

                  {/* Palavra-Passe */}
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">Palavra-Passe</label>
                    <div className="relative">
                      <input
                        
                        required
                        type="password"
                        placeholder="........"
                        className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                      />
                      <img
                        src={Eyeoff}
                        className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer"
                        alt="ver senha"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Relação com o Estudante
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Diga qual o seu grau parental"
                      className="w-full border-2 rounded-lg h-10 text-xs px-4 focus:border-[#1e88e5] outline-none"
                    />
                  </div>

                  {/* Foto de Perfil - O segredo do layout está aqui */}
                  <div className="flex items-center gap-4 py-2 border-t border-gray-100 mt-2">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                      {image ? (
                        <img
                          src={image}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">Foto</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-[10px] file:bg-blue-50 file:text-blue-700 file:text-sm file:border-none file:px-4 file:py-2 file:rounded-full file:cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1e88e5] h-10 w-full rounded-lg text-white font-medium hover:bg-blue-600 transition-colors mt-2"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
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
