// DateTimeField.jsx — date (required) + time (optional)
import { isoToDate, isoToTime, combineDatetime } from '@/lib/dateUtils'

export default function DateTimeField({ value, onChange, label }) {
  const date = isoToDate(value)
  const time = isoToTime(value)

  function handleDate(e) { onChange(combineDatetime(e.target.value, time)) }
  function handleTime(e) { onChange(combineDatetime(date, e.target.value)) }

  return (
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
  )
}