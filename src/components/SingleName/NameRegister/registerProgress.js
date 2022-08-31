import React, { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { RegisterState } from './constant'
const RegisterProgress = ({ state }) => {
  const [progress, setProgress] = useState(5)
  const progressRef = useRef(progress)
  const timer = useRef()
  progressRef.current = progress
  const increase = useCallback((max = 5, time = 100) => {
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      if (progressRef.current < max) {
        setProgress(progressRef.current + 0.1)
      } else if (timer) {
        window.clearInterval(timer.current)
      }
    }, time)
  }, [])
  useEffect(() => {
    switch (state) {
      case RegisterState.request: {
        setProgress(5)
        break
      }
      case RegisterState.requesting: {
        increase(40)
        break
      }
      case RegisterState.confirm: {
        if (progressRef.current < 50) {
          increase(50, (50 - progressRef.current) / 0.1 / 1000)
        } else {
          setProgress(50)
        }
        break
      }
      case RegisterState.registering: {
        if (progressRef.current < 50) {
          setProgress(50)
        }
        increase(80)
        break
      }
      case RegisterState.registerSuccess: {
        increase(100, (100 - progressRef.current) / 0.1 / 1000)
        break
      }
      case RegisterState.registerError: {
        window.clearInterval(timer.current)
        break
      }
      default: {
        break
      }
    }
  }, [state])

  return (
    <div className="md:w-[928px] w-full mt-[32px]">
      <div className="relative w-full h-[20px]">
        <div className="absolute w-full h-full rounded-[10px] bg-[#CCFCFF]/20" />
        <div
          className={cn(
            'absolute h-full rounded-[10px]',
            state === 'REGISTER_ERROR' ? 'bg-[#ED7E17]' : 'bg-[#1EEFA4]'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="w-full flex justify-between mt-[16px]">
        <div className="w-[80px] h-[54px] flex flex-col items-center">
          <div className="w-[1px] h-[8px] bg-[#B1D6D3]" />
          <div className="font-semibold text-center text-[14px] leading-[22px]">
            Request to Register
          </div>
        </div>
        <div className="w-[80px] h-[54px] flex flex-col items-center">
          <div className="w-[1px] h-[8px] bg-[#B1D6D3]" />
          <div className="font-semibold text-center text-[14px] leading-[22px]">
            Confirm Registration
          </div>
        </div>
        <div className="w-[80px] h-[54px] flex flex-col items-center">
          <div className="w-[1px] h-[8px] bg-[#B1D6D3]" />
          <div className="font-semibold text-center text-[14px] leading-[22px]">
            Registration Completed
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterProgress
