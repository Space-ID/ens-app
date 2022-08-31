import React, { useState } from 'react'
import cn from 'classnames'
import { useHistory } from 'react-router'
import { RegisterState } from './constant'
import InsufficientBalanceModal from '../../Modal/InsufficientBalanceModal'
const Step2Main = ({ onRegister, state, onRetry, hasSufficientBalance }) => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const handleRegister = () => {
    if (hasSufficientBalance) {
      onRegister()
    } else {
      setShowModal(true)
    }
  }
  return (
    <>
      {showModal && (
        <InsufficientBalanceModal closeModal={() => setShowModal(false)} />
      )}
      <div className="text-white font-semibold flex flex-col items-center">
        <div className="font-bold text-center md:text-[24px] md:leading-[34px] text-[20px] leading-[28px]">
          Step 2: Complete Registration
        </div>
        <div className="text-center text-[14px] leading-[22px] mt-[12px] md:mt-[16px]">
          Confirm the registration, perform payment and complete the
          registration. Please note that if the second transaction is not
          processed within 7 days after the first, the registration will be
          forfeited and has to be restarted from the first step.
        </div>
        <div
          className={cn(
            'text-[#30DB9E] w-[64px] mt-[32px] mb-[27px]',
            state === 'REGISTER_ERROR' ? 'text-[#ED7E17]' : ''
          )}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.9999 16C7.57556 16 7.16859 16.1686 6.86853 16.4686C6.56847 16.7687 6.3999 17.1757 6.3999 17.6C6.3999 18.0243 6.56847 18.4313 6.86853 18.7314C7.16859 19.0314 7.57556 19.2 7.9999 19.2H25.5999C26.0242 19.2 26.4312 19.0314 26.7313 18.7314C27.0313 18.4313 27.1999 18.0243 27.1999 17.6C27.1999 17.1757 27.0313 16.7687 26.7313 16.4686C26.4312 16.1686 26.0242 16 25.5999 16H7.9999ZM17.5999 25.6C17.1756 25.6 16.7686 25.7686 16.4685 26.0686C16.1685 26.3687 15.9999 26.7757 15.9999 27.2C15.9999 27.6243 16.1685 28.0313 16.4685 28.3314C16.7686 28.6314 17.1756 28.8 17.5999 28.8H33.5999C34.0242 28.8 34.4312 28.6314 34.7313 28.3314C35.0313 28.0313 35.1999 27.6243 35.1999 27.2C35.1999 26.7757 35.0313 26.3687 34.7313 26.0686C34.4312 25.7686 34.0242 25.6 33.5999 25.6H17.5999ZM12.7999 36.8C12.7999 36.3756 12.9685 35.9687 13.2685 35.6686C13.5686 35.3686 13.9756 35.2 14.3999 35.2H44.6207L41.4207 38.4H14.3999C13.9756 38.4 13.5686 38.2314 13.2685 37.9314C12.9685 37.6313 12.7999 37.2243 12.7999 36.8ZM32.8767 46.944L35.0207 44.8H7.9999C7.57556 44.8 7.16859 44.9686 6.86853 45.2686C6.56847 45.5687 6.3999 45.9756 6.3999 46.4C6.3999 46.8243 6.56847 47.2313 6.86853 47.5314C7.16859 47.8314 7.57556 48 7.9999 48H31.9551C32.2379 47.6274 32.5458 47.2746 32.8767 46.944ZM39.9999 27.2C39.9999 26.7757 40.1685 26.3687 40.4685 26.0686C40.7686 25.7686 41.1756 25.6 41.5999 25.6H52.7999C53.2242 25.6 53.6312 25.7686 53.9313 26.0686C54.2313 26.3687 54.3999 26.7757 54.3999 27.2C54.3999 27.6243 54.2313 28.0313 53.9313 28.3314C53.6312 28.6314 53.2242 28.8 52.7999 28.8H41.5999C41.1756 28.8 40.7686 28.6314 40.4685 28.3314C40.1685 28.0313 39.9999 27.6243 39.9999 27.2ZM33.5999 16C33.1756 16 32.7686 16.1686 32.4685 16.4686C32.1685 16.7687 31.9999 17.1757 31.9999 17.6C31.9999 18.0243 32.1685 18.4313 32.4685 18.7314C32.7686 19.0314 33.1756 19.2 33.5999 19.2H54.3999C54.8242 19.2 55.2312 19.0314 55.5313 18.7314C55.8313 18.4313 55.9999 18.0243 55.9999 17.6C55.9999 17.1757 55.8313 16.7687 55.5313 16.4686C55.2312 16.1686 54.8242 16 54.3999 16H33.5999ZM35.1359 49.2064L50.5919 33.7504C51.7147 32.6284 53.2373 31.9984 54.8246 31.999C56.4119 31.9996 57.9339 32.6308 59.0559 33.7536C60.1779 34.8764 60.8079 36.399 60.8073 37.9863C60.8067 39.5736 60.1755 41.0956 59.0527 42.2176L43.5967 57.6704C42.6963 58.5712 41.5682 59.2105 40.3327 59.52L35.5391 60.7168C35.0625 60.8356 34.5632 60.8291 34.0898 60.6979C33.6164 60.5667 33.185 60.3153 32.8375 59.9681C32.49 59.6209 32.2382 59.1897 32.1066 58.7165C31.9749 58.2432 31.968 57.7439 32.0863 57.2672L33.2863 52.4736C33.5932 51.2371 34.2329 50.1083 35.1359 49.2096V49.2064Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {state === RegisterState.confirm && (
          <>
            <button
              className="w-[160px] h-[42px] rounded-[16px] bg-[#30DB9E] text-[#071A2F] text-[18px] leading-[26px] font-semibold mx-auto"
              onClick={handleRegister}
            >
              Register
            </button>
            <div className="md:w-[512px] mt-[16px] font-normal text-center text-[12px] leading-[20px] text-[#B1D6D3]">
              *An additional 10% will be charged prior to prevent transaction
              failure due to currency fluctuation. You will be refunded with the
              excess amount from the transaction.
            </div>
          </>
        )}
        {(state === RegisterState.registering ||
          state === RegisterState.registerSuccess) && (
          <>
            {state === RegisterState.registerSuccess ? (
              <div className="text-[#1EEFA4] text-[20px] leading-[28px] text-center mb-[30px]">
                Registration completed!
              </div>
            ) : (
              <div className="text-[20px] leading-[28px] text-center mb-[30px]">
                Registration in progress...
              </div>
            )}
            <button
              className={cn(
                'w-[160px] h-[42px] rounded-[16px] text-[18px] leading-[26px] font-semibold mx-auto',
                state === RegisterState.registerSuccess
                  ? 'bg-[#30DB9E] text-[#071A2F]'
                  : 'bg-[#7E9195] text-[#FFFFFF]'
              )}
              disabled={state !== RegisterState.registerSuccess}
              onClick={() => {
                history.push('/profile')
              }}
            >
              Manage Profile
            </button>
          </>
        )}
        {state === RegisterState.registerError && (
          <>
            <div className="text-[#ED7E17] text-[20px] leading-[28px] text-center mb-[30px]">
              Error in registration :(
            </div>
            <button
              className="w-[160px] h-[42px] rounded-[16px] text-[18px] leading-[26px] font-semibold mx-auto text-[#30DB9E] bg-[#438C88]/25 backdrop-blur-[5px] border border-solid border-[#30DB9E]"
              onClick={onRetry}
            >
              Retry
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Step2Main
