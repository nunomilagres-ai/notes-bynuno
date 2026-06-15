# notes.bynuno.com

Aplicação de notas pessoais com temas, editor Markdown e lembretes com notificações.

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions
- **Base de dados**: Cloudflare D1 (SQLite)
- **Auth**: Cookie partilhado `Domain=.bynuno.com` → valida em `bynuno.com/api/auth/me`

## Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar base de dados D1
```bash
npx wrangler d1 create notes-bynuno-db
# Copiar o database_id para wrangler.toml
npx wrangler d1 execute notes-bynuno-db --file=./schema.sql
```

### 3. Atualizar wrangler.toml
Substituir `REPLACE_WITH_YOUR_D1_DATABASE_ID` pelo ID gerado no passo anterior.

### 4. Desenvolvimento local
```bash
npm run build
npx wrangler pages dev ./dist --d1 DB=<database_id>
```

### 5. Deploy
```bash
npm run build
npx wrangler pages deploy ./dist
```
Configurar o domínio `notes.bynuno.com` no painel Cloudflare Pages.

## Estrutura
```
functions/
  _auth.js                  Auth helper (delega ao bynuno.com hub)
  [[path]].js               SPA fallback
  api/
    auth/me.js              GET /api/auth/me
    auth/logout.js          POST /api/auth/logout
    note-topics/index.js    GET/POST /api/note-topics
    note-topics/[id].js     PUT/DELETE /api/note-topics/:id
    notes/index.js          GET/POST /api/notes
    notes/[id].js           GET/PUT/DELETE /api/notes/:id
    note-reminders/index.js GET/POST /api/note-reminders
    note-reminders/[id].js  GET/PUT/DELETE /api/note-reminders/:id

src/
  pages/NotesPage.jsx       Layout principal (3 colunas)
  components/
    TopicsSidebar.jsx       Sidebar de temas
    TopicForm.jsx           Formulário criar/editar tema
    NotesList.jsx           Lista de notas
    NoteEditor.jsx          Editor Markdown
    RemindersPanel.jsx      Painel de lembretes
    ReminderItem.jsx        Item de lembrete individual
  lib/
    AuthContext.jsx         Context de autenticação
    api.js                  API client + helpers
    NotificationService.js  Polling + Web Notifications
```

## Funcionalidades
- Temas personalizados (emoji + cor) para organizar notas
- Editor Markdown com preview
- Notas fixadas (pin)
- Lembretes com data/hora e notificações nativas do browser
- Notas ligadas a lembretes
- Autenticação via byNuno Hub (Google OAuth)
- Responsive: mobile (panes) + desktop (3 colunas)