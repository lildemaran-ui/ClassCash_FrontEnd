// components/ContentLoader.tsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Spinner from './spinner'

export default function ContentLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [location])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && <Spinner local />}
      {children}
    </div>
  )
}