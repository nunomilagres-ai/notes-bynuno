// CalendarPanel.jsx — monthly calendar showing notes and reminders by date
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Bell, StickyNote } from 'lucide-react'

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function firstDayOfMonth(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7 } // 0=Mon

export default function CalendarPanel({ reminders, notes, onOpenNote }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(null)

  function prev() { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); setSelected(null) }
  function next() { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1); setSelected(null) }

  const days = daysInMonth(year, month)
  const firstDay = firstDayOfMonth(year, month)
  const todayStr = today.toISOString().slice(0, 10)

  // Build a map: dateStr -> { reminders: [], notes: [] }
  const map = {}
  reminders.forEach(r => {
    const d = r.due_date ? r.due_date.slice(0, 10) : null
    if (!d) return
    if (!map[d]) map[d] = { reminders: [], notes: [] }
    map[d].reminders.push(r)
  })
  notes.forEach(n => {
    const d = n.created_date ? n.created_date.slice(0, 10) : null
    if (!d) return
    if (!map[d]) map[d] = { reminders: [], notes: [] }
    map[d].notes.push(n)
  })

  const selKey = selected ? `${year}-${String(month+1).padStart(2,'0')}-${String(selected).padStart(2,'0')}` : null
  const selData = selKey ? (map[selKey] || { reminders: [], notes: [] }) : null

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const dayNames = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']

  return (
    <div className="flex flex-col h-full" style={{ background: '#fff' }}>
      <div className="px-4 pt-4 pb-2 flex-shrink-0" style={{ borderBottom: '1px solid #f0ece4' }}>
        <div className="flex items-center justify-between">
          <button onClick={prev} className="p-1 rounded hover:bg-amber-50"><ChevronLeft size={16} style={{ color: '#a89f96' }}/></button>
          <span className="text-sm font-semibold" style={{ color: '#1a1614' }}>{monthNames[month]} {year}</span>
          <button onClick={next} className="p-1 rounded hover:bg-amber-50"><ChevronRight size={16} style={{ color: '#a89f96' }}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pt-2">
          <div className="grid grid-cols-7 mb-1">
            {dayNames.map(d => <div key={d} className="text-[10px] font-semibold text-center py-1" style={{ color: '#a89f96' }}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={'e'+i}/>
              const dKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const data = map[dKey]
              const isToday = dKey === todayStr
              const isSel = selected === day
              const hasR = data?.reminders?.length > 0
              const hasN = data?.notes?.length > 0
              return (
                <button key={day} onClick={() => setSelected(isSel ? null : day)}
                  className="flex flex-col items-center py-1 rounded-lg transition-colors"
                  style={{ background: isSel ? '#FFF6E8' : 'transparent', outline: isToday ? '2px solid #E8A838' : 'none' }}>
                  <span className="text-xs font-medium" style={{ color: isSel ? '#D4822E' : isToday ? '#E8A838' : '#1a1614' }}>{day}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {hasR && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#EF4444' }}/>}
                    {hasN && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E8A838' }}/>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        {selData && (
          <div className="px-3 pt-3 pb-4">
            <p className="text-xs font-semibold mb-2" style={{ color: '#5a4e44' }}>
              {selected} {monthNames[month]} {year}
            </p>
            {selData.reminders.length === 0 && selData.notes.length === 0 && (
              <p className="text-xs" style={{ color: '#a89f96' }}>Sem notas ou lembretes neste dia.</p>
            )}
            {selData.reminders.map(r => (
              <div key={r.id} className="flex items-center gap-2 mb-1.5 p-2 rounded-lg" style={{ background: '#FFF0F0', border: '1px solid #FECACA' }}>
                <Bell size={11} style={{ color: '#EF4444' }} />
                <span className="text-xs truncate flex-1" style={{ color: r.completed ? '#a89f96' : '#1a1614', textDecoration: r.completed ? 'line-through' : 'none' }}>{r.title}</span>
                <span className="text-[10px]" style={{ color: '#a89f96' }}>{r.due_date?.slice(11,16)||''}</span>
              </div>
            ))}
            {selData.notes.map(n => (
              <button key={n.id} onClick={() => onOpenNote && onOpenNote(n)}
                className="w-full text-left flex items-center gap-2 mb-1.5 p-2 rounded-lg hover:opacity-90"
                style={{ background: '#FFFCF8', border: '1px solid #e4ddd4' }}>
                <StickyNote size={11} style={{ color: '#E8A838' }} />
                <span className="text-xs truncate flex-1" style={{ color: '#1a1614' }}>{n.title||'Sem título'}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
