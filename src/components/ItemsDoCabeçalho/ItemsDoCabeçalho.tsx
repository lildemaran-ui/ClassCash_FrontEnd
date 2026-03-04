import { Bell, Search } from "lucide-react";
export default function ItemsDoCabeçalho() {
  return (
    <div className="flex">
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="search"
          placeholder="Procurar por um nome/código"
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-MeuAzul/20 focus:border-none"
        />
      </div>
      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <Bell className="text-[#268cff] cursor-pointer" />
          <div className="absolute bg-red-500 w-3 h-3 flex -top-1 -right-1 rounded-full border border-white"></div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 border overflow-hidden">
          <img loading="lazy" src="https://via.placeholder.com/40" alt="User" />
        </div>
      </div>
    </div>
  );
}
