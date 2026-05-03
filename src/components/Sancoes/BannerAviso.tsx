import { AlertTriangle } from 'lucide-react'

export function BannerAviso() {
  return (
    <div className="bg-amber-400 text-amber-950 px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-bold sticky top-0 z-[100] border-b border-amber-500/20 shadow-sm">
      <AlertTriangle size={18} className="animate-bounce" />
      <span>
        Atenção: A mensalidade da instituição está pendente. Regularize até o
        dia 15 para evitar restrições no sistema.
      </span>
    </div>
  )
}
