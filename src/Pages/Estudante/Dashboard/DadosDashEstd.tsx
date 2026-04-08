import Avatar from "@/components/Avatar/Avatar";
import ChartEstud from "@/components/Charts/ChartEstud";
import { Header } from "@/components/Header/header";
import { ProfileEditModal } from "@/components/profile_edit_modal";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Bell, CheckCircle, Download, Pen, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DadosDashEstd() {
  // No topo do componente:
  const navigate = useNavigate();
  const location = useLocation();
  const fromEncarregado =
    (location.state as { fromEncarregado?: boolean })?.fromEncarregado ?? false;
  const pdfRef = useRef<HTMLDivElement>(null);

  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (sessao) setUser(sessao.usuario);
  }, []);

  if (!user) return <>A verificar autenticação...</>;

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

  const SummaryRow = ({
    label,
    value,
    isLast,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center py-3 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <span className="text-gray-400 font-medium text-sm">{label}</span>
      <span className="text-gray-800 font-bold text-base">{value}</span>
    </div>
  );
  
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 bg-[#f8fafc] mb-8 ">
    
      <div ref={pdfRef} className="flex-1 overflow-y-auto min-w-0 top-0 space-y-8">
        <div className="flex items-end justify-end mt-3">
          <Link to="/Config">
        <button
          className="text-[#184d8a] hover:scale-110 transition-all p-1"
        >
          <Settings size={20} className="sm:hidden" />
          <Settings size={24} className="hidden sm:block" />
        </button></Link>

        {/* Sino de notificações */}
        <div className="relative cursor-pointer group p-1">
          <Bell
            size={20}
            className="text-[#184d8a] group-hover:scale-110 transition-transform sm:hidden"
          />
          <Bell
            size={24}
            className="text-[#184d8a] group-hover:scale-110 transition-transform hidden sm:block"
          />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white" />
        </div>
        </div>
        {/* Header Modernizado */}

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white transition-transform group-hover:scale-[1.02]">
                {user.foto ? (
                  <img
                    src={user.foto}
                    alt={user.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-[#184d8a] text-white shadow-inner text-4xl font-black">
                    {user.nome?.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => setModal(true)}
                className="absolute -bottom-0.5 -right-0.5 bg-white p-2 rounded-xl shadow-lg text-[#184d8a] hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <Pen size={16} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <span className="bg-blue-100 text-[#184d8a] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                {user.perfil}
              </span>
              <h1 className="text-3xl font-black text-gray-800 mt-2 tracking-tight">
                {user.nome}
              </h1>
              <div className="flex flex-col justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-gray-500 text-sm">
                <p>
                  <strong>Código:</strong> 
                </p>
                <p>
                  <strong>Classe:</strong> {user.classe}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Situação Rápida */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-4 shadow-sm min-w-[280px]">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Situação Financeira
              </h3>
              <p className="text-emerald-600 text-xs font-semibold">
                Conta Regularizada
              </p>
            </div>
          </div>
        </header>
        <div className="mt-8 flex justify-end">
          <button
            onClick={gerarPDF}
            className="bg-[#184d8a] text-white  px-4 py-2.5 rounded-lg  flex items-center gap-3 hover:bg-[#184d8a]/80 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            <Download size={20} />
            <span className="font-bold">Exportar Relatório</span>
          </button>
        </div>
        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Financeiro */}
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#184d8a] rounded-full"></span>
              Resumo Financeiro
            </h3>
            <div className="flex flex-col ">
              <SummaryRow label="Último pagamento" value="09/11/2025" />
              <SummaryRow label="Próximo vencimento" value="09/12/2025" />
              <SummaryRow label="Total pago (Mês)" value="Kz 55.300,00" />
              <SummaryRow
                label="Total acumulado"
                value="Kz 313.000,00"
                isLast
              />
            </div>
          </div>

          {/* Gráfico com mais espaço */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#184d8a] rounded-full"></span>
                Serviços pagos
              </h3>
            </div>
            <div className="h-[250px] w-full">
              <ChartEstud />
            </div>
          </div>
        </div>

        {/* Tabela "Glassmorphism" Style */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Histórico de Transações</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#184d8a]/80">
                <tr className="text-white text-xs uppercase tracking-widest">
                  <th className="px-8 py-4 font-semibold">Data</th>
                  <th className="px-8 py-4 font-semibold">Serviço</th>
                  <th className="px-8 py-4 font-semibold">Valor Total</th>
                  <th className="px-8 py-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3].map((i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5 text-sm font-medium text-gray-600">
                      09 Nov, 2025
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-800">
                      Propina Mensal
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-900">
                      Kz 31.300,00
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold">
                        PAGO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ações Inferiores */}

      <ProfileEditModal
        isOpen={Modal}
        onClose={() => setModal(false)}
        user={user}
      />
    </div>
  );
}
