import { ChevronLeft, ChevronRight, Search, Inbox, AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  let lastRendered = 0

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg p-2 text-slate-500 hover:bg-white/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => {
        const showDots = p - lastRendered > 1
        lastRendered = p
        return (
          <span key={p} className="flex items-center">
            {showDots && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              {p}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg p-2 text-slate-500 hover:bg-white/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center animate-fade-in">
      <div className="rounded-2xl bg-primary-50 p-4">
        <Icon className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9"
      />
    </div>
  )
}

export function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field w-auto min-w-[140px]">
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="rounded-2xl bg-red-50 p-3">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex w-full gap-3 pt-2">
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn-danger flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
