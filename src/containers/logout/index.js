import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { Container } from 'reactstrap'

import { actions as authActions } from "../app/auth";
import { ROUTES } from '../../constants/routeConstants'
import { isTenantSite } from '../../transforms'
import { logout } from '../../actions/login'
import { logInConstant } from '../../constants/storeConstants'

class Logout extends React.Component {

  componentDidMount() {
    if(isTenantSite()){
      this.props._logout()
    } else {
      authActions.clearSession();
      this.props.normalLogout()
    }
  }

  render () {
    let { login } = this.props
    if( isTenantSite() && process.env.REACT_APP_NODE_ENV !== 'sandbox') {
      return (
        <div className="page-landing">
          <Container>
            <div className="landing-group">
              <div className="content-center">
                <div className="login-group">
                Logging out session...
                </div>
                {!login.isUserLoggedIn &&
                  <Redirect to={ROUTES.TENANT_LOGIN}/>
                }
              </div>
            </div>
          </Container>
        </div>
      )
    } else {
      return (
        <div className="page-landing">
          <Container>
            <div className="landing-group">
              <div className="content-center">
                <div className="login-group">
                Logging out session...
                </div>
                {!login.isUserLoggedIn &&
                  <Redirect to={ROUTES.HOME}/>
                }
              </div>
            </div>
          </Container>
        </div>
      )
    }
  }
}
const mapStateToProps = (state) => ({
  ...state
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _logout       : logout,
      normalLogout  : () => dispatch({type: logInConstant.LOGOUT_SUCCESS})
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
