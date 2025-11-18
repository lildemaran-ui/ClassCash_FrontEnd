import React, { useState } from "react";
import { MessageCircleQuestionMark,
  HouseIcon,
  CreditCardIcon,
  SettingsIcon,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Logo from "../assets/Logo5.5.png"

export default function Pagamentos() {
  const [pagamento, setPagamento] = useState({
    metodo: "",
    servico: "Propina",
    meses: 1,
    plataforma: "PayPay",
    comprovativo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPagamento({ ...pagamento, [name]: value });
  };

  const handleFileChange = (e) => {
    setPagamento({ ...pagamento, comprovativo: e.target.files[0] });
  };

  const enviarPagamento = () => {
    console.log(pagamento);
    alert("Pagamento enviado!");
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="bg-[#1e88e5] text-white w-96 flex flex-col p-6">
        <div className="mb-16">
          <div className="flex items-center mb-4 border-b p-5" >
            <div className=" items-center flex justify-start">
              <img src={Logo} alt="" className="h-20 w-auto"/>
            </div>
            <h1 className="text-2xl font-bold ml-2">ClassCash</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <button className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
           <HouseIcon/> Página Inicial
          </button>
          <button className="flex items-center gap-2 p-2 bg-blue-800 rounded">
            <CreditCardIcon/> Pagamentos
          </button>
          <button className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
            <MessageCircle/> Reclamações
          </button>
          <button className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
            <SettingsIcon/> Configurações
          </button>
          <button className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
            <MessageCircleQuestionMark/> Suporte
          </button>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-10">
        <button className="mb-6 flex items-center gap-2 text-gray-500 text-lg">
          <ArrowLeft size={28} className="text-[#268CFF]"/> Voltar
        </button>

        <div className=" px-20 py-24 border rounded  max-w-7xl mx-auto h-auto grid grid-cols-2 gap-20">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-4">
            <div className="mb-5">
              <label className="block mb-1">Código</label>
              <input
                type="text"
                value="DVP-2025-SV"
                readOnly
                className="w-32  border rounded px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-3">Como será feito o pagamento?</label>
              <div className="flex flex-col gap-2">
                {["De forma digital", "No banco", "Dinheiro Físico"].map((m) => (
                  <label key={m} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="metodo"
                      value={m}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3 mt-3">Quais dos serviços fará o pagamento?</label>
              <select
                name="servico"
                value={pagamento.servico}
                onChange={handleChange}
                className="w-64 border rounded px-3 py-2"
              >
                <option>Propina</option>
                <option>Uniforme</option>
              </select>
            </div>

            <div>
              <label className="block mb-3 mt-3">Vai pagar para quantos meses?</label>
              <input
                type="number"
                name="meses"
                min={1}
                value={pagamento.meses}
                onChange={handleChange}
                className="w-20 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-3 mt-3">Quais dos serviços utilizará?</label>
              <select
                name="plataforma"
                value={pagamento.plataforma}
                onChange={handleChange}
                className="w-64 border rounded px-3 py-2"
              >
                <option>Multicaixa Express</option>
                <option>PayPay</option>
              </select>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-3 ">Valor do serviço:</label>
              <input
                type="text"
                value="Kz 15.000,00"
                readOnly
                className="w-40 border rounded px-5 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block mb-3 mt-3">IBAN:</label>
              <input
                type="text"
                value="AO006 0000 0000 0000 0000 0000 0"
                readOnly
                className="w-full border rounded px-5 py-2 text-gray-700"
              />
            </div>

            <div >
              <label className="block mb-1">Comprovativo</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full h-64 items-center flex justify-center  border rounded p-4 text-gray-400"
                
              />
            </div>
                
            <button
              onClick={enviarPagamento}
              className="mt-auto bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
              Enviar pagamento
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
}
