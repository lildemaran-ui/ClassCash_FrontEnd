import React, { useState } from "react";
import { X, Search } from "lucide-react";
import Footer from "../../Componentes/Footer/Footer";
import MenuEstatico from "../../Componentes/Menu/MenuEstatico";

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
        <h2 className="max-w-4xl text-center font-bold text-gray-800 mb-12 mt-32">
          Confira a sua instituição para poderes usufruir da automatização e
          digitalização dos serviços da mesma aqui na nossa plataforma:
        </h2>

        {/* Container da Tabela/Lista */}
        <div className="w-full max-w-5xl border bg-white text-base rounded-lg p-8 relative ">
          <div className=" px-12 py-4 flex items-center justify-end ">
        <div className="relative flex items-center justify-end">
          {showInput && (
            <input
              onBlur={Close}
              type="text"
              placeholder="Buscar instituições..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brandBlue/20"
            />
          )}
          <button
            onClick={showInput ? Close : Open}
            className={`absolute ${
              showInput ? "right-3" : "right-0"
            } p-2 text-gray-500 hover:text-brandBlue transition-all duration-500`}
          >
            {showInput ? (
              <X size={20} /> // Ícone de fechar (X) da biblioteca Lucide
            ) : (
              <Search size={20} /> // Ícone de lupa
            )}
          </button>
        </div>
      </div>
          {/* Cabeçalhos de Categoria */}
          <div className="flex justify-start mb-8 border-b ">
            <div className="bg-brandBlue text-[#268cff] px-8 py-2 rounded-t-lg font-semibold text-sm">
              Instituições
            </div>
            <div className=" text-[#268cff] px-8 py-2 rounded-t-lg font-semibold text-sm">
              Localização
            </div>
            <div className=" text-[#268cff] px-8 py-2 rounded-t-lg font-semibold text-sm">
              Perfil da Instituição
            </div>
          </div>
        </div>

       
      </main>

      {/* Rodapé (Footer) */}
      <Footer></Footer>
    </div>
  );
}
