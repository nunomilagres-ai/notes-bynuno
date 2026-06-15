// DashboardPanel.jsx — today's tasks, overdue, and future tasks
import { LayoutDashboard, AlertCircle, Clock, CalendarDays, Check, Trash2 } from 'lucide-react'
import { api, fmtDue } from '@/lib/api'
import { toast } from 'sonner'

function Section({ title, icon, color, items, allNotes, onToggle, onDelete }) {
  if (items.length === 0) return null
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{title}</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: color }}>{items.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map(r => {
          const { label } = fmtDue(r.due_date)
          const noteName = allNotes.find(n => n.id === r.note_id)?.title
          return (
            <div key={r.id} className="flex items-start gap-2 p-2.5 rounded-lg group" style={{ background: '#FFFCF8', border: '1px solid #e4ddd4' }}>
              <button onClick={() => onToggle(r)} className="mt-0.5 flex-shrink-0">
                {r.completed
                  ? <Check size={13} style={{ color: '#10B981' }} />
                  : <div className="w-3 h-3 rounded-full border-2 mt-0.5" style={{ borderColor: color }} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: r.completed ? '#a89f96' : '#1a1614', textDecoration: r.completed ? 'line-through' : 'none' }}>
                  {r.title}
                </p>
                {r.body && <p className="text-[11px] truncate mt-0.5" style={{ color: '#7a6e64' }}>{r.body}</p>}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px]" style={{ color: '#a89f96' }}>{label}</span>
                  {noteName && <span className="text-[10px]" style={{ color: '#a89f96' }}>📝 {noteName}</span>}
                </div>
              </div>
              <button onClick={() => onDelete(r.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 flex-shrink-0">
                <Trash2 size={10} style={{ color: '#c8bfb6' }} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPanel({ reminders, setReminders, allNotes }) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const pending = reminders.filter(r => !r.completed)
  const overdue = pending.filter(r => new Date(r.due_date) < todayStart).sort((a,b) => a.due_date.localeCompare(b.due_date))
  const today   = pending.filter(r => { const d = new Date(r.due_date); return d >= todayStart && d <= todayEnd }).sort((a,b) => a.due_date.localeCompare(b.due_date))
  const future  = pending.filter(r => new Date(r.due_date) > todayEnd).sort((a,b) => a.due_date.localeCompare(b.due_date))
  const done    = reminders.filter(r => r.completed).sort((a,b) => b.due_date.localeCompare(a.due_date)).slice(0, 10)

  async function doToggle(r) {
    try { const u = await api.reminders.update(r.id, { ...r, completed: r.completed ? 0 : 1 }); setReminders(p => p.map(x => x.id === r.id ? { ...x, ...u } : x)) }
    catch { toast.error('Erro') }
  }
  async function doDelete(id) {
    try { await api.reminders.delete(id); setReminders(p => p.filter(x => x.id !== id)) }
    catch { toast.error('Erro ao apagar') }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#fff' }}>
      <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #f0ece4' }}>
        <div className="flex items-center gap-2">
          <LayoutDashboard size={15} style={{ color: '#E8A838' }} />
          <span className="text-sm font-semibold" style={{ color: '#1a1614' }}>Dashboard de Tarefas</span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#a89f96' }}>{now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {overdue.length === 0 && today.length === 0 && future.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="text-3xl">✅</span>
            <p className="text-sm" style={{ color: '#a89f96' }}>Sem tarefas pendentes!</p>
          </div>
        )}
        <Section title="Vencidas" icon={<AlertCircle size={13}/>} color="#EF4444" items={overdue} allNotes={allNotes} onToggle={doToggle} onDelete={doDelete}/>
        <Section title="Hoje" icon={<Clock size={13}/>} color="#E8A838" items={today} allNotes={allNotes} onToggle={doToggle} onDelete={doDelete}/>
        <Section title="Futuras" icon={<CalendarDays size={13}/>} color="#3B82F6" items={future} allNotes={allNotes} onToggle={doToggle} onDelete={doDelete}/>
        {done.length > 0 && (
          <Section title="Concluídas recentemente" icon={<Check size={13}/>} color="#10B981" items={done} allNotes={allNotes} onToggle={doToggle} onDelete={doDelete}/>
        )}
      </div>
    </div>
  )
}
