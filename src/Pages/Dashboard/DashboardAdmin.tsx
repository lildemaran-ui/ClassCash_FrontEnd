import logo from "../../assets/Logo5.5.png";
import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  ScrollText,
  Settings,
  Search,
  Bell,
  CircleUser,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Building2,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Clock,
  User, // Ícone para Configurações de Perfil
  Lock, // Ícone para Configurações de Segurança
  BellRing, // Ícone para Configurações de Notificações
  UploadCloud, // Ícone para upload de logo
  X,
  Shell, // Ícone de fechar modal
} from 'lucide-react';

// --- DADOS MOCK (Simulação de Dados para o Dashboard) ---

interface Metric {
  title: string;
  value: string;
  unit?: string;
  trend: number;
  trendText?: string;
  isKz?: boolean;
}

interface MiniMetric {
  title: string;
  trend: number;
}

const mainMetrics: Metric[] = [
  { title: "Total de instituições", value: "12", unit: "No último mês", trend: 50, trendText: "+50", isKz: false },
  { title: "Total de estudantes", value: "1,000", unit: "No último mês", trend: 95, trendText: "+30", isKz: false },
  { title: "Total de Encarregados", value: "1,500", unit: "No último mês", trend: 10, trendText: "+10", isKz: false },
  { title: "Total de Administradores", value: "2", unit: "No último mês", trend: 0, trendText: "sem alteração", isKz: false },
  { title: "Orçamento total", value: "200,000", unit: "KZ", trend: 5, trendText: "+10,000", isKz: true },
  
];

const miniMetrics: MiniMetric[] = [
  { title: "Estudantes Ativos", trend: 30 },
  { title: "Estudantes Inativos", trend: -60 },
  { title: "Alunos Recadastrados", trend: 10 },
  { title: "Novos Ingressos", trend: 20 },
];



// --- DADOS MOCK (Simulação de Dados para Gestão de Instituições) ---

interface Institution {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  totalPayment: string;
  contactName: string;
  dateAdded: string;
}

const mockInstitutions: Institution[] = [
  { 
    id: 1, 
    name: "Instituto Médio Politécnico Kibangas", 
    address: "Rua: António Pedro Benje, nº 107, Vila-Alice - Luanda",
    email: "impc.kibangas@gmail.com",
    phone: "+244 923 000 000",
    status: 'Ativo',
    totalPayment: "200,000 KZ",
    contactName: "Dr. João Silva",
    dateAdded: "01/01/2023",
  },
  { id: 2, name: "Colégio Caracol", address: "Rua da Liberdade, Vila-Alice - Luanda", email: "info@caracol.co.ao", phone: "911 111 111", status: 'Ativo', totalPayment: "50,000 KZ", contactName: "Maria F.", dateAdded: "10/05/2023" },
  { id: 3, name: "Colégio Elizângela Filomena", address: "Avenida Ho-Chi-Min, Praça da Independência - Luanda", email: "elizangela@colegio.ao", phone: "922 222 222", status: 'Inativo', totalPayment: "0 KZ", contactName: "Filomena L.", dateAdded: "03/03/2024" },
  { id: 4, name: "Centro MAPTESS", address: "Rua: B6, Rangel - Luanda", email: "contacto@maptess.gov.ao", phone: "933 333 333", status: 'Ativo', totalPayment: "150,000 KZ", contactName: "Pedro S.", dateAdded: "15/07/2022" },
  { id: 5, name: "Centro Infantil Kiesse", address: "Bairro Nelito Soares, Rangel - Luanda", email: "kiesse.infantil@ao", phone: "944 444 444", status: 'Ativo', totalPayment: "80,000 KZ", contactName: "Ana C.", dateAdded: "20/11/2023" },
  { id: 6, name: "Instituto Superior Politécnico de Ciências e Tecnologia - INSUTEC", address: "Gamek, Morro-Bento - Luanda", email: "insutec@edu.ao", phone: "955 555 555", status: 'Ativo', totalPayment: "300,000 KZ", contactName: "Carlos M.", dateAdded: "01/09/2022" },
];

