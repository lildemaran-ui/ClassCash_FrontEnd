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
      return "text-orange-500 bg-orange-50 border-orange-200";
    case "Aceite":
      return "text-green-600 bg-green-50 border-green-200";
    case "Recusado":
      return "text-red-500 bg-red-50 border-red-200";
    default:
      return "text-gray-500 bg-gray-50 border-gray-200";
  }
}
