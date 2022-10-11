import { useEffect, useState } from 'react'
import SID from '@siddomains/sidjs'
import { ethers, getProvider } from '../ui'

const useSID = () => {
  const [sid, setSid] = useState(undefined)
  useEffect(async () => {
    let provider
    try {
      provider = await getProvider()
    } catch (e) {
      const infura = process.env.REACT_APP_INFURA_URL
      provider = new ethers.providers.JsonRpcProvider(infura)
    }
    const tSid = new SID({
      provider,
      sidAddress: process.env.REACT_APP_REGISTRY_ADDRESS,
    })
    setSid(tSid)
  }, [])
  return sid
}

export default useSID
