import ChartEstud from "@/components/Charts/ChartEstud";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle, Download, Pen } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function DadosDashEstd() {
  // No topo do componente:
  const navigate = useNavigate();
  const location = useLocation();
  const fromEncarregado =
    (location.state as { fromEncarregado?: boolean })?.fromEncarregado ?? false;

  const pdfRef = useRef<HTMLDivElement>(null);

  const gerarPDF = async () => {
    const elemento = pdfRef.current;
    if (!elemento) return;
    const canvas = await html2canvas(elemento, { scale: 2 });
    const imagem = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const largura = pdf.internal.pageSize.getWidth();
    const altura = (canvas.height * largura) / canvas.width;
    pdf.addImage(imagem, "PNG", 0, 0, largura, altura);
    pdf.save("relatorio.pdf");
  };

  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin && dadosDoLogin !== "undefined") {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return <span>Carregado...</span>;

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-bold whitespace-nowrap">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-0">
      {/* Botão Voltar — só aparece se veio do painel do encarregado */}
      {/* Só aparece quando vem do painel do encarregado */}
      {fromEncarregado && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-[#268cff] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar ao Painel
          </button>
        </div>
      )}
      <div ref={pdfRef}>
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8 transition-all duration-500">
          {/* Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
            <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gray-100 shrink-0">
              {user.foto ? (
                <img
                  loading="lazy"
                  src={user.foto}
                  alt={user.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#268cff] text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                  {(user.nome || "User")
                    .trim()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <p className="text-lg font-bold">{user.nome}</p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nº de processo:</strong> {user.processo}
              </p>
              {user.perfil === "Estudante" && (
                <p className="text-sm text-gray-600">
                  <strong>Classe:</strong> {user.classe}
                </p>
              )}
            </div>
          </div>

          {/* Editar + Situação Financeira */}
          <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
            <button
              onClick={() => setModal(true)}
              className="text-[#268cff] text-[16px] font-medium flex items-center gap-2 transition-all duration-500"
            >
              <Pen size={18} /> EDITAR PERFIL
            </button>

            <div className="bg-white p-5 rounded-xl border w-full sm:min-w-[250px] flex items-center gap-4">
              <CheckCircle size={40} className="text-green-600 shrink-0" />
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Situação Financeira
                </h3>
                <p className="text-green-600 text-sm font-medium">
                  Financeiramente está estável
                </p>
                <p className="text-xs text-gray-400">
                  Sem pagamentos em atraso
                </p>
              </div>
            </div>
          </div>
        </header>

        <hr className="mb-8 border-gray-200" />

        {/* Resumo + Gráfico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-6 text-gray-800">Resumo Financeiro:</h3>
            <div className="space-y-4">
              <SummaryRow label="Último pagamento:" value="09/11/2025" />
              <SummaryRow label="Próximo vencimento:" value="09/12/2025" />
              <SummaryRow label="Total pago no mês:" value="Kz 55.300,00" />
              <SummaryRow label="Total pago no ano:" value="Kz 313.000,00" />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <ChartEstud />
          </div>
        </div>

        {/* Tabela de Histórico */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              Histórico de pagamentos referente ao período selecionado
            </h3>
          </div>

          {/* Scroll horizontal em telas pequenas */}
          <div className="overflow-x-auto custom_scroll ">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[#268cff] text-white text-sm">
                <tr>
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium">Serviço</th>
                  <th className="p-4 font-medium">Valor</th>
                  <th className="p-4 font-medium">Multas</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="text-sm text-gray-600">
                    <td className="p-4">09/11/2025</td>
                    <td className="p-4">Propina</td>
                    <td className="p-4 font-medium text-gray-900">
                      Kz 31.300,00
                    </td>
                    <td className="p-4 text-gray-400">Kz 0,00</td>
                    <td className="p-4 text-green-500 font-medium">Em dia</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ProfileEditModal
          isOpen={Modal}
          onClose={() => setModal(false)}
          user={user}
        />
      </div>

      {/* Botão PDF */}
      <div className="mt-6 flex justify-center sm:justify-end">
        <button
          onClick={gerarPDF}
          className="bg-[#268cff] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all duration-500 w-full sm:w-auto justify-center"
        >
          <Download size={18} /> Gerar PDF
        </button>
      </div>
    </div>
  );
}
