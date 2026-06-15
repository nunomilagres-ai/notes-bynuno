// src/lib/api.js — API client helpers
const J = { 'Content-Type': 'application/json' }

export const api = {
  topics: {
    list:   ()       => fetch('/api/note-topics').then(r => r.json()),
    create: (d)      => fetch('/api/note-topics', { method: 'POST', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    update: (id, d)  => fetch(`/api/note-topics/${id}`, { method: 'PUT', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    delete: (id)     => fetch(`/api/note-topics/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },
  notes: {
    list:   (tid)    => fetch(`/api/notes${tid !== undefined ? `?topic_id=${tid}` : ''}`).then(r => r.json()),
    get:    (id)     => fetch(`/api/notes/${id}`).then(r => r.json()),
    create: (d)      => fetch('/api/notes', { method: 'POST', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    update: (id, d)  => fetch(`/api/notes/${id}`, { method: 'PUT', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    delete: (id)     => fetch(`/api/notes/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },
  reminders: {
    list:   ()       => fetch('/api/note-reminders').then(r => r.json()),
    create: (d)      => fetch('/api/note-reminders', { method: 'POST', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    update: (id, d)  => fetch(`/api/note-reminders/${id}`, { method: 'PUT', headers: J, body: JSON.stringify(d) }).then(r => r.json()),
    delete: (id)     => fetch(`/api/note-reminders/${id}`, { method: 'DELETE' }).then(r => r.json()),
  },
}

export function gid() {
  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('')
}

export function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const diffDays = Math.floor((Date.now() - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return d.toLocaleDateString('pt-PT', { weekday: 'short' })
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
}

export function fmtDue(iso) {
  if (!iso) return { label: '', overdue: false }
  const d = new Date(iso)
  const diff = d - Date.now()
  const overdue = diff < 0
  let label
  if (overdue) {
    label = d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } else if (diff < 3600000) {
    label = 'em ' + Math.round(diff / 60000) + ' min'
  } else if (diff < 86400000) {
    label = 'hoje ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 172800000) {
    label = 'amanha ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
  } else {
    label = d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }
  return { label, overdue }
}

export function renderMarkdown(text) {
  if (!text) return ''
  const s = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="md-pre"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    .replace(/^#{6} (.+)$/gm, '<h6 class="md-h6">$1</h6>')
    .replace(/^#{5} (.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/^#{4} (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^#{3} (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^#{1} (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="md-ul">$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/^---$/gm, '<hr class="md-hr" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-a">$1</a>')
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, '<br />')
  return '<p class="md-p">' + s + '</p>'
}