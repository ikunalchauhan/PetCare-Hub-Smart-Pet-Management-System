export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="glass-card flex items-center gap-4 p-4">
      <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-1/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-8 w-8 rounded-lg" />
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  )
}

export function SkeletonGrid({ count = 6, Component = SkeletonCard }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => <Component key={i} />)}
    </div>
  )
}
