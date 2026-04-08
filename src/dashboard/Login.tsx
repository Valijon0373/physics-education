import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_AUTH_KEY, loginAdminApi } from './auth'

export function AdminLogin() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_AUTH_KEY) === '1') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!login.trim() || !password.trim()) return

    setIsSubmitting(true)
    setErrorMessage('')
    const result = await loginAdminApi(login, password)
    setIsSubmitting(false)

    if (!result.ok) {
      setErrorMessage(result.error)
      return
    }

    sessionStorage.setItem(ADMIN_AUTH_KEY, '1')
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Login: <span className="font-medium">Salayeva</span>, Parol:{' '}
          <span className="font-medium">Hilola</span>
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Login
            </span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 outline-none ring-cyan-500 transition focus:ring-2 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                placeholder="Login kiriting"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Parol
            </span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-10 outline-none ring-cyan-500 transition focus:ring-2 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                placeholder="Parol kiriting"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {errorMessage ? (
            <p className="text-sm text-rose-600 dark:text-rose-400">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  )
}
