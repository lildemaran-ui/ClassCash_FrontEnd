import { useState, useEffect } from "react";
import img1 from "../../assets/Plain credit card-amico.svg";
import { ImagePlus, Wallet } from "lucide-react";
import { toast } from "sonner";

// ✅ Interface alinhada com o tipo User do teu sistema
interface User {
  idusuario: number;
  nome: string;
  email: string;
  foto?: string;
  perfil?: string;
  processo?: number;
  classe?: string;
  contacto?: string;
  relacao?: string;
  nomeEstudante?: string;
  senha?: string;
  instituicao?: string;
  idInstituicao?: number;
  codigoPlataforma?: string;
  ibanInstituicao?: string;
}

const PRECOS_SERVICOS: { [key: string]: number } = {
  Propina: 15000,
  Justificativo: 2000,
  Transferência: 5000,
  Certificado: 2000,
  CartãodeEstudante: 1000,
  Uniforme: 12000,
};

const mesesDoAno = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const servicoMap: { [key: string]: string } = {
  Propina: "2",
  Justificativo: "8",
  Transferência: "9",
  Certificado: "5",
  CartãodeEstudante: "6",
  Uniforme: "3",
};

export default function PagamentoGeral() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [iban, setIban] = useState<string>("A carregar..."); // ✅ dentro do componente

  const [pagamento, setPagamento] = useState({
    metodo: "",
    servico: "Propina",
    mesInicial: "Janeiro",
    mesFinal: "Janeiro",
    plataforma: "Multicaxa Express",
  });
