import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { CrossIcon } from 'components/Icons'
import cn from 'classnames'

function Modal({
  small,
  children,
  closeModal,
  width = '40%',
  cannotCloseFromOutside = false,
  showingCrossIcon = false,
  className = 'pt-6 pb-[36px] px-[40px]',
}) {
  const modalRoot = document.getElementById('modal-root')
  return ReactDOM.createPortal(
    <div className="fixed left-0 top-0 w-full h-full p-0 flex justify-center items-center bg-black/50 z-[100]">
      <div
        className={cn(
          `bg-[#0E4549] overflow-y-auto h-auto rounded-[24px] relative mx-7 md:mx-0 z-[100] max-h-[calc(100vh-80px)] custom-modal`,
          className
        )}
        style={{ width }}
        onClick={(event) => event.stopPropagation()}
        small={small}
      >
        {showingCrossIcon && (
          <div
            className="absolute right-[24px] top-[24px] select-none outline-none"
            onClick={() => {
              closeModal()
            }}
          >
            <CrossIcon className="text-white cursor-pointer" size={11} />
          </div>
        )}

        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
