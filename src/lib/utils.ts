import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colorsSit = (status: string) => {
  switch (status) {
    case "Ativo":
      return "border-gray-200 text-green-500 ";
    case "Inativo":
      return "border-gray-200 text-red-500 ";
    case "Pendente":
      return "border-gray-200 text-yellow-500 ";
    default:
      return "border-gray-200 text-gray-500 ";
  }
}
