import { ImagePlus, Receipt, Send, ShieldAlert, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import img1 from "../../assets/Plain credit card-amico.svg";

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

interface Servico {
  idservico: number;
  nome: string;
  nivel: number;
  valorservico: number;
  multa_base: number;
}

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

const MULTICAIXA_URL = "https://v0-multicaixa-express-app.vercel.app";

// Gera ID de transação único (usado como fallback)
function gerarIdTransacao() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN-${ts}-${rand}`;
}

// ==================== COMPONENTE COMPROVATIVO (unificado) ====================
interface ComprovativoProps {
  transactionId: string;
  nomeAluno: string;
  nomeServico: string;
  valorTotal: number;
  meses: number;
  metodo: string;
  instituicao: string;
  processo?: number | string;
  comprativoImagem?: string | null;
  onConfirmar: () => void;
  loading: boolean;
}

function Comprovativo({
  transactionId,
  nomeAluno,
  nomeServico,
  valorTotal,
  meses,
  metodo,
  instituicao,
  processo,
  comprativoImagem,
  onConfirmar,
  loading,
}: ComprovativoProps) {
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const horaFormatada = agora.toLocaleTimeString("pt-AO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-lg animate-in slide-in-from-bottom-4 w-full max-w-full">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Receipt size={20} className="text-[#184d8a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">
            Comprovativo de Pagamento
          </p>
          <p className="text-xs text-gray-400">
            {dataFormatada} às {horaFormatada}
          </p>
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full whitespace-nowrap">
          Pendente validação
        </span>
      </div>

      {/* ID da transação */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 border border-dashed border-gray-300">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          ID de Transação
        </p>
        <p className="font-mono text-sm font-bold text-[#184d8a] tracking-wider break-all">
          {transactionId}
        </p>
      </div>

      {/* Detalhes */}
      <div className="flex flex-col gap-2 text-sm">
        {[
          { label: "Aluno", value: nomeAluno },
          { label: "Nº Processo", value: processo ?? "—" },
          { label: "Instituição", value: instituicao },
          { label: "Serviço", value: nomeServico },
          { label: "Período", value: meses > 1 ? `${meses} meses` : "1 mês" },
          { label: "Método", value: metodo },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800 text-right max-w-[65%] truncate">
              {value}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
          <span className="font-bold text-gray-700">Total Pago</span>
          <span className="text-lg font-black text-[#184d8a]">
            KZ {valorTotal.toLocaleString("pt-PT")},00
          </span>
        </div>
      </div>

      {/* Imagem do comprovativo */}
      {comprativoImagem && (
        <div className="rounded-xl overflow-hidden border border-blue-100">
          <p className="text-xs font-bold text-gray-500 px-3 py-2 bg-gray-50 border-b">
            Comprovativo anexado
          </p>
          <img
            src={comprativoImagem}
            alt="Comprovativo"
            className="w-full object-contain max-h-64 sm:max-h-80"
          />
        </div>
      )}

      {/* Aviso */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
        <Send size={16} /> O seu pagamento será validado pela Secretaria. Guarde
        o ID de transação.
      </div>

      {/* Botão final - idêntico para banco e digital */}
      <button
        onClick={onConfirmar}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.985] shadow-md ${
          loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            A enviar...
          </>
        ) : (
          <>
            <Send size={18} />
            Concluir e Enviar para Secretaria
          </>
        )}
      </button>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function PagamentoGeral() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [iban, setIban] = useState<string>("A carregar...");
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
  const [perfil, setPerfil] = useState<"estudante" | "encarregado" | null>(
    null,
  );
  const [nomeEducando, setNomeEducando] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados do comprovativo
  const [mostrarComprovativo, setMostrarComprovativo] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [comprativoUrl, setComprativoUrl] = useState<string | null>(null);

  const sessao = JSON.parse(localStorage.getItem("sessao") || "{}");
  const token: string | null = sessao.token ?? null;

  const [pagamento, setPagamento] = useState({
    metodo: "",
    servicoId: "",
    mesInicial: "Janeiro",
    mesFinal: "Janeiro",
    plataforma: "",
  });

  // ─── Carregar serviços da classe do aluno ─────────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/servicos/aluno", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((dados: Servico[]) => {
        setServicosDisponiveis(Array.isArray(dados) ? dados : []);
        if (dados.length > 0)
          setPagamento((p) => ({
            ...p,
            servicoId: String(dados[0].idservico),
          }));
      })
      .catch(() => toast.error("Erro ao carregar serviços"));
  }, [token]);

  // ─── Serviço selecionado ──────────────────────────────────────────────────
  const servicoAtual = servicosDisponiveis.find(
    (s) => String(s.idservico) === String(pagamento.servicoId),
  );
  const isPropina =
    servicoAtual?.nome?.toLowerCase().includes("propina") ?? false;

  const precoBase = servicoAtual?.valorservico ?? 0;
  const indexInicio = mesesDoAno.indexOf(pagamento.mesInicial);
  const indexFim = mesesDoAno.indexOf(pagamento.mesFinal);
  const quantidadeMeses =
    isPropina && indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1;
  const valorTotal = precoBase * quantidadeMeses;

  // ─── URL iframe Multicaixa ────────────────────────────────────────────────
  const iframeUrl =
    token &&
    user?.codigoPlataforma &&
    iban &&
    iban !== "A carregar..." &&
    iban !== "Não disponível"
      ? `${MULTICAIXA_URL}/?iban=${encodeURIComponent(iban)}&valor=${valorTotal}&ref=${encodeURIComponent(user.codigoPlataforma)}&token=${encodeURIComponent(token)}`
      : null;

  // Escutar resposta da Multicaixa Express
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Aceitar apenas mensagens da origem do Multicaixa
      if (
        !event.origin.includes("v0-multicaixa-express-app.vercel.app") &&
        !event.origin.includes("multicaixa")
      ) {
        return;
      }

      console.log("📨 PostMessage recebido:", event.data); // ← Mantém isto para debug

      const data = event.data || {};

      // Possíveis variações de nome que o Multicaixa pode enviar
      const status =
        data.status || data.paymentStatus || data.result || data.state;
      const txId = data.transactionId || data.txId || data.id || data.reference;
      const receiptUrl = data.receiptUrl || data.receipt || data.comprovativo;
      const receiptImage = data.receiptImageBase64 || data.image || data.base64;

      if (
        (status === "success" ||
          status === "completed" ||
          status === "approved") &&
        txId
      ) {
        console.log("✅ Pagamento digital confirmado!", txId);

        setTransactionId(txId);
        setComprativoUrl(receiptImage || receiptUrl || null);
        setMostrarComprovativo(true);

        toast.success(
          "Pagamento processado com sucesso! Revê o comprovativo abaixo.",
        );
      } else if (status === "failed" || status === "error" || data.error) {
        toast.error(data.message || "O pagamento não foi concluído.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setPagamento((prev) => ({ ...prev, [name]: value }));
    if (name === "metodo") {
      if (value === "Dinheiro Físico") setShowModal(true);

      // Reset ao mudar de método
      setMostrarComprovativo(false);
      setTransactionId(null);
      setComprativoUrl(null);
      setImage(null);
      setImageFile(null);
    }

    if (name === "servicoId") {
      setPagamento((prev) => ({
        ...prev,
        mesInicial: "Janeiro",
        mesFinal: "Janeiro",
      }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Preparar comprovativo para "No banco"
  const handlePrepararComprovativo = () => {
    if (!pagamento.servicoId || !imageFile) return;

    const novoId = gerarIdTransacao();
    setTransactionId(novoId);
    setComprativoUrl(image);
    setMostrarComprovativo(true);
  };
  // ─── Enviar pagamento final ───────────────────────────────────────────────
  const handleEnviarFinal = async () => {
    if (!user || !token || !transactionId) return;
    setLoading(true);
    const mesesSelecionados = isPropina
      ? mesesDoAno.slice(indexInicio, indexFim + 1).join(", ")
      : null;

    const formData = new FormData();
    formData.append("usuarioId", String(user.idusuario));
    formData.append("servicoId", pagamento.servicoId);
    formData.append("meses", String(quantidadeMeses));
    formData.append(
      "tipoPagamentoId",
      pagamento.metodo === "De forma digital" ? "1" : "2",
    );

    if (pagamento.metodo === "De forma digital") {
      formData.append("comprovativo_digital_id", transactionId);
    } else if (imageFile) {
      formData.append("comprovativo", imageFile);
    }

    if (pagamento.metodo === "No banco") {
      formData.append("id_transacao_local", transactionId);
    }

    if (mesesSelecionados) {
      formData.append("mesesReferencia", mesesSelecionados);
    }
    try {
      const response = await fetch("http://localhost:5000/api/pagamento", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Pagamento enviado para validação da Secretaria!");
        // Reset total
        setMostrarComprovativo(false);
        setTransactionId(null);
        setComprativoUrl(null);
        setImage(null);
        setImageFile(null);
        setPagamento((p) => ({
          ...p,
          metodo: "",
          plataforma: "",
          servicoId: servicosDisponiveis[0]
            ? String(servicosDisponiveis[0].idservico)
            : "",
        }));
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error ?? "Erro ao enviar pagamento");
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Carregar dados do utilizador ─────────────────────────────────────────
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex bg-gray-50 w-full lg:w-1/2 font-sans">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* ── COLUNA ESQUERDA ── */}
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block mb-1 font-bold text-gray-700">
                    Código
                  </label>
                  <input
                    type="text"
                    value={user?.codigoPlataforma ?? "Aguardando aprovação"}
                    readOnly
                    className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>

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

                {/* Método de pagamento */}
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <label className="block mb-3 font-bold text-gray-700">
                    Como será feito o pagamento?
                  </label>
                  <div className="flex flex-col gap-3">
                    {["De forma digital", "No banco", "Dinheiro Físico"].map(
                      (m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="metodo"
                            value={m}
                            checked={pagamento.metodo === m}
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#184d8a]"
                          />
                          <span className="text-sm">{m}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {pagamento.metodo !== "" &&
                  pagamento.metodo !== "Dinheiro Físico" && (
                    <div className="flex flex-col gap-4 animate-in fade-in">
                      {/* Serviço */}
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">
                          Serviço Disponível:
                        </label>
                        <select
                          name="servicoId"
                          value={pagamento.servicoId}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                          disabled={mostrarComprovativo}
                        >
                          {servicosDisponiveis.length === 0 && (
                            <option value="">Nenhum serviço disponível</option>
                          )}
                          {servicosDisponiveis.map((s) => (
                            <option key={s.idservico} value={s.idservico}>
                              {s.nome} —{" "}
                              {Number(s.valorservico).toLocaleString("pt-AO")}{" "}
                              KZ
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Meses — só para Propina */}
                      {isPropina && !mostrarComprovativo && (
                        <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in">
                          <label className="font-medium text-gray-700 text-sm">
                            Período de pagamento (propina):
                          </label>
                          <div className="flex gap-3 items-center">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                De
                              </label>
                              <select
                                name="mesInicial"
                                value={pagamento.mesInicial}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">
                                Até
                              </label>
                              <select
                                name="mesFinal"
                                value={pagamento.mesFinal}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                              >
                                {mesesDoAno.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {indexFim < indexInicio && (
                            <p className="text-xs text-red-500">
                              ⚠️ O mês final deve ser igual ou posterior ao mês
                              inicial.
                            </p>
                          )}
                          <p className="text-xs text-blue-600 font-semibold">
                            {quantidadeMeses} mês(es) selecionado(s)
                          </p>
                        </div>
                      )}

                      {/* Plataforma — só para digital */}
                      {pagamento.metodo === "De forma digital" &&
                        !mostrarComprovativo && (
                          <div>
                            <label className="font-medium block mb-2 text-gray-700">
                              Plataforma Digital:
                            </label>
                            <select
                              name="plataforma"
                              value={pagamento.plataforma}
                              onChange={handleChange}
                              className="p-3 border rounded-lg w-full bg-white text-sm"
                            >
                              <option value="">
                                Selecione uma plataforma...
                              </option>
                              <option value="Multicaxa Express">
                                Multicaixa Express
                              </option>
                              <option value="Unitel Money">Unitel Money</option>
                              <option value="Pay Pay">Pay Pay</option>
                            </select>
                          </div>
                        )}

                      {/* Total */}
                      {!mostrarComprovativo && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <label className="block text-xs text-blue-500 font-semibold mb-1">
                            Total a pagar
                          </label>
                          <p className="text-2xl font-black text-blue-700">
                            KZ {valorTotal.toLocaleString("pt-PT")},00
                          </p>
                          <p className="text-xs text-blue-400 mt-1 italic">
                            {isPropina
                              ? `${quantidadeMeses} mês(es)`
                              : "1 serviço"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* ── COLUNA DIREITA ── */}
              <div className="flex flex-col gap-6">
                {/* Multicaixa iframe */}
                {pagamento.plataforma === "Multicaxa Express" &&
                  pagamento.metodo === "De forma digital" &&
                  !mostrarComprovativo && (
                    <div className="animate-in zoom-in-95">
                      <div className="bg-blue-600 p-4 rounded-t-xl text-white font-bold">
                        <span>Total: KZ {valorTotal.toLocaleString()}</span>
                      </div>
                      {!token ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-b-xl text-red-700 text-sm">
                          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                          <span>
                            Sessão inválida. Por favor, faça login novamente.
                          </span>
                        </div>
                      ) : !iframeUrl ? (
                        <div className="h-36 flex items-center justify-center rounded-b-xl border border-dashed border-gray-300 text-gray-400 text-sm">
                          A aguardar dados da instituição...
                        </div>
                      ) : (
                        <iframe
                          key={iframeUrl}
                          src={iframeUrl}
                          title="Multicaixa Express"
                          width="100%"
                          height="400"
                          className="border rounded-b-xl shadow-lg block"
                          allow="payment"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      )}
                      <button
                        onClick={() => {
                          const fakeTxId = gerarIdTransacao();
                          setTransactionId(fakeTxId);
                          setComprativoUrl(null); // ou podes colocar uma imagem de teste
                          setMostrarComprovativo(true);
                          toast.info(
                            "Comprovativo aberto manualmente (modo teste)",
                          );
                        }}
                        className="w-full py-3.5 text-sm font-medium border-2 border-dashed border-[#184d8a]/30 hover:border-[#184d8a] rounded-2xl text-[#184d8a] transition-colors"
                      >
                        ✅ Já fiz o pagamento – Mostrar Comprovativo
                      </button>

                      <p className="text-center text-xs text-gray-500">
                        Se o comprovativo não apareceu automaticamente após
                        pagar
                      </p>
                    </div>
                  )}

                {/* Campos No Banco */}
                {pagamento.metodo === "No banco" && !mostrarComprovativo && (
                  <div className="flex flex-col gap-4 animate-in fade-in">
                    <h3 className="font-bold text-gray-800 border-b pb-2">
                      Dados para transferência
                    </h3>
                    <div>
                      <label className="font-medium block mb-2 text-gray-700">
                        IBAN da Instituição
                      </label>
                      <input
                        type="text"
                        value={iban}
                        readOnly
                        className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="font-medium block mb-2 text-gray-700">
                        Comprovativo de depósito
                      </label>
                      <label
                        htmlFor="fotoInput"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#184d8a] transition-colors cursor-pointer overflow-hidden"
                      >
                        {image ? (
                          <img
                            loading="lazy"
                            src={image}
                            alt="preview"
                            className="h-28 object-contain rounded-lg"
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

                    {/* Botão Gerar Comprovativo */}
                    <button
                      onClick={handlePrepararComprovativo}
                      disabled={!imageFile || !pagamento.servicoId}
                      className={`py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        imageFile && pagamento.servicoId
                          ? "bg-primary text-white hover:bg-primary/85 shadow-md"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Receipt size={18} />
                      Gerar Comprovativo
                    </button>
                  </div>
                )}

                {/* Comprovativo (banco ou digital) */}
                {mostrarComprovativo && transactionId && (
                  <Comprovativo
                    transactionId={transactionId}
                    nomeAluno={user?.nome ?? "—"}
                    nomeServico={servicoAtual?.nome ?? "—"}
                    valorTotal={valorTotal}
                    meses={quantidadeMeses}
                    metodo={pagamento.metodo}
                    instituicao={user?.instituicao ?? "—"}
                    processo={user?.processo}
                    comprativoImagem={comprativoUrl}
                    onConfirmar={handleEnviarFinal}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado decorativo */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-50 p-8 border-l">
        <img
          src={img1}
          alt="Credit Card"
          className="w-full max-w-sm opacity-80"
        />
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
              Por favor, dirija-se à Secretaria da Instituição para efetuar o
              pagamento em numerário.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setPagamento((p) => ({ ...p, metodo: "" }));
              }}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
