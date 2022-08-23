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
  const [discountAmount, setDiscountAmount] = useState({
    amount: 0,
    percent: 0,
  })

  useEffect(() => {
    if (price && selectedDomain) {
      const ethVal = new EthVal(`${price || 0}`).toEth()
      const domain = selectedDomain.name
      if (domain.length === 3) {
        const tPrice = {
          amount: ethVal * 0.4,
          percent: 40,
        }
        setDiscountAmount({ ...tPrice })
      } else if (domain.length === 4) {
        setDiscountAmount({
          amount: ethVal * 0.2,
          percent: 20,
        })
      } else {
        setDiscountAmount({
          amount: 0,
          percent: 0,
        })
      }
    }
  }, [price, selectedDomain])

  const ethVal = new EthVal(`${price || 0}`).toEth()

  const registrationFee = ethVal / (1 - discountAmount.percent / 100)

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
                  discount={discountAmount}
                />
              </div>
              <EthRegistrationGasPrice
                price={price}
                gasPrice={gasPrice}
                ethUsdPrice={ethUsdPrice}
                discount={discountAmount}
                registrationFee={registrationFee}
                domain={selectedDomain.name}
              />
              <button
                className={cn(
                  'text-[18px] py-2 px-[51px] rounded-full font-semibold flex mx-auto mt-6',
                  parseFloat(years) < 0.000001
                    ? 'bg-[#7E9195] text-white cursor-not-allowed'
                    : 'bg-[#30DB9E] text-[#071A2F]'
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
