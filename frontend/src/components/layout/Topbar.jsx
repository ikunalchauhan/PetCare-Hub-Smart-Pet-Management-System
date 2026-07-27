import { Menu } from 'lucide-react'

export default function Topbar({ title, subtitle, onMenuClick, actions }) {
  return (
    <header className="sticky top-0 z-30 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/50 bg-white/40 backdrop-blur-lg px-4 py-4 sm:px-6 -mx-4 sm:-mx-6 sm:rounded-b-none">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-white/70 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
