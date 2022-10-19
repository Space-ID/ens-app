import React from 'react'

const Step1Sidebar = ({
  usePoint,
  price,
  totalUsd,
  priceWithPoint,
  totalUsdWithPoint,
}) => {
  return (
    <div className="md:w-[178px] w-full md:h-auto h-[176px] md:mr-2 md:mb-0 mb-2 bg-fill-2 backdrop-blur-[5px] rounded-2xl flex flex-col items-center justify-center font-bold text-green-100">
      <div className="md:w-[114px] w-fll md:text-2xl text-xl text-center">
        Step 1: Request to Register
      </div>
      <div className="mt-4 font-normal text-sm">Estimated Total</div>
      <div className="text-[32px] leading-[46px]">{`${
        usePoint ? priceWithPoint.toFixed(3) : price.toFixed(3)
      } BNB`}</div>
      <div className="font-normal text-sm">{`USD ${
        usePoint ? totalUsdWithPoint.toFixed(3) : totalUsd.toFixed(3)
      }`}</div>
    </div>
  )
}

export default Step1Sidebar
