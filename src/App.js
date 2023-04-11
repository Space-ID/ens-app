import React, { lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { validateName } from '@siddomains/sidjs/dist/utils'
import { CrossIcon } from 'components/Icons'

const LandingPage = lazy(() => import('./routes/LandingPage'))
const Home = lazy(() => import('./routes/Home'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Profile = lazy(() => import('./routes/Profile'))
const Referral = lazy(() => import('./routes/Referral'))
const HomePageLayout = lazy(() => import('components/Layout/HomePageLayout'))
const Error404 = lazy(() => import('components/Error/Errors'))

import useReactiveVarListeners from './hooks/useReactiveVarListeners'
import { useAccount } from './components/QueryAccount'
import { emptyAddress } from './ui'
import ToastContainer from 'components/Toast/ToastContainer'

import { setInviter } from 'app/slices/referralSlice'

const INVITER_KEY = 'inviter'

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
  const dispatch = useDispatch()
  const [showAlert, setShowAlert] = useState(false)
  useEffect(() => {
    if (
      accountRef.current &&
      accountRef.current !== emptyAddress &&
      account !== emptyAddress &&
      accountRef.current !== account
    ) {
      window.location.reload()
    } else {
      accountRef.current = account
    }
  }, [account])

  useEffect(() => {
    const params = new URL(window.location).searchParams
    let inviter =
      params.get('inviter')?.trim() ||
      window.sessionStorage.getItem(INVITER_KEY)
    if (inviter) {
      inviter = decodeURIComponent(inviter)
      if (inviter.endsWith('.bnb')) {
        try {
          inviter = validateName(inviter)
          dispatch(setInviter(inviter))
          window.sessionStorage.setItem(INVITER_KEY, inviter)
        } catch (e) {
          console.error('invalid inviter:', e)
        }
      }
    }
  }, [])

  return (
    <BrowserRouter basename="/">
      {showAlert && (
        <div
          className="flex items-center gap-2 text-white text-base p-2 md:px-16 px-2 font-bold break-all"
          style={{
            background: 'linear-gradient(90deg, #FF7A00 0%, #3300FF 100%)',
          }}
        >
          <p className="flex-1 text-center">
            <span>
              SPACE ID 2.0 Beta Version is now open to all! ⭐️⭐️⭐️{' '}
            </span>
            <a
              className="text-primary visited:text-primary"
              href="https://beta.space.id"
              target="_blank"
            >
              Read more ↗
            </a>
          </p>
          <div className="flex-none" onClick={() => setShowAlert(false)}>
            <CrossIcon className="text-white cursor-pointer" size={11} />
          </div>
        </div>
      )}

      <Switch>
        <DefaultRoute exact path="/" component={LandingPage} />
        {/*<Route exact path="/app" component={Home} layout={HomePageLayout} />*/}
        {/*<Route*/}
        {/*  exact*/}
        {/*  path="/app/profile"*/}
        {/*  component={Profile}*/}
        {/*  layout={HomePageLayout}*/}
        {/*/>*/}
        {/*<Route*/}
        {/*  path="/app/name/:name"*/}
        {/*  component={SingleName}*/}
        {/*  layout={HomePageLayout}*/}
        {/*/>*/}
        {/*<Route*/}
        {/*  exact*/}
        {/*  path="/app/referral"*/}
        {/*  component={Referral}*/}
        {/*  layout={HomePageLayout}*/}
        {/*/>*/}
        <Route path="*" component={Error404} layout={null} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  )
}
export default App
