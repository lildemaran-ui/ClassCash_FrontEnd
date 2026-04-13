// src/components/RotaProtegida/rota_protegida.tsx
import { getSessao, clearSessao } from "@/types/global/sessao";
import { useEffect } from "react";

export default function RotaProtegida({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sessao = getSessao();
    if (!sessao) {
      clearSessao();
      window.location.href = "/Login";
    }
  }, []);

  if (!getSessao()) return null;

  return <>{children}</>;
}