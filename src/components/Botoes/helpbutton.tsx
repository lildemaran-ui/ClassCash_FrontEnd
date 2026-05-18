import SuporteDrawer from "@/Pages/Secretaria/SuporteDrawer";
import { Headset } from "lucide-react";
import { useState } from "react";
export default function HelpButton() {
  const [suporteAberto, setSuporteAberto] = useState(false);

 const [totalNaoLidas, setTotalNaoLidas] = useState(0);

    return (
       <>
         <button
        onClick={() => { setSuporteAberto(true); setTotalNaoLidas(0); }}
        className="bg-primary animate-pulse duration-1500 text-white rounded-full w-14 h-14 lg:w-16 lg:h-16 hover:animate-none hover:scale-110 transition-all font-bold shadow-md fixed bottom-4 flex items-center justify-center right-2 lg:right-12 z-30"
        title="Abrir Suporte"
      >
        <div className="relative">
          <div className="hidden lg:block"><Headset size={30} /></div>
          <div className="lg:hidden"><Headset size={24} /></div>
          {/* ✅ Badge de não lidas — estilo WhatsApp */}
          {totalNaoLidas > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg border-2 border-white animate-bounce">
              {totalNaoLidas > 99 ? "99+" : totalNaoLidas}
            </span>
          )}
        </div>
      </button>

         
      <SuporteDrawer
        aberto={suporteAberto}
        onFechar={() => setSuporteAberto(false)}
        onNaoLidasChange={setTotalNaoLidas}
      />
       </>
    )
}