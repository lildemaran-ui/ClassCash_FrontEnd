import Avatar from "@/components/Avatar/Avatar";
import { ProfileEditModal } from "../profile_edit_modal";
import { Bell, Settings } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AppLayoutProps {
  titulo: string;
  children: ReactNode;
  sidebar: ReactNode; // recebe o MenuSecretaria (ou qualquer menu)
}

// ─── Navbar (antigo Header) ────────────────────────────────────────────────────

function Navbar({ titulo }: { titulo: string }) {
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
    <div
      className="flex items-center justify-between top-0
      px-4 sm:px-6 lg:px-8
      py-3 sm:py-4
      w-full bg-white/80 backdrop-blur-sm border-b border-gray-100"
    >
      <h1 className="text-base sm:text-lg lg:text-xl pl-10 lg:pl-0 font-bold text-[#184d8a] truncate max-w-[60%] sm:max-w-none">
        {titulo}
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setModal(true)}
          className="text-[#184d8a] hover:scale-110 transition-all p-1"
        >
          <Settings size={20} className="sm:hidden" />
          <Settings size={24} className="hidden sm:block" />
        </button>

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

        <ProfileEditModal
          isOpen={Modal}
          onClose={() => setModal(false)}
          user={user}
        />

        <div className="avatar">
          <Avatar name={user.nome} src={user.foto} size="md" />
        </div>
      </div>
    </div>
  );
}

// ─── AppLayout (Sidebar + Navbar juntos) ──────────────────────────────────────

export function AppLayout({ titulo, children, sidebar }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden custom_scroll">
      {/* Sidebar — passa qualquer menu como prop */}
      {sidebar}

      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Navbar sticky no topo */}
        <Navbar titulo={titulo} />

        {children}
      </main>
    </div>
  );
}
