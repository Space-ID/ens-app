import React, { useEffect, useState } from 'react'
import { toast } from 'material-react-toastify'
import Modal from './Modal'

import DefaultAvatar from 'assets/images/default-avatar.png'
import AnimationSpin from 'components/AnimationSpin'
import { Link } from 'react-router-dom'
import { CrossIcon } from 'components/Icons'
import { useLazyQuery } from '@apollo/client'
import { CHECK_SBT } from '../../graphql/queries'
import { useAccount } from '../QueryAccount'
import { isEmptyAddress } from '../../utils/records'
import { useDispatch } from 'react-redux'
import { setVerify } from '../../app/slices/stagingSlice'

import Success from 'components/Toast/Success'
import Failed from '../Toast/Failed'

export default function VerifyModal({ closeModal }) {
  const account = useAccount()
  const dispatch = useDispatch()
  const [getCheckSBT, { data: { checkSBT = undefined } = {}, loading = true }] =
    useLazyQuery(CHECK_SBT, { variables: { account }, fetchPolicy: 'no-cache' })
  useEffect(() => {
    if (!isEmptyAddress(account)) {
      getCheckSBT({ variables: { account } })
    }
  }, [account])
  useEffect(() => {
    dispatch(setVerify(checkSBT))
    if (checkSBT) {
      closeModal()
    }
  }, [checkSBT, closeModal])

  useEffect(() => {
    if (checkSBT) {
      toast.success(<Success label="Verification completed" />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else if (checkSBT !== undefined) {
      toast.error(<Failed label="Verification failed" />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }, [checkSBT])
  return (
    <div>
      <Modal width="1056px" className="px-6 pt-6 pb-9">
        <div className="space-y-8 text-white">
          <div onClick={closeModal}>
            <CrossIcon
              className="absolute cursor-pointer right-6 top-6"
              size={11}
            />
          </div>
          <p className="font-urbanist font-bold md:text-3xl md:leading-[52px] text-[32px] leading-[46px] text-center tracking-wide">
            Verify your SBT to participate SPACE ID Staging Launch!
          </p>
          <div className="flex justify-center">
            <div className="w-[332px] h-[332px] drop-shadow-[0_0_45px_rgba(80,255,192,0.45)] relative">
              <img src={DefaultAvatar} className="w-full rounded-3xl" />
              {loading ? (
                <button className="absolute bg-blue-100 rounded-[20px] font-urbanist font-semibold text-2xl leading-9 flex py-3 items-center bottom-[18px] left-[50%] -translate-x-1/2 md:w-[240px] min-w-[218px] justify-center">
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
                  onClick={() => {
                    console.log('clci')
                    getCheckSBT({ variables: { account } })
                  }}
                >
                  Verify
                </button>
              )}
            </div>
          </div>
          {!loading && !checkSBT && (
            <>
              <p className="text-xl font-semibold leading-7 text-center text-gray-700 font-urbanist">
                No SBT yet? We got your back!
                <br />
                You can choose either Galxe SBT or BNB SBT for verification
              </p>
              <div className="flex items-center justify-center space-x-8">
                <button className="text-2xl rounded-[20px] py-3 px-8 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common">
                  Get your Galxe SBT
                </button>
                <button className="text-2xl rounded-[20px] py-3 px-8 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common">
                  Get your BNB SBT
                </button>
              </div>
              <div className="text-center">
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
