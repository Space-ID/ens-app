import axios from 'axios'
import { namehash } from '@siddomains/sidjs'
import { getTokenId } from 'utils/utils'

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})

instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    console.error('network error:', error)
    return Promise.reject(error)
  }
)

export function fetchDomainList(account, networkId) {
  const params = {
    ChainID: networkId,
    Address: account,
  }
  return instance.post('/listname', params)
}

export function fetchRecords(account, networkId) {
  const params = {
    ChainID: networkId,
    Address: account,
  }
  return instance.get('/records', { params })
}

export function fetchReferralHistory(address, lastId = 0) {
  const params = {
    address,
    lastId,
    pageSize: 100,
  }
  return instance.get('/moneyrecords', { params })
}

export function fetchSkins(domain) {
  const params = {
    nodeHash: namehash(domain),
  }
  return instance.get('/nameskins', { params })
}

export function changeSkin(skin, signature, expiration) {
  const params = {
    skinId: skin.id,
    nodeHash: '0x' + skin.nodeHash,
    expiration,
  }
  return instance.post('/changeskin', params, {
    headers: { Signature: signature },
  })
}

export function fetchDomainMetaData(domainName) {
  const tokenId = getTokenId(domainName)
  const url = `${process.env.REACT_APP_META_DATA_URL}${tokenId}`
  return instance.get(url)
}
