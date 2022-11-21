import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { isEmptyAddress } from '../../utils/records'

import NameRegister from './NameRegister'

function NameDetails({
  domain,
  refetch,
  account,
  registrationOpen,
  showPremium,
}) {
  return (
    <>
      <Route
        exact
        path="/name/:name/register"
        render={() => (
          <NameRegister
            registrationOpen={registrationOpen}
            showPremium={showPremium}
            domain={domain}
            refetch={refetch}
            readOnly={isEmptyAddress(account)}
          />
        )}
      />
    </>
  )
}

export default NameDetails
