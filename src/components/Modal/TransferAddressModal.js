import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useSelector } from 'react-redux'
import DomainInput from '../Input/DomainInput'

export default function TransferAddressModal({
  show,
  saveHandler,
  closeModal,
  title,
  address,
}) {
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const [toAddress, setToAddress] = useState(undefined)
  useEffect(() => {
    setToAddress('')
  }, [show])
  return (
    <div>
      {show && (
        <Modal
          width="420px"
          showingCrossIcon={true}
          className="pt-[34px] pb-9 px-5 md:px-10"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          <div className="text-white">
            <div className="text-3xl font-bold font-cocoSharp text-center">
              {title === 'Registrant' ? 'Transfer Registrant' : `Set ${title}`}
            </div>
            {title === 'Resolver' && (
              <div className="mt-4 text-xs text-red-100">
                Use the Public Resolver or enter the address of your custom
                resolver contract
              </div>
            )}

            <div className="mt-4">
              <div className="text-base font-semibold">From domain/address</div>
              <div className="text-sm text-green-600 break-all md:break-normal">
                {primaryDomain?.name ? primaryDomain?.name + '.bnb' : address}
              </div>
            </div>
          </div>
          {/* Form for submitting transfer Registrant */}
          {/* <div>
              <div className="font-semibold text-white">Chain</div>
              <input
                className="w-full bg-[rgba(72,143,139,0.25)] rounded-xl text-gray-800 text-[14px] py-[7px] px-4"
                id="chain"
                name="chain"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.chain}
                disabled
              />
            </div> */}
          <div className="mt-2 text-white">
            <div className="font-semibold text-base mb-1">
              Recipient domain/address
              <span className="text-error font-normal"> *</span>
            </div>
            <DomainInput
              placeholder="Enter the domain/address"
              onChange={(v) => setToAddress(v)}
            />
          </div>
          {title === 'Resolver' && (
            <div className="mt-4 text-xs text-center text-green-100">
              Use Public Resolver
            </div>
          )}

          <div className="text-green-600 text-sm mt-4">
            <span className="text-error">* </span>Required field must be filled
            in.
          </div>
          <div className="flex justify-center mt-4">
            <button
              disabled={!toAddress}
              className="btn btn-primary w-[160px] rounded-2xl px-[10px] py-2 text-lg font-semibold"
              onClick={() => saveHandler({ address: toAddress })}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
