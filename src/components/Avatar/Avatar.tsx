// src/components/Avatar.tsx
import { useState } from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg"; // Adicionei tamanhos para ser mais versátil
}

const Avatar = ({ name, src, size = "md" }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  // Configuração de tamanhos com Tailwind
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-xl",
  };

  const initials = name
    .trim()
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const commonClasses = `${sizeClasses[size]} rounded-full flex items-center border border-[#268cff]/50 justify-center overflow-hidden shrink-0`;

  if (src && !hasError) {
    return (
      <img
        loading="lazy"
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`${commonClasses} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${commonClasses} bg-gradient-to-br from-blue-400 to-[#268cff] text-white font-medium shadow-inner`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
