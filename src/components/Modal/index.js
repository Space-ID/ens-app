import React, { useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import './index.css'
import { CrossIcon } from '../Icons'

export default function Modal(props) {
  const {
    open,
    onOpenChange,
    title,
    closable = true,
    children,
    width = 'auto',
  } = props
  const handleClickOutside = useCallback((e) => e.preventDefault(), [])
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay">
          <Dialog.Content
            autofocus={false}
            onInteractOutside={handleClickOutside}
            className="dialog-content select-none outline-none"
            style={{ width }}
          >
            {closable && (
              <Dialog.Close className="absolute top-6 right-6">
                <CrossIcon size={11} />
              </Dialog.Close>
            )}
            {title && (
              <Dialog.Title className="text-center md:text-5xl text-3xl font-bold mb-8 mt-3">
                {title}
              </Dialog.Title>
            )}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
