import { useState, useEffect } from "react";

export default function FrasesRotativas() {
  const frases = [
    " académicos sem complicações.",
    "feitos num só clique!",
    "seu futuro escolar está aqui.",
    "seguros. Processos claros.",
    
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % frases.length);
        setFade(true); 
      }, 700); 
    }, 3500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`text-[#268CFF] text-2xl  sm:text-4xl font-extrabold cursor-default animate-spin transition-opacity duration-700 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {frases[index]}
    </span>
  );
}
