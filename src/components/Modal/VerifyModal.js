import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'material-react-toastify'
import Modal from './Modal'

import DefaultAvatar from 'assets/images/default-avatar.png'
import AnimationSpin from 'components/AnimationSpin'
import { Link } from 'react-router-dom'
import { CrossIcon, GalaxyIcon, TokenIcon } from 'components/Icons'
import { useLazyQuery } from '@apollo/client'
import { useAccount } from '../QueryAccount'
import { isEmptyAddress } from '../../utils/records'
import { useDispatch, useSelector } from 'react-redux'

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
    autoClose: 2000,
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
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: false,
  })
}

export default function VerifyModal({ closeModal }) {
  return (
    <div>
      <Modal width="1056px" className="p-6 pt-0">
        <div className="text-white">
          <div
            onClick={closeModal}
            className="sticky top-0 flex items-center justify-end h-10 bg-dark-500"
          >
            <CrossIcon className="sticky cursor-pointer" size={11} />
          </div>
          <p className="font-urbanist font-bold md:text-3xl md:leading-[52px] mt-2.5 text-[32px] leading-[46px] text-center">
            Verify your SBT to participate SPACE ID Staging Launch!
          </p>
          <div className="my-8 text-center text-xl text-gray-700 font-semibold">
            <p>
              No SBT yet? We got your back!
              <br />
              You can choose either Galxe SBT or BNB SBT for verification
            </p>
            <p className="mt-8 h-[84px]">
              <span className="mr-4">•</span>Galxe Passport - 2 slots
              <br />
              <span className="mr-4">•</span>Galxe Passport and BABT - 5 slots
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5 md:flex-row md:space-x-16 md:space-y-0 mb-5">
            <button
              className="flex items-center md:text-2xl text-xl rounded-[20px] py-3 px-6 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common"
              onClick={() => {
                window.open('https://galxe.com/passport', '_blank')
              }}
            >
              Get your Galxe Passport{' '}
              <GalaxyIcon size={33} className="ml-[10px]" />
            </button>
            <button
              className="flex items-center  400px:w-[307px] md:w-[350px] justify-center md:text-2xl text-xl rounded-[20px] py-3 px-6 font-semibold leading-8 bg-green-200 font-urbanist text-dark-common"
              onClick={() => {
                window.open(
                  'https://www.binance.com/en/support/announcement/0fe1e7c8781844e29f56cb674231dfd7',
                  '_blank'
                )
              }}
            >
              Get your BNB BABT <TokenIcon className="ml-[10px]" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
