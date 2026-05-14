import Avatar from "@/components/Avatar/Avatar";
import ConfiguracaoGeral from "@/components/Configuracoes/ConfiguracaoGeral";
import { Header } from "@/components/Header/header";
import { exigirSessao, type SessaoUsuario } from "@/types/global/sessao";
import { useEffect, useState } from "react";
import { LayoutEncarregado } from "../layout/index2";
import ContentLoader from "@/components/contentLoader";

export default function ConfiguracaoEncar() {
  const [user, setUser] = useState<SessaoUsuario | null>(null);

  useEffect(() => {
    const sessao = exigirSessao();
    if (!sessao) return;
    setUser(sessao.usuario);
  }, []);

  if (!user) return <span>A carregar...</span>;

  return (
    <LayoutEncarregado>
      <div className="flex-1 w-full h-full mx-auto">
        <div className="flex-1 overflow-auto">
          <Header
            titulo="Configurações"
            usuario={<Avatar name={user.nome ?? ""} src={user.foto} size="sm" />}
          />
          <div>
            <ContentLoader>
              <ConfiguracaoGeral />
            </ContentLoader>
          </div>
        </div>
      </div>
    </LayoutEncarregado>
  );
}