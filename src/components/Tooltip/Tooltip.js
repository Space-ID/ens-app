import { ReactNode } from 'react'
export const Tooltip = ({ message, children, delay }) => {
  return (
    <div className="relative flex flex-col items-center cursor-pointer group">
      {children}
      <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 transition-all ease-out delay-100 group-hover:block group-hover:flex">
        <span className="relative z-10 px-2 py-[2px] text-white whitespace-nowrap bg-[#508292] rounded-lg text-xs font-semibold leading-5">
          {message}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-[#508292]" />
      </div>
    </div>
  )
}

export default Tooltip
