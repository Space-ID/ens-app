import React from 'react'

const Step1Sidebar = ({ price, totalUsd }) => {
  return (
    <div className="md:w-[178px] w-full md:h-auto h-[176px] md:mr-2 md:mb-0 mb-2 bg-fill-2 backdrop-blur-[5px] rounded-2xl flex flex-col items-center justify-center font-bold text-green-100">
      <div className="md:w-[114px] w-fll md:text-2xl text-xl text-center">
        Step 1: Request to Register
      </div>
      <div className="mt-4 font-normal text-sm">Estimated Total</div>
      <div className="text-[32px] leading-[46px]">{`${price.toFixed(
        3
      )} BNB`}</div>
      <div className="font-normal text-sm">{`USD ${totalUsd.toFixed(3)}`}</div>
    </div>
  )
}

export default Step1Sidebar
