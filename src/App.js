import React, { lazy, useEffect, useRef } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Profile = lazy(() => import('./routes/Profile'))
const HomePageLayout = lazy(() => import('components/Layout/HomePageLayout'))
const Error404 = lazy(() => import('components/Error/Errors'))

import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { useAccount } from './components/QueryAccount'
import { emptyAddress } from './ui'
import ToastContainer from 'components/Toast/ToastContainer'
import { useGetStagingInfo, useGetStagingQuota } from './hooks/stagingHooks'

const Route = ({
  component: Component,
  layout: Layout = HomePageLayout,
  ...rest
}) => {
  return (
    <DefaultRoute
      {...rest}
      render={(props) =>
        Layout ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

const App = () => {
  useReactiveVarListeners()
  const account = useAccount()
  const accountRef = useRef(account)
  useGetStagingInfo()
  useEffect(() => {
    if (
      accountRef.current !== emptyAddress &&
      account !== emptyAddress &&
      accountRef !== account
    ) {
      window.location.reload()
    } else {
      accountRef.current = account
    }
  }, [account])

  return (
    <BrowserRouter basename="/">
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} layout={HomePageLayout} />
        {/* <Route exact path="/" component={HungerPhase} layout={HomePageLayout} /> */}
        <Route
          exact
          path="/profile"
          component={Profile}
          layout={HomePageLayout}
        />
        <Route
          path="/name/:name"
          component={SingleName}
          layout={HomePageLayout}
        />
        <Route path="*" component={Error404} layout={null} />
      </Switch>
    </BrowserRouter>
  )
}
export default App
