import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="darslar" element={<Lessons />} />
          <Route path="darslar/:lessonId" element={<LessonDetail />} />
          <Route path="galereya" element={<Gallery />} />
          <Route path="tajribalar" element={<Experiments />} />
          <Route path="qollanmalar" element={<Guides />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
