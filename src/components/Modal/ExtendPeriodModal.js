//Import packages
import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import EthVal from 'ethval'

//Import components
import Modal from './Modal'
import Pricer from 'components/SingleName/Pricer'
import EthRegistrationGasPrice from '../SingleName/NameRegister/EthRegistrationGasPrice'

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
  price,
  rentPriceLoading,
  gasPrice,
  extendHandler,
}) {
  const ethVal = new EthVal(`${price || 0}`).toEth()

  const registrationFee = ethVal

  return (
    <div>
      {show && (
        <Modal
          width="500px"
          showingCrossIcon={true}
          className="pt-[34px] pb-[36px] px-[24px]"
          closeModal={closeModal}
          cannotCloseFromOutside={true}
        >
          <div className="text-white font-bold text-[28px] text-center">
            Extend Registration
          </div>
          {Object.keys(gasPrice).length > 0 && (
            <div>
              <div className="mt-4 text-white">
                <Pricer
                  className="justify-between"
                  name={selectedDomain.name}
                  duration={duration}
                  years={years}
                  setYears={setYears}
                  ethUsdPriceLoading={ethUsdPriceLoading}
                  ethUsdPremiumPrice={currentPremium}
                  ethUsdPrice={ethUsdPrice}
                  loading={rentPriceLoading}
                  price={price}
                />
              </div>
              <EthRegistrationGasPrice
                price={price}
                gasPrice={gasPrice}
                ethUsdPrice={ethUsdPrice}
                registrationFee={registrationFee}
                domain={selectedDomain.name}
              />
              <button
                className={cn(
                  'text-[18px] py-2 px-[51px] rounded-full font-semibold flex mx-auto mt-6',
                  parseFloat(years) < 0.000001
                    ? 'bg-gray-800 text-white cursor-not-allowed'
                    : 'bg-green-200 text-dark-common'
                )}
                disabled={parseFloat(years) < 0.000001}
                onClick={() => {
                  extendHandler(duration)
                }}
              >
                Extend
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
