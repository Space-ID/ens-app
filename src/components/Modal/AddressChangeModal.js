//Import packages
import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { ethers } from '../../ui'
import cn from 'classnames'

//Import components
import Modal from './Modal'

export default function AddressChangeModal({
  show,
  closeModal,
  saveHandler,
  defaultValue,
}) {
  const formik = useFormik({
    initialValues: {
      address: '',
    },
    validate: async (values) => {
      const errors = {}
      if (!ethers.utils.isAddress(values.address)) {
        errors.address = 'Address is not valid.'
      }
      return errors
    },
    onSubmit: (values) => {
      saveHandler(values)
    },
  })

  useEffect(() => {
    formik.resetForm({ values: { address: defaultValue } })
  }, [show])

  return (
    <div>
      {show && (
        <Modal
          width="380px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-[40px]"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          <div className="text-white font-bold text-[28px] text-center">
            Edit Address
          </div>
          <div className="mt-4">
            <form onSubmit={formik.handleSubmit}>
              <div>
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
              <div className="text-[#BCC2D1] text-[14px] mt-4">
                <span className="text-red-800">*</span>Required field must be
                filled in.
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className={cn(
                    'w-[160px] rounded-2xl h-[38px] flex justify-center items-center font-semibold',
                    formik.isValid
                      ? 'bg-green-200 text-dark-100'
                      : 'bg-gray-800 text-white'
                  )}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}
