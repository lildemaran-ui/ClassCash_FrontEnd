import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";

const InputField = ({
  label,
  type = "text",
  isTextArea = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  isTextArea?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-blue-900 text-sm font-medium mb-1">
      *{label}
    </label>
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#184d8a] rounded-l-lg"></div>
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
      <MenuEstatico />

      {/* Banner */}
      <div className="mt-20 sm:mt-32 lg:mt-40 mb-6 sm:mb-8 px-4 sm:px-6 lg:px-0">
        <div className="overflow-hidden shadow-sm max-w-7xl flex ml-auto">
          <div className="w-4 bg-[#00f2ff] shrink-0"></div>
          <div className="flex-1 bg-gradient-to-r from-[#1a5fb4] to-[#184d8a] py-8 sm:py-12 text-center text-white">
            <h1 className="text-xl sm:text-2xl font-semibold">Contactos</h1>
            <p className="text-xs opacity-90 uppercase tracking-widest mt-1">
              Fale conosco
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 items-start mb-12 sm:mb-20">
        {/* Lado Esquerdo */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-[#184d8a] font-bold text-xl mb-4 underline decoration-2 underline-offset-4">
              ClassCash
            </h1>
            <p className="text-blue-900 font-bold mb-4">Fale conosco!</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilize o nosso formulário de contacto para nos enviar uma
              mensagem, fazer uma reclamação ou partilhar um elogio.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-[#184d8a] font-bold text-sm">Email</h3>
              <p className="text-blue-900 text-sm font-medium">
                geral@classcash.co.ao
              </p>
            </div>
            <div>
              <h3 className="text-[#184d8a] font-bold text-sm">Telefone</h3>
              <p className="text-blue-900 text-sm font-medium">
                (+244) 938840991
              </p>
            </div>
            <div>
              <h3 className="text-[#184d8a] font-bold text-sm">Localização</h3>
              <p className="text-blue-900 text-sm font-medium">
                (+244) 938840991
              </p>
            </div>
          </div>

          {/* Decoração círculos — oculta no mobile */}
          <div className="hidden sm:grid grid-cols-10 gap-2 opacity-50 bg-white p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  [0, 1, 5, 6, 7, 12, 13, 14, 18, 19].includes(i)
                    ? "bg-[#184d8a]"
                    : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="relative pl-0 sm:pl-8 border-l-0 sm:border-l-2 border-black/10">
          <div className="flex justify-end mb-6 sm:mb-8">
            <div className="bg-[#184d8a] text-white px-6 py-2 rounded-l-lg shadow-sm text-sm font-bold flex items-center gap-2">
              Enviar mensagem <div className="w-4 h-4 bg-[#1a5fb4]"></div>
            </div>
          </div>

          <form className="space-y-4">
            <InputField label="Seu nome" />

            {/* 2 colunas no sm+, 1 coluna no mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Seu email" type="email" />
              <InputField label="Telefone/WhatsApp" />
            </div>

            <InputField label="Assunto" />
            <InputField label="Sua Mensagem" isTextArea />

            <button className="w-full bg-[#184d8a] text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-[#184d8a]/80 transition-colors duration-500 active:scale-[0.98] shadow-lg">
              Enviar mensagem
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
