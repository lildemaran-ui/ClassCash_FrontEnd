import { Clock, ImagePlus, Receipt, Send, ShieldAlert, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import img1 from "../../assets/Plain credit card-amico.svg";

// ─── Interfaces ──────────────────────────────────────────────────────────────
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
  dia_limite: number | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const mesesDoAno = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const MULTICAIXA_URL = "https://v0-multicaixa-express-app.vercel.app";
const VALID_PHONE    = "923687972";
const MAX_ATTEMPTS   = 3;
const SUSPENSION_MS  = 24 * 60 * 60 * 1000;

function suspensionKey(userId: number | string) {
  return `multicaixaSuspendedAt_${userId}`;
}
function isSuspended(userId: number | string): boolean {
  const ts = localStorage.getItem(suspensionKey(userId));
  if (!ts) return false;
  return Date.now() - Number(ts) < SUSPENSION_MS;
}
function suspendNow(userId: number | string) {
  localStorage.setItem(suspensionKey(userId), String(Date.now()));
}
function gerarIdTransacao() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN-${ts}-${rand}`;
}

// ─── Comprovativo ────────────────────────────────────────────────────────────
interface ComprovativoProps {
  transactionId: string;
  nomeAluno: string;
  nomeServico: string;
  valorBase: number;
  multaTotal: number;
  mesesComMulta: number;
  valorTotal: number;
  meses: number;
  metodo: string;
  instituicao: string;
  processo?: number | string;
  comprativoImagem?: string | null;
  onConfirmar: () => void;
  loading: boolean;
  isPropina?: boolean;
}

function Comprovativo({
  transactionId, nomeAluno, nomeServico, valorBase, multaTotal,
  mesesComMulta, valorTotal, meses, metodo, instituicao,
  comprativoImagem, onConfirmar, loading, isPropina = false,
}: ComprovativoProps) {
  const agora         = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-AO", { day: "2-digit", month: "long", year: "numeric" });
  const horaFormatada = agora.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-lg animate-in slide-in-from-bottom-4 w-full max-w-full">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Receipt size={20} className="text-[#184d8a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">Comprovativo de Pagamento</p>
          <p className="text-xs text-gray-400">{dataFormatada} às {horaFormatada}</p>
        </div>
        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full whitespace-nowrap">
          Validação pendente
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 border border-dashed border-gray-300">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID de Transação</p>
        <p className="font-mono text-sm font-bold text-[#184d8a] tracking-wider break-all">{transactionId}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {[
          { label: "Aluno",       value: nomeAluno },
          { label: "Instituição", value: instituicao },
          { label: "Serviço",     value: nomeServico },
          ...(isPropina ? [{ label: "Período", value: meses > 1 ? `${meses} meses` : "1 mês" }] : []),
          { label: "Método",      value: metodo },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800 text-right max-w-[65%] truncate">{value}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Valor</span>
            <span className="font-semibold text-gray-800">KZ {valorBase.toLocaleString("pt-PT")},00</span>
          </div>
          {multaTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-red-500 font-medium">
                Multa ({mesesComMulta} mês{mesesComMulta > 1 ? "es" : ""} em atraso)
              </span>
              <span className="font-semibold text-red-600">+ KZ {multaTotal.toLocaleString("pt-PT")},00</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
            <span className="font-bold text-gray-700">Total Pago</span>
            <span className="text-lg font-black text-[#184d8a]">KZ {valorTotal.toLocaleString("pt-PT")},00</span>
          </div>
        </div>
      </div>

      {comprativoImagem && (
        <div className="rounded-xl overflow-hidden border border-blue-100">
          <p className="text-xs font-bold text-gray-500 px-3 py-2 bg-gray-50 border-b">Comprovativo anexado</p>
          <img src={comprativoImagem} alt="Comprovativo" className="w-full object-contain max-h-64 sm:max-h-80" />
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
        <Send size={14} />
        O seu pagamento será validado pela Secretaria. Guarde o ID de transação.
      </div>

      <button
        onClick={onConfirmar}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.985] shadow-md ${
          loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> A enviar...</>
        ) : (
          <><Send size={18} /> Concluir e Enviar para Secretaria</>
        )}
      </button>
    </div>
  );
}

// ─── Modal: Validação do número Multicaixa ────────────────────────────────────
interface ModalMulticaixaProps {
  userId: number;
  onValidado: () => void;
  onCancelar: () => void;
  onSuspender: (metodo: "No banco" | "Dinheiro Físico") => void;
}

function ModalMulticaixa({ userId, onValidado, onCancelar, onSuspender }: ModalMulticaixaProps) {
  const [phone, setPhone]           = useState("");
  const [erro, setErro]             = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [suspenso, setSuspenso]     = useState(false);
  const [validando, setValidando]   = useState(false);
  const [validado, setValidado]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleValidar = () => {
    if (phone.length !== 9) { setErro("Introduza um número válido com 9 dígitos."); return; }
    setValidando(true); setErro("");
    setTimeout(() => {
      setValidando(false);
      if (phone === VALID_PHONE) {
        setValidado(true);
        setTimeout(() => onValidado(), 1200);
      } else {
        const novasTentativas = tentativas + 1;
        setTentativas(novasTentativas);
        setPhone("");
        inputRef.current?.focus();
        if (novasTentativas >= MAX_ATTEMPTS) {
          suspendNow(userId); setSuspenso(true);
        } else {
          const restantes = MAX_ATTEMPTS - novasTentativas;
          setErro(`Número não encontrado. ${restantes} tentativa${restantes > 1 ? "s" : ""} restante${restantes > 1 ? "s" : ""}.`);
        }
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
        {!suspenso && !validado && (
          <>
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} className="text-[#184d8a]" />
            </div>
            <h2 className="text-lg font-bold text-center mb-1">Verificação Multicaixa Express</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Introduza o número de telemóvel associado à sua conta Multicaixa Express.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i < tentativas ? "bg-red-500" : "bg-gray-200"}`} />
              ))}
            </div>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg select-none">🇦🇴</span>
              <input
                ref={inputRef} type="tel" maxLength={9} value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErro(""); }}
                onKeyDown={(e) => e.key === "Enter" && !validando && handleValidar()}
                placeholder="9XX XXX XXX"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 text-center text-lg font-mono tracking-widest outline-none transition-all ${
                  erro ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-[#184d8a]"
                }`}
              />
            </div>
            {erro && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                <ShieldAlert size={14} className="flex-shrink-0" />{erro}
              </div>
            )}
            <button
              onClick={handleValidar} disabled={phone.length !== 9 || validando}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mb-2 ${
                phone.length === 9 && !validando ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {validando ? <><span className="w-4 h-4 border-2 border-gray-300 border-t-[#184d8a] rounded-full animate-spin" /> A verificar...</> : "Validar número"}
            </button>
            <button onClick={onCancelar} className="w-full py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </>
        )}
        {validado && (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-1 text-gray-800">Número verificado!</h2>
            <p className="text-sm text-gray-500">A abrir o Multicaixa Express...</p>
          </div>
        )}
        {suspenso && (
          <>
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-center mb-1">Método suspenso</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Excedeu o número de tentativas permitidas.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-5 flex items-start gap-2">
              <Clock size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
              <span>O <strong>Multicaixa Express</strong> ficará suspenso por <strong>24 horas</strong>. Por favor, utilize outro método de pagamento.</span>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onSuspender("No banco")} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><Receipt size={18} className="text-[#184d8a]" /></div>
                <div><p className="font-semibold text-sm text-gray-800">Pagar no banco</p><p className="text-xs text-gray-400">Transferência bancária com comprovativo</p></div>
              </button>
              <button onClick={() => onSuspender("Dinheiro Físico")} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><Wallet size={18} className="text-amber-600" /></div>
                <div><p className="font-semibold text-sm text-gray-800">Dinheiro físico</p><p className="text-xs text-gray-400">Pagamento presencial na Secretaria</p></div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PagamentoGeral() {
  const [showModalDinheiro, setShowModalDinheiro]       = useState(false);
  const [showModalMulticaixa, setShowModalMulticaixa]   = useState(false);
  const [multicaixaSuspenso, setMulticaixaSuspenso]     = useState(false);

  const [image, setImage]         = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser]           = useState<User | null>(null);
  const [iban, setIban]           = useState<string>("A carregar...");
  const [servicosDisponiveis, setServicos] = useState<Servico[]>([]);
  const [perfil, setPerfil]       = useState<"estudante" | "encarregado" | null>(null);
  const [nomeEducando, setNomeEducando]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const [mesesPagos, setMesesPagos] = useState<string[]>([]);

  const [mostrarComprovativo, setMostrarComprovativo] = useState(false);
  const [transactionId, setTransactionId]             = useState<string | null>(null);
  const [comprativoUrl, setComprativoUrl]             = useState<string | null>(null);

  const sessao = JSON.parse(localStorage.getItem("sessao") || "{}");
  const token: string | null = sessao.token ?? null;

  const [pagamento, setPagamento] = useState({
    metodo:     "",
    servicoId:  "",
    mesInicial: "",
    mesFinal:   "",
    plataforma: "",
  });

  // ── Determina se o painel direito (imagem) deve ser visível ──────────────
  // A imagem some quando há um método selecionado
  const metodoSelecionado = pagamento.metodo !== "";

  // ─── Carregar serviços ────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/servicos/aluno", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((dados: Servico[]) => {
        setServicos(Array.isArray(dados) ? dados : []);
        if (dados.length > 0)
          setPagamento((p) => ({ ...p, servicoId: String(dados[0].idservico) }));
      })
      .catch(() => toast.error("Erro ao carregar serviços"));
  }, [token]);

  // ─── Carregar meses já pagos quando o serviço mudar ─────────────────────
  useEffect(() => {
    if (!token || !pagamento.servicoId || !user?.idusuario) return;

    const servicoAtualObj = servicosDisponiveis.find(
      (s) => String(s.idservico) === String(pagamento.servicoId)
    );
    const ehPropina = servicoAtualObj?.nome?.toLowerCase().includes("propina") ?? false;

    if (!ehPropina) {
      setMesesPagos([]);
      return;
    }

    fetch(
      `http://localhost:5000/api/pagamentos/meses-pagos?usuarioId=${user.idusuario}&servicoId=${pagamento.servicoId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then((data: { meses: string[] }) => {
        setMesesPagos(Array.isArray(data.meses) ? data.meses : []);
      })
      .catch(() => setMesesPagos([]));
  }, [pagamento.servicoId, user?.idusuario, token]);

  // ─── Verificar suspensão quando o user carregar ───────────────────────────
  useEffect(() => {
    if (user?.idusuario) setMulticaixaSuspenso(isSuspended(user.idusuario));
  }, [user?.idusuario]);

  // ─── Serviço seleccionado e cálculos ─────────────────────────────────────
  const servicoAtual = servicosDisponiveis.find(
    (s) => String(s.idservico) === String(pagamento.servicoId),
  );

  const isPropina   = servicoAtual?.nome?.toLowerCase().includes("propina") ?? false;
  const precoBase   = servicoAtual?.valorservico ?? 0;
  const multaBase   = servicoAtual?.multa_base   ?? 0;

  const primeiroMesDisponivel = mesesDoAno.find((m) => !mesesPagos.includes(m)) ?? "Janeiro";

  const indexInicio = mesesDoAno.indexOf(
    pagamento.mesInicial || primeiroMesDisponivel
  );
  const indexFim    = mesesDoAno.indexOf(
    pagamento.mesFinal   || primeiroMesDisponivel
  );
  const quantidadeMeses = isPropina && indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diaLimite = servicoAtual?.dia_limite ?? null;

  const mesesComMulta = isPropina && diaLimite !== null
    ? mesesDoAno.slice(indexInicio, indexFim + 1).filter((_, i) => {
        const idxMes = indexInicio + i;
        const limiteDesseMes = new Date(hoje.getFullYear(), idxMes, diaLimite);
        limiteDesseMes.setHours(0, 0, 0, 0);
        return hoje >= limiteDesseMes;
      }).length
    : 0;

  const temMulta   = mesesComMulta > 0;
  const valorBase  = precoBase * quantidadeMeses;
  const multaTotal = multaBase * mesesComMulta;
  const valorTotal = valorBase + multaTotal;

  // ─── URL iframe Multicaixa ────────────────────────────────────────────────
  const iframeUrl =
    token && user?.codigoPlataforma && iban &&
    iban !== "A carregar..." && iban !== "Não disponível"
      ? `${MULTICAIXA_URL}/?iban=${encodeURIComponent(iban)}&valor=${valorTotal}&ref=${encodeURIComponent(user.codigoPlataforma)}&token=${encodeURIComponent(token)}`
      : null;

  // ─── Escutar resposta da Multicaixa Express ───────────────────────────────
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("v0-multicaixa-express-app.vercel.app") && !event.origin.includes("multicaixa")) return;
      const data         = event.data || {};
      const status       = data.status || data.paymentStatus || data.result || data.state;
      const txId         = data.transactionId || data.txId || data.id || data.reference;
      const receiptImage = data.receiptImageBase64 || data.image || data.base64;
      const receiptUrl   = data.receiptUrl || data.receipt || data.comprovativo;
      if ((status === "success" || status === "completed" || status === "approved") && txId) {
        setTransactionId(txId);
        setComprativoUrl(receiptImage || receiptUrl || null);
        setMostrarComprovativo(true);
        toast.success("Pagamento processado com sucesso! Revê o comprovativo abaixo.");
      } else if (status === "failed" || status === "error" || data.error) {
        toast.error(data.message || "O pagamento não foi concluído.");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ─── handleChange ─────────────────────────────────────────────────────────
  const resetComprovativo = () => {
    setMostrarComprovativo(false);
    setTransactionId(null);
    setComprativoUrl(null);
    setImage(null);
    setImageFile(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "metodo") {
      resetComprovativo();
      setPagamento((prev) => ({ ...prev, metodo: value, plataforma: "" }));
      if (value === "Dinheiro Físico") setShowModalDinheiro(true);
      return;
    }

    if (name === "plataforma" && value === "Multicaixa Express") {
      if (multicaixaSuspenso) { toast.error("Multicaixa Express suspenso por 24h. Escolha outro método."); return; }
      setShowModalMulticaixa(true);
      return;
    }

    if (name === "servicoId") {
      setPagamento((prev) => ({ ...prev, servicoId: value, mesInicial: "", mesFinal: "" }));
      return;
    }

    if (name === "mesInicial" || name === "mesFinal") {
      if (mesesPagos.includes(value)) {
        toast.error(`${value} já foi pago. Escolha outro mês.`);
        return;
      }
    }

    setPagamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleMulticaixaValidado = () => {
    setShowModalMulticaixa(false);
    setTimeout(() => { setPagamento((p) => ({ ...p, plataforma: "Multicaixa Express" })); }, 150);
  };
  const handleMulticaixaCancelar = () => setShowModalMulticaixa(false);
  const handleMulticaixaSuspender = (metodo: "No banco" | "Dinheiro Físico") => {
    setMulticaixaSuspenso(true);
    setShowModalMulticaixa(false);
    resetComprovativo();
    if (metodo === "Dinheiro Físico") {
      setPagamento((p) => ({ ...p, metodo: "Dinheiro Físico", plataforma: "" }));
      setShowModalDinheiro(true);
    } else {
      setPagamento((p) => ({ ...p, metodo: "No banco", plataforma: "" }));
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

  const handlePrepararComprovativo = () => {
    if (!pagamento.servicoId || !imageFile) return;
    setTransactionId(gerarIdTransacao());
    setComprativoUrl(image);
    setMostrarComprovativo(true);
  };

  const handleEnviarFinal = async () => {
    if (!user || !token || !transactionId) return;
    setLoading(true);

    const mesInicialFinal = pagamento.mesInicial || primeiroMesDisponivel;
    const mesFinalFinal   = pagamento.mesFinal   || primeiroMesDisponivel;
    const idxIni = mesesDoAno.indexOf(mesInicialFinal);
    const idxFim = mesesDoAno.indexOf(mesFinalFinal);

    const mesesSelecionados = isPropina
      ? mesesDoAno.slice(idxIni, idxFim + 1).join(", ")
      : null;

    const formData = new FormData();
    formData.append("usuarioId",       String(user.idusuario));
    formData.append("servicoId",       pagamento.servicoId);
    formData.append("meses",           String(quantidadeMeses));
    formData.append("tipoPagamentoId", pagamento.metodo === "De forma digital" ? "1" : "2");
    formData.append("multa",           String(multaTotal));

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
        resetComprovativo();
        setMesesPagos((prev) => [
          ...prev,
          ...mesesDoAno.slice(idxIni, idxFim + 1),
        ]);
        setPagamento((p) => ({
          ...p, metodo: "", plataforma: "", mesInicial: "", mesFinal: "",
          servicoId: servicosDisponiveis[0] ? String(servicosDisponiveis[0].idservico) : "",
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
    if (!dadosDoLogin || dadosDoLogin === "undefined") { window.location.href = "/Login"; return; }
    try {
      const parsed        = JSON.parse(dadosDoLogin);
      const idusuario     = parsed.usuario?.idusuario ?? parsed.idusuario ?? parsed.id;
      const idInstituicao = parsed.idInstituicao ?? parsed.usuario?.idInstituicao;
      const perfilNome: string = parsed.perfil ?? parsed.usuario?.perfil ?? "";
      const isEncarregado = perfilNome.toLowerCase().includes("encarregado");
      setPerfil(isEncarregado ? "encarregado" : "estudante");
      if (!idusuario) { window.location.href = "/Login"; return; }

      const userBase: User = {
        idusuario, nome: parsed.usuario?.nome ?? parsed.nome ?? "",
        email: parsed.usuario?.email ?? parsed.email ?? "",
        foto: parsed.usuario?.foto ?? parsed.foto, perfil: perfilNome,
        idInstituicao, instituicao: parsed.instituicao,
      };

      const buscarIban = (instId: number) => {
        fetch("http://localhost:5000/api/cadastro-instituicao")
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
            setUser({ ...userBase, codigoPlataforma: dados.codigo_plataforma ?? undefined, idInstituicao: idInstituicao ?? dados.idinstituicao });
            setNomeEducando(dados.nome_educando ?? null);
            const instId = idInstituicao ?? dados.idinstituicao;
            if (instId) buscarIban(instId); else setIban("Instituição não associada");
          })
          .catch(() => { setUser(userBase); setIban("Não disponível"); });
      } else {
        fetch(`http://localhost:5000/api/estudante/${idusuario}`)
          .then((r) => r.json())
          .then((dados) => { setUser({ ...userBase, codigoPlataforma: dados.codigo_plataforma ?? undefined }); })
          .catch(() => setUser(userBase));
        if (idInstituicao) buscarIban(idInstituicao); else setIban("Instituição não associada");
      }
    } catch { window.location.href = "/Login"; }
  }, []);

  // ─── Meses disponíveis para seleção (não pagos) ───────────────────────────
  const mesesDisponiveis = mesesDoAno.filter((m) => !mesesPagos.includes(m));

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* ── ÁREA DE CONTEÚDO PRINCIPAL ── */}
      {/* Quando nenhum método está selecionado: divide espaço com a imagem (lg).
          Quando método selecionado: ocupa a página toda com transição suave. */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-500 ease-in-out
          ${metodoSelecionado ? "lg:w-full" : "lg:w-1/2"}
        `}
      >
        <div className="flex-1 p-4 sm:p-6 md:p-8 xl:p-12">
          <div className={`
            mx-auto py-6 transition-all duration-500 ease-in-out
            ${metodoSelecionado ? "max-w-5xl" : "max-w-xl"}
          `}>

            {/* ── GRID INTERNO ── */}
            {/* Sem método: 1 coluna centrada. Com método: 2 colunas lado a lado. */}
            <div className={`
              grid gap-6 lg:gap-10 items-start transition-all duration-500
              ${metodoSelecionado
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
              }
            `}>

              {/* ── COLUNA ESQUERDA ── */}
              <div className="flex flex-col gap-5">

                <div>
                  <label className="block mb-1 font-bold text-gray-700 text-sm">Código</label>
                  <input
                    type="text"
                    value={user?.codigoPlataforma ?? "Aguardando aprovação"}
                    readOnly
                    className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>

                {perfil === "encarregado" && (
                  <div>
                    <label className="block mb-1 font-bold text-gray-700 text-sm">Educando</label>
                    <input
                      type="text"
                      value={nomeEducando ?? "Não associado"}
                      readOnly
                      className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                  <label className="block mb-3 font-bold text-gray-700 text-sm">
                    Como será feito o pagamento?
                  </label>
                  <div className="flex flex-col gap-3">
                    {["De forma digital", "No banco", "Dinheiro Físico"].map((m) => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer">
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
                    ))}
                  </div>
                </div>

                {/* ── Serviço, Período, Plataforma e Total (só sem método digital iframe) ── */}
                {pagamento.metodo !== "" && pagamento.metodo !== "Dinheiro Físico" && (
                  <div className="flex flex-col gap-4 animate-in fade-in">

                    {/* Serviço */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1 text-sm">
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
                            {s.nome} — {Number(s.valorservico).toLocaleString("pt-AO")} KZ
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Período com meses bloqueados */}
                    {isPropina && !mostrarComprovativo && (
                      <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in">
                        <label className="font-medium text-gray-700 text-sm">
                          Período de pagamento (propina):
                        </label>

                        {mesesPagos.length > 0 && (
                          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <span className="text-green-600 text-xs mt-0.5">✓</span>
                            <p className="text-xs text-green-700">
                              <strong>Já pagos:</strong> {mesesPagos.join(", ")}
                            </p>
                          </div>
                        )}

                        {mesesDisponiveis.length === 0 ? (
                          <div className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-3 text-center">
                            <p className="text-sm font-bold text-blue-700">
                              🎉 Todos os meses do ano já foram pagos!
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-3 items-center">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">De</label>
                                <select
                                  name="mesInicial"
                                  value={pagamento.mesInicial || primeiroMesDisponivel}
                                  onChange={handleChange}
                                  className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                                >
                                  {mesesDoAno.map((m) => (
                                    <option key={m} value={m} disabled={mesesPagos.includes(m)}>
                                      {m}{mesesPagos.includes(m) ? " ✓" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Até</label>
                                <select
                                  name="mesFinal"
                                  value={pagamento.mesFinal || primeiroMesDisponivel}
                                  onChange={handleChange}
                                  className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                                >
                                  {mesesDoAno.map((m) => (
                                    <option key={m} value={m} disabled={mesesPagos.includes(m)}>
                                      {m}{mesesPagos.includes(m) ? " ✓" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            {indexFim < indexInicio && (
                              <p className="text-xs text-red-500">
                                ⚠️ O mês final deve ser igual ou posterior ao mês inicial.
                              </p>
                            )}
                            <p className="text-xs text-blue-600 font-semibold">
                              {quantidadeMeses} mês(es) selecionado(s)
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Plataforma digital */}
                    {pagamento.metodo === "De forma digital" && !mostrarComprovativo && (
                      <div>
                        <label className="font-medium block mb-2 text-gray-700 text-sm">
                          Plataforma Digital:
                        </label>
                        <select
                          name="plataforma"
                          value={pagamento.plataforma}
                          onChange={handleChange}
                          className="p-3 border rounded-lg w-full bg-white text-sm"
                        >
                          <option value="">Selecione uma plataforma...</option>
                          <option value="Multicaixa Express" disabled={multicaixaSuspenso}>
                            Multicaixa Express{multicaixaSuspenso ? " — suspenso 24h 🔒" : ""}
                          </option>
                          <option value="Unitel Money">Unitel Money</option>
                          <option value="Pay Pay">Pay Pay</option>
                        </select>
                        {multicaixaSuspenso && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <Clock size={13} className="flex-shrink-0" />
                            Multicaixa Express suspenso por 24h devido a tentativas falhadas.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Totais */}
                    {!mostrarComprovativo && (
                      <div className="flex flex-col gap-2 animate-in fade-in">
                        {temMulta ? (
                          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4">
                            <p className="text-xs font-bold text-red-600 mb-3">
                              ⚠️ {mesesComMulta} mês{mesesComMulta > 1 ? "es" : ""} fora do prazo — multa aplicada
                            </p>
                            <div className="flex flex-col gap-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Propina ({quantidadeMeses} mês{quantidadeMeses > 1 ? "es" : ""})
                                </span>
                                <span className="font-semibold text-gray-800">
                                  KZ {valorBase.toLocaleString("pt-PT")},00
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-500">
                                  Multa ({mesesComMulta} mês{mesesComMulta > 1 ? "es" : ""} × KZ {multaBase.toLocaleString("pt-PT")})
                                </span>
                                <span className="font-semibold text-red-600">
                                  + KZ {multaTotal.toLocaleString("pt-PT")},00
                                </span>
                              </div>
                              {quantidadeMeses > mesesComMulta && (
                                <p className="text-[11px] text-gray-400 italic">
                                  {quantidadeMeses - mesesComMulta} mês{quantidadeMeses - mesesComMulta > 1 ? "es" : ""} sem multa (dentro do prazo)
                                </p>
                              )}
                              <div className="flex justify-between pt-2 border-t border-red-100 mt-1">
                                <span className="font-bold text-red-700">Total a pagar</span>
                                <span className="font-black text-red-700 text-lg">
                                  KZ {valorTotal.toLocaleString("pt-PT")},00
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <label className="block text-xs text-blue-500 font-semibold mb-1">
                              Total a pagar
                            </label>
                            <p className="text-2xl font-black text-blue-700">
                              KZ {valorTotal.toLocaleString("pt-PT")},00
                            </p>
                            <p className="text-xs text-blue-400 mt-1 italic">
                              {isPropina ? `${quantidadeMeses} mês(es)` : "1 serviço"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── COLUNA DIREITA (só aparece quando há método selecionado ≠ Dinheiro Físico) ── */}
              {metodoSelecionado && pagamento.metodo !== "Dinheiro Físico" && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">

                  {/* Iframe Multicaixa */}
                  {pagamento.plataforma === "Multicaixa Express" &&
                    pagamento.metodo === "De forma digital" && !mostrarComprovativo && (
                      <div className="animate-in zoom-in-95">
                        <div className="bg-blue-600 p-4 rounded-t-xl text-white font-bold flex items-center justify-between">
                          <span>Total: KZ {valorTotal.toLocaleString()}</span>
                          {temMulta && (
                            <span className="text-xs font-medium text-red-200">
                              (inclui multa de KZ {multaTotal.toLocaleString()})
                            </span>
                          )}
                        </div>
                        {!token ? (
                          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-b-xl text-red-700 text-sm">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                            <span>Sessão inválida. Por favor, faça login novamente.</span>
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
                            height="420"
                            className="border rounded-b-xl shadow-lg block"
                            allow="payment"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          />
                        )}
                        <button
                          onClick={() => {
                            setTransactionId(gerarIdTransacao());
                            setComprativoUrl(null);
                            setMostrarComprovativo(true);
                            toast.info("Comprovativo aberto manualmente (modo teste)");
                          }}
                          className="w-full mt-3 py-3.5 text-sm font-medium border-2 border-dashed border-[#184d8a]/30 hover:border-[#184d8a] rounded-2xl text-[#184d8a] transition-colors"
                        >
                          ✅ Já fiz o pagamento – Mostrar Comprovativo
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-1">
                          Se o comprovativo não apareceu automaticamente após pagar
                        </p>
                      </div>
                    )}

                  {/* Upload comprovativo (No banco) */}
                  {pagamento.metodo === "No banco" && !mostrarComprovativo && (
                    <div className="flex flex-col gap-4 animate-in fade-in">
                      <h3 className="font-bold text-gray-800 border-b pb-2 text-sm">
                        Dados para transferência
                      </h3>
                      <div>
                        <label className="font-medium block mb-2 text-gray-700 text-sm">
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
                        <label className="font-medium block mb-2 text-gray-700 text-sm">
                          Comprovativo de depósito
                        </label>
                        <label
                          htmlFor="fotoInput"
                          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#184d8a] transition-colors cursor-pointer overflow-hidden"
                        >
                          {image ? (
                            <img loading="lazy" src={image} alt="preview" className="h-36 object-contain rounded-lg" />
                          ) : (
                            <>
                              <ImagePlus className="w-8 h-8 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-500">Arraste ou clique para carregar</p>
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
                        onClick={handlePrepararComprovativo}
                        disabled={!imageFile || !pagamento.servicoId}
                        className={`py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          imageFile && pagamento.servicoId
                            ? "bg-primary text-white hover:bg-primary/85 shadow-md"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Receipt size={18} /> Gerar Comprovativo
                      </button>
                    </div>
                  )}

                  {/* Comprovativo final */}
                  {mostrarComprovativo && transactionId && (
                    <Comprovativo
                      transactionId={transactionId}
                      nomeAluno={user?.nome ?? "—"}
                      nomeServico={servicoAtual?.nome ?? "—"}
                      valorBase={valorBase}
                      multaTotal={multaTotal}
                      mesesComMulta={mesesComMulta}
                      valorTotal={valorTotal}
                      meses={quantidadeMeses}
                      metodo={pagamento.metodo}
                      instituicao={user?.instituicao ?? "—"}
                      processo={user?.processo}
                      comprativoImagem={comprativoUrl}
                      onConfirmar={handleEnviarFinal}
                      loading={loading}
                      isPropina={isPropina}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PAINEL DA IMAGEM DECORATIVA ──
          Só visível em desktop (lg+) e apenas quando nenhum método está selecionado.
          Usa transição de opacidade + largura para suavizar o desaparecimento. */}
      <div
        className={`
          hidden lg:flex items-center justify-center bg-gray-50 border-l
          transition-all duration-500 ease-in-out overflow-hidden
          ${metodoSelecionado
            ? "w-0 opacity-0 pointer-events-none border-0 p-0"
            : "w-1/2 opacity-100 p-8"
          }
        `}
      >
        <img
          src={img1}
          alt="Credit Card"
          className={`w-full max-w-sm transition-all duration-500 ${
            metodoSelecionado ? "opacity-0 scale-95" : "opacity-80 scale-100"
          }`}
        />
      </div>

      {/* ── MODAL: Dinheiro Físico ── */}
      {showModalDinheiro && (
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
                setShowModalDinheiro(false);
                setPagamento((p) => ({ ...p, metodo: "" }));
              }}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: Multicaixa ── */}
      {showModalMulticaixa && user && (
        <ModalMulticaixa
          userId={user.idusuario}
          onValidado={handleMulticaixaValidado}
          onCancelar={handleMulticaixaCancelar}
          onSuspender={handleMulticaixaSuspender}
        />
      )}
    </div>
  );
}