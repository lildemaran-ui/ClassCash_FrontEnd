import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  MessageSquare,
  Settings,
  LifeBuoy,
  Menu,
  Bell,
} from "lucide-react";
import Logo5 from "../../assets/Logo5.5.png";
import Avatar from "@/Componentes/Avatar/Avatar";

export default function Pagamentos() {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu_aberto");
    return saved === "true";
  });

  const [pagamento, setPagamento] = useState({
    metodo: "",
    servico: "Propina",
    mesInicial: "Janeiro",
    mesFinal: "Janeiro",
    plataforma: "PayPay",
    comprovativo: null,
  });

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

  const PRECOS_SERVICOS: { [key: string]: number } = {
    Propina: 15000,
    Justificativo: 2000,
    Transferência: 5000,
    Certificado: 2000,
    CartãodeEstudante: 1000,
    Uniforme: 12000,
  };

  // --- FUNÇÕES DE LÓGICA ---

  // UNIFICADA: Apenas uma função handleChange
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
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const OpenMenu = () => {
    setMenu(true);
    localStorage.setItem("menu_aberto", "true");
  };
  const CloseMenu = () => {
    setMenu(false);
    localStorage.setItem("menu_aberto", "false");
  };

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  // --- CÁLCULOS ---
  const precoBase = PRECOS_SERVICOS[pagamento.servico] || 0;
  const indexInicio = mesesDoAno.indexOf(pagamento.mesInicial);
  const indexFim = mesesDoAno.indexOf(pagamento.mesFinal);
  const quantidadeMeses =
    indexFim >= indexInicio ? indexFim - indexInicio + 1 : 1;
  const valorTotal = precoBase * quantidadeMeses;

  const formularioValido =
    pagamento.metodo !== "" && image !== null && indexFim >= indexInicio;

  if (!user) return <span>Carregado...</span>;

  const NavItem = ({
    icon,
    label,
    active = false,
  }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 mt-3 rounded-lg cursor-pointer transition-all duration-500 ${active ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans transition-all duration-500">
      {/* Sidebar */}
      {menu && (
        <aside className="w-64 bg-[#268cff] text-white flex-col block">
          <div className="mb-16 pt-4 flex relative justify-between items-center px-4">
            <Link
              to="/DashboardEstud"
              className="flex items-center font-semibold"
            >
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-16 h-16"
              />
              <span>ClassCash</span>
            </Link>
            <button onClick={CloseMenu}>
              <Menu size={22} />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link to="/DashboardEstud">
              <NavItem
                icon={<LayoutDashboard size={22} />}
                label="Painel"
                active={false}
              />
            </Link>
            <Link to="/Pagamentos">
              <NavItem
                icon={<Wallet size={22} />}
                label="Pagamentos"
                active={true}
              />
            </Link>
            <Link to="/reclamacoes">
              <NavItem
                icon={<MessageSquare size={22} />}
                label="Reclamações"
                active={false}
              />
            </Link>
            <Link to="/Config">
              <NavItem
                icon={<Settings size={22} />}
                label="Configurações"
                active={false}
              />
            </Link>
            <NavItem icon={<LifeBuoy size={22} />} label="Suporte" />
          </nav>
        </aside>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 p-4">
        {!menu && (
          <button onClick={OpenMenu}>
            <Menu size={22} className="text-[#268cff]" />
          </button>
        )}

        <header className="flex justify-end items-center mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={22} className="text-[#268cff]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <Avatar name={user.nome} src={user.foto} size="md" />
          </div>
        </header>
        <div className="px-4 md:px-20 py-10 max-w-7xl mx-auto">
          <div className="px-4 md:px-20 py-10 max-w-7xl mx-auto">
            {/* GRID PRINCIPAL: Envolve tudo para permitir que as colunas fiquem lado a lado desde o topo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* COLUNA ESQUERDA: Código, Método e Dados */}
              <div className="flex flex-col gap-8">
                {/* Bloco do Código */}
                <div>
                  <label className="block mb-1 font-medium text-gray-500">
                    Código
                  </label>
                  <input
                    type="text"
                    value="DVS-2025-KS"
                    readOnly
                    className="w-32 border bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>

                {/* Bloco do Método de Pagamento */}
                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm max-w-md">
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
                            className="w-4 h-4 accent-[#268cff]"
                          />
                          <span
                            className={`transition-colors ${pagamento.metodo === m ? "font-semibold text-[#268cff]" : "text-gray-600 group-hover:text-blue-400"}`}
                          >
                            {m}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Dados do Serviço (Apenas se for Digital ou Banco) */}
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
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        {Object.keys(PRECOS_SERVICOS).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lógica Condicional da Esquerda */}
                    {pagamento.metodo === "De forma digital" ? (
                      <div className="animate-in fade-in">
                        <label className="font-medium block mb-2 text-gray-700">
                          Plataforma a ser usada:
                        </label>
                        <select
                          name="plataforma"
                          value={pagamento.plataforma}
                          onChange={handleChange}
                          className="p-3 border rounded-lg w-full bg-white"
                        >
                          <option value="Multicaxa Express">
                            Multicaixa Express
                          </option>
                          <option value="Unitel Money">Unitel Money</option>
                          <option value="PayPay">Pay Pay</option>
                        </select>
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
                              className="w-full border rounded-lg px-3 py-2 bg-white"
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
                              className="w-full border rounded-lg px-3 py-2 bg-white"
                            >
                              {mesesDoAno.map((m) => (
                                <option key={m}>{m}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA: Finalização (Agora alinhada ao topo com o Código) */}
              <div className="flex flex-col gap-6">
                {(pagamento.metodo === "De forma digital" ||
                  pagamento.metodo === "No banco") && (
                  <div className="flex flex-col gap-6 animate-in fade-in">
                    <h3 className="font-bold text-gray-800 border-b pb-2">
                      Finalização
                    </h3>

                    {/* Período de Pagamento (Digital) */}
                    {pagamento.metodo === "De forma digital" && <div></div>}

                    {/* Resumo de Valores */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                      <label className="block text-sm text-blue-600 font-semibold tracking-wider">
                        Total a pagar
                      </label>
                      <div className="text-3xl font-black text-blue-700">
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
                      <div className="relative group w-full h-44 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white overflow-hidden transition-all hover:border-blue-400">
                        {image ? (
                          <img
                            loading="lazy"
                            src={image}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Wallet
                              className="mx-auto text-gray-300 mb-2"
                              size={32}
                            />
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
                      className={`py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
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

            {/* MODAL DE DINHEIRO FÍSICO (RESTAURADO) */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet size={32} />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    Pagamento Presencial
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Por favor, dirija-se à Secretaria da Instituição para
                    efetuar o pagamento em numerário.
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
        </div>
      </div>
    </div>
  );
}
