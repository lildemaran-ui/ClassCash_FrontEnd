import { fetchComAuth } from "@/types/global/fetchComAuth";
import { exigirSessao } from "@/types/global/sessao";
import { MessageSquare, Send, Clock, CheckCircle, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avatar from "../Avatar/Avatar";

interface ReclamacaoProps {
  idreclamacao: number;
  titulo: string;
  nome: string;
  descricao: string;
  status: "Pendente" | "Resolvida";
  resposta?: string | null;
}

/* ── Respostas acumuladas formatadas ── */
// Cada resposta está no formato "[dd/mm/aaaa, hh:mm] texto\n\n[...] texto"
const RespostasAcumuladas = ({ texto }: { texto: string }) => {
  const blocos = texto.split(/\n\n(?=\[)/).filter(Boolean);
  return (
    <div className="flex flex-col gap-2 mt-2">
      {blocos.map((bloco, i) => {
        const match = bloco.match(/^\[(.+?)\]\s*([\s\S]*)$/);
        const data = match?.[1] ?? "";
        const mensagem = match?.[2]?.trim() ?? bloco;
        return (
          <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            {data && <p className="text-[10px] font-bold text-blue-400 mb-1">{data}</p>}
            <p className="text-xs text-blue-800 leading-relaxed">{mensagem}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ── Modal Editar ── */
const ModalEditar = ({
  rec, onClose, onSave,
}: {
  rec: ReclamacaoProps;
  onClose: () => void;
  onSave: (id: number, titulo: string, descricao: string) => Promise<void>;
}) => {
  const [titulo, setTitulo] = useState(rec.titulo);
  const [descricao, setDescricao] = useState(rec.descricao);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!titulo.trim() || !descricao.trim()) { toast.error("Preenche o assunto e a descrição."); return; }
    setSaving(true);
    await onSave(rec.idreclamacao, titulo, descricao);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-primary px-6 py-5 flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-lg">Editar Reclamação</h2>
            <p className="text-blue-200 text-sm mt-0.5">#{rec.idreclamacao}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"><X size={18} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Assunto</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Descrição</label>
            <textarea rows={5} value={descricao} onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#184d8a] focus:ring-2 focus:ring-[#184d8a]/10 transition-all resize-none" />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-[#1a5fad] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />A guardar...</> : <><Send size={16} />Guardar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Modal Cancelar ── */
const ModalCancelar = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Cancelar Reclamação</h2>
      <p className="text-gray-500 text-sm mb-6">Tens a certeza? Esta acção não pode ser revertida.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">Manter</button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all">Cancelar Reclamação</button>
      </div>
    </div>
  </div>
);

/* ── Card de Reclamação ── */
const statusConfig = {
  Resolvida: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  Pendente:  { color: "bg-amber-100 text-amber-700",  icon: Clock },
};

const ReclamacaoCard = ({
  rec, onEditar, onCancelar,
}: {
  rec: ReclamacaoProps;
  onEditar: (rec: ReclamacaoProps) => void;
  onCancelar: (id: number) => void;
}) => {
  const cfg = statusConfig[rec.status] ?? statusConfig.Pendente;
  const Icon = cfg.icon;
  const podeEditar = rec.status === "Pendente";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0"><MessageSquare size={15} className="text-[#184d8a]" /></div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{rec.titulo}</h3>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${cfg.color}`}>
          <Icon size={11} />{rec.status}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-500 pl-9">
        <span><span className="font-medium text-gray-700">Remetente:</span> {rec.nome}</span>
        <span><span className="font-medium text-gray-700">Descrição:</span> {rec.descricao}</span>
      </div>

      {/* ✅ Respostas acumuladas formatadas por data */}
      {rec.resposta && rec.resposta.trim() && (
        <div className="pl-9">
          <p className="text-xs font-semibold text-blue-700 mb-1">Resposta da Secretaria:</p>
          <RespostasAcumuladas texto={rec.resposta} />
        </div>
      )}

      {podeEditar && (
        <div className="flex gap-2 justify-end pt-1 border-t border-gray-50">
          <button onClick={() => onEditar(rec)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-[#184d8a] text-xs font-bold hover:bg-primary hover:text-white transition-all">
            <Pencil size={12} /> Editar
          </button>
          <button onClick={() => onCancelar(rec.idreclamacao)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={12} /> Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function ReclamacaoGeral() {
  const sessao = exigirSessao();
  const nomeEstudante = sessao?.usuario?.nome ?? "Estudante";
  const token = sessao?.token;


  const [listaReclamacoes, setListaReclamacoes] = useState<ReclamacaoProps[]>([]);
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modalEditar, setModalEditar] = useState<ReclamacaoProps | null>(null);
  const [modalCancelar, setModalCancelar] = useState<number | null>(null);

  const carregarReclamacoes = () => {
    setCarregando(true);
    fetchComAuth("http://localhost:5000/api/reclamacoes")
      .then((r) => r.json())
      .then((dados) => {
        setListaReclamacoes(dados.map((r: any) => ({
          idreclamacao: r.idreclamacao,
          titulo: r.titulo ?? r.descricao?.substring(0, 50),
          nome: r.nome,
          descricao: r.descricao,
          status: r.status === "Resolvida" ? "Resolvida" : "Pendente",
          resposta: r.resposta ?? null,
        })));
      })
      .catch((err) => console.error(err))
      .finally(() => setCarregando(false));
  };

  useEffect(() => { carregarReclamacoes(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assunto.trim() || !descricao.trim()) { toast.error("Preencha o assunto e a descrição."); return; }
    setEnviando(true);
    try {
      const response = await fetchComAuth("http://localhost:5000/api/reclamacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titulo: assunto, descricao, nome: nomeEstudante }),
      });
      if (response.ok) {
        toast.success("Reclamação enviada com sucesso!");
        setAssunto(""); setDescricao("");
        carregarReclamacoes();
      } else {
        const erro = await response.json();
        toast.error(`Erro: ${erro.erro || "Não foi possível enviar."}`);
      }
    } catch { toast.error("Não foi possível conectar ao servidor."); }
    finally { setEnviando(false); }
  };

  const handleEditar = async (id: number, titulo: string, descricao: string) => {
    try {
      const response = await fetchComAuth(`http://localhost:5000/api/reclamacoes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ titulo, descricao }),
      });
      if (response.ok) { toast.success("Reclamação actualizada!"); carregarReclamacoes(); }
      else { const erro = await response.json(); toast.error(`Erro: ${erro.erro || "Não foi possível actualizar."}`); }
    } catch { toast.error("Não foi possível conectar ao servidor."); }
  };

  const handleCancelar = async () => {
    if (!modalCancelar) return;
    try {
      const response = await fetchComAuth(`http://localhost:5000/api/reclamacoes/${modalCancelar}`, { method: "DELETE" });
      if (response.ok) { toast.success("Reclamação cancelada."); setModalCancelar(null); carregarReclamacoes(); }
      else { toast.error("Não foi possível cancelar a reclamação."); }
    } catch { toast.error("Não foi possível conectar ao servidor."); }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 w-full h-full">
      <div className="flex flex-col xl:flex-row xl:items-start gap-6 sm:gap-8 w-full">

        {/* Histórico */}
        <section className="flex flex-col gap-3 sm:gap-4 w-full xl:w-1/2 xl:sticky xl:top-6">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#184d8a]">Histórico de Reclamações</h2>
            <span className="bg-primary/10 text-[#184d8a] text-xs font-semibold px-2 py-0.5 rounded-full">{listaReclamacoes.length}</span>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {carregando ? (
              <p className="text-sm text-gray-400">A carregar...</p>
            ) : listaReclamacoes.length === 0 ? (
              <p className="text-sm text-gray-400">Sem reclamações registadas.</p>
            ) : (
              listaReclamacoes.map((item) => (
                <ReclamacaoCard key={item.idreclamacao} rec={item} onEditar={setModalEditar} onCancelar={setModalCancelar} />
              ))
            )}
          </div>
        </section>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full xl:w-1/2">
          <div className="bg-primary px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-white font-bold text-sm sm:text-base">Nova Reclamação</h2>
            <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">Preencha os campos abaixo. A sua identidade será associada à reclamação.</p>
          </div>
          <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Remetente</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
                <Avatar name={sessao?.usuario?.nome ?? "Estudante"} src={sessao?.usuario?.foto} size="sm" />
                <span className="text-sm font-medium text-gray-700 truncate">{nomeEstudante}</span>
                <span className="ml-auto text-[11px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">Automático</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assunto</label>
              <input required type="text" value={assunto} onChange={(e) => setAssunto(e.target.value)}
                placeholder="Ex: IBAN inválido, atraso no e-mail..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 outline-none focus:border-[#184d8a] focus:bg-white focus:ring-2 focus:ring-[#184d8a]/10 transition-all duration-200 placeholder:text-gray-400" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</label>
              <textarea rows={5} required value={descricao} onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva detalhadamente a sua reclamação..."
                className="w-full xl:min-h-[180px] bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 outline-none focus:border-[#184d8a] focus:bg-white focus:ring-2 focus:ring-[#184d8a]/10 transition-all duration-200 placeholder:text-gray-400 resize-none" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={enviando}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${enviando ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-[#1a5fa8]"}`}>
                <Send size={15} />
                {enviando ? "A enviar..." : "Enviar Reclamação"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {modalEditar && <ModalEditar rec={modalEditar} onClose={() => setModalEditar(null)} onSave={handleEditar} />}
      {modalCancelar !== null && <ModalCancelar onClose={() => setModalCancelar(null)} onConfirm={handleCancelar} />}
    </div>
  );
}