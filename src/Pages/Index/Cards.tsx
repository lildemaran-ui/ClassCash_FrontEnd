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
  const duplicatedServices = [...services, ...services, ...services];

  return (
    <div className="w-full overflow-hidden py-6 sm:py-10">
  <div className="pl-4 sm:pl-6"> {/* ← div intermédia com padding */}
    <div className="flex gap-4 sm:gap-6 w-max animate-slide">
      {duplicatedServices.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="group relative 
              h-36 w-32
              sm:h-44 sm:w-40
              lg:h-48 lg:w-44
              flex-shrink-0 flex flex-col justify-center items-center
              bg-white border border-slate-100 rounded-3xl shadow-sm
              transition-all duration-300 ease-out
              hover:-translate-y-3 hover:shadow-xl hover:border-blue-200"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center text-center px-2">
              <div className="mb-3 sm:mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Icon size={36} strokeWidth={1.5} className="sm:hidden" />
                <Icon size={48} strokeWidth={1.5} className="hidden sm:block" />
              </div>
              <h3 className="text-slate-700 font-medium text-xs sm:text-sm lg:text-base group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
  );
}