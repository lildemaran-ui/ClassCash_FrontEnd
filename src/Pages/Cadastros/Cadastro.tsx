import { Link } from "react-router-dom";
import img from "../../assets/ImgCadstro.png";
import Logo55 from "../../assets/Logo5.5.png";
import FrasesRotativasLogin from "../../Hooks/FrasesRotativasLogin";
import { TelaCadastro } from ".";

export default function Cadastro() {
  return (
   <div className="flex min-h-screen">
  
  {/* Parte visual da esquerda - esconde em mobile */}
  <div
    className="hidden lg:flex bg-cover bg-center w-1/2 flex-col justify-between p-8"
    style={{ backgroundImage: `url(${img})` }}
  >
    <Link to="/PaginaInicial">
      <div className="flex items-center">
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

  {/* Parte do formulário - ocupa tudo em mobile, metade em desktop */}
  <div className="flex items-center justify-center bg-white w-full lg:w-1/2">
    <div className="m-auto w-full p-4 lg:p-8">
      <TelaCadastro />
    </div>
  </div>

</div>
  );
}
