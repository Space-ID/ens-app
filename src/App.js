import React, { lazy } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const Redemption = lazy(() => import('./routes/redemption'))
const SingleName = lazy(() => import('./routes/SingleName'))
const Profile = lazy(() => import('./routes/Profile'))
const HomePageLayout = lazy(() => import('components/Layout/HomePageLayout'))
const Error404 = lazy(() => import('components/Error/Errors'))

import useReactiveVarListeners from './hooks/useReactiveVarListeners'

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

  return (
    <BrowserRouter basename="app">
      <Switch>
        {/* <Route exact path="/" component={Home} layout={HomePageLayout} /> */}
        <Route
          exact
          path="/redemption"
          component={Redemption}
          layout={HomePageLayout}
        />
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
