import React, { useCallback, useEffect } from 'react'
import { toast } from 'material-react-toastify'
import Modal from './Modal'

import DefaultAvatar from 'assets/images/default-avatar.png'
import AnimationSpin from 'components/AnimationSpin'
import { Link } from 'react-router-dom'
import { CrossIcon, GalaxyIcon, TokenIcon } from 'components/Icons'
import { useLazyQuery } from '@apollo/client'
import { CHECK_SBT } from '../../graphql/queries'
import { useAccount } from '../QueryAccount'
import { isEmptyAddress } from '../../utils/records'
import { useDispatch } from 'react-redux'
import { setVerify } from '../../app/slices/stagingSlice'

import Success from 'components/Toast/Success'
import Failed from '../Toast/Failed'

const ToastPosition =
  window.innerWidth >= 768
    ? toast.POSITION.TOP_RIGHT
    : toast.POSITION.BOTTOM_CENTER

const showSuccess = () => {
  toast.dismiss()
  toast.success(<Success label="Verification completed" />, {
    position: ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: false,
  })
}

const showError = () => {
  toast.dismiss()
  toast.error(<Failed label="Verification failed" />, {
    position: ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: false,
  })
}

export default function VerifyModal({ closeModal }) {
  const account = useAccount()
  const dispatch = useDispatch()
  const [getCheckSBT, { data: { checkSBT = undefined } = {}, loading = true }] =
    useLazyQuery(CHECK_SBT, { variables: { account }, fetchPolicy: 'no-cache' })

  const handleCheck = useCallback(() => {
    getCheckSBT({ variables: { account } }).then((res) => {
      if (res.data?.checkSBT) {
        showSuccess()
      } else {
        showError()
      }
    })
  }, [account])

  useEffect(() => {
    if (!isEmptyAddress(account)) {
      handleCheck()
    }
  }, [account])
  useEffect(() => {
    dispatch(setVerify(checkSBT))
    if (checkSBT) {
      closeModal()
    }
  }, [checkSBT, closeModal])

  return (
    <div>
      <Modal width="1056px" className="p-6">
        <div className="text-white">
          <div onClick={closeModal}>
            <CrossIcon
              className="absolute cursor-pointer right-6 top-6"
              size={11}
            />
          </div>
          <p className="font-urbanist font-bold md:text-3xl md:leading-[52px] mt-2.5 text-[32px] leading-[46px] text-center">
            Verify your SBT to participate SPACE ID Staging Launch!
          </p>
          <div className="flex justify-center mt-4 mb-6 md:mt-8">
            <div className="md:w-[332px] w-[302px] drop-shadow-[0_0_45px_rgba(80,255,192,0.45)] relative">
              <img src={DefaultAvatar} className="w-full rounded-3xl" />
              {loading ? (
                <button className="absolute bg-blue-100 rounded-[20px] font-urbanist font-semibold text-2xl leading-9 flex py-3 items-center bottom-[18px] left-[50%] -translate-x-1/2 min-w-[218px] justify-center">
                  Verifying SBT{' '}
                  <AnimationSpin
                    className="ml-[10px]"
                    extraColor="#BDCED1"
                    loadingColor="#FFFFFF"
                    size={20}
                  />
                </button>
              ) : (
                <button
                  className="absolute bg-blue-100 rounded-[20px] font-urbanist font-semibold text-2xl leading-9 flex py-3 items-center bottom-[18px] left-[50%] -translate-x-1/2 md:w-[240px] min-w-[218px] justify-center"
                  onClick={handleCheck}
                >
                  Verify
                </button>
              )}
            </div>
          </div>
          {!loading && !checkSBT && (
            <>
              <p className="pt-5 mb-5 text-lg font-semibold leading-7 text-center text-gray-700 md:mb-8 md:text-xl font-urbanist">
                No SBT yet? We got your back!
                <br />
                You can choose either Galxe SBT or BNB SBT for verification
              </p>
              <div className="flex flex-col items-center justify-center space-y-5 md:flex-row md:space-x-16 md:space-y-0">
                <button className="flex items-center md:text-2xl text-xl rounded-[20px] py-3 px-6 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common">
                  Get your Galxe Passport{' '}
                  <GalaxyIcon size={33} className="ml-[10px]" />
                </button>
                <button className="flex items-center w-[307px] md:w-[350px] justify-center md:text-2xl text-xl rounded-[20px] py-3 px-6 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common">
                  Get your BNB SBT <TokenIcon className="ml-[10px]" />
                </button>
              </div>
              <div className="mt-8 text-center">
                <Link>
                  <span className="text-sm font-semibold leading-5 text-green-200 font-urbanist">
                    Staging Launch Rules ↗{' '}
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
