import { Coins, Shirt, GraduationCap, IdCard, Notebook, ScrollText, ArrowRightLeft } from 'lucide-react';

const services = [
  { name: "Propinas", icon: Coins },
  { name: "Uniforme", icon: Shirt },
  { name: "Certificado", icon: GraduationCap },
  { name: "Cartão de Estudante", icon: IdCard },
  { name: "Fascículos", icon: Notebook },
  { name: "Justificativos", icon: ScrollText },
  { name: "Transferências", icon: ArrowRightLeft },
  
];

export default function Cards() {
  // Criamos uma lista duplicada para o efeito de loop infinito
  const duplicatedServices = [...services, ...services, ...services];

  return (
    <div className="w-full overflow-hidden py-10"> 
      {/* 1. Mudamos de 'grid' para 'flex' para permitir o deslize lateral */}
      {/* 2. 'animate-slide' deve estar nesta div que envolve os cards */}
      <div className="flex gap-6 w-max animate-slide px-4">
        
        {duplicatedServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <div 
              key={index} 
              // 3. Adicionado 'flex-shrink-0' para os cards não esmagarem
              className="group relative h-48 w-44 flex-shrink-0 flex flex-col justify-center items-center bg-white border border-slate-100 rounded-3xl shadow-sm transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-xl hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col items-center text-center px-2">
                <div className="mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-700 font-medium text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}