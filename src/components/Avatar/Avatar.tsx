import { useState, useEffect } from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = ({ name, src, size = "md" }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  // ✅ Reseta o erro sempre que o src muda
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-xl",
    xl: "w-32 h-32 lg:w-40 lg:h-40 text-4xl",
  };

  const initials = (name ?? "")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0)
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => (n ? n[0] : ""))
    .join("")
    .toUpperCase();

  const commonClasses = `${sizeClasses[size]} rounded-full flex items-center border border-[#184d8a]/50 justify-center overflow-hidden shrink-0`;

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
    <div className={`${commonClasses} bg-primary text-white font-medium shadow-inner`}>
      {initials}
    </div>
  );
};

export default Avatar;