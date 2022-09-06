import React from 'react'
import Modal from './Modal'

export default function InsufficientBalanceModal({ closeModal }) {
  return (
    <div>
      <Modal width="574px">
        <div className="text-white">
          <div className="text-[28px] font-cocoSharp text-center">
            Insufficient Balance
          </div>
          <div className="mt-4 font-semibold text-center text-urbanist">
            It seems like the balance in your wallet is insufficient to perform
            the payment. Would you like to top up your wallet?
          </div>
        </div>
        <div className="mt-[36px] flex justify-center">
          <button
            className="w-[160px] bg-green-200 text-dark-100 rounded-2xl h-[38px] flex justify-center items-center font-semibold mr-4"
            onClick={() => {
              closeModal()
            }}
          >
            Go Back
          </button>
        </div>
      </Modal>
    </div>
  )
}
