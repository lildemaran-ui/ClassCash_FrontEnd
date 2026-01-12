import React from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Receipt, 
  AlertOctagon, FileText, UserCog, Settings, 
  MessageSquare, Bell, Search, Download 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10'}`}>
    <Icon size={20} className="text-white" />
    <span className="text-white font-medium text-sm">{label}</span>
  </div>
);

const CardKpi = ({ title, value, subtext, trend }: { title: string, value: string, subtext: string, trend?: 'up' | 'down' }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <p className="text-gray-400 text-xs mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {trend === 'up' && <span className="text-green-500 text-xs">↑</span>}
      {trend === 'down' && <span className="text-red-500 text-xs">↓</span>}
    </div>
    <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>
  </div>
);

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-bgLight font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-MeuAzul flex flex-col py-6">
        <div className="px-8 mb-10 flex items-center gap-2">
          <div className="bg-white p-1 rounded text-MeuAzul font-bold">ClassCash</div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <SidebarItem icon={LayoutDashboard} label="DashBoard" active />
          <SidebarItem icon={Users} label="Gestão de Alunos" />
          <SidebarItem icon={CreditCard} label="Gestão de Propinas" />
          <SidebarItem icon={Receipt} label="Gestão de Pagamentos" />
          <SidebarItem icon={AlertOctagon} label="Módulo de Multas" />
          <SidebarItem icon={FileText} label="Relatório" />
          <SidebarItem icon={UserCog} label="Gestão de Usuários" />
          <SidebarItem icon={Settings} label="Gestão de Serviços" />
          <div className="mt-4 pt-4 border-t border-white/10">
            <SidebarItem icon={MessageSquare} label="Reclamações" />
            <SidebarItem icon={Settings} label="Configurações" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Procurar por um código" 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-MeuAzul/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-MeuAzul cursor-pointer" />
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-MeuAzul overflow-hidden">
               <img src="https://via.placeholder.com/40" alt="User" />
            </div>
          </div>
        </header>

        {/* Filters & KPI Cards */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-6">
             <div className="flex gap-4">
                {['Ano', 'Semestre', 'Mês'].map(filter => (
                  <div key={filter}>
                    <label className="block text-xs text-gray-500 mb-1">{filter}</label>
                    <select className="bg-white border border-gray-100 rounded-md px-3 py-1 text-sm text-gray-400 outline-none">
                      <option>Sem filtro</option>
                    </select>
                  </div>
                ))}
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-MeuAzul text-MeuAzul rounded-md text-xs font-semibold hover:bg-MeuAzul hover:text-white transition-all">
                Gerar PDF
             </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <CardKpi title="Total de estudantes" value="1.000" subtext="no último mês" trend="up" />
            <CardKpi title="Total de Encarregados" value="1.500" subtext="no último mês" trend="up" />
            <CardKpi title="Estudantes ativos" value="50" subtext="no último mês" />
            <CardKpi title="Estudantes Inativos" value="70" subtext="no último mês" trend="down" />
          </div>
        </section>

        {/* Serviços Mais Utilizados */}
        <section className="mb-8">
          <h3 className="text-gray-700 font-bold mb-4 text-sm">Serviços mais utilizados</h3>
          <div className="grid grid-cols-3 gap-6">
            {['Multicaixa Express', 'Unitel Money', 'PayPay'].map(servico => (
              <div key={servico} className="bg-white p-6 rounded-xl border border-gray-50 shadow-sm text-center">
                <p className="font-bold text-gray-700 mb-3">{servico}</p>
                <div className="h-2 w-full bg-MeuAzul rounded-full mb-2"></div>
                <p className="text-[10px] text-gray-400">Serviço digital</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alunos Cadastrados */}
        <section className="mb-8">
          <h3 className="text-gray-700 font-bold mb-4 text-sm">Alunos Cadastrados</h3>
          <div className="flex flex-col gap-1">
            {[
              { nome: 'Délcio Valente de Sousa', processo: '21234' },
              { nome: 'Jacira de Almeida Cassongo', processo: '20455' },
              { nome: 'Andreia Lurdes do Rosário Lima', processo: '19982' },
            ].map((aluno, i) => (
              <div key={i} className={`p-4 ${i % 2 === 0 ? 'bg-MeuAzul/60 text-white' : 'bg-white text-gray-700'} rounded-sm`}>
                <p className="font-bold text-sm">{aluno.nome}</p>
                <p className="text-[10px] opacity-80">Classe: 7ª | Nº de processo: {aluno.processo}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-MeuAzul text-white px-6 py-2 rounded text-xs font-bold shadow-md">Ver mais</button>
        </section>

        {/* Faturamento Chart Placeholder */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between mb-8">
              <div>
                <p className="text-xs text-gray-500">Faturamento mensal</p>
                <p className="text-MeuAzul font-bold">375.600,00 Kz</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Mês</p>
                <p className="text-blue-900 font-bold">Outubro</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Faturamento anual</p>
                <p className="text-MeuAzul font-bold">4.507.200,00 Kz</p>
              </div>
           </div>
           
           {/* Gráfico Representativo com Divs */}
           <div className="flex items-end justify-between h-48 gap-2 px-4">
              {[40, 40, 20, 30, 20, 60, 15, 40, 20, 35, 55, 30].map((height, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-MeuAzul rounded-t-sm"
                  ></div>
                  <span className="text-[10px] text-gray-400 mt-2">{(i + 1).toString().padStart(2, '0')}</span>
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}