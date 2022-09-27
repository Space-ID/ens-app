import axios from 'axios'

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
