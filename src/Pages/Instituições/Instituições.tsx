import { useState } from "react";
import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";

export default function Instituicoes() {
  const [showInput, setShowInput] = useState(false);

  function Open() {
    setShowInput(true);
  }
  function Close() {
    setShowInput(false);
  }

  return (
    <div className="min-h-screen bg-[#f0f5fa] flex flex-col font-sans">
      {/* Navbar Superior */}
      <MenuEstatico></MenuEstatico>

      {/* Sub-header com Busca */}

      {/* Conteúdo Principal */}
      <main className="flex-1 px-12 py-16 flex flex-col items-center">
        <h1 className="max-w-4xl text-center font-bold text-gray-800 mb-12 mt-32">
          Confira a sua instituição para poderes usufruir da automatização e
          digitalização dos serviços da mesma aqui na nossa plataforma:
        </h1>

       
      </main>

      {/* Rodapé (Footer) */}
      <Footer></Footer>
    </div>
  );
}
