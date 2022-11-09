import { useEffect, useState } from 'react'
import Tooltip from './index'

function NewFeatureToolTip({ children }) {
  const [show, setShow] = useState(false)
  const onOpenChange = () => {
    const key = process.env.REACT_APP_NEW_FEAT
    setShow(false)
    if (key) {
      window.localStorage.setItem(key, '1')
    }
  }
  useEffect(() => {
    const key = process.env.REACT_APP_NEW_FEAT
    if (key) {
      const state = window.localStorage.getItem(key)
      if (!state) {
        setShow(true)
      }
    }
  }, [])
  return (
    <>
      {show ? (
        <Tooltip
          title="New feature updated!"
          color="#2980E8"
          contentClass="text-white text-sm font-semibold py-2 px-4"
          defaultOpen={true}
          onOpenChange={onOpenChange}
          align="end"
          hideWhenClick
        >
          {children}
        </Tooltip>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default NewFeatureToolTip
