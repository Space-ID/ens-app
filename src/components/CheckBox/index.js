import React, { useEffect, useState } from 'react'
import './index.css'
export default function CheckBox({ checked, onChange, disabled = false }) {
  const [innerV, setInnerV] = useState(checked ?? false)
  const handler = (e) => {
    const v = e.target.checked
    setInnerV(v)
    if (typeof onChange === 'function') {
      onChange(v)
    }
  }
  useEffect(() => {
    if (checked !== undefined) {
      setInnerV(checked)
    }
  }, [checked])
  return (
    <input
      disabled={disabled}
      type="checkbox"
      checked={innerV}
      className="checkbox checkbox-primary"
      onChange={handler}
    />
  )
}
