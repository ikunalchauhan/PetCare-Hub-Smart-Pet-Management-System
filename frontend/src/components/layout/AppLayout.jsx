import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet context={{ openMobileMenu: () => setMobileOpen(true) }} />
      </main>
    </div>
  )
}