// --- DADOS MOCK (Simulação de Dados para Administradores) ---

interface Administrator {
  id: number;
  name: string;
  email: string;
  institution: string;
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  contact: string;
}

const mockAdministrators: Administrator[] = [
  { id: 1, name: "Paula Garra", email: "paula.garra@email.com", institution: "Kibangas", status: 'Ativo', contact: '927863909' },
  { id: 2, name: "João Viana", email: "joao.viana@email.com", institution: "Colégio Caracol", status: 'Ativo', contact: '923123456' },
  { id: 3, name: "Filomena Silva", email: "filomena.silva@email.com", institution: "Elizângela Filomena", status: 'Bloqueado', contact: '911987654' },
  { id: 4, name: "Pedro Tomás", email: "pedro.tomas@email.com", institution: "MAPTESS", status: 'Ativo', contact: '922555777' },
  { id: 5, name: "Marta Correia", email: "marta.correia@email.com", institution: "Kibangas", status: 'Pendente', contact: '933444111' },
];

// --- DADOS MOCK (Simulação de Dados para Logs) ---

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'INFO' | 'AVISO' | 'ERRO';
    user: string;
    action: string;
    details: string;
}

const mockLogs: LogEntry[] = [
    { id: 1, timestamp: "2024-11-28 14:30:00", level: 'INFO', user: "Paula Garra (Admin)", action: "Criação de Conta", details: "Instituição 'Novo Horizonte' adicionada com sucesso." },
    { id: 2, timestamp: "2024-11-28 14:05:22", level: 'AVISO', user: "Sistema", action: "Falha de Login", details: "Tentativa falhada de login para 'joao.viana@email.com' (IP: 192.168.1.1)." },
    { id: 3, timestamp: "2024-11-27 09:15:45", level: 'ERRO', user: "Sistema", action: "Processamento de Pagamento", details: "Falha ao processar pagamento KZ 50,000 para 'Colégio Caracol'. Código de erro: P_004." },
    { id: 4, timestamp: "2024-11-26 18:50:10", level: 'INFO', user: "Pedro Tomás (Admin)", action: "Atualização de Status", details: "Status de 'Filomena Silva' alterado para 'Bloqueado'." },
    { id: 5, timestamp: "2024-11-25 10:00:00", level: 'INFO', user: "Sistema", action: "Backup Diário", details: "Backup da base de dados concluído com sucesso." },
    { id: 6, timestamp: "2024-11-24 16:20:05", level: 'AVISO', user: "Marta Correia (Admin)", action: "Modificação de Dados", details: "Email da Instituição 'Kibangas' alterado para 'impc.novo@gmail.com'." },
];


// --- COMPONENTES REUTILIZÁVEIS ---

// Componente para o item de navegação lateral
const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center p-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-700 text-white border-l-4 border-white'
        : 'text-blue-200 hover:bg-blue-700/50 hover:text-white border-l-4 border-transparent'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 mr-3' })}
    {label}
  </a>
);

