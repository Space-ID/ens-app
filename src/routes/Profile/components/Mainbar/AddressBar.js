import React from 'react'

import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'
import { convertToETHAddressDisplayFormat } from 'utils/utils'
import { refetchTilUpdatedSingle } from 'utils/graphql'

export default function AddressBar({
  loading,
  address,
  label,
  canEdit,
  clickHandler,
  clickHandlerLabel,
  pending,
  refetchAddress,
  fetchAddress,
  setConfirmed,
  txHash,
}) {
  return (
    <div className="cursor-pointer group relative bg-fill-3 rounded-[89px] px-[43px] py-2 text-center text-white 1200px:w-[224px]">
      {canEdit && (
        <div
          onClick={clickHandler}
          className="absolute hidden group-hover:flex w-full h-full bg-[rgba(72,143,139,0.25)] top-0 left-0 rounded-[28px] border-[2px] border-green-200 backdrop-blur-[8px] justify-center items-center font-semibold text-[18px]"
        >
          <span>{clickHandlerLabel}</span>
        </div>
      )}
      <p className="text-gray-600 text-[14px] font-semibold">{label}</p>
      {loading ? (
        <AnimationSpin className="flex justify-center mt-1" />
      ) : (
        <div>
          {pending ? (
            <PendingTx
              txHash={txHash}
              onConfirmed={async () => {
                refetchTilUpdatedSingle({
                  refetch: refetchAddress,
                  interval: 300,
                  keyToCompare: 'registrant',
                  prevData: address,
                })
                await fetchAddress()
                setConfirmed()
              }}
              className="mt-1"
            />
          ) : (
            <p className="font-semibold text-[18px] font-urbanist">
              {convertToETHAddressDisplayFormat(address)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
