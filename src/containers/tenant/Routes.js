import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import { ROUTES } from '../../constants/routeConstants'
import TenantLogin from './login'
import SlackAuth from './slack/auth'
import NoTenantRoute from './noRoute'
import NoTenant from './noTenant'


export const TenantRoutes = () => {

  return (
    <Switch>
      <Route 
        exact 
        path={ROUTES.TENANT_LOGIN}
        component={TenantLogin}
        render={matchProps=>
          process.env.REACT_APP_NODE_ENV === 'sandbox' ? (
            <Redirect
              to={{
                pathname: ROUTES.TENANT_NONE,
                state: { from: matchProps.location }
              }}
            />
          ) : (
            <Redirect
              to={{
                pathname: ROUTES.TENANT_LOGIN,
                state: { from: matchProps.location }
              }}
            />
          )
        }
      />
      <Route 
        exact
        path={ROUTES.TENANT_NONE}
        component={NoTenant} 
      />
      <Route 
        exact 
        path={ROUTES.TENANT_SLACK_AUTH} 
        component={SlackAuth} 
      />
      <Route 
        component={NoTenantRoute} 
      />
    </Switch>
  )
}

export default TenantRoutes