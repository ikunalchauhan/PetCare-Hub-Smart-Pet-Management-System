import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PetsPage from './pages/PetsPage'
import PetDetailPage from './pages/PetDetailPage'
import VaccinationsPage from './pages/VaccinationsPage'
import MedicalRecordsPage from './pages/MedicalRecordsPage'
import MedicinesPage from './pages/MedicinesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ExpensesPage from './pages/ExpensesPage'
import DocumentsPage from './pages/DocumentsPage'
import NotFoundPage from './pages/NotFoundPage'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
        <Route path="/vaccinations" element={<VaccinationsPage />} />
        <Route path="/medical-records" element={<MedicalRecordsPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
