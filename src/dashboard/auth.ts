import { supabase } from '../lib/supabase'

export const ADMIN_AUTH_KEY = 'admin-auth'

const FIXED_LOGIN = 'Salayeva'
const FIXED_PASSWORD = 'Hilola'

export async function loginAdminApi(login: string, password: string) {
  // Supabase request for initial API integration (ping style).
  // Real auth can be switched to Supabase Auth/table checks next.
  await supabase.from('profiles').select('id').limit(1)

  const isValid = login.trim() === FIXED_LOGIN && password.trim() === FIXED_PASSWORD

  if (!isValid) {
    return { ok: false as const, error: "Login yoki parol noto'g'ri." }
  }

  return { ok: true as const }
}
