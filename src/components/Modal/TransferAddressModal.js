import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { ethers, getWeb3 } from '../../ui'
import Modal from './Modal'

export default function TransferAddressModal({
  show,
  saveHandler,
  closeModal,
  title,
  address,
}) {
  const formik = useFormik({
    initialValues: {
      chain: 'BSC',
      address: '',
    },
    validate: async (values) => {
      let isContractAddress = true
      if (title === 'Resolver') {
        let provider = await getWeb3()
        const bytecode = await provider.getCode(values.address)
        isContractAddress = bytecode !== '0x'
      }
      const errors = {}
      if (!ethers.utils.isAddress(values.address)) {
        errors.address = 'Address is not valid.'
      } else if (!isContractAddress) {
        errors.address = 'Only Contract address is valid'
      }
      return errors
    },
    onSubmit: (values) => {
      saveHandler(values)
    },
  })
  useEffect(() => {
    formik.resetForm()
  }, [show])
  return (
    <div>
      {show && (
        <Modal
          width="380px"
          showingCrossIcon={true}
          className="pt-[34px] pb-9 px-5 md:px-10"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          <div className="text-white">
            <div className="text-[28px] font-bold font-cocoSharp text-center">
              {title === 'Registrant' ? 'Transfer Registrant' : `Set ${title}`}
            </div>
            {title === 'Resolver' && (
              <div className="mt-4 text-xs text-red-100">
                Use the Public Resolver or enter the address of your custom
                resolver contract
              </div>
            )}

            <div className="mt-4 text-urbanist">
              <div className="font-semibold">From address</div>
              <div className="text-[14px] break-all md:break-normal">
                {address}
              </div>
            </div>
          </div>
          {/* Form for submitting transfer Registrant */}
          <form className="mt-4" onSubmit={formik.handleSubmit}>
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
            <div className="mt-4">
              <div className="font-semibold text-white">
                Address<span className="text-red-800">*</span>
              </div>
              <input
                className="w-full bg-[rgba(72,143,139,0.25)] rounded-xl text-gray-800 text-[14px] py-[7px] px-4 focus:outline-0"
                placeholder="Enter the address"
                id="address"
                name="address"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              {formik.errors.address ? (
                <div className="m-1 text-xs text-red-100">
                  {formik.errors.address}
                </div>
              ) : null}
            </div>
            {title === 'Resolver' && (
              <div className="mt-4 text-xs text-center text-green-100">
                Use Public Resolver
              </div>
            )}

            <div className="text-[#BCC2D1] text-[14px] mt-4">
              <span className="text-red-800">*</span>Required field must be
              filled in.
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-[160px] bg-green-200 text-dark-100 rounded-2xl h-[38px] flex justify-center items-center font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
