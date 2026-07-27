import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-primary-50 text-4xl">🐾</div>
        <h1 className="font-display text-3xl font-bold text-slate-800">404 — Page Not Found</h1>
        <p className="mt-2 text-slate-500">Looks like this page wandered off. Let's get you back home.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <PawPrint className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
