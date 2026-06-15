import { Check, Trash2, AlertCircle } from 'lucide-react'
import { fmtDue } from '@/lib/api'

export default function ReminderItem({ r, onToggle, onDelete }) {
  const { label, overdue } = fmtDue(r.due_date)
  const bg = overdue && !r.completed ? '#FFF0F0' : '#FFFCF8'
  const bd = overdue && !r.completed ? '#FECACA' : '#e4ddd4'
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: bg, border: '1px solid ' + bd }}>
      <button onClick={() => onToggle(r)} className="mt-0.5 flex-shrink-0">
        {r.completed
          ? <Check size={14} style={{ color: '#10B981' }} />
          : <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: '#E8A838' }} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: r.completed ? '#a89f96' : '#1a1614', textDecoration: r.completed ? 'line-through' : 'none' }}>
          {r.title}
        </p>
        {r.body && <p className="text-xs mt-0.5 truncate" style={{ color: '#7a6e64' }}>{r.body}</p>}
        {r.note_title && <p className="text-[10px] mt-0.5" style={{ color: '#a89f96' }}>📝 {r.note_title}</p>}
        <div className="flex items-center gap-1 mt-1">
          {overdue && !r.completed && <AlertCircle size={10} style={{ color: '#EF4444' }} />}
          <span className="text-[10px]" style={{ color: overdue && !r.completed ? '#EF4444' : '#a89f96' }}>{label}</span>
        </div>
      </div>
      <button onClick={() => onDelete(r.id)} className="p-1 rounded hover:bg-red-50 flex-shrink-0">
        <Trash2 size={11} style={{ color: '#c8bfb6' }} />
      </button>
    </div>
  )
}