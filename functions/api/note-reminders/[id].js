// GET    /api/note-reminders/:id — obter lembrete
// PUT    /api/note-reminders/:id — editar / marcar concluído
// DELETE /api/note-reminders/:id — apagar lembrete
import { getAuthUser, unauthorized, badRequest, notFound, json } from '../../_auth.js';

function now() { return new Date().toISOString(); }

export async function onRequestGet({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  const reminder = await env.DB.prepare(
    'SELECT * FROM note_reminders WHERE id = ? AND user_id = ?'
  ).bind(params.id, user.id).first();

  if (!reminder) return notFound();
  return json(reminder);
}

export async function onRequestPut({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  const reminder = await env.DB.prepare(
    'SELECT * FROM note_reminders WHERE id = ? AND user_id = ?'
  ).bind(params.id, user.id).first();
  if (!reminder) return notFound();

  let body;
  try { body = await request.json(); } catch { return badRequest('JSON inválido'); }

  const title     = body.title     !== undefined ? (body.title || '').trim()      : reminder.title;
  const bBody     = body.body      !== undefined ? (body.body || null)             : reminder.body;
  const due_date  = body.due_date  !== undefined ? (body.due_date || '').trim()    : reminder.due_date;
  const completed = body.completed !== undefined ? (body.completed ? 1 : 0)        : reminder.completed;
  const noteId    = body.note_id   !== undefined ? (body.note_id || null)           : reminder.note_id;

  if (!title)    return badRequest('Título é obrigatório');
  if (!due_date) return badRequest('Data/hora é obrigatória');

  const ts = now();
  await env.DB.prepare(
    `UPDATE note_reminders
     SET title = ?, body = ?, due_date = ?, completed = ?, note_id = ?, updated_date = ?
     WHERE id = ? AND user_id = ?`
  ).bind(title, bBody, due_date, completed, noteId, ts, params.id, user.id).run();

  return json({ id: params.id, title, body: bBody, due_date, completed, note_id: noteId, updated_date: ts });
}

export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return unauthorized();

  const reminder = await env.DB.prepare(
    'SELECT id FROM note_reminders WHERE id = ? AND user_id = ?'
  ).bind(params.id, user.id).first();
  if (!reminder) return notFound();

  await env.DB.prepare('DELETE FROM note_reminders WHERE id = ? AND user_id = ?')
    .bind(params.id, user.id).run();

  return json({ ok: true });
}