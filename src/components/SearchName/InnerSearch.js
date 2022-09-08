import React, { useState } from 'react'
import cn from 'classnames'
import { toArray } from 'lodash'
import { Formik } from 'formik'
import { withRouter } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchDomainName } from 'app/slices/domainSlice'

import SearchIcon from 'components/Icons/SearchIcon'
import '../../api/subDomainRegistrar'

import './search.scss'

function InnerSearch({ history, className, style }) {
  const dispatch = useDispatch()
  const gotoSearchPage = () => {
    history.push('/')
  }

  return (
    <div className={cn('relative', className)}>
      <Formik
        initialValues={{ searchKey: '' }}
        validate={(values) => {
          const errors = {}
          if (toArray(values.searchKey).length < 3) {
            errors.searchKey = 'Name length must be at least 3 characters'
          } else if (
            !new RegExp(/^[a-z0-9\p{Emoji}]*$/u).test(values.searchKey)
          ) {
            errors.searchKey = 'Name contains unsupported characters'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(setSearchDomainName(values.searchKey))
          gotoSearchPage()
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          /* and other goodies */
        }) => (
          <form
            className={cn(`relative`)}
            style={style}
            onSubmit={handleSubmit}
          >
            <button
              className="absolute left-4 top-[14px]"
              type="submit"
              data-testid={'home-search-button'}
            >
              <SearchIcon className="text-[rgba(204,252,255,0.3)]" />
            </button>
            <div className="w-full">
              <input
                className="w-full bg-[#104151]/[0.25] py-2 px-[36px] text-gray-700 text-[18px] border border-[rgba(204,252,255,0.3)] rounded-[18px]"
                placeholder=""
                onChange={(e) => {
                  handleChange(e)
                }}
                type="text"
                name="searchKey"
                onBlur={handleBlur}
                value={values.searchKey}
                autoCapitalize="off"
              />
            </div>
            <div className="text-[rgba(204,252,255,0.3)] font-urbanist font-semibold text-base absolute right-4 top-[10px]">
              .bnb
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

const SearchWithRouter = withRouter(InnerSearch)

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer
