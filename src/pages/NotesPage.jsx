import { useState, useEffect } from 'react'
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import ReleaseNotes from '@/components/ReleaseNotes'
import { api, gid } from '@/lib/api'
import { useAuth } from '@/lib/AuthContext'
import { startNotificationService } from '@/lib/NotificationService'
import TopicsSidebar from '@/components/TopicsSidebar'
import NotesList from '@/components/NotesList'
import NoteEditor from '@/components/NoteEditor'
import RemindersPanel from '@/components/RemindersPanel'
import DashboardPanel from '@/components/DashboardPanel'
import CalendarPanel from '@/components/CalendarPanel'
import { toast } from 'sonner'

export default function NotesPage() {
  const { user, logout } = useAuth()
  const [topics, setTopics] = useState([])
  const [notes, setNotes] = useState([])
  const [reminders, setReminders] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [showReminders, setShowReminders] = useState(false)
  const [search, setSearch] = useState('')
  const [mobilePane, setMobilePane] = useState('sidebar') // sidebar | list | editor
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showRelease, setShowRelease] = useState(false)

  // Load initial data
  useEffect(() => {
    api.topics.list().then(d => Array.isArray(d) && setTopics(d))
    api.reminders.list().then(d => Array.isArray(d) && setReminders(d))
    startNotificationService()
  }, [])

  // Load notes when topic changes
  useEffect(() => {
    setSelectedNote(null)
    setSearch('')
    const tid = selectedTopic === null ? undefined : selectedTopic === 'none' ? 'none' : selectedTopic
    api.notes.list(tid).then(d => Array.isArray(d) && setNotes(d))
  }, [selectedTopic])

  // Fetch full note content on select
  async function openNote(n) {
    try {
      const full = await api.notes.get(n.id)
      setSelectedNote(full)
      setMobilePane('editor')
    } catch { toast.error('Erro ao abrir nota') }
  }

  async function newNote() {
    const id = gid()
    const topicId = selectedTopic && selectedTopic !== 'none' ? selectedTopic : null
    try {
      const note = await api.notes.create({ id, title: 'Nova nota', content: '', topic_id: topicId })
      setNotes(p => [note, ...p])
      setSelectedNote(note)
      setMobilePane('editor')
    } catch { toast.error('Erro ao criar nota') }
  }

  function handleUpdate(updated) {
    setNotes(p => p.map(n => n.id === updated.id ? { ...n, ...updated, excerpt: (updated.content||'').replace(/#+\s|[*`>#-]/g,'').slice(0,80) } : n))
    setSelectedNote(updated)
  }

  function handleDelete(id) {
    setNotes(p => p.filter(n => n.id !== id))
    setSelectedNote(null)
    setMobilePane('list')
  }

  const [showDashboard, setShowDashboard] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  function handleSelectReminders(show) {
    setShowReminders(show)
    setShowDashboard(false)
    setShowCalendar(false)
    setSelectedNote(null)
    if (show) setMobilePane('editor')
    else setMobilePane('list')
  }

  function handleShowDashboard() {
    setShowDashboard(true)
    setShowReminders(false)
    setShowCalendar(false)
    setSelectedNote(null)
    setMobilePane('editor')
  }
  function handleShowCalendar() {
    setShowCalendar(true)
    setShowDashboard(false)
    setShowReminders(false)
    setSelectedNote(null)
    setMobilePane('editor')
  }

  const pendingReminders = reminders.filter(r => !r.completed).length
  const topicLabel = selectedTopic === null ? 'Todas as notas' : selectedTopic === 'none' ? '📋 Geral' : (topics.find(t => t.id === selectedTopic)?.name || 'Notas')

  const sidebar = <TopicsSidebar topics={topics} setTopics={setTopics} selectedTopic={selectedTopic} setSelectedTopic={t=>{setSelectedTopic(t);setMobilePane('list');setShowDashboard(false);setShowCalendar(false)}} showReminders={showReminders} onSelectReminders={handleSelectReminders} pendingReminders={pendingReminders} onShowDashboard={handleShowDashboard} showDashboard={showDashboard} onShowCalendar={handleShowCalendar} showCalendar={showCalendar}/>
  const list = <NotesList notes={notes} selectedId={selectedNote?.id} search={search} setSearch={setSearch} onSelect={openNote} onNew={newNote} topicLabel={topicLabel} sidebarOpen={sidebarOpen} topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} showReminders={showReminders} onSelectReminders={handleSelectReminders}/>
  const editor = showCalendar
    ? <CalendarPanel reminders={reminders} notes={notes} onOpenNote={openNote}/>
    : showDashboard
      ? <DashboardPanel reminders={reminders} setReminders={setReminders} allNotes={notes}/>
      : showReminders
        ? <RemindersPanel reminders={reminders} setReminders={setReminders} allNotes={notes}/>
        : selectedNote
          ? <NoteEditor key={selectedNote.id} note={selectedNote} topics={topics} onUpdate={handleUpdate} onDelete={handleDelete} onBack={()=>setMobilePane('list')} reminders={reminders} setReminders={setReminders}/>
          : <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{color:'#a89f96'}}><span className="text-4xl">🗒️</span><p className="text-sm">Seleciona ou cria uma nota</p><button onClick={newNote} className="px-4 py-2 rounded-xl text-sm text-white" style={{background:'linear-gradient(135deg,#E8A838,#D4822E)'}}>+ Nova nota</button></div>

  return (
    <div className="flex flex-col h-screen" style={{background:'#FAF7F2'}}>
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 h-11 flex-shrink-0" style={{background:'#FFFCF8',borderBottom:'1px solid #e4ddd4'}}>
        <div className="flex items-center gap-2">
          <button onClick={()=>setSidebarOpen(o=>!o)} className="p-1 rounded hover:opacity-70 hidden md:flex items-center" title={sidebarOpen?'Esconder temas':'Mostrar temas'}>
            {sidebarOpen ? <PanelLeftClose size={15} style={{color:'#a89f96'}}/> : <PanelLeftOpen size={15} style={{color:'#a89f96'}}/>}
          </button>
          <span className="text-base">🗒️</span>
          <span className="text-sm font-semibold" style={{color:'#1a1614'}}>Notes</span>
          <span className="text-xs" style={{color:'#c8bfb6'}}>by Nuno</span>
          <button onClick={()=>setShowRelease(true)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full hidden sm:block" style={{background:'#FFF6E8',color:'#D4822E',border:'1px solid #F0D9A8'}} title="Novidades">v1.2</button>
        </div>
        {showRelease && <ReleaseNotes onClose={()=>setShowRelease(false)}/>}
        <div className="flex items-center gap-2">
          {user?.avatar_url && <img src={user.avatar_url} className="w-6 h-6 rounded-full" alt=""/>}
          <span className="text-xs hidden sm:block" style={{color:'#7a6e64'}}>{user?.name}</span>
          <button onClick={logout} className="p-1.5 rounded hover:opacity-80" title="Sair"><LogOut size={13} style={{color:'#a89f96'}}/></button>
        </div>
      </header>
      {/* 3-col desktop / mobile panes */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <div className={`${mobilePane==='sidebar'?'flex':'hidden'} md:flex flex-col w-full md:w-52 lg:w-60 flex-shrink-0`} style={{borderRight:'1px solid #e4ddd4'}}>{sidebar}</div>}
        <div className={`${mobilePane==='list'?'flex':'hidden'} md:flex flex-col w-full md:w-56 lg:w-72 flex-shrink-0`} style={{borderRight:'1px solid #e4ddd4'}}>{list}</div>
        <div className={`${mobilePane==='editor'?'flex':'hidden'} md:flex flex-col flex-1 overflow-hidden`}>{editor}</div>
      </div>
    </div>
  )
}