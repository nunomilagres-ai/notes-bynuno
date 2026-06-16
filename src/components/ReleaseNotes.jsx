// ReleaseNotes.jsx — in-app changelog for notes.bynuno.com
import { X } from 'lucide-react'

const RELEASES = [
  {
    version: '1.2',
    date: '2026-06-16',
    items: [
      'Calendário mensal com pontos por dia (notas 🟡 e lembretes 🔴)',
      'Tarefas recorrentes: diária, semanal, mensal e anual',
      'Dashboard de tarefas: Vencidas / Hoje / Futuras',
      'Criar tarefas diretamente dentro de cada nota',
      '60 emojis organizados por categoria (Saúde, Finanças, Férias…)',
      'Hora opcional nos lembretes; datas no passado permitidas',
      'Sidebar colapsável com dropdown de tema quando escondida',
      'Editar lembretes inline (botão ✏️ ao hover)',
    ],
  },
  {
    version: '1.1',
    date: '2026-06-15',
    items: [
      'IA: fotografa uma nota manuscrita e Claude Vision transcreve e classifica automaticamente',
      'Foto não é guardada — apenas o texto da nota',
      'Lembretes com notificações nativas do browser (polling 60s)',
      'Editor Markdown com preview e auto-save',
      'Temas personalizados com emoji e cor',
      'Login via Google através do byNuno Hub',
    ],
  },
  {
    version: '1.0',
    date: '2026-06-15',
    items: [
      'Lançamento de notes.bynuno.com',
      'Notas pessoais organizadas por temas',
      'Editor Markdown com preview',
    ],
  },
]

export default function ReleaseNotes({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-fade-in" style={{ background: '#FFFCF8' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f0ece4' }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: '#1a1614' }}>Novidades — Notes</h2>
            <p className="text-xs mt-0.5" style={{ color: '#a89f96' }}>notes.bynuno.com</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:opacity-70"><X size={14} style={{ color: '#a89f96' }} /></button>
        </div>
        <div className="overflow-y-auto p-5 flex flex-col gap-6" style={{ maxHeight: '70vh' }}>
          {RELEASES.map(r => (
            <div key={r.version} className="relative pl-4" style={{ borderLeft: '2px solid #f0ece4' }}>
              <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full" style={{ background: '#E8A838' }} />
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-xs font-bold" style={{ color: '#E8A838' }}>v{r.version}</span>
                <span className="text-[11px]" style={{ color: '#c8bfb6' }}>{r.date}</span>
              </div>
              <ul className="flex flex-col gap-1">
                {r.items.map((item, i) => (
                  <li key={i} className="text-xs flex gap-2" style={{ color: '#5a4e44' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#E8A838' }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}