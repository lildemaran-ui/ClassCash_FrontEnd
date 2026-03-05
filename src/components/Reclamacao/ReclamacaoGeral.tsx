import { Eye, EyeOff } from "lucide-react";

// Interface para os dados das reclamações
interface ReclamacaoProps {
  titulo: string;
  remetente: string;
  assunto: string;
  data: string;
  status: string;
  isPublica: boolean;
}

// Componente para cada card de reclamação
const ReclamacaoCard = ({
  titulo,
  remetente,
  assunto,
  data,
  status,
  isPublica,
}: ReclamacaoProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-2 relative border border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-gray-800 text-base">{titulo}</h3>
      <span className="text-[12px] text-gray-400">{data}</span>
    </div>
    <div className="space-y-1 ">
      <p className=" text-gray-500">
        <span className="font-medium">Remetente:</span> {remetente}
      </p>
      <p className=" text-gray-500">
        <span className="font-medium">Assunto:</span> {assunto}
      </p>
      <p className=" text-gray-500 mt-4">
        <span className="font-medium">Solicitação:</span> {status}
      </p>
    </div>
    <div className="absolute right-6 bottom-6 text-gray-400">
      {isPublica ? (
        <Eye size={22} className="text-[#268cffb2]" />
      ) : (
        <EyeOff size={22} className="text-[#268cffb2]" />
      )}
    </div>
  </div>
);

export default function ReclamacaoGeral() {
  const listaReclamacoes = [
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Deyse Valente Petra",
      assunto: "Problema com o IBAN",
      data: "07/09/2025",
      status: "Atendida",
      isPublica: true,
    },
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Anônimo",
      assunto: "Latência na chegada do e-mail",
      data: "08/10/2025",
      status: "Atendida",
      isPublica: false,
    },
    {
      titulo: "Pagamento feito por meio do Multicaixa Express",
      remetente: "Anônimo",
      assunto: "Dificuldade no cadastro do educando",
      data: "01/11/2025",
      status: "Atendida",
      isPublica: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans transition-all duration-500">
      <main className="flex-1 w-full h-full mx-auto">
        {/* Instruções */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-gray-400 font-medium text-[13px] leading-relaxed">
            As suas reclamações podem ser anónimas ou públicas. Basta deixar o
            ícone do olho na lateral direita aberto,
            <br />
            para reclamação pública, ou fechado, para reclamação anónima.
          </p>
        </div>

        {/* Lista de Reclamações */}
        <div className="max-w-5xl mx-auto mb-12">
          {listaReclamacoes.map((item, index) => (
            <ReclamacaoCard key={index} {...item} />
          ))}
        </div>

        {/* Formulário de Nova Reclamação */}
        <div className="max-w-5xl mx-auto flex gap-8 items-start">
          <div className="w-1/4">
            <p className="text-gray-800 font-bold text-base">
              Tem uma reclamação a fazer?
            </p>
            <p className="text-gray-800 text-sm">Escreve-a aqui:</p>
          </div>
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm relative border">
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">Remetente:</span>
                <input
                  type="text"
                  className="flex-1 outline-none text-sm text-gray-800"
                />
              </div>
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-500">Assunto:</span>
                <input
                  type="text"
                  className="flex-1 outline-none text-sm text-gray-800"
                />
              </div>
            </div>
            <button className="absolute bottom-6 right-6 bg-[#268cff] text-white px-8 py-2 rounded-full text-xs font-bold hover:bg-blue-500 transition-all duration-500 shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
