import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Hamster', 'Other']
const GENDER_OPTIONS = ['Male', 'Female', 'Unknown']

export default function PetFormModal({ open, onClose, onSubmit, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      name: '', species: 'Dog', breed: '', gender: 'Male', dateOfBirth: '', weightKg: '', color: '', microchipId: '', photoUrl: '', notes: '',
    })
  }, [defaultValues, open, reset])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Pet Profile' : 'Add a New Pet'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="input-label">Pet name</label>
          <input className="input-field" placeholder="Bella" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="input-label">Species</label>
          <select className="input-field" {...register('species', { required: true })}>
            {SPECIES_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="input-label">Breed</label>
          <input className="input-field" placeholder="Golden Retriever" {...register('breed')} />
        </div>

        <div>
          <label className="input-label">Gender</label>
          <select className="input-field" {...register('gender')}>
            {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="input-label">Date of birth</label>
          <input type="date" className="input-field" {...register('dateOfBirth', { required: 'Date of birth is required' })} />
          {errors.dateOfBirth && <p className="input-error">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="input-label">Weight (kg)</label>
          <input type="number" step="0.1" className="input-field" placeholder="12.5" {...register('weightKg')} />
        </div>

        <div>
          <label className="input-label">Color</label>
          <input className="input-field" placeholder="Golden" {...register('color')} />
        </div>

        <div>
          <label className="input-label">Microchip ID</label>
          <input className="input-field" placeholder="985121..." {...register('microchipId')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Photo URL</label>
          <input className="input-field" placeholder="https://…" {...register('photoUrl')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Notes</label>
          <textarea rows={3} className="input-field" placeholder="Allergies, temperament, favorite toys…" {...register('notes')} />
        </div>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Saving…' : defaultValues ? 'Save Changes' : 'Add Pet'}
          </button>
        </div>
      </form>
    </ModalBase>
  )
}
