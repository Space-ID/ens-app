import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { toArray } from 'lodash'
import axios from 'axios'
import { Formik } from 'formik'
import { withRouter } from 'react-router'
import { useDispatch } from 'react-redux'
import { validate } from '@ensdomains/ens-validation'

import SearchIcon from 'components/Icons/SearchIcon'
import FaceCryIcon from 'components/Icons/FaceCryIcon'
import FaceHappyIcon from 'components/Icons/FaceHappyIcon'
import { setSearchDomainName, setSelectedDomain } from 'app/slices/domainSlice'

import '../../api/subDomainRegistrar'
import {
  parseSearchTerm,
  validateName,
  validateDomain,
} from '../../utils/utils'

function Search({
  history,
  className,
  style,
  searchingDomainName,
  errorShowing = true,
  isShowSearchBtn = true,
  errorsStyling = false,
  suggestionClassName = 'w-[calc(100%-56px)]',
  isAbsolutePosition = true,
}) {
  const [showPopup, setShowPopup] = useState(false)
  const [result, setResult] = useState(null)
  const dispatch = useDispatch()

  const gotoDetailPage = () => {
    setShowPopup(false)
    if (result.Owner) {
      const date = new Date(result?.Expires)
      dispatch(setSelectedDomain({ ...result, expires_at: date }))
      history.push(`/profile`)
    } else {
      history.push(`/name/${result.name}.bnb/register`)
    }
  }

  useEffect(() => {
    if (searchingDomainName) {
      dispatch(setSearchDomainName(''))
      const params = {
        ChainID: parseInt(process.env.REACT_APP_NETWORK_CHAIN_ID),
        name: searchingDomainName,
      }

      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/nameof`, {
          ...params,
        })
        .then((res) => {
          setResult(res.data)
          setShowPopup(true)
        })
    }
  }, [searchingDomainName])

  return (
    <div className={cn('relative', className)}>
      <Formik
        initialValues={{ searchKey: searchingDomainName ?? '' }}
        validate={async (values) => {
          let errors = {}
          try {
            let searchTerm
            if (values.searchKey.split('.').length === 1) {
              searchTerm = values.searchKey + '.eth'
            } else {
              searchTerm = values.searchKey
            }
            const parsed = await validateName(searchTerm)
            const filterParsed = parsed.replace('.eth', '')
            values.searchKey = filterParsed

            if (toArray(values.searchKey).length < 3) {
              errors.searchKey = 'Name length must be at least 3 characters'
            } else if (!validateDomain(values.searchKey)) {
              errors.searchKey = 'Name contains unsupported characters'
            }
          } catch (err) {
            errors.searchKey = 'Name contains unsupported characters'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          const params = {
            ChainID: parseInt(process.env.REACT_APP_NETWORK_CHAIN_ID),
            name: values.searchKey,
          }
          axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/nameof`, {
              ...params,
            })
            .then((res) => {
              setResult(res.data)
              setShowPopup(true)
            })
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form
            className={cn(`relative`)}
            style={style}
            onSubmit={handleSubmit}
          >
            <button
              className="absolute left-4 top-[14px]"
              data-testid={'home-search-button'}
            >
              <SearchIcon className="text-green-100" />
            </button>
            <div>
              <input
                className={cn(
                  'w-full bg-transparent py-[10px] pl-10 text-base border border-green-100 rounded-[18px] focus:bg-transparent text-green-100 active:bg-transparent focus:outline-none',
                  isShowSearchBtn ? 'pr-[150px]' : 'pr-[50px]'
                )}
                placeholder="Explore the space"
                onChange={(e) => {
                  setShowPopup(false)
                  handleChange(e)
                }}
                type="text"
                name="searchKey"
                onBlur={handleBlur}
                value={values.searchKey}
              />
            </div>
            {errorShowing &&
              errors.searchKey &&
              touched.searchKey &&
              values.searchKey.length > 0 && (
                <div
                  className={cn(
                    'text-[#ED7E17] text-[14px] md:text-[16px] font-semibold mt-2 md:mt-1 ml-3',
                    errorsStyling
                      ? 'absolute shadow-popup flex w-[calc(100%-12px)] bg-[#205561] px-3 py-3 rounded-[12px] backdrop-blur-[5px] justify-between z-auto z-[1]'
                      : ''
                  )}
                >
                  {errors.searchKey}
                </div>
              )}
            <div
              className={cn(
                'text-primary font-urbanist font-semibold text-[16px] absolute top-[10px]',
                isShowSearchBtn ? 'right-[110px]' : 'right-[20px]'
              )}
            >
              .bnb
            </div>
            {isShowSearchBtn && (
              <button
                type="submit"
                className="text-darkButton w-[92px] bg-primary text-semibold text-[14px] font-semibold font-urbanist py-1 px-6 rounded-[10px] absolute top-2 right-2"
              >
                Search
              </button>
            )}
          </form>
        )}
      </Formik>
      {showPopup && (
        <div
          className={cn(
            'shadow-popup flex md:w-full bg-dark-300 px-3 py-3 rounded-[12px] backdrop-blur-[5px] justify-between z-auto z-[1]',
            suggestionClassName,
            isAbsolutePosition ? 'absolute top-[55px]' : 'relative mt-2'
          )}
        >
          <div className="flex items-center max-w-[calc(100%-170px)]">
            {result.Owner ? (
              <FaceCryIcon className="text-green-200" />
            ) : (
              <FaceHappyIcon className="text-green-200" />
            )}
            <span
              className={cn(
                'ml-2 text-[16px] font-semibold text-green-200 truncate'
              )}
            >
              {result.name}.bnb
            </span>
          </div>
          <div className="flex items-center">
            <div
              className={cn(
                'text-sm font-semibold leading-[22px] font-urbanist',
                result.Owner ? 'text-red-100' : 'text-blue-200'
              )}
            >
              {result.Owner ? 'Unavailable' : 'available'}
            </div>
            <div
              onClick={gotoDetailPage}
              className={cn(
                'cursor-pointer w-[92px] justify-center flex items-center h-7 text-white text-center rounded-[8px] font-urbanist font-semibold ml-3',
                result.Owner ? 'bg-red-100' : 'bg-blue-100'
              )}
            >
              {result.Owner ? <span>View</span> : <span>Register</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({
  searchDomain,
  className,
  style,
  searchingDomainName,
}) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
      searchingDomainName={searchingDomainName}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer
