import { differenceInYears, differenceInMonths, format, formatDistanceToNow, isPast } from 'date-fns'

export function formatDate(dateStr, pattern = 'MMM d, yyyy') {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), pattern)
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'MMM d, yyyy · h:mm a')
  } catch {
    return dateStr
  }
}

export function formatRelative(dateStr) {
  if (!dateStr) return '—'
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return isPast(new Date(dateStr))
}

export function formatCurrency(amount) {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return '—'
  const dob = new Date(dateOfBirth)
  const years = differenceInYears(new Date(), dob)
  if (years >= 1) return `${years} year${years === 1 ? '' : 's'}`
  const months = differenceInMonths(new Date(), dob)
  return `${months} month${months === 1 ? '' : 's'}`
}

export const SPECIES_EMOJI = {
  Dog: '🐕',
  Cat: '🐈',
  Bird: '🐦',
  Rabbit: '🐇',
  Fish: '🐠',
  Reptile: '🦎',
  Hamster: '🐹',
  Other: '🐾',
}

export const EXPENSE_CATEGORY_COLORS = {
  FOOD: '#17b37f',
  MEDICAL: '#e1574f',
  GROOMING: '#328eff',
  INSURANCE: '#c8a86c',
  ACCESSORIES: '#a970e8',
  TRAINING: '#f0a336',
  OTHER: '#64748b',
}

export const APPOINTMENT_STATUS_STYLES = {
  SCHEDULED: 'bg-ocean-50 text-ocean-700 border border-ocean-200',
  COMPLETED: 'bg-primary-50 text-primary-700 border border-primary-200',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
}
