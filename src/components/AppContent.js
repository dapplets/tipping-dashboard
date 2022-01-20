import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { dataPromise } from '../index'

// routes config
import routes from '../routes'

class AppContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      err: null,
    }
  }

  componentDidMount() {
    dataPromise.then((data) => this.setState({ data })).catch((err) => this.setState({ err }))
  }

  render() {
    const s = this.state

    if (s.err) return <CContainer lg>{JSON.stringify(s.err.message, null, 2)}</CContainer>

    if (!s.data) {
      return (
        <CContainer lg>
          <CSpinner color="primary" />
        </CContainer>
      )
    }

    return (
      <CContainer lg>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <>
                        <route.component {...props} data={s.data} />
                      </>
                    )}
                  />
                )
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    )
  }
}

export default React.memo(AppContent)
