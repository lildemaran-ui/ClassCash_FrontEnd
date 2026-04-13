import { getToken } from "@/types/global/sessao";

export const handleLogout = async () => {
  try {
    const token = getToken();
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (_) {
    // ignora erro de rede
  } finally {
    localStorage.removeItem("sessao");
  }
};