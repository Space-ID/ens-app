import React, { lazy, useState } from 'react'
import { BrowserRouter, Route as DefaultRoute, Switch } from 'react-router-dom'
import { CrossIcon } from 'components/Icons'

const LandingPage = lazy(() => import('./routes/LandingPage'))
const Error404 = lazy(() => import('components/Error/Errors'))

const Route = ({ component: Component, layout: Layout, ...rest }) => {
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
  const [showAlert, setShowAlert] = useState(false)
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
        <Route path="*" component={Error404} layout={null} />
      </Switch>
    </BrowserRouter>
  )
}
export default App
