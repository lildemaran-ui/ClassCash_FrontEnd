export interface SessaoUsuario {
  idusuario: number;
  nome: string;
  perfil: string;
  instituicao?: string;
  idInstituicao?: number;
  numProcesso?: string;
  foto?: string;
  email?: string;
  classe?: string;
  processo?: string;
  nomeEstudante?: string;
  relacao?: string;
  /** Código gerado pela plataforma após a secretaria validar o cadastro */
  codigo_plataforma?: string;
}

export interface Sessao {
  token: string;
  usuario: SessaoUsuario;
}

/** Lê e devolve a sessão do localStorage, ou null se não existir */
export function getSessao(): Sessao | null {
  try {
    const raw = localStorage.getItem("sessao");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw) as Sessao;
  } catch {
    return null;
  }
}

/** Devolve apenas o token JWT, ou null */
export function getToken(): string | null {
  return getSessao()?.token ?? null;
}

/** Devolve os dados do utilizador, ou null */
export function getUsuario(): SessaoUsuario | null {
  return getSessao()?.usuario ?? null;
}

/** Remove a sessão (logout) */
export function clearSessao(): void {
  localStorage.removeItem("sessao");
}

/** Redireciona para login se não houver sessão válida */
export function exigirSessao(): Sessao | null {
  const sessao = getSessao();
  if (!sessao?.token || !sessao?.usuario) {
    window.location.href = "/Login";
    return null;
  }
  return sessao;
}