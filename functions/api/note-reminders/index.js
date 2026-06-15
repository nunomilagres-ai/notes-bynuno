// GET  /api/note-reminders — listar lembretes do utilizador
// POST /api/note-reminders — criar lembrete
import { getAuthUser, unauthorized, badRequest, json } from '../../_auth.js';

function now() { return new Date().toISOString(); }
function gid() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  const url       = new URL(request.url);
  const completed = url.searchParams.get('completed'); // '0' | '1' | null (todos)

  let query;
  const bindings = [user.id];

  if (completed === '0') {
    query = `SELECT r.*, n.title AS note_title
             FROM note_reminders r
             LEFT JOIN notes n ON n.id = r.note_id
             WHERE r.user_id = ? AND r.completed = 0
             ORDER BY r.due_date ASC`;
  } else if (completed === '1') {
    query = `SELECT r.*, n.title AS note_title
             FROM note_reminders r
             LEFT JOIN notes n ON n.id = r.note_id
             WHERE r.user_id = ? AND r.completed = 1
             ORDER BY r.due_date DESC`;
  } else {
    query = `SELECT r.*, n.title AS note_title
             FROM note_reminders r
             LEFT JOIN notes n ON n.id = r.note_id
             WHERE r.user_id = ?
             ORDER BY r.completed ASC, r.due_date ASC`;
  }

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  let body;
  try { body = await request.json(); } catch { return badRequest('JSON inválido'); }

  const title    = (body.title || '').trim();
  const due_date = (body.due_date || '').trim();

  if (!title)    return badRequest('Título é obrigatório');
  if (!due_date) return badRequest('Data/hora é obrigatória');

  const id     = gid();
  const ts     = now();
  const noteId = body.note_id || null;
  const bBody  = body.body    || null;

  await env.DB.prepare(
    `INSERT INTO note_reminders (id, user_id, note_id, title, body, due_date, completed, notified, created_date, updated_date)
     VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
  ).bind(id, user.id, noteId, title, bBody, due_date, ts, ts).run();

  return json({ id, note_id: noteId, title, body: bBody, due_date, completed: 0, notified: 0, created_date: ts, updated_date: ts }, 201);
}