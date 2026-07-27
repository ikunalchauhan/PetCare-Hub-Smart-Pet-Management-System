import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Cake, Weight, Fingerprint, ChevronRight } from 'lucide-react'
import { SPECIES_EMOJI, calculateAge, formatDate } from '../../utils/format'

export default function PetCard({ pet, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card group overflow-hidden"
    >
      <Link to={`/pets/${pet.id}`} className="block p-5">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-3xl shadow-inner">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              SPECIES_EMOJI[pet.species] || '🐾'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-display text-lg font-bold text-slate-800">{pet.name}</h3>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" />
            </div>
            <p className="text-sm text-slate-500">{pet.breed || pet.species} · {pet.gender || 'Unknown'}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
          <div>
            <Cake className="mx-auto mb-1 h-4 w-4 text-primary-500" />
            <p className="text-xs font-semibold text-slate-700">{calculateAge(pet.dateOfBirth)}</p>
            <p className="text-[10px] text-slate-400">Age</p>
          </div>
          <div>
            <Weight className="mx-auto mb-1 h-4 w-4 text-ocean-500" />
            <p className="text-xs font-semibold text-slate-700">{pet.weightKg ? `${pet.weightKg} kg` : '—'}</p>
            <p className="text-[10px] text-slate-400">Weight</p>
          </div>
          <div>
            <Fingerprint className="mx-auto mb-1 h-4 w-4 text-sand-400" />
            <p className="truncate text-xs font-semibold text-slate-700">{pet.microchipId || '—'}</p>
            <p className="text-[10px] text-slate-400">Microchip</p>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-400">Born {formatDate(pet.dateOfBirth)}</p>
      </Link>
    </motion.div>
  )
}
