import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PageLoader } from './components/PageLoader'

const Home = lazy(async () => {
  const m = await import('./pages/Home')
  return { default: m.Home }
})
const Lessons = lazy(async () => {
  const m = await import('./pages/Lessons')
  return { default: m.Lessons }
})
const LessonDetail = lazy(async () => {
  const m = await import('./pages/LessonDetail')
  return { default: m.LessonDetail }
})
const Gallery = lazy(async () => {
  const m = await import('./pages/Gallery')
  return { default: m.Gallery }
})
const Experiments = lazy(async () => {
  const m = await import('./pages/Experiments')
  return { default: m.Experiments }
})
const Guides = lazy(async () => {
  const m = await import('./pages/Guides')
  return { default: m.Guides }
})
const Owner = lazy(async () => {
  const m = await import('./pages/Owner')
  return { default: m.Owner }
})
const AdminLogin = lazy(async () => {
  const m = await import('./dashboard/Login')
  return { default: m.AdminLogin }
})
const AdminDashboard = lazy(async () => {
  const m = await import('./dashboard/Dashboard')
  return { default: m.AdminDashboard }
})

export default function App() {
  return (
    <BrowserRouter unstable_useTransitions={false}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="darslar"
            element={
              <Suspense fallback={<PageLoader />}>
                <Lessons />
              </Suspense>
            }
          />
          <Route
            path="darslar/:lessonId"
            element={
              <Suspense fallback={<PageLoader />}>
                <LessonDetail />
              </Suspense>
            }
          />
          <Route path="galereya" element={<Gallery />} />
          <Route
            path="tajribalar"
            element={
              <Suspense fallback={<PageLoader />}>
                <Experiments />
              </Suspense>
            }
          />
          <Route
            path="qollanmalar"
            element={
              <Suspense fallback={<PageLoader />}>
                <Guides />
              </Suspense>
            }
          />
          <Route
            path="muallif"
            element={
              <Suspense fallback={<PageLoader />}>
                <Owner />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
