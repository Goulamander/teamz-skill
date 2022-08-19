import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { actions as authActions } from "./auth";
import { ROUTES } from '../../constants/routeConstants'
import Can from '../../component/Can'
import { getUserRoleName } from '../../transforms'

const routeResource = 'ROUTES'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
      return (
      authActions.isLoggedIn()
            ? <Can
                role={getUserRoleName()}
                resource={routeResource}
                action={props.match.path}
                yes={(attr) => (
                  <Component {...props} attr={attr} />
                )}
                no={() => (
                  <Redirect to={{ pathname: ROUTES.HOME, state: { from: props.location } }} />
                )}
              />
            : <Redirect to={{ pathname: ROUTES.HOME, state: { from: props.location } }} />
    )}} />
)
export default PrivateRoute;
