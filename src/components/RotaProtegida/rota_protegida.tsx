// src/components/RotaProtegida.tsx
import { getSessao, logout } from "@/types/global/auth";
import { useEffect } from "react";

export default function RotaProtegida({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sessao = getSessao();
    if (!sessao) logout();
  }, []);

  if (!getSessao()) return null;

  return <>{children}</>;
}