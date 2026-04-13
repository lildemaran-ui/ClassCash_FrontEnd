import { getToken } from "@/types/global/sessao";
import { toast } from "sonner";

export async function fetchComAuth(url: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  // Token expirado ou inválido
  if (res.status === 401) {
    toast.error("A sua sessão expirou. Por favor, faça login novamente.", {
      duration: 4000,
    });

    // Limpa a sessão
    localStorage.removeItem("sessao");
    localStorage.removeItem("token");

    // Redireciona após 1.5s para o utilizador ver o toast
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);

    throw new Error("Sessão expirada");
  }

  return res;
}