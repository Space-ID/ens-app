import React, { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { RegisterState } from './constant'
import CheckCircle from '../../Icons/CheckCircle'

const RegisterProgress = ({ state }) => {
  const [progress, setProgress] = useState(5)
  const progressRef = useRef(progress)
  const [width, setWith] = useState(`40px`)
  const timer = useRef()
  progressRef.current = progress
  const increase = useCallback((max = 5, time = 100) => {
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      if (progressRef.current < max) {
        setProgress(progressRef.current + 0.05)
      } else if (timer) {
        window.clearInterval(timer.current)
      }
    }, time)
  }, [])
  useEffect(() => {
    setWith(`${progress}%`)
  }, [progress])
  useEffect(() => {
    window.clearInterval(timer.current)
    switch (state) {
      case RegisterState.request: {
        setWith('40px')
        break
      }
      case RegisterState.requesting: {
        setWith('calc(5% + 40px)')
        break
      }
      case RegisterState.requestSuccess: {
        setWith('calc(20%)')
        if (progressRef.current < 50) {
          setProgress(20)
          increase(47)
        }
        break
      }
      case RegisterState.confirm:
      case RegisterState.register: {
        setWith('50%')
        break
      }
      case RegisterState.registerError:
      case RegisterState.registering: {
        setWith('80%')
        break
      }
      case RegisterState.registerSuccess: {
        // increase(100, (100 - progressRef.current) / 0.1 / 1000)
        setWith('calc(100% - 21px)')
        break
      }
      default: {
        break
      }
    }
  }, [state])

  return (
    <div className="md:w-[928px] w-full mt-[32px]">
      <div className="relative w-full h-[20px] rounded-[10px] overflow-hidden">
        <div className="absolute w-full h-full bg-[#CCFCFF]/20" />
        <div
          className={cn(
            'absolute h-full rounded-[10px]',
            state === RegisterState.registerError
              ? 'bg-[#ED7E17]'
              : 'bg-[#1EEFA4]'
          )}
          style={{ width: width }}
        />
        {state === RegisterState.registerSuccess && (
          <CheckCircle className="absolute top-0 right-0" />
        )}
      </div>
      <div className="w-full flex justify-between mt-[16px]">
        <div className="w-[80px] h-[54px] flex flex-col items-center">
          <div className="w-[1px] h-[8px] bg-[#B1D6D3]" />
          <div className="font-semibold text-center text-[14px] text-[#B1D6D3] leading-[22px]">
            Request to Register
          </div>
        </div>
        <div className="w-[80px] h-[54px] flex flex-col items-center">
          <div className="w-[1px] h-[8px] bg-[#B1D6D3]" />
          <div className="font-semibold text-center text-[14px] text-[#B1D6D3] leading-[22px]">
            Confirm Registration
          </div>
        </div>
        <div
          className="w-[80px] h-[54px] flex flex-col items-center"
          style={{
            filter:
              state === RegisterState.registerSuccess
                ? 'drop-shadow(0px 0px 6px rgba(30, 239, 164, 0.8))'
                : 'none',
          }}
        >
          <div
            className={cn(
              'w-[1px] h-[8px]',
              state === RegisterState.registerSuccess
                ? 'bg-[#1EEFA4]'
                : 'bg-[#B1D6D3]'
            )}
          />
          <div
            className={cn(
              'font-semibold text-center text-[14px] leading-[22px]',
              state === RegisterState.registerSuccess
                ? 'text-[#1EEFA4]'
                : 'text-[#B1D6D3]'
            )}
          >
            Registration Completed
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterProgress
