import { Bell, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileEditModal } from "../profile_edit_modal";

export function Header(props) {
  const [Modal, setModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between  top-0 
      px-4 sm:px-6 lg:px-8
      py-3 sm:py-4
      w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">

      {/* Título — menor no mobile */}
      <h1 className="text-base sm:text-lg lg:text-xl pl-10 lg:pl-0 font-bold text-[#268cff] truncate max-w-[60%] sm:max-w-none">
        {props.titulo}
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Botão configurações */}
        <button
          onClick={() => setModal(true)}
          className="text-[#268cff] hover:scale-110 transition-all p-1"
        >
          <Settings size={20} className="sm:hidden" />
          <Settings size={24} className="hidden sm:block" />
        </button>

        {/* Sino de notificações */}
        <div className="relative cursor-pointer group p-1">
          <Bell
            size={20}
            className="text-[#268cff] group-hover:scale-110 transition-transform sm:hidden"
          />
          <Bell
            size={24}
            className="text-[#268cff] group-hover:scale-110 transition-transform hidden sm:block"
          />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white" />
        </div>

        <ProfileEditModal isOpen={Modal} onClose={() => setModal(false)} user={user} />

        {/* Avatar */}
        <div className="avatar">{props.usuario}</div>
      </div>
    </div>
  );
}