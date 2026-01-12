import React from 'react';
import Footer from '../../Componentes/Footer/Footer';
import MenuEstatico from '../../Componentes/Menu/MenuEstatico';

const InputField = ({ label, type = "text", isTextArea = false }: { label: string, placeholder?: string, type?: string, isTextArea?: boolean }) => (
  <div className="mb-4">
    <label className="block text-blue-900 text-sm font-medium mb-1">*{label}</label>
    <div className="relative">
      {/* Detalhe azul escuro na lateral do input */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#268cff] rounded-l-lg"></div>
      {isTextArea ? (
        <textarea 
          rows={5}
          className="w-full pl-12 pr-4 py-3 bg-[#d9e8f5] rounded-lg border-none focus:ring-2 focus:ring-brandBlue outline-none resize-none"
        />
      ) : (
        <input 
          type={type}
          className="w-full pl-12 pr-4 py-3 bg-[#d9e8f5] rounded-lg border-none focus:ring-2 focus:ring-brandBlue outline-none"
        />
      )}
    </div>
  </div>
);

export default function Contactos() {
  return (
    <div className="min-h-screen bg-[#f0f5fa] font-sans flex flex-col">
      
      {/* Navbar Superior */}
      <MenuEstatico></MenuEstatico>      
      {/* Botão Voltar e Banner de Título */}
      <div className=" mt-40 mb-8">
        

        <div className=" overflow-hidden  shadow-sm max-w-7xl flex ml-auto">
          <div className="w-4 bg-[#00f2ff]"></div> {/* Detalhe Ciano */}
          <div className="flex-1 bg-gradient-to-r from-[#1a5fb4] to-[#268cff] py-12 text-center text-white">
            <h1 className="text-2xl font-semibold">Contactos</h1>
            <p className="text-xs opacity-90 uppercase tracking-widest mt-1">Fale conosco</p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal: Grid de 2 Colunas */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 p-12 items-start mt-16 mb-20">
        
        {/* Lado Esquerdo: Informações */}
        <div className="space-y-8 ">
          <div>
            <h2 className="text-[#268cff] font-bold text-xl mb-4 underline decoration-2 underline-offset-4">ClassCash</h2>
            <p className="text-blue-900 font-bold mb-4">Fale conosco!</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilize o nosso formulário de contacto para nos enviar uma mensagem, fazer uma reclamação ou partilhar um elogio.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[#268cff] font-bold text-sm">Email</h3>
              <p className="text-blue-900 text-sm font-medium">geral@classcash.co.ao</p>
            </div>
            <div>
              <h3 className="text-[#268cff] font-bold text-sm">Telefone</h3>
              <p className="text-blue-900 text-sm font-medium">(+244) 938840991</p>
            </div>
            <div>
              <h3 className="text-[#268cff] font-bold text-sm">Localização</h3>
              <p className="text-blue-900 text-sm font-medium">(+244) 938840991</p>
            </div>
          </div>

          {/* Decoração de Círculos ao fundo */}
          <div className="grid grid-cols-10 gap-2 opacity-50 bg-white p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full ${i === 5 || i === 6 || i === 7 || i === 12 || i === 13 || i === 14 || i === 18 || i === 19 || i === 0 || i === 1 ? 'bg-[#268cff]' : 'bg-gray-400'}`}></div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="relative  pl-8 border-l-2 border-black/10">
          <div className="flex justify-end mb-8">
            <div className="bg-[#268cff] text-white px-6 py-2 rounded-l-lg shadow-sm text-sm font-bold flex items-center gap-2">
              Enviar mensagem <div className="w-4 h-4 bg-[#1a5fb4]"></div>
            </div>
          </div>

          <form className="space-y-4 ">
            <InputField label="Seu nome"  />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Seu email" type="email" />
              <InputField label="Telefone/WhatsApp" />
            </div>

            <InputField label="Assunto" />
            <InputField label="Sua Mensagem" isTextArea />

            <button className="w-full bg-[#268cff] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors duration-500 active:scale-[0.98] shadow-lg">
              Enviar mensagem
            </button>
          </form>
        </div>
      </main>

      {/* Footer Padrão */}
     <Footer></Footer>
    </div>
  );
}