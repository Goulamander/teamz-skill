import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'

import { ROUTES } from '../../../constants/routeConstants';
import SingleSignOnOkta from './SingleSignOnOkta.js'
import SingleSignOnAzure from './SingleSignOnAzure.js'
import ChangePassword from './ChangePassword'
import ManageAccess from './ManageAccess'
import ManageBrandKit from './ManageBrangKit'
import SalesForceIntegrations from './SalesForceIntegrations';

const RightSection = (props) => {
  let activeRoute = props.router.location.pathname

  return (
    <Col xl="8" lg="8" md="7" className="col-xxl-8">
      <div className="content-right">
      <Switch>
          <Route 
            exact 
            path={ROUTES.COMPANY_SETTINGS_OKTA}
            component={SingleSignOnOkta}
          />
          <Route 
            exact 
            path={ROUTES.COMPANY_SETTINGS_AZURE}
            component={SingleSignOnAzure}
          />
          <Route 
            exact 
            path={ROUTES.CHANGE_PASSWORD}
            component={ChangePassword} 
          />
          <Route 
            exact 
            path={ROUTES.MANAGE_ACCESS}
            component={ManageAccess} 
          />
          <Route 
            exact 
            path={ROUTES.MANAGE_COMPANY_BRANDKIT}
            component={ManageBrandKit} 
          />
          <Route 
            exact 
            path={ROUTES.COMPANY_SETTINGS_SALESFORCE}
            component={SalesForceIntegrations}
          />
          <Route
              exact
              path={ROUTES.COMPANY_SETTINGS}
              render={() => {
                  return (
                    <Redirect to={ROUTES.COMPANY_SETTINGS_OKTA} />
                  )
              }}
            />
          {/* <Can
            role={getUserRoleName()}
            resource={'ROUTES'}
            action={activeRoute}
            yes={(attr) => (
              <Route 
                exact 
                path={ROUTES.COMPANY_SETTINGS}
                component={SingleSignOn}
              />
            )}
            no={() => (
              <Redirect to={{ pathname: ROUTES.HOME, state: { from: props.location } }} />
            )}
          /> */}
        </Switch>
      </div>
    </Col>
  )
}

const mapStateToProps = ({ router }) => ({
  router
})

export default connect(
  mapStateToProps,
  null
)(RightSection)
