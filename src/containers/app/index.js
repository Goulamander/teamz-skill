import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import PrivateRoute from './privateRoute'
import { actions as authActions } from "./auth";
import { ROUTES } from '../../constants/routeConstants'
import { verfiyTenant } from '../../transforms'

import Header from '../header'
import Home from '../home'
import Login from '../login'
import Tenant from '../tenant'
import Logout from '../logout'
import SignUp from '../signup'
import SignUp2 from '../signup/signup2'
import SlackAuth from '../slack/auth'
import SamlAuth from '../saml/auth'
import OnBoarding from '../onboarding'
import Profile from '../profile'
import Course from '../course'
import CourseAssigned from '../course/assigned'
// import CustomCoursesLibrary from '../profile/main/Library/index.js/index.js.js.js.js'
import Admin from '../analytics'
import Grow from '../grow'
import Praise from '../praise'
import Team from '../team'
import NoRoute from '../noRoute'
import CompanySettings from '../companysettings'
import ProfileSettings from '../profileSettings'
import PublicView from '../publicprofileview'
import SearchResult from '../searchresultlisting'
import VerifyUser from '../verify'
import ContentPortal from '../contentportal';
import CreateMicrosite from '../contentportal/createMicrosite';
import CreateExperience from '../contentportal/createExperience';
import MicroSite from '../contentportal/createMicrosite/microsite';
import ExperienceUserView from '../contentportal/createExperience/experienceUserView'
import TemplatesView from '../contentportal/createExperience/TemplatesView'

class App extends Component {

  constructor(props) {
    super(props)
    verfiyTenant()
  }

  render() {
    return (
      <div>
        <Header />

        <main>
          <Switch>
            <Route 
              exact 
              path={ROUTES.HOME} 
              
              render={matchProps =>
                authActions.isLoggedIn() ? (
                  authActions.isNewUser() ? (
                    <Redirect
                      to={{
                        pathname: ROUTES.ONBOARDING,
                        state: { from: matchProps.location }
                      }}
                    />
                  ): (
                    <Redirect
                      to={{
                        pathname: ROUTES.PROFILE,
                        state: { from: matchProps.location }
                      }}
                    />
                  )
                ) : (
                  <Home {...matchProps} />
                )
              }
            />
            <Route exact path={ROUTES.SLACK_AUTH} component={SlackAuth} />
            <Route exact path={ROUTES.VERIFY_USER} component={VerifyUser} />
            <Route exact path={ROUTES.SAML} component={SamlAuth} />
            <Route 
              exact 
              path={ROUTES.LOGIN}
              render={matchProps =>
                authActions.isLoggedIn() ? (
                  <Redirect
                    to={{
                      pathname: ROUTES.HOME,
                      state: { from: matchProps.location }
                    }}
                  />
                ) : (
                  <Login {...matchProps} />
                )
              }
            />
            <Route 
              path={ROUTES.TENANT}
              component={Tenant}
            />
            <Route 
              exact 
              path={ROUTES.SignUp}
              render={matchProps =>
                authActions.isLoggedIn() ? (
                  <Redirect
                    to={{
                      pathname: ROUTES.HOME,
                      state: { from: matchProps.location }
                    }}
                  />
                ) : (
                  <SignUp {...matchProps} />
                )
              }
            />
            <Route 
              exact 
              path={ROUTES.SignUp2}
              render={matchProps =>
                authActions.isLoggedIn() ? (
                  <Redirect
                    to={{
                      pathname: ROUTES.HOME,
                      state: { from: matchProps.location }
                    }}
                  />
                ) : (
                  <SignUp2 {...matchProps} />
                )
              }
            />
            <Route
              exact
              path={ROUTES.MICROSITE_ID}
              component={MicroSite}
            />
            <Route
              exact
              path={ROUTES.EXPERIENCE_ID}
              component={ExperienceUserView}
            />
            <PrivateRoute
              exact
              path={ROUTES.TEMPLATES_ID}
              component={TemplatesView}
            />
            <PrivateRoute
              exact
              path={ROUTES.ONBOARDING}
              component={OnBoarding}
            />
            <PrivateRoute
              exact
              path={ROUTES.PROFILE}
              component={Profile}
            />
            <PrivateRoute
              exact
              path={ROUTES.MY_COURSES}
              component={Profile}
            />
            <PrivateRoute
              exact
              path={ROUTES.COURSES_LIBRARY}
              component={Profile}
            />
            <PrivateRoute
              exact
              path={ROUTES.COURSE_ID}
              component={Course}
            />
            <PrivateRoute
              exact
              path={ROUTES.COURSE_COMPLETE}
              component={Course}
            />
            <PrivateRoute
              exact
              path={ROUTES.COURSE_ASSIGNED}
              component={CourseAssigned}
            />
            <PrivateRoute
              path={ROUTES.ANALYTICS}
              component={Admin}
            />
            <PrivateRoute
              path={ROUTES.GROW}
              component={Grow}
            />
            <PrivateRoute
              path={ROUTES.PRAISE}
              component={Praise}
            />
            <PrivateRoute
              path={ROUTES.TEAM}
              component={Team}
            />
            <PrivateRoute
              path={ROUTES.CONTENT_PORTAL}
              component={ContentPortal}
            />
            <PrivateRoute
              path={ROUTES.CREATE_MICROSITE}
              component={CreateMicrosite}
            />
            <PrivateRoute
              path={ROUTES.CREATE_EXPERIENCE}
              component={CreateExperience}
            />
            <PrivateRoute
              exact
              path={ROUTES.LOGOUT}
              component={Logout}
            />
            <PrivateRoute
              path={ROUTES.COMPANY_SETTINGS}
              component={CompanySettings}
            />
            <PrivateRoute
              path={ROUTES.PROFILE_SETTINGS}
              component={ProfileSettings}
            />
            <PrivateRoute
              path={ROUTES.PUBLIC_VIEW_PAGE}
              component={PublicView}
            />
            <PrivateRoute
              path={ROUTES.SEARCH_RESULT}
              component={SearchResult}
            />
            <Route 
              component={NoRoute}
            />
          </Switch>
        </main>
      </div>
    )
  }
}

export default App