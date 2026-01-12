import { CreditCard, Check, Eye, Lock } from "lucide-react";

export default function Objetivo() {
  return (
    <div className="overflow-x-auto sm:ovverflow-none">
      <div className="flex   justify-center items-center space-y-8  mt-10  flex-col animate-fade-in  ">
        <div className=" flex flex-col sm:flex-row  gap-4 ">
          <div className="group p-8 rounded-xl shadow-md w-64 items-center justify-center flex-col flex mb-20 transition-transform duration-300 hover:scale-105 border border-gray-100">
            <h3 className=" flex items-center flex-col  font-bold pb-5 justify-center">
              <CreditCard
                size={48}
                className="inline-block mb-4 h-10  text-[#268CFF] transition-transform duration-300 "
              ></CreditCard>
              Pagamentos Digitais
            </h3>
            <p className="text-sm text-gray-500  ">
              Multicaixa Express, PayPay, PayPal
            </p>
          </div>
          <div className="group bg-white  p-8 rounded-xl shadow-md w-64 items-center justify-center flex-col flex mb-20 transition-transform duration-300 hover:scale-105 border border-gray-100">
            <h3 className=" flex items-center flex-col  font-bold pb-5 justify-center">
              <Check
                size={48}
                className="inline-block mb-4 h-10 text-[#268CFF] transition-transform duration-300 "
              ></Check>
              Facilidade
            </h3>
            <p className="text-sm text-gray-500  ">
              Pague propinas e serviços escolares em segundos, sem tarifas nem
              burocracia.
            </p>
          </div>
          <div className="group bg-white  p-8 rounded-xl shadow-md w-64 items-center justify-center flex-col flex mb-20 transition-transform duration-300 hover:scale-105 border border-gray-100">
            <h3 className=" flex items-center flex-col font-bold pb-5 justify-center">
              <Eye
                size={45}
                className="inline-block mb-4 h-10 text-[#268CFF] transition-transform duration-300  "
              ></Eye>
              Transparência
            </h3>
            <p className="text-sm text-gray-500   ">
              Acompanhe as suas transferências, gere rela- tórios em PDF.
            </p>
          </div>
          <div className="group bg-white  p-4 rounded-xl shadow-md w-64 items-center justify-center flex-col h-auto mb-20   flex transition-transform duration-300 hover:scale-105 border border-gray-100 ">
            <h3 className=" flex items-center flex-col font-bold pb-5 justify-center">
              <Lock
                size={48}
                className="inline-block mb-4 h-10 text-[#268CFF] transition-transform  "
              ></Lock>
              Segurança
            </h3>
            <p className="text-sm text-gray-500  ">
              Todos os dados serão protegidos e as transações, validadas pela
              instituição.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
