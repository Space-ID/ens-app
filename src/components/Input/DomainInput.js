import { useRef, useState } from 'react'
import { utils as ethersUtils } from 'ethers'
import { useDebounceEffect } from 'ahooks'
import { isEmptyAddress } from 'utils/records'
import AnimationSpin from '../AnimationSpin'
import CheckCircle from '../Icons/CheckCircle'
import FailedIcon from '../Icons/FailedIcon'
import useSID from '../../hooks/useSID'

const DOMAIN_STATE = {
  success: 'SUCCESS',
  error: 'ERROR',
  loading: 'LOADING',
  default: '',
}

export default function DomainInput(props) {
  const { onChange, placeholder } = props
  const [domainState, setDomainState] = useState(DOMAIN_STATE.default)
  const [innerV, setInnerV] = useState('')
  const innerVRef = useRef(innerV)
  const resolveDomainRef = useRef(() => {})
  const [resolvedAddr, setResolvedAddr] = useState('')
  const sid = useSID()

  const resolveDomain = async (domain) => {
    setDomainState(DOMAIN_STATE.loading)
    const param = domain.endsWith('.bnb') ? domain : domain + '.bnb'
    try {
      const addr = await sid.name(param).getAddress()
      if (isEmptyAddress(addr)) {
        throw 'not found'
      }
      if (domain === innerVRef.current) {
        setDomainState(DOMAIN_STATE.success)
        setResolvedAddr(addr)
        onChange(addr)
      }
    } catch (e) {
      if (domain === innerVRef.current) {
        setDomainState(DOMAIN_STATE.error)
        onChange('')
      }
    }
  }

  resolveDomainRef.current = resolveDomain

  useDebounceEffect(
    () => {
      if (ethersUtils.isAddress(innerV)) {
        onChange(innerV)
      } else if (innerV) {
        resolveDomainRef?.current(innerV)
      }
    },
    [innerV],
    {
      wait: 1500,
    }
  )
  const handleOnChange = (e) => {
    const v = e.target.value.trim()
    setInnerV(v)
    innerVRef.current = v
    setDomainState(DOMAIN_STATE.default)
    setResolvedAddr('')
    onChange('')
  }

  return (
    <div className="relative">
      <input
        value={innerV}
        className="s-input"
        placeholder={placeholder}
        autoComplete="on"
        type="text"
        name="address"
        onChange={handleOnChange}
      ></input>
      <div className="text-sm font-semibold text-primary mt-1">
        {domainState === DOMAIN_STATE.error ? (
          <span className="text-red-100">.bnb domain not found</span>
        ) : domainState === DOMAIN_STATE.success ? (
          <span>{resolvedAddr}</span>
        ) : (
          ''
        )}
      </div>
      <div className="absolute top-2 right-6">
        {domainState === DOMAIN_STATE.error && <FailedIcon />}
        {domainState === DOMAIN_STATE.success && <CheckCircle />}
        {domainState === DOMAIN_STATE.loading && <AnimationSpin />}
      </div>
    </div>
  )
}
