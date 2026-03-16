import { useState, useEffect } from "react";
import img1 from "../../assets/Plain credit card-amico.svg";
import { Wallet } from "lucide-react";

export default function PagamentoGeral() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [pagamento, setPagamento] = useState({
    metodo: "",
    servico: "Propina",
    mesInicial: "Janeiro",
    mesFinal: "Janeiro",
    plataforma: "PayPay",
    comprovativo: null,
  });

  const mesesDoAno = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const PRECOS_SERVICOS: { [key: string]: number } = {
    Propina: 15000,
    Justificativo: 2000,
    Transferência: 5000,
    Certificado: 2000,
    CartãodeEstudante: 1000,
    Uniforme: 12000,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPagamento((prev) => ({ ...prev, [name]: value }));
    if (name === "metodo" && value === "Dinheiro Físico") {
      setShowModal(true);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  const precoBase = PRECOS_SERVICOS[pagamento.servico] || 0;
  const indexInicio = mesesDoAno.indexOf(pagamento.mesInicial);
  const indexFim = mesesDoAno.indexOf(pagamento.mesFinal);
  const quantidadeMeses = indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1;
  const valorTotal = precoBase * quantidadeMeses;

  const formularioValido = pagamento.metodo !== "" && image !== null && indexFim >= indexInicio;

  if (!user) return <span>Carregado...</span>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Formulário */}
      <div className="flex bg-gray-50 w-full lg:w-1/2 font-sans">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto py-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* COLUNA ESQUERDA */}
              <div className="flex flex-col gap-6">

                {/* Código */}
                <div>
                  <label className="block mb-1 font-medium text-gray-500">Código</label>
                  <input
                    type="text"
                    value="DVS-2025-KS"
                    readOnly
                    className="w-32 border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>

                {/* Método de Pagamento */}
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <label className="block mb-3 font-bold text-gray-700">
                    Como será feito o pagamento?
                  </label>
                  <div className="flex flex-col gap-3">
                    {["De forma digital", "No banco", "Dinheiro Físico"].map((m) => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="metodo"
                          value={m}
                          checked={pagamento.metodo === m}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#268cff]"
                        />
                        <span className={`transition-colors text-sm md:text-base ${
                          pagamento.metodo === m
                            ? "font-semibold text-[#268cff]"
                            : "text-gray-600 group-hover:text-blue-400"
                        }`}>
                          {m}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dados do Serviço */}
                {(pagamento.metodo === "De forma digital" || pagamento.metodo === "No banco") && (
                  <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Dados do Serviço</h3>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Serviço:</label>
                      <select
                        name="servico"
                        value={pagamento.servico}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none text-sm md:text-base"
                      >
                        {Object.keys(PRECOS_SERVICOS).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {pagamento.metodo === "De forma digital" && (
                      <div className="animate-in fade-in flex flex-col gap-4">
                        <div>
                          <label className="font-medium block mb-2 text-gray-700">
                            Plataforma a ser usada:
                          </label>
                          <select
                            name="plataforma"
                            value={pagamento.plataforma}
                            onChange={handleChange}
                            className="p-3 border rounded-lg w-full bg-white text-sm md:text-base"
                          >
                            <option value="Multicaxa Express">Multicaixa Express</option>
                            <option value="Unitel Money">Unitel Money</option>
                            <option value="PayPay">Pay Pay</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-medium block mb-2 text-gray-700">
                            Meses a pagar:
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400">De:</p>
                              <select
                                name="mesInicial"
                                value={pagamento.mesInicial}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-2 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => <option key={m}>{m}</option>)}
                              </select>
                            </div>
                            <span className="mt-5 text-gray-400 font-bold">à</span>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400">Até:</p>
                              <select
                                name="mesFinal"
                                value={pagamento.mesFinal}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-2 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => <option key={m}>{m}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA */}
              <div className="flex flex-col gap-6">
                {(pagamento.metodo === "De forma digital" || pagamento.metodo === "No banco") && (
                  <div className="flex flex-col gap-6 animate-in fade-in">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Finalização</h3>

                    {/* Resumo de Valores */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                      <label className="block text-sm text-blue-600 font-semibold tracking-wider">
                        Total a pagar
                      </label>
                      <div className="text-2xl md:text-3xl font-black text-blue-700">
                        KZ {valorTotal.toLocaleString("pt-PT")},00
                      </div>
                      <p className="text-xs text-blue-400 mt-1 italic">
                        {quantidadeMeses} mês(es) selecionado(s)
                      </p>
                    </div>

                    {/* Comprovativo */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Anexar Comprovativo:
                      </label>
                      <div className="relative w-full h-40 md:h-44 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white overflow-hidden hover:border-blue-400 transition-all">
                        {image ? (
                          <img
                            loading="lazy"
                            src={image}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Wallet className="mx-auto text-gray-300 mb-2" size={32} />
                            <span className="text-gray-400 text-sm block">
                              Clique abaixo para carregar o ficheiro
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full"
                      />
                    </div>

                    <button
                      onClick={() => alert("Pagamento enviado com sucesso!")}
                      disabled={!formularioValido}
                      className={`py-4 rounded-xl font-bold text-base md:text-lg transition-all transform active:scale-95 shadow-lg ${
                        formularioValido
                          ? "bg-[#268cff] text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      Enviar Pagamento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Imagem decorativa — escondida em mobile */}
      <div className="hidden lg:flex w-1/2 items-center justify-center border-l border-gray-200 bg-gray-50 p-8">
        <img src={img1} alt="" className="w-full max-w-md object-contain" />
      </div>

      {/* Modal Dinheiro Físico */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} />
            </div>
            <h1 className="text-xl font-bold mb-2">Pagamento Presencial</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Por favor, dirija-se à Secretaria da Instituição para efetuar o pagamento em numerário.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setPagamento((p) => ({ ...p, metodo: "" }));
              }}
              className="w-full bg-[#268cff] text-white py-3 rounded-lg font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}