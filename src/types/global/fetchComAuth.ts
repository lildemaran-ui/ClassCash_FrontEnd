import { getToken } from "@/types/global/sessao";
import { toast } from "sonner";

export async function fetchComAuth(url: string, options: RequestInit = {}) {
  const token = getToken();

  // Se o body for FormData, não definir Content-Type
  // O browser define automaticamente com o boundary correcto
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    toast.error("A sua sessão expirou. Por favor, faça login novamente.", {
      duration: 4000,
    });
    localStorage.removeItem("sessao");
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
    throw new Error("Sessão expirada");
  }

  return res;
}