import { Link } from "react-router-dom";
import {
  CreditCard,
  Receipt,
  Settings,
  MessageSquare,
  AlertOctagon,
  FileText,
  ScrollText,
  KeyIcon,
  School,
  InfoIcon,
  Search,
  Bell,
  CircleUser,
  Menu,
  Users,
  LayoutDashboard,
  Plus,
  Minus,
  Building2,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
  X,
} from "lucide-react";
import React from "react";
import Logo5 from "../../assets/Logo5.5.png";
export default function GestaoDeInstituicao() {
  const [expandedInstitutionId, setExpandedInstitutionId] = React.useState<
    number | null
  >(null);
  // NOVO: Estado para controlar a abertura do modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const toggleDetails = (id: number) => {
    setExpandedInstitutionId(expandedInstitutionId === id ? null : id);
  };

  const getButtonText = (id: number) => {
    return expandedInstitutionId === id ? "Esconder Detalhes" : "Detalhes";
  };

  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
  }: {
    icon: any;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg  ml-3 cursor-pointer transition-colors duration-500  ${
        active ? "bg-white/20 w-56  " : "hover:bg-white/10 w-56"
      }`}
    >
      <Icon size={22} className="text-white" />
      <span className="text-white font-medium text-sm">{label}</span>
    </div>
  );
  const [menu, setMenu] = React.useState(true);
  function OpenMenu() {
    setMenu(true);
  }
  function CloseMenu() {
    setMenu(false);
  }

  const [activeTab, setActiveTab] = React.useState("Instituições");

  // --- COMPONENTE: MODAL DE ADICIONAR INSTITUIÇÃO ---

  const AddInstitutionModal: React.FC<{
    onClose: () => void;
    formData: any;
    onchange: (e: any) => void;
  }> = ({ onClose, formData, onchange }) => {
    // Estado para a aba de Administrador
    const [createAdmin, setCreateAdmin] = React.useState(false);

    // Lista de tipos de instituição mock (com o valor inicial da imagem)
    const institutionTypes = [
      "Ensino Médio",
      "Ensino Superior",
      "Ensino Primário",
      "Centro de Formação",
    ];

    //Card para novos dados da instituição
    const [formulario, setFormulario] = React.useState({
      name: "",
      address: "",
      email: "",
      phone: "",
      nif: "",
      iban: "",
      type: "Ensino Médio",
      admin: createAdmin,
    });

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { id, value } = e.target;
      setFormulario((prev) => ({ ...prev, [id]: value }));
    };

    return (
      <div className="fixed inset-0 z-50 custom_scroll bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] custom_scroll transform transition-all">
          {/* Cabeçalho do Modal */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h1 className="text-xl font-bold text-gray-800">
              Adicionar Instituição
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Corpo do Formulário */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-6">
              Insira os dados da instituição e clique em "Concluir" para
              finalizar a operação.
            </p>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna 1: Dados Principais */}
              <div className="space-y-4 md:col-span-1">
                {/* Tipo de Instituição */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de Instituição
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-1"
                      defaultValue={institutionTypes[0]}
                    >
                      {institutionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
                  </div>
                </div>

                {/* Nome da Instituição */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome da Instituição
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formulario.name}
                    onChange={onchange}
                    placeholder="Ex: Colégio Caracol"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>

                {/* Email da Instituição */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email da Instituição
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formulario.email}
                    onChange={onchange}
                    placeholder="contacto@instituicao.ao"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>

                {/* Contacto da Instituição */}
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contacto da Instituição
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    value={formulario.phone}
                    onChange={onchange}
                    placeholder="+244 9XX XXX XXX"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>
              </div>

              {/* Coluna 2: Endereço, NIF e Logo */}
              <div className="space-y-4 md:col-span-1">
                {/* Endereço */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço da Instituição
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formulario.address}
                    onChange={onchange}
                    placeholder="Rua: Principal, nº X, Bairro - Cidade"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>

                {/* NIF */}
                <div>
                  <label
                    htmlFor="nif"
                    className="block text-sm font-medium text-gray-700"
                  >
                    NIF da Instituição
                  </label>
                  <input
                    type="text"
                    id="nif"
                    value={formulario.nif}
                    onChange={onchange}
                    placeholder="0000000000"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>

                {/* IBAN */}
                <div>
                  <label
                    htmlFor="iban"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IBAN da Instituição
                  </label>
                  <input
                    type="text"
                    id="iban"
                    value={formulario.iban}
                    onChange={onchange}
                    placeholder="AO06 XXXX XXXX XXXX XXXX XXXX"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                </div>

                {/* Área de Upload de Logo */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logotipo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Arraste ou clique para carregar a foto do logotipo
                    </p>
                  </div>
                </div>
              </div>

              {/* Coluna 3: Administrador Local (Opcional) */}
              <div className="md:col-span-1 border border-gray-200 rounded-xl p-4 bg-blue-50 self-start">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-800">
                    Criar Administrador Local
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAdmin}
                      onChange={() => setCreateAdmin(!createAdmin)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <p className="text-base text-gray-500 mb-4">
                  Se ativado, será criado um administrador local para gerir esta
                  instituição no sistema.
                </p>

                <div
                  className={`space-y-4 transition-opacity duration-500 ${createAdmin ? "opacity-100 block" : "opacity-50 pointer-events-none"}`}
                >
                  {/* Nome do Admin */}
                  <div>
                    <label
                      htmlFor="adminName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      id="adminName"
                      placeholder="Nome Completo"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                      disabled={!createAdmin}
                    />
                  </div>
                  {/* Email do Admin */}
                  <div>
                    <label
                      htmlFor="adminEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="adminEmail"
                      placeholder="admin.local@email.com"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                      disabled={!createAdmin}
                    />
                  </div>
                  {/* Contacto do Admin */}
                  <div>
                    <label
                      htmlFor="adminContact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contacto
                    </label>
                    <input
                      type="tel"
                      id="adminContact"
                      placeholder="9XX XXX XXX"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                      disabled={!createAdmin}
                    />
                  </div>
                  {/* Palavra-passe Provisória */}
                  <div>
                    <label
                      htmlFor="adminPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Palavra-passe (Provisória)
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      placeholder="Auto-gerada ou provisória"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
                      disabled={!createAdmin}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Rodapé do Modal (Botões de Ação) */}
          <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 sticky bottom-0">
            <button
              onClick={onClose}
              className="text-gray-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors mr-3"
            >
              Cancelar
            </button>
            <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              Concluir
            </button>
          </div>
        </div>
      </div>
    );
  };
  const mockInstitutions: Institution[] = [
    {
      id: 1,
      name: "Instituto Médio Politécnico Kibangas",
      address: "Rua: António Pedro Benje, nº 107, Vila-Alice - Luanda",
      email: "impc.kibangas@gmail.com",
      phone: "+244 923 000 000",
      status: "Ativo",
      totalPayment: "200,000 KZ",
      contactName: "Dr. João Silva",
      dateAdded: "01/01/2023",
    },
    {
      id: 2,
      name: "Colégio Caracol",
      address: "Rua da Liberdade, Vila-Alice - Luanda",
      email: "info@caracol.co.ao",
      phone: "911 111 111",
      status: "Ativo",
      totalPayment: "50,000 KZ",
      contactName: "Maria F.",
      dateAdded: "10/05/2023",
    },
    {
      id: 3,
      name: "Colégio Elizângela Filomena",
      address: "Avenida Ho-Chi-Min, Praça da Independência - Luanda",
      email: "elizangela@colegio.ao",
      phone: "922 222 222",
      status: "Inativo",
      totalPayment: "0 KZ",
      contactName: "Filomena L.",
      dateAdded: "03/03/2024",
    },
    {
      id: 4,
      name: "Centro MAPTESS",
      address: "Rua: B6, Rangel - Luanda",
      email: "contacto@maptess.gov.ao",
      phone: "933 333 333",
      status: "Ativo",
      totalPayment: "150,000 KZ",
      contactName: "Pedro S.",
      dateAdded: "15/07/2022",
    },
    {
      id: 5,
      name: "Centro Infantil Kiesse",
      address: "Bairro Nelito Soares, Rangel - Luanda",
      email: "kiesse.infantil@ao",
      phone: "944 444 444",
      status: "Ativo",
      totalPayment: "80,000 KZ",
      contactName: "Ana C.",
      dateAdded: "20/11/2023",
    },
    {
      id: 6,
      name: "Instituto Superior Politécnico de Ciências e Tecnologia - INSUTEC",
      address: "Gamek, Morro-Bento - Luanda",
      email: "insutec@edu.ao",
      phone: "955 555 555",
      status: "Ativo",
      totalPayment: "300,000 KZ",
      contactName: "Carlos M.",
      dateAdded: "01/09/2022",
    },
  ];

  // Componente para exibir os detalhes expandidos da instituição
  const ExpandedInstitutionDetails: React.FC<{ institution: Institution }> = ({
    institution,
  }) => {
    const isPositiveTrend = true; // Mock para a seta

    return (
      <div className="mt-4 p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 items-start">
          {/* Coluna 1: Logo e Informações Básicas de Contato */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              {/* Logo/Ícone repetido */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 border border-indigo-300 mr-4 flex-shrink-0">
                <Building2 className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Nome da Instituição
                </p>
                <p className="text-base text-gray-600">{institution.name}</p>
              </div>
            </div>
            <div className="space-y-1 ml-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span>{institution.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                <span>{institution.phone}</span>
              </div>
              <p className="text-base text-gray-500 mt-2 ml-6">
                <span className="font-semibold">Endereço:</span>{" "}
                {institution.address}
              </p>
            </div>
          </div>

          {/* Coluna 2: Detalhes do Contrato */}
          <div className="grid grid-cols-2 gap-4 text-sm border-l border-gray-200 pl-8 h-full">
            <div className="space-y-1">
              <p className="font-medium text-gray-600">
                Responsável de Contato
              </p>
              <p className="text-gray-800">{institution.contactName}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-600">Data de adesão</p>
              <div className="flex items-center text-gray-800">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span>{institution.dateAdded}</span>
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="font-medium text-gray-600">Licença de software</p>
              <p className="text-gray-800">Mensal / Anual / Completa (Mock)</p>
            </div>
          </div>

          {/* Coluna 3: Status e Pagamento */}
          <div className="flex flex-col space-y-4 items-end text-sm border-l border-gray-200 pl-8">
            <div className="flex flex-col items-end">
              <p className="font-medium text-gray-600">Status</p>
              <div
                className={`flex items-center font-bold mt-1 ${institution.status === "Ativo" ? "text-green-600" : "text-red-600"}`}
              >
                {institution.status === "Ativo" ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                {institution.status}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className="font-medium text-gray-600">Total de Pagamento</p>
              <div className="flex items-center text-xl font-bold text-gray-900 mt-1">
                <span className="text-base text-gray-600">KZ</span>
                <span className="ml-1">
                  {institution.totalPayment.replace(" KZ", "")}
                </span>
                {isPositiveTrend ? (
                  <ArrowUp className="w-4 h-4 ml-1 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 ml-1 text-red-500" />
                )}
              </div>
            </div>

            <button className="bg-blue-600 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4">
              Editar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex  bg-gray-50 font-sans ">
      {/* Sidebar */}

      {menu && (
        <aside className="w-64 bg-[#268cff] flex flex-col sticky top-0 h-screen ">
          <div className="px-4 pt-4 mb-10 flex items-center gap-2 relative justify-between">
            <div className=" flex items-center">
              <img
                loading="lazy"
                src={Logo5}
                alt="Logo"
                className="w-16 h-16 "
              />
              <p className="text-white font-semibold">ClassCash</p>
            </div>
            <button>
              <Menu size={22} className="text-white" onClick={CloseMenu} />
            </button>
          </div>
          <nav className="max-h-screen overflow-y-auto  custom_scroll flex flex-col gap-1 text-white">
            {" "}
            <Link to="/Administradores">
              <SidebarItem
                icon={LayoutDashboard}
                label="Painel Geral"
                active={false}
              />
            </Link>
            <div
              className="
                       flex flex-col"
            >
              <Link to="/GestaoEstudantes">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Estudantes"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Encarregados"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={School}
                  label="Gestão de Instituições"
                  active={true}
                />
              </Link>
              <Link to="/GestaoDeUsuarios">
                <SidebarItem
                  icon={Users}
                  label="Gestão de Usuarios"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={CreditCard}
                  label="Gestão de Propinas"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={Receipt}
                  label="Gestão de Pagamentos"
                  active={false}
                />
              </Link>

              <Link to="">
                <SidebarItem
                  icon={Settings}
                  label="Gestão de Serviços"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={MessageSquare}
                  label="Gestão de Reclamações"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={AlertOctagon}
                  label="Gestão de Multas"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={FileText}
                  label="Gestão de Relatórios"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={KeyIcon}
                  label="Permissões e Acessos"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={ScrollText}
                  label="Logs de Atividades"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={InfoIcon}
                  label="Suporte e Ajuda"
                  active={false}
                />
              </Link>
              <Link to="">
                <SidebarItem
                  icon={Settings}
                  label="Configurações"
                  active={false}
                />
              </Link>
            </div>
          </nav>
        </aside>
      )}

      {/* Conteúdo Principal */}
      <div className="flex flex-col flex-1 custom_scroll">
        <div className="flex items-center justify-between z-50 top-0  p-6 sticky h-22 mb-5 bg-translucido">
          <div className="flex items-center gap-6">
            {!menu && (
              <button
                onClick={OpenMenu}
                className="text-[#268cff] hover:bg-blue-50 p-2 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            )}
            <h1 className="text-xl font-bold  text-[#268cff]">
              Gestão de Instituição
            </h1>
          </div>
          {/* Header (Topo) */}
          <header className=" ">
            <h1 className="text-xl font-bold text-[#268cff]">{}</h1>
            <div className="flex items-center space-x-4">
              {/* Campo de Pesquisa */}
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#268cff]/20 outline-none transition-all"
                />
              </div>

              {/* Ícones de Notificação e Perfil */}
              <div className="relative cursor-pointer">
                <Bell className="text-[#268cff] group-hover:scale-110 transition-transform " />
                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              </div>
              <CircleUser className="w-8 h-8 text-[#268cff] hover:text-blue-600" />
            </div>
          </header>
        </div>

        <main className="p-6 md:p-8">
          <div className="bg-white p-6 rounded-xl border  border-gray-200">
            {/* Ações e Botões */}
            <div className="flex justify-end space-x-3 mb-6">
              <button
                onClick={() => setIsModalOpen(true)} // ABRIR MODAL
                className="flex items-center bg-[#268cff] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-700 shadow-md "
              >
                <Plus className="w-4 h-4 mr-2 " />
                Adicionar
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                <Minus className="w-4 h-4 mr-2 text-red-600" />
                Remover
              </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("Instituições")}
                className={`py-2 px-4 text-base font-medium transition-colors ${
                  activeTab === "Instituições"
                    ? "border-b-2 border-[#268cff] text-[#268cff]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Instituições
              </button>
            </div>

            {/* Conteúdo da Lista de Instituições */}
            {activeTab === "Instituições" && (
              <div className="divide-y divide-gray-200">
                {mockInstitutions.map((inst) => (
                  <div key={inst.id} className="pt-4 pb-4">
                    {/* Linha Principal da Instituição */}
                    <div
                      className={`flex items-start transition-colors ${
                        expandedInstitutionId === inst.id
                          ? "pb-4"
                          : "hover:bg-blue-50 cursor-pointer rounded-lg p-2 -mx-2"
                      }`}
                    >
                      {/* Placeholder para Logo */}
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 mr-4 flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#268cff]" />
                      </div>
                      {/* Detalhes e Endereço */}
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {inst.name}
                        </h3>
                        <p className="text-sm text-gray-500">{inst.address}</p>
                      </div>
                      {/* Botão Detalhes */}
                      <button
                        onClick={() => toggleDetails(inst.id)}
                        className="ml-4 text-sm font-medium py-1 px-3 rounded-lg border border-[#268cff] text-[#268cff] hover:bg-blue-50 transition-colors flex-shrink-0"
                      >
                        {getButtonText(inst.id)}
                      </button>
                    </div>

                    {/* Painel de Detalhes Expandido (Condicional) */}
                    {expandedInstitutionId === inst.id && (
                      <ExpandedInstitutionDetails institution={inst} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RENDERIZAÇÃO DO MODAL (Condicional) */}
          {isModalOpen && (
            <AddInstitutionModal onClose={() => setIsModalOpen(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
