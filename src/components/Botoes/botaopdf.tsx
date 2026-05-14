import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

 
export default function BotaoPDF() {
      const [gerandoPDF, setGerandoPDF] = useState(false);
        const pdfRef = useRef<HTMLDivElement>(null);
          const [user, setUser] = useState<SessaoUsuario | null>(null);
        
       const sessao = exigirSessao();
          if (!sessao) return;
          setUser(sessao.usuario);

       const gerarPDF = async () => {
    const elemento = pdfRef.current;
    if (!elemento) return;
    setGerandoPDF(true);
    try {
      const canvas = await html2canvas(elemento, { scale: 2, useCORS: true });
      const imagem = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const largura = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();
      const alturaImagem = (canvas.height * largura) / canvas.width;
      let posY = 0;
      while (posY < alturaImagem) {
        if (posY > 0) pdf.addPage();
        pdf.addImage(imagem, "PNG", 0, -posY, largura, alturaImagem);
        posY += alturaPagina;
      }
      pdf.save(
        `relatorio_${user?.nome?.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    } finally {
      setGerandoPDF(false);
    }
  };
    
  return (
    <div className="mt-8 flex justify-end mb-6">
          <button
            onClick={gerarPDF}
            disabled={gerandoPDF}
            className="bg-primary text-white px-4 py-2.5 rounded-lg flex items-center gap-3 hover:bg-primary/80 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 disabled:opacity-60"
          >
            {gerandoPDF ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            <span className="font-bold">
              {gerandoPDF ? "A gerar PDF..." : "Exportar Relatório"}
            </span>
          </button>
        </div>
  );
}   