import React, { lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Profile = lazy(() => import('./routes/Profile'))
const HomePageLayout = lazy(() => import('components/Layout/HomePageLayout'))
const Error404 = lazy(() => import('components/Error/Errors'))

import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { useAccount } from './components/QueryAccount'
import { emptyAddress } from './ui'
import { CrossIcon } from './components/Icons'

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
  // const [showAlert, setShowAlert] = useState(true)
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
      {/*{showAlert && (*/}
      {/*  <div className="text-center bg-red-100 text-white text-2xl p-2 px-6 flex items-center justify-between">*/}
      {/*    <div className="flex-1">*/}
      {/*      BNB Chain is temporarily suspended, please see{' '}*/}
      {/*      <a*/}
      {/*        href="https://twitter.com/bnbchain/status/1578148078636650496"*/}
      {/*        target="_blank"*/}
      {/*        className="text-white visited:text-white underline"*/}
      {/*      >*/}
      {/*        {' '}*/}
      {/*        here{' '}*/}
      {/*      </a>{' '}*/}
      {/*      for additional info. Please wait to register, extend and transfer*/}
      {/*      domains until the chain is restored.*/}
      {/*    </div>*/}
      {/*    <div className="flex-none" onClick={() => setShowAlert(false)}>*/}
      {/*      <CrossIcon className="text-white cursor-pointer" size={11} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      <Switch>
        <Route exact path="/" component={Home} layout={HomePageLayout} />
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
