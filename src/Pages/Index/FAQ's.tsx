import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Footer from "../../components/Footer/footer";
import MenuEstatico from "../../components/Menu/MenuEstatico";

// Componente para o Accordion de cada pergunta
const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left transition-colors hover:text-brandBlue"
      >
        <span className="font-bold text-gray-800/90 text-sm">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-brandBlue" size={22} />
        ) : (
          <ChevronDown className="text-gray-400" size={22} />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 text-sm text-gray-600 leading-relaxed animate-fadeIn">
          {answer ||
            "Informação detalhada sobre este tópico será exibida aqui conforme a necessidade da instituição."}
        </div>
      )}
    </div>
  );
};

export default function FAQScreen() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Navbar Superior Padrão */}
      <MenuEstatico></MenuEstatico>

      <main className="flex-1 max-w-4xl mx-auto w-full mt-32 py-16 px-6">
        {/* Seção 1: Geral */}
        <div className="text-center mb-12">
          <h1 className="font-bold text-gray-800 text-lg">Tem dúvidas?</h1>
          <p className="text-gray-500 text-sm">
            Consulte as questões mais frequentes
          </p>
          <div className="w-16 h-1 bg-gray-300 mx-auto mt-6"></div>
        </div>

        <div className="space-y-2 mb-16">
          <AccordionItem
            question="Como aderir aos serviços e pagamentos?"
            answer="Para aderir aos serviços e pagamentos por meio de cadastro e login, e posteriormente acesse o painel na opção de 'Pagamentos'. Em caso de dúvidas deve entrar em contacto com a nossa área técnica que terá todo o gosto em apoiá-lo."
          />
          <AccordionItem question="Para que serve a localização via Class Maps?" />
          <AccordionItem question="Que tipos de Instituições podem utilizar a ClassCash?" />
          <AccordionItem question="Que informações pessoais a ClassCash divulga?" />
        </div>

        {/* Botão de Contacto Intermediário */}
        <div className="text-center mb-20">
          <p className="text-gray-800 font-bold text-sm mb-4">
            Necessito de esclarecimentos adicionais?
          </p>
          <button className="bg-[#184d8a] text-white px-8 py-2 rounded-lg text-sm animate-bounce font-bold hover:bg-[#184d8a]/80 transition-all shadow-md">
            Entrar em contacto
          </button>
        </div>

        {/* Seção 2: Pagamentos Digitais */}
        <div className="text-center mb-12">
          <h1 className="font-bold text-gray-800 text-lg leading-tight">
            Tem dúvidas sobre os serviços de pagamentos digitais?
          </h1>
          <p className="text-gray-500 text-sm">
            Consulte as questões mais frequentes
          </p>
          <div className="w-16 h-1 bg-gray-300 mx-auto mt-6"></div>
        </div>

        <div className="space-y-2">
          <AccordionItem question="O que é a PayPay?" />
          <AccordionItem question="Como funciona o pagamento com o MyUnitelMoney?" />
          <AccordionItem question="Como pedir uma devolução de um pagamento realizado via Multicaixa Express?" />
          <AccordionItem question="Quais são as vantagens deste tipo de serviço para o estudante/encarregado de educação?" />
        </div>
      </main>

      {/* Rodapé Padrão */}
      <Footer></Footer>
    </div>
  );
}
