export const getSessao = () => {
  const sessao = localStorage.getItem("sessao");
  return sessao ? JSON.parse(sessao) : null;
};