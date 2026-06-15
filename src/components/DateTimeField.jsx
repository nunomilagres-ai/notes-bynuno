// DateTimeField.jsx — date (required) + time (optional) + recurrence (optional)
import { isoToDate, isoToTime, combineDatetime } from '@/lib/dateUtils'

const RECURRENCES = [
  { value: '', label: 'Sem recorrência' },
  { value: 'daily',   label: 'Diária' },
  { value: 'weekly',  label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly',  label: 'Anual' },
]

export default function DateTimeField({ value, onChange, label, recurrence, onRecurrenceChange }) {
  const date = isoToDate(value)
  const time = isoToTime(value)

  function handleDate(e) { onChange(combineDatetime(e.target.value, time)) }
  function handleTime(e) { onChange(combineDatetime(date, e.target.value)) }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1.5">
        <div className="flex flex-col flex-1">
          <label className="text-[10px] mb-0.5" style={{ color: '#a89f96' }}>{label || 'Data'} *</label>
          <input type="date" value={date} onChange={handleDate} required
            className="text-xs bg-transparent focus:outline-none" style={{ color: '#5a4e44' }} />
        </div>
        <div className="flex flex-col w-24">
          <label className="text-[10px] mb-0.5" style={{ color: '#a89f96' }}>Hora (opcional)</label>
          <input type="time" value={time} onChange={handleTime}
            className="text-xs bg-transparent focus:outline-none" style={{ color: '#5a4e44' }} />
        </div>
      </div>
      {onRecurrenceChange !== undefined && (
        <div className="flex flex-col">
          <label className="text-[10px] mb-0.5" style={{ color: '#a89f96' }}>Recorrência</label>
          <select value={recurrence || ''} onChange={e => onRecurrenceChange(e.target.value || null)}
            className="text-xs bg-transparent focus:outline-none" style={{ color: '#5a4e44' }}>
            {RECURRENCES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}
