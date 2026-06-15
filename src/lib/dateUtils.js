// dateUtils.js — helpers for optional-time dates

/**
 * Format an ISO date/datetime for display.
 * If no time part, show date only.
 */
export function fmtDisplayDate(iso) {
  if (!iso) return ''
  const hasTime = iso.includes('T') && !iso.endsWith('T00:00')
  const d = new Date(iso)
  if (hasTime) {
    return d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Get date part (YYYY-MM-DD) from ISO string.
 */
export function isoToDate(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

/**
 * Get time part (HH:MM) from ISO string, or '' if no time.
 */
export function isoToTime(iso) {
  if (!iso || !iso.includes('T')) return ''
  const t = iso.slice(11, 16)
  return t === '00:00' ? '' : t
}

/**
 * Combine date + optional time into ISO string.
 */
export function combineDatetime(date, time) {
  if (!date) return ''
  if (!time) return date + 'T00:00'
  return date + 'T' + time
}

/**
 * Is a date today?
 */
export function isToday(iso) {
  if (!iso) return false
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10)
}

/**
 * Is a date in the past (before today)?
 */
export function isPast(iso) {
  if (!iso) return false
  const d = new Date(iso)
  const now = new Date()
  return d < now
}

/**
 * Get YYYY-MM for a date.
 */
export function yearMonth(iso) {
  if (!iso) return ''
  return iso.slice(0, 7)
}