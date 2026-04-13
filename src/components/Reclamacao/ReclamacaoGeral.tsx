import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao } from "@/types/global/sessao";
import { MessageSquare, Send, Clock, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ReclamacaoProps {
  titulo: string;
  nome: string;
  descricao: string;
  status: "Atendida" | "Pendente";
}

const statusConfig = {
  Atendida: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  Pendente: { color: "bg-amber-100 text-amber-700", icon: Clock },
};

const ReclamacaoCard = ({ titulo, nome, descricao, status }: ReclamacaoProps) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-[#184d8a]/10 p-2 rounded-lg shrink-0">
            <MessageSquare size={15} className="text-[#184d8a]" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{titulo}</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${cfg.color}`}
        >
          <Icon size={11} />
          <span>{status}</span>
        </span>
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-1 text-xs text-gray-500 pl-9">
        <span>
          <span className="font-medium text-gray-700">Remetente:</span> {nome}
        </span>
        <span className="sm:col-span-2 lg:col-span-2">
          <span className="font-medium text-gray-700">Descrição:</span> {descricao}
        </span>
      </div>
    </div>
  );
};

export default function ReclamacaoGeral() {
  const sessao = exigirSessao();
  const nomeEstudante = sessao?.usuario?.nome ?? "Estudante";
  const token = sessao?.token;

  const initials = nomeEstudante
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const [listaReclamacoes, setListaReclamacoes] = useState<ReclamacaoProps[]>([]);
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Carregar lista de reclamações
  const carregarReclamacoes = () => {
    setCarregando(true);
    fetch("http://localhost:5000/api/reclamacoes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((dados: Array<{ titulo: string; nome: string; descricao: string; status: string }>) => {
        const mapeadas: ReclamacaoProps[] = dados.map((r) => ({
          titulo: r.titulo,
          nome: r.nome,
          descricao: r.descricao,
          status: r.status === "atendida" ? "Atendida" : "Pendente",
        }));
        setListaReclamacoes(mapeadas);
      })
      .catch((err) => console.error("Erro ao carregar reclamações:", err))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarReclamacoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assunto.trim() || !descricao.trim()) {
      toast.error("Preencha o assunto e a descrição.");
      return;
    }

    setEnviando(true);
    try {
      const response = await fetchComAuth("http://localhost:5000/api/reclamacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descricao: `${assunto} — ${descricao}`,
          nome: nomeEstudante,
          visibilidade: "publico",
        }),
      });

      if (response.ok) {
        toast.success("Reclamação enviada com sucesso!");
        setAssunto("");
        setDescricao("");
        carregarReclamacoes(); // Recarrega a lista após envio
      } else {
        const erro = await response.json();
        toast.error(`Erro: ${erro.erro || "Não foi possível enviar."}`);
      }
    } catch (err) {
      console.error("Erro na conexão:", err);
      toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 w-full h-full">
      <div className="flex flex-col xl:flex-row xl:items-start gap-6 sm:gap-8 w-full">

        {/* Histórico */}
        <section className="flex flex-col gap-3 sm:gap-4 w-full xl:w-1/2 xl:sticky xl:top-6">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#184d8a]">Histórico de Reclamações</h2>
            <span className="bg-[#184d8a]/10 text-[#184d8a] text-xs font-semibold px-2 py-0.5 rounded-full">
              {listaReclamacoes.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {carregando ? (
              <p className="text-sm text-gray-400">A carregar...</p>
            ) : listaReclamacoes.length === 0 ? (
              <p className="text-sm text-gray-400">Sem reclamações registadas.</p>
            ) : (
              listaReclamacoes.map((item, index) => (
                <ReclamacaoCard key={index} {...item} />
              ))
            )}
          </div>
        </section>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full xl:w-1/2"
        >
          <div className="bg-[#184d8a] px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-white font-bold text-sm sm:text-base">Nova Reclamação</h2>
            <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">
              Preencha os campos abaixo. A sua identidade será associada à reclamação.
            </p>
          </div>

          <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
            {/* Remetente (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Remetente</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="w-7 h-7 rounded-full bg-[#184d8a] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{nomeEstudante}</span>
                <span className="ml-auto text-[11px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  Automático
                </span>
              </div>
            </div>

            {/* Assunto */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assunto</label>
              <input
                required
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Ex: IBAN inválido, atraso no e-mail..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 outline-none focus:border-[#184d8a] focus:bg-white focus:ring-2 focus:ring-[#184d8a]/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</label>
              <textarea
                rows={5}
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva detalhadamente a sua reclamação..."
                className="w-full xl:min-h-[180px] bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 outline-none focus:border-[#184d8a] focus:bg-white focus:ring-2 focus:ring-[#184d8a]/10 transition-all duration-200 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Botão */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={enviando}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
                  enviando
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#184d8a] hover:bg-[#1a5fa8]"
                }`}
              >
                <Send size={15} />
                {enviando ? "A enviar..." : "Enviar Reclamação"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}