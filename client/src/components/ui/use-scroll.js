import { useState, useEffect, useCallback } from 'react'

export function useScroll(threshold) {
  const [scrolled, setScrolled] = useState(false)

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Check on first load
  useEffect(() => {
    onScroll()
  }, [onScroll])

  return scrolled
}
