import { useEffect, useState } from 'react'
import CirclePlus from 'components/Icons/CircleUser'

const LevelProgress = ({ current = 0, level, list, isPartner }) => {
  const [progress, setProgress] = useState('0%')
  useEffect(() => {
    if (level && !isPartner) {
      if (current >= list[list.length - 1]) {
        setProgress('100%')
      } else {
        const temp =
          ((current - list[level - 1]) / (list[level] - list[level - 1]) / 3) *
          100
        setProgress(`${(temp + (100 / 3) * (level - 1)).toFixed(2)}%`)
      }
    }
  }, [current, level, isPartner, list])
  return (
    <div>
      <div className="mb-2">
        <div className="flex items-baseline justify-center space-x-3">
          <p className="font-bold text-2xl">
            <span className="text-6xl">{current}</span>
            {!isPartner && current < list[list.length - 1] && (
              <span>/{list[level]}</span>
            )}
          </p>
          <div className="flex items-center justify-center text-base">
            <CirclePlus />
            <span className="ml-1">Invitees</span>
          </div>
        </div>
        {!isPartner && (
          <>
            {current >= list[list.length - 1] ? (
              <p className="font-normal text-green-600 text-sm text-center">
                You’re at the top level!
              </p>
            ) : (
              <p className="font-normal text-green-600 text-sm text-center">
                Gain {list[level]} referrals to level up
              </p>
            )}
          </>
        )}
      </div>
      {!isPartner && (
        <div className="w-full relative">
          <div
            style={{
              left: progress,
              visibility: current > 0 ? 'visible' : 'hidden',
            }}
            className="relative -translate-x-1/2 w-0 border-0 border-x-[6px] border-t-[12px] border-primary border-l-transparent border-r-transparent"
          ></div>
          <div className="relative overflow-hidden rounded-full w-full">
            <div className="bg-fill-3 h-[10px] flex justify-between">
              <div></div>
              <div className="s-divider s-divider-v"></div>
              <div className="s-divider s-divider-v"></div>
              <div></div>
            </div>
            <div
              className="absolute bg-primary h-[10px] top-0"
              style={{ width: progress }}
            ></div>
          </div>

          <div className="text-green-600 text-xs font-normal relative">
            <span className="absolute left-0">{list[0]}</span>
            <span className="absolute left-1/3 -translate-x-1/2">
              {list[1] || ''}
            </span>
            <span className="absolute left-2/3 -translate-x-1/2">
              {list[2] || ''}
            </span>
            <span className="absolute right-0">{list[3] || ''}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LevelProgress
