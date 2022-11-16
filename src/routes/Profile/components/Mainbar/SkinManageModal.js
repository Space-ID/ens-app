import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { changeSkin } from 'api/index'
import Modal from 'components/Modal'
import FailedImage from 'assets/images/image-failed.png'
import Select from 'components/Select'
import { getSigner } from 'ui/web3'
import { getDomainNftUrl } from 'utils/utils'

const domain = {
  name: 'SpaceID',
  version: '1.0.0',
  chainId: Number(process.env.REACT_APP_NETWORK_CHAIN_ID),
}
const types = {
  SKIN: [
    { name: 'notice', type: 'string' },
    { name: 'nodeHash', type: 'string' },
    { name: 'skinId', type: 'uint256' },
    { name: 'expiration', type: 'uint256' },
  ],
}

function SkinManageModal({
  open,
  onOpenChange,
  selectedDomain,
  curImg,
  currentId,
  skinList,
  onImageChange,
  ...other
}) {
  const [imageUrl, setImageUrl] = useState(curImg)
  const [options, setOptions] = useState([])
  const [select, setSelect] = useState()
  const [loading, setLoading] = useState(false)
  const handleSave = async () => {
    const selectSkin = skinList.find((v) => v.id === select?.value)
    if (!selectSkin) return
    setLoading(true)
    try {
      const singer = await getSigner()
      const expiration = moment().add(2, 'm').unix()
      const value = {
        notice: `You are signing for space.id ${selectedDomain.name}.bnb name`,
        nodeHash: '0x' + selectSkin.nodeHash,
        skinId: selectSkin.id,
        expiration,
      }
      const signature = await singer._signTypedData(domain, types, value)
      const res = await changeSkin(selectSkin, signature, expiration)
      if (res === null) {
        onImageChange(select)
        onOpenChange(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  const handleSelect = (v) => {
    setSelect(v)
    setImageUrl(getDomainNftUrl(selectedDomain.name, v.value))
  }
  useEffect(() => {
    if (open) {
      setImageUrl(curImg)
    }
  }, [open])
  useEffect(() => {
    const arr = skinList.map((v) => ({ value: v.id, label: v.name }))
    setOptions(arr)
    setSelect(arr.find((v) => v.value === currentId))
  }, [skinList, currentId])
  return (
    <Modal
      title="Skin Selection"
      open={open}
      onOpenChange={onOpenChange}
      {...other}
    >
      <div className="md:px-6 flex flex-col items-center space-y-4 text-base font-semibold">
        <img
          className="rounded-[20px] drop-shadow-[0px_0px_55px_rgba(80,255,192,0.6)] block md:max-w-[320px] max-w-[310px]"
          src={imageUrl}
          onError={() => setImageUrl(FailedImage)}
        />
        <div className="w-full capitalize">
          <p className="mb-1">Skin Selection</p>
          <Select
            value={select}
            options={options}
            style={{ width: '100%' }}
            isDisabled={loading}
            onChange={handleSelect}
          />
        </div>
        <div className="flex md:flex-row md:flex-row-reverse flex-col md:space-y-0 space-y-4 w-full items-center pt-4">
          <button
            className={cn(
              'btn btn-primary py-2 w-[160px] md:ml-4 text-base font-semibold rounded-2xl',
              loading ? 'loading' : ''
            )}
            disabled={!select || select?.value === currentId || loading}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="w-[160px] py-2 text-base font-semibold rounded-2xl bg-transparent text-primary border-primary border-[1px] hover:opacity-70"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Back
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SkinManageModal
