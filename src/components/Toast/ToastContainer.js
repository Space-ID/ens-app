import React from 'react'
import { ToastContainer, toast } from 'material-react-toastify'
import { CloseIcon, CrossIcon } from 'components/Icons'

const contextClass = {
  success: 'bg-[rgba(30,239,164,0.5)]',
  error: 'bg-[rgba(237,126,23,0.5)]',
  info: 'bg-gray-600',
  warning: 'bg-orange-400',
  default: 'bg-indigo-600',
  dark: 'bg-white-600 font-gray-300',
}

export default function CustomToastContainer() {
  return (
    <ToastContainer
      toastClassName={({ type }) =>
        contextClass[type || 'default'] +
        ' backdrop-blur-md flex px-6 py-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer w-[328px]'
      }
      progressClassName="hidden"
      closeButton={<CloseIcon size={11} />}
      bodyClassName={() => 'text-sm font-white font-med block p-0'}
    />
  )
}
