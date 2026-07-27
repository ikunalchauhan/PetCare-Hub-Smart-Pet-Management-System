import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

const CATEGORY_OPTIONS = ['FOOD', 'MEDICAL', 'GROOMING', 'INSURANCE', 'ACCESSORIES', 'TRAINING', 'OTHER']

export default function ExpenseFormModal({ open, onClose, onSubmit, pets, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      petId: pets[0]?.id || '', category: 'FOOD', amount: '', expenseDate: '', description: '',
    })
  }, [defaultValues, open, reset, pets])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Expense' : 'Add Expense'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="input-label">Pet</label>
          <select className="input-field" disabled={!!defaultValues} {...register('petId', { required: 'Please select a pet' })}>
            <option value="">Select a pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.petId && <p className="input-error">{errors.petId.message}</p>}
        </div>

        <div>
          <label className="input-label">Category</label>
          <select className="input-field" {...register('category', { required: true })}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
        </div>

        <div>
          <label className="input-label">Amount ($)</label>
          <input type="number" step="0.01" className="input-field" placeholder="45.00" {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Must be positive' } })} />
          {errors.amount && <p className="input-error">{errors.amount.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Date</label>
          <input type="date" className="input-field" {...register('expenseDate', { required: 'Required' })} />
          {errors.expenseDate && <p className="input-error">{errors.expenseDate.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Description</label>
          <textarea rows={2} className="input-field" placeholder="Monthly kibble, flea treatment…" {...register('description')} />
        </div>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving…' : 'Save Expense'}</button>
        </div>
      </form>
    </ModalBase>
  )
}