// Componente para o card de métrica principal
const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const isPositive = metric.trend >= 0;

  return (
    <div className="bg-white p-6 rounded-xl border  flex flex-col justify-between h-36">
      <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
      <div className="text-2xl font-bold text-gray-900 mt-1">
        {metric.isKz && <span className="text-xl">KZ </span>}
        {metric.value}
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">{metric.unit}</div>
        <div
          className={`flex items-center text-sm font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          {metric.trendText}
        </div>
      </div>
    </div>
  );
};

// Componente para o card de mini métrica (apenas tendência)


// Componente para simular o gráfico de barras horizontais (Análise Gráfico)
const VerticalBarChartSimulation: React.FC = () => {
  // Dados simulados (rótulo, valor percentual, cor)
  const data = [
    { label: "Total de instituições", value: 75, color: 'bg-[#268cff]' },
    { label: "Total de estudantes", value: 50, color: 'bg-[#268cff]' },
    { label: "Total de encarregados", value: 30, color: 'bg-[#268cff]' },
    { label: "Total de Administradores", value: 90, color: 'bg-[#268cff]' },
    {label: "Total de Orçamento", value: 60, color: 'bg-[#268cff]' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border mt-6 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 p-2">Análise Gráfico</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-48 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 ml-4">
              <div
                className={`${item.color} h-6 rounded-r-md transition-all duration-500`}
                style={{ width: `${item.value}%` }}
              />
            </div>
            <div className="ml-4 text-sm font-medium text-gray-700 w-10 text-right">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para simular o gráfico de barras mensais (Gráfico dos meses)
const MonthlyBarChartSimulation: React.FC = () => {
  const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const values = [40, 65, 80, 5, 95, 20, 40, 60, 50, 5, 45, 35]; // Altura da barra (0 a 100)

  return (
    <div className="bg-white p-8 rounded-xl border mt-6 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-8">Gráfico dos meses com mais cadastros</h2>
      <div className="flex items-end h-64 border-l border-b border-gray-300 relative">
        {/* Linhas de grade e valores Y simulados */}
        {[0, 20, 40, 60, 80, 100].map(y => (
          <div key={y} className="absolute left-0 w-full text-xs text-gray-500 " style={{ bottom: `${y}%`, transform: 'translateY(50%)' }}>
            {y}%
            {y > 0 && <div className="absolute left-0 bottom-0 w-full border-t border-gray-200 -z-10" />}
          </div>
        ))}

        {/* Barras de dados */}
        {values.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center h-full justify-end relative z-10"
            style={{ width: `${100 / months.length}%` }}
          >
            <div
              className="w-12 bg-[#268CFF] hover:bg-blue-600 transition-all duration-300 rounded-t-md"
              style={{ height: `${value}%` }}
              title={`${months[index]}: ${value} cadastros`}
            />
          </div>
        ))}
      </div>
      {/* Rótulos dos meses X */}
      <div className="flex justify-between -mt-px border-t border-gray-300 pt-1">
        {months.map((month, index) => (
          <div key={index} className="text-xs text-gray-600 font-medium text-center" style={{ width: `${100 / months.length}%` }}>
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CONTEÚDO DA PÁGINA: DASHBOARD ---

const   DashboardContent: React.FC = () => (
  <main className="p-6 md:p-8 space-y-8">
    {/* Seção de Filtros e Alerta */}
    <div className="bg-white p-6 border rounded-xl ">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <div className="flex items-center text-lg font-semibold text-gray-700">
          <Bell className="w-6 h-6 mr-2  " />
          Alerta das Instituições
        </div>
        <button className="bg-[#268cff] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-700 shadow-md">
          Ver Alertas
        </button>
      </div>
    </div>

{/* Filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Ano', 'Semestre', 'Mês', 'Instituição'].map((filter) => (
          <div key={filter} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{filter}</label>
            <div className="relative">
              <select
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="Sem Filtro"
              >
                <option>Sem Filtro</option>
                <option>Filtro A</option>
                <option>Filtro B</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    {/* Cartões de Métricas Principais (Linha 1) */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {mainMetrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>

    {/* Seção de Gráficos e Cartões de Tendência */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna do Gráfico Vertical */}
      <div className="lg:col-span-2">
        <VerticalBarChartSimulation />
      </div>

      {/* Coluna dos Mini-Cartões de Tendência (Topo) */}
     
     
    </div>


    <div className="space-y-6 ">
     

      {/* Gráfico de Meses (Horizontal Bar Chart) */}
      <MonthlyBarChartSimulation />
    </div>
  </main>
);


// Componente para exibir os detalhes expandidos da instituição
const ExpandedInstitutionDetails: React.FC<{ institution: Institution }> = ({ institution }) => {
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
              <p className="text-sm font-semibold text-gray-800">Nome da Instituição</p>
              <p className="text-xs text-gray-600">{institution.name}</p>
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
             <p className="text-xs text-gray-500 mt-2 ml-6">
               <span className="font-semibold">Endereço:</span> {institution.address}
             </p>
          </div>
        </div>

        {/* Coluna 2: Detalhes do Contrato */}
        <div className="grid grid-cols-2 gap-4 text-sm border-l border-gray-200 pl-8 h-full">
            <div className="space-y-1">
                <p className="font-medium text-gray-600">Responsável de Contato</p>
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
                <div className={`flex items-center font-bold mt-1 ${institution.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                    {institution.status === 'Ativo' ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                    {institution.status}
                </div>
            </div>

            <div className="flex flex-col items-end">
                <p className="font-medium text-gray-600">Total de Pagamento</p>
                <div className="flex items-center text-xl font-bold text-gray-900 mt-1">
                    <span className="text-base text-gray-600">KZ</span>
                    <span className="ml-1">{institution.totalPayment.replace(' KZ', '')}</span>
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

// --- COMPONENTE: MODAL DE ADICIONAR INSTITUIÇÃO ---

const AddInstitutionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Estado para a aba de Administrador
    const [createAdmin, setCreateAdmin] = React.useState(false);
    
    // Lista de tipos de instituição mock (com o valor inicial da imagem)
    const institutionTypes = ["Ensino Médio", "Ensino Superior", "Ensino Primário", "Centro de Formação"];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
                
                {/* Cabeçalho do Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Adicionar Instituição</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Corpo do Formulário */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                        Insira os dados da instituição e clique em "Concluir" para finalizar a operação.
                    </p>
                    
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Coluna 1: Dados Principais */}
                        <div className="space-y-4 md:col-span-1">
                            {/* Tipo de Instituição */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Instituição</label>
                                <div className="relative">
                                    <select
                                        id="type"
                                        className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-1"
                                        defaultValue={institutionTypes[0]}
                                    >
                                        {institutionTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
                                </div>
                            </div>

                            {/* Nome da Instituição */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Instituição</label>
                                <input type="text" id="name" placeholder="Ex: Colégio Caracol" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>
                            
                            {/* Email da Instituição */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email da Instituição</label>
                                <input type="email" id="email" placeholder="contacto@instituicao.ao" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>
                            
                            {/* Contacto da Instituição */}
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contacto da Instituição</label>
                                <input type="tel" id="contact" placeholder="+244 9XX XXX XXX" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>
                        </div>

                        {/* Coluna 2: Endereço, NIF e Logo */}
                        <div className="space-y-4 md:col-span-1">
                            {/* Endereço */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço da Instituição</label>
                                <input type="text" id="address" placeholder="Rua: Principal, nº X, Bairro - Cidade" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>
                            
                            {/* NIF */}
                            <div>
                                <label htmlFor="nif" className="block text-sm font-medium text-gray-700">NIF da Instituição</label>
                                <input type="text" id="nif" placeholder="0000000000" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>
                            
                            {/* IBAN */}
                            <div>
                                <label htmlFor="iban" className="block text-sm font-medium text-gray-700">IBAN da Instituição</label>
                                <input type="text" id="iban" placeholder="AO06 XXXX XXXX XXXX XXXX XXXX" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" />
                            </div>

                            {/* Área de Upload de Logo */}
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Arraste ou clique para carregar a foto do logotipo</p>
                                </div>
                            </div>
                        </div>

                        {/* Coluna 3: Administrador Local (Opcional) */}
                        <div className="md:col-span-1 border border-gray-200 rounded-xl p-4 bg-blue-50 self-start">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-gray-800">Criar Administrador Local</h4>
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

                            <p className="text-xs text-gray-500 mb-4">
                                Se ativado, será criado um administrador local para gerir esta instituição no sistema.
                            </p>

                            <div className={`space-y-4 transition-opacity duration-300 ${createAdmin ? 'opacity-100 block' : 'opacity-50 pointer-events-none'}`}>
                                {/* Nome do Admin */}
                                <div>
                                    <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input type="text" id="adminName" placeholder="Nome Completo" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" disabled={!createAdmin} />
                                </div>
                                {/* Email do Admin */}
                                <div>
                                    <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="adminEmail" placeholder="admin.local@email.com" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" disabled={!createAdmin} />
                                </div>
                                {/* Contacto do Admin */}
                                <div>
                                    <label htmlFor="adminContact" className="block text-sm font-medium text-gray-700">Contacto</label>
                                    <input type="tel" id="adminContact" placeholder="9XX XXX XXX" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" disabled={!createAdmin} />
                                </div>
                                {/* Palavra-passe Provisória */}
                                <div>
                                    <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Palavra-passe (Provisória)</label>
                                    <input type="password" id="adminPassword" placeholder="Auto-gerada ou provisória" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 mt-1" disabled={!createAdmin} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Rodapé do Modal (Botões de Ação) */}
                <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                    <button onClick={onClose} className="text-gray-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors mr-3">
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


// --- CONTEÚDO DA PÁGINA: GESTÃO DE INSTITUIÇÕES ---

const InstitutionManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Instituições');
  const [expandedInstitutionId, setExpandedInstitutionId] = React.useState<number | null>(null);
  // NOVO: Estado para controlar a abertura do modal
  const [isModalOpen, setIsModalOpen] = React.useState(false); 

  const toggleDetails = (id: number) => {
    setExpandedInstitutionId(expandedInstitutionId === id ? null : id);
  };

  const getButtonText = (id: number) => {
    return expandedInstitutionId === id ? 'Esconder Detalhes' : 'Detalhes';
  };

  return (
    <main className="p-6 md:p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Ações e Botões */}
        <div className="flex justify-end space-x-3 mb-6">
          <button 
            onClick={() => setIsModalOpen(true)} // ABRIR MODAL
            className="flex items-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </button>
          <button className="flex items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
            <Minus className="w-4 h-4 mr-2 text-red-500" />
            Remover
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('Instituições')}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'Instituições'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Instituições
          </button>
          <button
            onClick={() => setActiveTab('Perfil')}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'Perfil'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Perfil
          </button>
        </div>

        {/* Conteúdo da Lista de Instituições */}
        {activeTab === 'Instituições' && (
          <div className="divide-y divide-gray-200">
            {mockInstitutions.map((inst, index) => (
              <div key={inst.id} className="pt-4 pb-4">
                {/* Linha Principal da Instituição */}
                <div
                  className={`flex items-start transition-colors ${
                    expandedInstitutionId === inst.id ? 'pb-4' : 'hover:bg-blue-50 cursor-pointer rounded-lg p-2 -mx-2'
                  }`}
                >
                  {/* Placeholder para Logo */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 mr-4 flex-shrink-0">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  {/* Detalhes e Endereço */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{inst.name}</h3>
                    <p className="text-sm text-gray-500">{inst.address}</p>
                  </div>
                  {/* Botão Detalhes */}
                  <button
                    onClick={() => toggleDetails(inst.id)}
                    className="ml-4 text-sm font-medium py-1 px-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
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

        {/* Conteúdo da Aba Perfil (Placeholder) */}
        {activeTab === 'Perfil' && (
          <div className="p-4 text-gray-500 italic">
            Visualização de perfil ou configurações de instituição viria aqui.
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO DO MODAL (Condicional) */}
      {isModalOpen && <AddInstitutionModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
};


// --- CONTEÚDO DA PÁGINA: ADMINISTRADORES ---

const AdministratorsPage: React.FC = () => {
  return (
    <main className="p-6 md:p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Ações e Botões */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="flex items-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </button>
          <button className="flex items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
            <Minus className="w-4 h-4 mr-2 text-red-500" />
            Remover
          </button>
        </div>

        {/* Tabela de Administradores */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nome', 'Email', 'Instituição associada', 'Status', 'Contacto', ''].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAdministrators.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      admin.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                      admin.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};


// --- CONTEÚDO DA PÁGINA: LOGS DO SISTEMA ---

const LogsPage: React.FC = () => {
    // Função auxiliar para determinar a cor do tag de nível de log
    const getLevelColor = (level: LogEntry['level']) => {
        switch (level) {
            case 'INFO': return 'bg-blue-100 text-blue-800';
            case 'AVISO': return 'bg-yellow-100 text-yellow-800';
            case 'ERRO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <main className="p-6 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Registros de Atividade</h2>
                
                {/* Filtros Simples (Data e Nível) */}
                <div className="flex space-x-4 mb-6">
                    <div className="relative">
                        <label className="sr-only">Filtrar por Nível</label>
                        <select
                            className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="Todos os Níveis"
                        >
                            <option>Todos os Níveis</option>
                            <option>INFO</option>
                            <option>AVISO</option>
                            <option>ERRO</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <label className="sr-only">Filtrar por Data</label>
                         <input
                            type="date"
                            className="block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        />
                    </div>
                </div>

                {/* Tabela de Logs */}
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Data/Hora', 'Nível', 'Utilizador', 'Ação', 'Detalhes'].map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {mockLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getLevelColor(log.level)}`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};


// --- CONTEÚDO DA PÁGINA: CONFIGURAÇÕES ---

const SettingsPage: React.FC = () => {
    const [activeSetting, setActiveSetting] = React.useState('Geral');

    const settingItems = [
        { key: 'Geral', label: 'Geral', icon: <Settings className="w-5 h-5" /> },
        { key: 'Perfil', label: 'Perfil e Acesso', icon: <User className="w-5 h-5" /> },
        { key: 'Segurança', label: 'Segurança', icon: <Lock className="w-5 h-5" /> },
        { key: 'Notificações', label: 'Notificações', icon: <BellRing className="w-5 h-5" /> },
    ];

    const renderSettingContent = () => {
        switch (activeSetting) {
            case 'Geral':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">Configurações Gerais do Sistema</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma do Sistema</label>
                            <div className="relative w-full md:w-1/2">
                                <select
                                    className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Português (Angola)"
                                >
                                    <option>Português (Angola)</option>
                                    <option>Inglês (EUA)</option>
                                    <option>Português (Portugal)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
                             <div className="relative w-full md:w-1/2">
                                <select
                                    className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Africa/Luanda (UTC+1)"
                                >
                                    <option>Africa/Luanda (UTC+1)</option>
                                    <option>Europe/Lisbon (UTC)</option>
                                    <option>UTC (Coordinated Universal Time)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none mt-0.5" />
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Guardar Alterações
                            </button>
                        </div>
                    </div>
                );
            case 'Perfil':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">Gerir Perfil de Administrador</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input type="text" id="name" defaultValue="Nome do Administrador" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                                <input type="email" id="email" defaultValue="admin.classcash@email.com" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" disabled />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Número de Telefone</label>
                                <input type="tel" id="phone" defaultValue="+244 923 999 999" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Função</label>
                                <input type="text" id="role" defaultValue="Super Administrador" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" disabled />
                            </div>
                        </div>

                        <div className="flex justify-start pt-4">
                            <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Atualizar Perfil
                            </button>
                        </div>
                    </div>
                );
            case 'Segurança':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">Segurança da Conta</h3>
                        
                        <div className="p-4 rounded-lg border border-gray-200 bg-red-50">
                            <p className="font-medium text-red-700 mb-2 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Alterar Palavra-Passe</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="password" placeholder="Palavra-passe Atual" className="border border-gray-300 rounded-lg p-2 text-sm" />
                                <input type="password" placeholder="Nova Palavra-passe" className="border border-gray-300 rounded-lg p-2 text-sm" />
                                <input type="password" placeholder="Confirmar Nova Palavra-passe" className="border border-gray-300 rounded-lg p-2 text-sm" />
                            </div>
                            <div className="mt-4">
                                <button className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-md">
                                    Alterar Palavra-passe
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 bg-green-50">
                            <p className="font-medium text-green-700 mb-2">Autenticação de Dois Fatores (2FA)</p>
                            <p className="text-sm text-gray-600">A autenticação de dois fatores está atualmente **Ativa**.</p>
                            <div className="mt-3">
                                <button className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                    Desativar 2FA
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'Notificações':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">Preferências de Notificação</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-700">Alertas de Transações</p>
                                    <p className="text-sm text-gray-500">Receber notificações quando novos pagamentos são processados.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-700">Alertas de Segurança</p>
                                    <p className="text-sm text-gray-500">Notificações sobre logins em novos dispositivos ou tentativas falhadas.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-700">E-mails de Marketing</p>
                                    <p className="text-sm text-gray-500">Receber notícias e ofertas promocionais (Mock).</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-start pt-4">
                            <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Guardar Preferências
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="p-6 md:p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col lg:flex-row min-h-[70vh]">
                {/* Menu Lateral de Configurações */}
                <aside className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 border-gray-200 lg:pr-6 pb-4 lg:pb-0 mb-4 lg:mb-0 flex lg:block space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto">
                    {settingItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveSetting(item.key)}
                            className={`flex items-center w-full p-3 rounded-lg text-sm font-medium transition-colors duration-150 flex-shrink-0 ${
                                activeSetting === item.key
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                            {item.label}
                        </button>
                    ))}
                </aside>
                
                {/* Conteúdo da Configuração Ativa */}
                <section className="flex-1 lg:pl-6 pt-4 lg:pt-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeSetting}</h2>
                    <div className="pb-8">
                        {renderSettingContent()}
                    </div>
                </section>
            </div>
        </main>
    );
};


// --- COMPONENTE PRINCIPAL (App) ---

export const App: React.FC = () => {
  // Mantém "Configurações" como padrão, mas mude para 'Gestão de Instituições' para ver o modal
  const [activeMenu, setActiveMenu] = React.useState('Configurações'); 

  const getPageTitle = (menu: string) => {
    switch (menu) {
      case 'Dashboard':
        return 'Dashboard';
      case 'Gestão de Instituições':
        return 'Gestão de Instituições';
      case 'Administradores':
        return 'Administradores';
      case 'Logs':
        return 'Logs do Sistema';
      case 'Configurações':
        return 'Configurações';
      default:
        return 'ClassCash';
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Gestão de Instituições':
        return <InstitutionManagementPage />;
      case 'Administradores':
        return <AdministratorsPage />;
      case 'Logs':
        return <LogsPage />;
      case 'Configurações':
        return <SettingsPage />; // Novo componente
      default:
        // Placeholder para as outras páginas
        return (
            <main className="p-8">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-600">
                    <h2 className="text-xl font-bold mb-4">{getPageTitle(activeMenu)}</h2>
                    <p>Esta é uma página de placeholder. Clique em "Dashboard", "Gestão de Instituições", "Administradores" ou "Logs" para ver o conteúdo implementado.</p>
                </div>
            </main>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 antialiased text-gray-800">
      {/* Sidebar (Menu Lateral) */}
      <div className="hidden lg:flex flex-col w-64 bg-[#268cff] shadow-xl z-20">
        <div className="flex items-center justify-center h-16 border-b border-white p-4">
          <img src={logo} alt="" className="w-16" />
          <span className="text-white font-medium">ClassCash</span>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <NavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            isActive={activeMenu === 'Dashboard'}
            onClick={() => setActiveMenu('Dashboard')}
          />
          <NavItem
            icon={<Building />}
            label="Gestão de Instituições"
            isActive={activeMenu === 'Gestão de Instituições'}
            onClick={() => setActiveMenu('Gestão de Instituições')}
          />
          <NavItem
            icon={<Users />}
            label="Administradores"
            isActive={activeMenu === 'Administradores'}
            onClick={() => setActiveMenu('Administradores')}
          />
          <NavItem
            icon={<ScrollText />}
            label="Logs"
            isActive={activeMenu === 'Logs'}
            onClick={() => setActiveMenu('Logs')}
          />
          <NavItem
            icon={<Settings />}
            label="Configurações"
            isActive={activeMenu === 'Configurações'}
            onClick={() => setActiveMenu('Configurações')}
          />
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header (Topo) */}
        <header id="menu-translucido"  className="flex items-center justify-between z-10 top-5  px-6 sticky h-22 mb-20  ">
          <h1 className="text-xl font-bold text-[#268cff]">{getPageTitle(activeMenu)}</h1>
          <div className="flex items-center space-x-4">
            {/* Campo de Pesquisa */}
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Ícones de Notificação e Perfil */}
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <CircleUser className="w-8 h-8 text-gray-500 hover:text-gray-700" />
          </div>
        </header>

        {/* Renderiza o conteúdo da página ativa */}
        {renderContent()}
      </div>
    </div>
  );
};

export default App;