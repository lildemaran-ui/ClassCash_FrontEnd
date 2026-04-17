import Avatar from "@/components/Avatar/Avatar";
import { Header } from "@/components/Header/header";
import PagamentoGeral from "@/components/Pagamento/PagamentoGeral";
import { useEffect, useState } from "react";
import { LayoutEncarregado } from "../layout/index2";

export default function PagamentoEncar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dadosDoLogin = localStorage.getItem("UsuarioAtivo");
    if (dadosDoLogin) {
      setUser(JSON.parse(dadosDoLogin));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  if (!user) return <span>Carregado...</span>;

  return (
    <LayoutEncarregado>
      <div className="flex-1 w-full h-full mx-auto ">
        <div className="flex-1 overflow-auto">
          <Header
            titulo="Pagamentos"
            usuario={<Avatar name={user.nome} src={user.foto} size="sm" />}
          />
          <div className="">
            <PagamentoGeral />
          </div>
        </div>
      </div>
    </LayoutEncarregado>
  );
}
