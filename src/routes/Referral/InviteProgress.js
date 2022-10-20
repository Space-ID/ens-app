import React, { useEffect, useState } from 'react'

const InviteProgress = ({ total = 0, current = 0, levelTitle, levelIcons }) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (total > 0) {
      const temp = (current / total).toFixed(2) * 100
      setProgress(Math.min(temp, 100))
    }
  }, [current, total])
  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <div
        className="absolute top-0 left-0 w-full h-full radial-progress"
        style={{ '--value': progress, '--size': '200px', '--thickness': '8px' }}
      ></div>
      <div className="m-auto flex h-full">
        <div className="text-center m-auto flex flex-col items-center justify-center font-bold">
          <p className="text-lg text-green-600">Current Level</p>
          <p className="referral-text mb-2 text-2xl">{levelTitle}</p>
          <div className="flex items-center space-x-2">
            {levelIcons.map((v) => (
              <img src={v} alt="" width={28} height={28} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteProgress
