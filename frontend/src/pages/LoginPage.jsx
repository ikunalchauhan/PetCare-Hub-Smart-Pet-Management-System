import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue managing your pets' care.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="input-label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field pl-9"
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && <p className="input-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="input-field pl-9 pr-10"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="input-error">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <LogIn className="h-4 w-4" />
          {submitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-xs text-primary-800">
        <p className="font-semibold">Demo credentials</p>
        <p>Email: <span className="font-mono">demo@petcarehub.dev</span> · Password: <span className="font-mono">Demo@1234</span></p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Create one</Link>
      </p>
    </AuthLayout>
  )
}
