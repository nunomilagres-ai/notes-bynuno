import { useState } from 'react'
import { Check, X } from 'lucide-react'

const EMOJIS = ['📋','📝','🎬','🎁','✈️','🛒','💡','📚','🎮','🎵','💼','🏠','🍕','🎯','💻','❤️']
const COLORS = ['#E8A838','#D4822E','#3B82F6','#10B981','#8B5CF6','#EF4444','#F59E0B','#06B6D4']

export default function TopicForm({ v, onSave, onCancel }) {
  const [name,setName]=useState(v?.name??'')
  const [emoji,setEmoji]=useState(v?.emoji??'📋')
  const [color,setColor]=useState(v?.color??'#E8A838')
  return (
    <form onSubmit={e=>{e.preventDefault();name.trim()&&onSave({name:name.trim(),emoji,color})}}
      className="p-2 rounded-lg" style={{background:'#FFFCF8',border:'1px solid #e4ddd4'}}>
      <input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do tema…"
        className="w-full text-xs bg-transparent focus:outline-none mb-1.5" style={{color:'#1a1614'}}/>
      <div className="flex flex-wrap gap-1 mb-1.5">
        {EMOJIS.map(e=>(
          <button key={e} type="button" onClick={()=>setEmoji(e)}
            className="w-6 h-6 rounded text-sm flex items-center justify-center"
            style={{background:emoji===e?'#FFF6E8':'transparent',outline:emoji===e?'1.5px solid #E8A838':'none'}}>
            {e}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {COLORS.map(c=>(
          <button key={c} type="button" onClick={()=>setColor(c)}
            className="w-4 h-4 rounded-full border-2"
            style={{background:c,borderColor:color===c?'#1a1614':'transparent'}}/>
        ))}
      </div>
      <div className="flex gap-1.5">
        <button type="submit" className="flex-1 py-1 rounded text-xs font-medium text-white flex items-center justify-center gap-1" style={{background:'#E8A838'}}>
          <Check size={10}/> Guardar
        </button>
        <button type="button" onClick={onCancel} className="px-2 py-1 rounded text-xs" style={{background:'#f0ece4',color:'#7a6e64'}}>
          <X size={10}/>
        </button>
      </div>
    </form>
  )
}