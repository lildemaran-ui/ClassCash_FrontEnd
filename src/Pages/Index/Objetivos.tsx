import { CreditCard, Check, Eye, Lock } from "lucide-react";

export default function Objetivo() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-10 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {[
          {
            icon: <CreditCard size={48} className="text-[#184d8a]" />,
            title: "Pagamentos Digitais",
            desc: "Multicaixa Express, PayPay, PayPal",
          },
          {
            icon: <Check size={48} className="text-[#184d8a]" />,
            title: "Facilidade",
            desc: "Pague propinas e serviços escolares em segundos, sem tarifas nem burocracia.",
          },
          {
            icon: <Eye size={48} className="text-[#184d8a]" />,
            title: "Transparência",
            desc: "Acompanhe as suas transferências, gere relatórios em PDF.",
          },
          {
            icon: <Lock size={48} className="text-[#184d8a]" />,
            title: "Segurança",
            desc: "Todos os dados serão protegidos e as transações, validadas pela instituição.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="group bg-white p-8 rounded-xl shadow-md border border-gray-100
              w-full max-w-[260px] sm:max-w-none
              flex flex-col items-center justify-center text-center
              transition-transform duration-300 hover:scale-105"
          >
            <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <h3 className="font-bold mb-3 text-sm sm:text-base">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
