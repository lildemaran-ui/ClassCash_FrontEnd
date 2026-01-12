import { useState, useEffect } from "react";

export default function FrasesRotativasLogin() {
  const frases = [
    " Anime e Facilite a sua gestão.",
    "Tenha mais controle sobre sua situação.",
    "O futuro dos pagamentos escolares está aqui.",
    "Entre e descubra como o ClassCash funciona."
    
  ];

  const [primeiro, setPrimeiro] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 

      setTimeout(() => {
        setPrimeiro((prev) => (prev + 1) % frases.length);
        setFade(true); 
      }, 500); 
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`text-white text-2xl  lg:text-lg   font-normal cursor-default transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {frases[primeiro]}
    </span>
  );
}