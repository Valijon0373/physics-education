import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * `id` bigint/uuid/int uchun PostgREST `.eq('id', …)` mos kelishi uchun bir nechta variant.
 * Avval string (katta bigint uchun xavfsiz), keyin faqat xavfsiz integer bo‘lsa number.
 */
export function eqCandidatesForTaskId(id: string): (string | number)[] {
  const t = String(id).trim()
  const out: (string | number)[] = [t]
  if (/^\d+$/.test(t)) {
    const n = Number(t)
    if (Number.isSafeInteger(n)) out.push(n)
  }
  return out
}

export async function deleteTaskRow(
  client: SupabaseClient,
  table: string,
  id: string,
): Promise<{ ok: boolean; error: string | null }> {
  for (const candidate of eqCandidatesForTaskId(id)) {
    // DELETE’da `count` ba’zan null qaytishi mumkin; `select()` bilan representation qaytartirib,
    // ta’sir qilingan qatorlarni data.length orqali ham tekshiramiz.
    const { data, error, count } = await client
      .from(table)
      .delete({ count: 'exact' })
      .eq('id', candidate)
      .select('id')
    if (error) return { ok: false, error: error.message }
    const affected = (count ?? 0) || (data?.length ?? 0)
    if (affected > 0) return { ok: true, error: null }
  }
  return { ok: false, error: "Topshiriq o'chirilmadi: mos ID topilmadi." }
}
