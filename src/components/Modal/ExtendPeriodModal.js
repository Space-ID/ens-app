//Import packages
import React, { useEffect } from 'react'

//Import components
import Modal from './Modal'
import Pricer from 'components/SingleName/Pricer'

export default function ExtendPeriodModal({
  show,
  saveHandler,
  closeModal,
  selectedDomain,
  duration,
  years,
  setYears,
  ethUsdPriceLoading,
  currentPremium,
  ethUsdPrice,
  gasPrice
}) {
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
          <div className="text-[white]">
            <Pricer
              name={selectedDomain.name}
              duration={duration}
              years={years}
              setYears={setYears}
              ethUsdPriceLoading={ethUsdPriceLoading}
              ethUsdPremiumPrice={currentPremium}
              ethUsdPrice={ethUsdPrice}
              gasPrice={gasPrice}
              loading={rentPriceLoading}
              price={getRentPrice}
              premiumOnlyPrice={getPremiumPrice}
              underPremium={underPremium}
              displayGas={true}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}
