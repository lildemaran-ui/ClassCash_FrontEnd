import { useEffect, useState } from "react";

import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import ReclamacaoGeral from "@/components/Reclamacao/ReclamacaoGeral";
import { LayoutEncarregado } from "../layout/index2";

export default function ReclamacoesEncar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");

    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);
  if (!user) {
    return <span>Carregado...</span>;
  }
  return (
    <LayoutEncarregado>
      <div className="flex-1 w-full h-full mx-auto ">
        <div className="flex-1 overflow-auto">
          <Header
            titulo="Reclamações"
            usuario={<Avatar name={user.nome} src={user.foto} size="md" />}
          />
          <div className="">
            <ReclamacaoGeral />
          </div>
        </div>
      </div>
    </LayoutEncarregado>
  );
}
