import { useEffect, useState } from 'react'
import './index.css'
function NewFeatureBadge({ id, children }) {
  const [showBadge, setShowBadge] = useState('')
  const handleClick = () => {
    window.localStorage.setItem(id, '1')
    setShowBadge('')
  }
  useEffect(() => {
    if (id) {
      const state = window.localStorage.getItem(id)
      if (!state) {
        setShowBadge('dot-badge')
      }
    }
  }, [id])
  return (
    <div onClick={handleClick} className={showBadge}>
      {children}
    </div>
  )
}

export default NewFeatureBadge
