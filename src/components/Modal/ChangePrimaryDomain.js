// Import packages
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import cn from 'classnames'

// Import components
import Modal from './Modal'

const colorStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'rgba(67,140,136,0.25)',
    border: 'none',
    borderRadius: '12px',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: '#1B5759',
      color: '#FFFFFF',
      fontWeight: 600,
      padding: '8px 0px 8px 0px',
      borderBottom: '1px solid rgba(204,252,255,0.2)',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  },
  singleValue: (styles) => {
    return {
      ...styles,
      color: 'white',
      paddingLeft: '10px',
    }
  },
  input: (styles) => {
    return {
      ...styles,
      color: 'white',
      paddingLeft: '10px',
    }
  },
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#1B5759',
    borderRadius: '12px',
    padding: '12px 16px',
    position: 'absolute',
  }),
  menuList: (styles) => ({
    ...styles,
    maxHeight: '120px',
  }),
}

const IndicatorsContainer = (props) => {
  return (
    <div style={{ border: 'none' }}>
      <components.IndicatorsContainer {...props} />
    </div>
  )
}

export default function ChangePrimaryDomain({
  show,
  saveHandler,
  closeModal,
  domains,
}) {
  const [selected, setSelected] = useState(null)
  const options = domains.map((item) => {
    return {
      value: item.name,
      label: item.name + '.bnb',
    }
  })

  useEffect(() => {
    setSelected(null)
  }, [show])

  return (
    <div>
      {show && (
        <Modal
          width="560px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-5 md:px-[40px]"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          {/* Title */}
          <div className="text-white">
            <div className="text-[24px] md:text-[28px] font-bold font-cocoSharp text-center">
              Primary SPACE ID Name
            </div>
          </div>
          {/* Body */}
          <div id="domain-modal-body" className="mt-5">
            <div className="text-base text-white font-urbanist">
              This will designate one of your SPACE ID names to represent your
              account and act as your cross-platform Web3 username and profile.
              You can only have one Primary SPACE ID Name per SPACE ID account
              and can change it at any time.
            </div>
            <div className="mt-5">
              <div className="text-base font-semibold text-white font-urbanist">
                Select one Space ID Name
              </div>
              <div>
                <Select
                  options={options}
                  styles={colorStyles}
                  components={{
                    IndicatorSeparator: () => null,
                    IndicatorsContainer,
                  }}
                  onChange={(item) => {
                    setSelected(item)
                  }}
                />
              </div>
            </div>
            <div className="mt-5 text-gray-700">
              * Only SPACE ID names that point to your SPACE ID acount can be
              set as you Primary SPACE ID Name.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-center mt-5">
            <button
              disabled={!selected}
              className={cn(
                'rounded-2xl py-2 px-[60px] text-[18px] mx-auto font-semibold',
                selected
                  ? 'bg-green-200 text-dark-common cursor-pointer'
                  : 'bg-gray-800 text-white cursor-not-allowed'
              )}
              onClick={() => saveHandler(selected)}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
