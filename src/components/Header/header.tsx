import { Bell, Settings } from "lucide-react";
import Avatar from "../Avatar/Avatar";
import { useEffect, useState } from "react";
import { ProfileEditModal } from "../profile_edit_modal";

// Header.jsx
export function Header(props) {
     const [Modal, setModal] = useState(false);
    
      function ShowModal() {
        setModal(true);
      }
    
      function CloseModal() {
        setModal(false);
      }
       const [user, setUser] = useState<User | null>(null);
      
        useEffect(() => {
          const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
          if (dadosDoLogin) {
            setUser(JSON.parse(dadosDoLogin));
          } else {
            window.location.href = "/Login";
          }
        }, []);
      
        if(!user) {
          return null; // Ou um componente de carregamento, se preferir
        }
  return (
    <div className="flex items-center justify-between z-50 top-0  px-5 sticky h-22 w-full ">
      <h1 className="text-xl font-bold text-[#268cff]">{props.titulo}</h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={ShowModal}
          className="text-[#268cff] hover:scale-110 transition-all"
        >
          <Settings size={24} />
        </button>

        <div className="relative cursor-pointer group">
          <Bell className="text-[#268cff] group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
        </div>
        <ProfileEditModal 
        isOpen={Modal} 
        onClose={CloseModal} 
        user={user} 
      />
        {/* Usando dados do usuário via props */}
        <div className="avatar">{props.usuario}</div>
        
      </div>
    </div>
  );
}