const sessao = JSON.parse(localStorage.getItem("sessao") || "{}");
const token = sessao.token;
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setPagamento((prev) => ({ ...prev, [name]: value }));
    if (name === "metodo" && value === "Dinheiro Físico") {
      setShowModal(true);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImageFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!formularioValido || !user) return;

    try {
      const formData = new FormData();
      formData.append("usuarioId", String(user.idusuario));
      formData.append("servicoId", servicoMap[pagamento.servico] ?? "2");
      formData.append("meses", String(quantidadeMeses));
      formData.append(
        "tipoPagamentoId",
        pagamento.metodo === "De forma digital" ? "1" : "2",
      );

      if (imageFile) {
        formData.append("comprovativo", imageFile);
      } else {
        toast.error("Por favor, selecione um comprovativo");
        return;
      }

     const response = await fetch("http://localhost:5000/api/pagamento", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      if (response.ok) {
        const dados = await response.json();
        toast.success(
          `Pagamento criado! Código: ${dados.codigo} | Valor: KZ ${dados.valor}`,
        );
        setImage(null);
        setImageFile(null);
        setPagamento({
          metodo: "",
          servico: "Propina",
          mesInicial: "Janeiro",
          mesFinal: "Janeiro",
          plataforma: "Multicaxa Express",
        });
        const fileInput = document.getElementById(
          "fotoInput",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const erro = await response.json();
        toast.error(`Erro: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      toast.error("Não foi possível conectar ao servidor.");
    }
  };

  const [perfil, setPerfil] = useState<"estudante" | "encarregado" | null>(
    null,
  );
  const [nomeEducando, setNomeEducando] = useState<string | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (!dadosDoLogin || dadosDoLogin === "undefined") {
      window.location.href = "/Login";
      return;
    }

    try {
      const parsed = JSON.parse(dadosDoLogin);
      const idusuario =
        parsed.usuario?.idusuario ?? parsed.idusuario ?? parsed.id;
      const idInstituicao =
        parsed.idInstituicao ?? parsed.usuario?.idInstituicao;
      const perfilNome: string = parsed.perfil ?? parsed.usuario?.perfil ?? "";
      const isEncarregado = perfilNome.toLowerCase().includes("encarregado");

      setPerfil(isEncarregado ? "encarregado" : "estudante");

      if (!idusuario) {
        window.location.href = "/Login";
        return;
      }

      const userBase: User = {
        idusuario,
        nome: parsed.usuario?.nome ?? parsed.nome ?? "",
        email: parsed.usuario?.email ?? parsed.email ?? "",
        foto: parsed.usuario?.foto ?? parsed.foto,
        perfil: perfilNome,
        idInstituicao,
        instituicao: parsed.instituicao,
      };

      const buscarIban = (instId: number) => {
        fetch(`http://localhost:5000/api/cadastro-instituicao`)
          .then((r) => r.json())
          .then((lista: Array<{ idinstituicao: number; iban: string }>) => {
            const inst = lista.find((i) => i.idinstituicao === instId);
            setIban(inst?.iban ?? "Não disponível");
          })
          .catch(() => setIban("Não disponível"));
      };

      if (isEncarregado) {
        // ✅ Encarregado: busca nome do educando + código do encarregado
        fetch(`http://localhost:5000/api/encarregado/${idusuario}`)
          .then((r) => r.json())
          .then((dados) => {
            setUser({
              ...userBase,
              codigoPlataforma: dados.codigo_plataforma ?? undefined,
              idInstituicao: idInstituicao ?? dados.idinstituicao,
            });
            setNomeEducando(dados.nome_educando ?? null);
            const instId = idInstituicao ?? dados.idinstituicao;
            if (instId) buscarIban(instId);
            else setIban("Instituição não associada");
          })
          .catch(() => {
            setUser(userBase);
            setIban("Não disponível");
          });
      } else {
        // ✅ Estudante: busca o seu próprio código
        fetch(`http://localhost:5000/api/estudante/${idusuario}`)
          .then((r) => r.json())
          .then((dados) => {
            setUser({
              ...userBase,
              codigoPlataforma: dados.codigo_plataforma ?? undefined,
            });
          })
          .catch(() => setUser(userBase));

        if (idInstituicao) buscarIban(idInstituicao);
        else setIban("Instituição não associada");
      }
    } catch {
      window.location.href = "/Login";
    }
  }, []);
  const precoBase = PRECOS_SERVICOS[pagamento.servico] || 0;
  const indexInicio = mesesDoAno.indexOf(pagamento.mesInicial);
  const indexFim = mesesDoAno.indexOf(pagamento.mesFinal);
  const quantidadeMeses =
    indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1;
  const valorTotal = precoBase * quantidadeMeses;
  const formularioValido =
    pagamento.metodo !== "" && imageFile !== null && indexFim >= indexInicio;

  if (!user) return <span>A carregar...</span>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex bg-gray-50 w-full lg:w-1/2 font-sans">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* COLUNA ESQUERDA */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block mb-1 font-bold text-gray-700">
                    Código
                  </label>
                  {/* ✅ usa codigoPlataforma (camelCase) */}
                  <input
                    type="text"
                    value={user.codigoPlataforma ?? "Aguardando aprovação"}
                    readOnly
                    className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
                {/* ✅ Educando — só para encarregado */}
                {perfil === "encarregado" && (
                  <div>
                    <label className="block mb-1 font-bold text-gray-700">
                      Educando
                    </label>
                    <input
                      type="text"
                      value={nomeEducando ?? "Não associado"}
                      readOnly
                      className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                )}
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <label className="block mb-3 font-bold text-gray-700">
                    Como será feito o pagamento?
                  </label>
                  <div className="flex flex-col gap-3">
                    {["De forma digital", "No banco", "Dinheiro Físico"].map(
                      (m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="metodo"
                            value={m}
                            checked={pagamento.metodo === m}
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#184d8a]"
                          />
                          <span
                            className={`transition-colors text-sm md:text-base ${pagamento.metodo === m ? "font-semibold text-[#184d8a]" : "text-gray-600 group-hover:text-blue-400"}`}
                          >
                            {m}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {(pagamento.metodo === "De forma digital" ||
                  pagamento.metodo === "No banco") && (
                  <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">
                      Dados do Serviço
                    </h3>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Serviço:
                      </label>
                      <select
                        name="servico"
                        value={pagamento.servico}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none text-sm md:text-base"
                      >
                        {Object.keys(PRECOS_SERVICOS).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                     <div>
                          <label className="font-medium block mb-2 text-gray-700">
                            Meses a pagar:
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400">
                                De:
                              </p>
                              <select
                                name="mesInicial"
                                value={pagamento.mesInicial}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-2 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => (
                                  <option key={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <span className="mt-5 text-gray-400 font-bold">
                              à
                            </span>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400">
                                Até:
                              </p>
                              <select
                                name="mesFinal"
                                value={pagamento.mesFinal}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-2 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => (
                                  <option key={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                    {pagamento.metodo === "De forma digital" && (
                      <div className="animate-in fade-in flex flex-col gap-4">
                        <div>
                          <label className="font-medium block mb-2 text-gray-700">
                            Plataforma:
                          </label>
                          <select
                            name="plataforma"
                            value={pagamento.plataforma}
                            onChange={handleChange}
                            className="p-3 border rounded-lg w-full bg-white text-sm md:text-base"
                          >
                            <option value="Multicaxa Express">
                              Multicaixa Express
                            </option>
                            <option value="Unitel Money">Unitel Money</option>
                            <option value="PayPay">Pay Pay</option>
                          </select>
                        </div>
                       
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA */}
              <div className="flex flex-col gap-6">
                {(pagamento.metodo === "De forma digital" ||
                  pagamento.metodo === "No banco") && (
                  <div className="flex flex-col gap-6 animate-in fade-in">
                    <h3 className="font-bold text-gray-800 border-b pb-2">
                      Finalização
                    </h3>

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

                    <div>
                      <label className="font-medium block mb-2 text-gray-700">
                        IBAN da Instituição
                      </label>
                      {/* ✅ mostra o IBAN real buscado da BD */}
                      <input
                        type="text"
                        value={iban}
                        readOnly
                        className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="font-medium block mb-2 text-gray-700">
                        Comprovativo
                      </label>
                      <label
                        htmlFor="fotoInput"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-14 text-center hover:border-[#184d8a] transition-colors cursor-pointer overflow-hidden"
                      >
                        {image ? (
                          <img
                            loading="lazy"
                            src={image}
                            alt="preview"
                            className="h-20 object-contain rounded-lg"
                          />
                        ) : (
                          <>
                            <ImagePlus className="w-8 h-8 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">
                              Arraste ou clique para carregar
                            </p>
                          </>
                        )}
                      </label>
                      <input
                        id="fotoInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!formularioValido}
                      className={`py-4 rounded-xl font-bold text-base md:text-lg transition-all transform active:scale-95 shadow-lg ${
                        formularioValido
                          ? "bg-[#184d8a] text-white hover:bg-[#184d8a]/80"
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

      <div className="hidden lg:flex w-1/2 items-center justify-center border-l border-gray-200 bg-gray-50 p-8">
        <img src={img1} alt="" className="w-full max-w-md object-contain" />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} />
            </div>
            <h1 className="text-xl font-bold mb-2">Pagamento Presencial</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Por favor, dirija-se à Secretaria da Instituição para efetuar o
              pagamento em numerário.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setPagamento((p) => ({ ...p, metodo: "" }));
              }}
              className="w-full bg-[#184d8a] text-white py-3 rounded-lg font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
