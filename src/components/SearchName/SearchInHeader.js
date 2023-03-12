import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import axios from 'axios'
import { Formik } from 'formik'
import { withRouter } from 'react-router'
import { useDispatch } from 'react-redux'
import { toArray } from 'lodash'
import ClickAwayListener from 'react-click-away-listener'
import SearchIcon from 'components/Icons/SearchIcon'
import FaceCryIcon from 'components/Icons/FaceCryIcon'
import FaceHappyIcon from 'components/Icons/FaceHappyIcon'
import { setSearchDomainName, setSelectedDomain } from 'app/slices/domainSlice'
import '../../api/subDomainRegistrar'
import { validateDomain, validateName } from '../../utils/utils'

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
  onSubmit,
}) {
  const [showPopup, setShowPopup] = useState(false)
  const [result, setResult] = useState(null)
  const [active, setActive] = useState(false)
  const dispatch = useDispatch()

  const gotoDetailPage = () => {
    setShowPopup(false)
    if (result.Owner) {
      dispatch(setSelectedDomain({ ...result, expires: result.Expires }))
      history.push(`/app/profile`)
    } else {
      history.push(`/app/name/${result.name}.bnb/register`)
    }
    onSubmit()
  }

  useEffect(() => {
    if (searchingDomainName) {
      // check claimable
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

  const handleBlurFunction = () => {
    setTimeout(() => {
      if (!showPopup) setActive(false)
    }, [500])
  }

  return (
    <div
      className={cn('relative group', className)}
      onBlur={handleBlurFunction}
    >
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
          setActive(true)
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
            onClick={() => setActive(true)}
            className={cn(`relative group`)}
            style={style}
            onSubmit={handleSubmit}
          >
            <button
              className="absolute left-4 top-[14px]"
              data-testid={'home-search-button'}
            >
              <SearchIcon
                className={cn(
                  active ? 'text-green-100' : 'text-[rgba(204,252,255,0.6)]'
                )}
              />
            </button>
            <div>
              <input
                className={cn(
                  'w-full bg-[#104151]/[0.25] py-[10px] pl-[40px] text-base border rounded-[18px] focus:bg-transparent text-green-100 active:bg-transparent focus:outline-none',
                  isShowSearchBtn ? 'pr-[150px]' : 'pr-[50px]',
                  active ? 'border-green-100' : 'border-[rgba(204,252,255,0.6)]'
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
                    'text-red-100 text-[14px] md:text-base font-semibold mt-2 md:mt-1 ml-3',
                    errorsStyling
                      ? 'absolute shadow-popup flex w-[calc(100%-12px)] bg-dark-300 px-3 py-3 rounded-xl backdrop-blur-[5px] justify-between z-auto z-[1]'
                      : ''
                  )}
                >
                  {errors.searchKey}
                </div>
              )}
            <div
              className={cn(
                'font-urbanist font-semibold text-base absolute top-[10px] transition-all',
                active
                  ? 'right-[110px] text-green-100'
                  : 'right-5 text-[rgba(204,252,255,0.6)]'
              )}
            >
              .bnb
            </div>
            {active && (
              <button
                type="submit"
                className="w-[92px] text-dark-common bg-green-100 text-semibold text-[14px] font-semibold font-urbanist py-1 px-6 rounded-[10px] absolute top-2 right-2"
              >
                Search
              </button>
            )}
          </form>
        )}
      </Formik>
      {showPopup && (
        <ClickAwayListener onClickAway={() => setShowPopup(false)}>
          <div
            className={cn(
              'shadow-popup flex md:w-full bg-dark-300 px-3 py-3 rounded-xl backdrop-blur-[5px] justify-between z-auto z-[1]',
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
                  'ml-2 text-base font-semibold text-green-200 truncate'
                )}
              >
                {result.name}.bnb
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={cn(
                  'text-sm',
                  result.Owner ? 'text-red-100' : 'text-blue-100'
                )}
              >
                {result.Owner ? 'Unavailable' : 'available'}
              </div>
              <button
                onClick={gotoDetailPage}
                className={cn(
                  'cursor-pointer w-[92px] justify-center flex items-center h-[28px] text-white text-center rounded-lg font-urbanist font-semibold ml-3',
                  result.Owner ? 'bg-red-100' : 'bg-blue-100'
                )}
              >
                {result.Owner ? <span>View</span> : <span>Register</span>}
              </button>
            </div>
          </div>
        </ClickAwayListener>
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
