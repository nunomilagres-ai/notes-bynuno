import { Plus, Search } from 'lucide-react'
import { fmtDate } from '@/lib/api'

export default function NotesList({ notes, selectedId, search, setSearch, onSelect, onNew, topicLabel }) {
  const filtered = notes.filter(n =>
    (n.title||'').toLowerCase().includes(search.toLowerCase()) ||
    (n.excerpt||'').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full" style={{background:'#FEFCF8',borderRight:'1px solid #e4ddd4'}}>
      <div className="px-3 pt-4 pb-2 flex-shrink-0" style={{borderBottom:'1px solid #f0ece4'}}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold truncate" style={{color:'#1a1614'}}>{topicLabel}</span>
          <button onClick={onNew} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{background:'#FFF6E8',color:'#D4822E',border:'1px solid #F0D9A8'}}>
            <Plus size={12}/>
          </button>
        </div>
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{color:'#a89f96'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar…"
            className="w-full pl-7 pr-2 py-1 text-xs rounded-lg focus:outline-none"
            style={{background:'#f5f0e8',border:'1px solid #e4ddd4',color:'#1a1614'}}/>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length===0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-xs" style={{color:'#a89f96'}}>{search?'Sem resultados':'Nenhuma nota ainda.'}</p>
            {!search && <button onClick={onNew} className="text-xs px-3 py-1 rounded-lg text-white" style={{background:'#E8A838'}}>+ Nova nota</button>}
          </div>
        )}
        {filtered.map(n=>(
          <button key={n.id} onClick={()=>onSelect(n)}
            className="w-full text-left px-3 py-2.5 transition-colors hover:opacity-90"
            style={{borderBottom:'1px solid #f5f0e8',borderLeft:selectedId===n.id?'2px solid #E8A838':'2px solid transparent',background:selectedId===n.id?'#FFF6E8':'transparent'}}>
            <div className="flex items-start justify-between gap-1">
              <p className="text-sm font-medium truncate flex-1" style={{color:'#1a1614'}}>{n.pinned?'📌 ':''}{n.title||'Sem título'}</p>
              <span className="text-[10px] flex-shrink-0 mt-0.5" style={{color:'#c8bfb6'}}>{fmtDate(n.updated_date)}</span>
            </div>
            <p className="text-xs mt-0.5 line-clamp-2" style={{color:'#a89f96'}}>{n.excerpt||''}</p>
          </button>
        ))}
      </div>
    </div>
  )
}