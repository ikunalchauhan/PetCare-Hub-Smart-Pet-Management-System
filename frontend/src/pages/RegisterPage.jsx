import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { register: registerUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const password = watch('password')

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const { confirmPassword, ...payload } = data
      await registerUser(payload)
      toast.success('Account created! Welcome to PetCare Hub.')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start tracking your pets' health and expenses in minutes.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="input-label">Full name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Jane Doe"
              className="input-field pl-9"
              {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Too short' } })}
            />
          </div>
          {errors.fullName && <p className="input-error">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="input-label">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field pl-9"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && <p className="input-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="input-label">Phone (optional)</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input placeholder="+1 555 123 4567" className="input-field pl-9" {...register('phone')} />
          </div>
        </div>

        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="input-field pl-9 pr-10"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="input-error">{errors.password.message}</p>}
        </div>

        <div>
          <label className="input-label">Confirm password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="input-field pl-9"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <UserPlus className="h-4 w-4" />
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Log in</Link>
      </p>
    </AuthLayout>
  )
}
