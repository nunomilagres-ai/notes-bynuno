// NoteReminders.jsx — reminders linked to a specific note, shown inside NoteEditor
import { useState, useEffect } from 'react'
import { Bell, Plus, Check, X, Pencil, Trash2, AlertCircle } from 'lucide-react'
import { api, fmtDue } from '@/lib/api'
import { toast } from 'sonner'

function QuickForm({ noteId, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  return (
    <form onSubmit={e => { e.preventDefault(); title.trim() && due && onSave({ title: title.trim(), due_date: due, note_id: noteId, body: null }) }}
      className="flex flex-col gap-1 p-2 rounded-lg" style={{ background: '#FFFCF8', border: '1px solid #e4ddd4' }}>
      <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da tarefa…"
        className="text-xs font-medium bg-transparent focus:outline-none" style={{ color: '#1a1614' }} />
      <input type="datetime-local" value={due} onChange={e => setDue(e.target.value)} required
        className="text-xs bg-transparent focus:outline-none" style={{ color: '#5a4e44' }} />
      <div className="flex gap-1.5 mt-0.5">
        <button type="submit" className="flex-1 py-1 rounded text-xs font-medium text-white flex items-center justify-center gap-1" style={{ background: '#E8A838' }}>
          <Check size={10} /> Criar
        </button>
        <button type="button" onClick={onCancel} className="px-2 py-1 rounded text-xs" style={{ background: '#f0ece4', color: '#7a6e64' }}>
          <X size={10} />
        </button>
      </div>
    </form>
  )
}

export default function NoteReminders({ noteId, reminders, setReminders }) {
  const [creating, setCreating] = useState(false)
  const noteReminders = reminders
    .filter(r => r.note_id === noteId)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))

  async function doCreate(d) {
    try {
      const r = await api.reminders.create(d)
      setReminders(p => [...p, r])
      setCreating(false)
      toast.success('Tarefa criada')
    } catch { toast.error('Erro ao criar') }
  }

  async function doToggle(r) {
    try {
      const u = await api.reminders.update(r.id, { ...r, completed: r.completed ? 0 : 1 })
      setReminders(p => p.map(x => x.id === r.id ? { ...x, ...u } : x))
    } catch { toast.error('Erro') }
  }

  async function doDelete(id) {
    try {
      await api.reminders.delete(id)
      setReminders(p => p.filter(x => x.id !== id))
    } catch { toast.error('Erro ao apagar') }
  }

  return (
    <div className="flex-shrink-0 px-5 py-3" style={{ borderTop: '1px solid #f0ece4', background: '#FEFCF8' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Bell size={11} style={{ color: '#E8A838' }} />
          <span className="text-xs font-semibold" style={{ color: '#5a4e44' }}>Tarefas desta nota</span>
          {noteReminders.length > 0 && (
            <span className="text-[10px] px-1 py-0.5 rounded-full font-bold text-white" style={{ background: '#E8A838' }}>{noteReminders.length}</span>
          )}
        </div>
        <button onClick={() => setCreating(c => !c)} className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#FFF6E8', color: '#D4822E', border: '1px solid #F0D9A8' }}>
          <Plus size={10} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {creating && <QuickForm noteId={noteId} onSave={doCreate} onCancel={() => setCreating(false)} />}
        {noteReminders.length === 0 && !creating && (
          <p className="text-xs" style={{ color: '#c8bfb6' }}>Sem tarefas. Clica + para adicionar.</p>
        )}
        {noteReminders.map(r => {
          const { label, overdue } = fmtDue(r.due_date)
          return (
            <div key={r.id} className="flex items-center gap-2 group">
              <button onClick={() => doToggle(r)} className="flex-shrink-0">
                {r.completed
                  ? <Check size={12} style={{ color: '#10B981' }} />
                  : <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: overdue ? '#EF4444' : '#E8A838' }} />}
              </button>
              <span className="text-xs flex-1 truncate" style={{ color: r.completed ? '#a89f96' : '#1a1614', textDecoration: r.completed ? 'line-through' : 'none' }}>
                {r.title}
              </span>
              <span className="text-[10px] flex-shrink-0" style={{ color: overdue && !r.completed ? '#EF4444' : '#a89f96' }}>
                {overdue && !r.completed && <AlertCircle size={9} className="inline mr-0.5" />}{label}
              </span>
              <button onClick={() => doDelete(r.id)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 flex-shrink-0">
                <Trash2 size={10} style={{ color: '#c8bfb6' }} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}