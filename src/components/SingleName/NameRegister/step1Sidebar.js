import React from 'react'

const Step1Sidebar = ({
  usePoint,
  price,
  totalUsd,
  priceWithPoint,
  totalUsdWithPoint,
}) => {
  return (
    <div className="2md:w-[178px] w-full 2md:h-auto h-[176px] 2md:mr-2 2md:mb-0 mb-2 bg-fill-2 backdrop-blur-[5px] rounded-2xl flex flex-col items-center justify-center font-bold text-green-100">
      <div className="2md:w-[114px] w-fll 2md:text-2xl text-xl text-center">
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
