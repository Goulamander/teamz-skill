import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import {
  samlAuth
} from '../../actions/saml_auth'
import {
  checkTenatExist
} from '../../actions/login'
import { ROUTES } from '../../constants/routeConstants'
import { getQueryCode } from '../../transforms'
import loader from '../../assets/img/loader.gif'
import { getTenantSite } from '../../transforms';
class SamlAuth extends Component {

  componentDidMount() {
    let tenantName = getTenantSite();

    if(process.env.REACT_APP_NODE_ENV === 'sandbox') {
      if(tenantName){
        this.props._checkTenatExist(tenantName)
      }
    } else {
      if(tenantName){
        // begin auth
        this.props._samlAuth(tenantName)
      }
    }
  }

  getTenant = () => {
    let domain = window.location.host.toLowerCase();
    let path = window.location.pathname.toLowerCase();
    let domainChunks = domain.split('.');
    let subdomain = domainChunks[domainChunks.length - 3]

    return subdomain
  }

  redirectErrorResponse = (error) => {
    if(!!error.status == true){
      switch(error.status) {
        case 401:
          return <Redirect to={ROUTES.TENANT_LOGIN} />
        case 404:
        case 405:
          return <Redirect to={ROUTES.TENANT_NONE} />
      }
    } else {
      return <Redirect to={ROUTES.TENANT_LOGIN} />
    }
  } 

  redirectSandboxErrorResponse = (error) => {
    console.log("error", error);
    if(!!error.status == true){
      switch(error.status) {
        case 404:
        case 405:
          return <Redirect to={ROUTES.TENANT_NONE} />
      }
    } else {
      return <Redirect to={ROUTES.HOME} />
    }
  }

  render() {
    let { login } = this.props
    return (
      <div className="page-landing">
        <div className="container">
          <div className="landing-group" style={{minHeight: '63vh'}}>
            {
              process.env.REACT_APP_NODE_ENV === 'sandbox' ? 
              <div> 
                {login.tenantExist && this.redirectSandboxErrorResponse(login.tenantCheckError)}
              </div>  
              : <div className="content-center">
                  {
                    !login.isLoading && 
                    <div>
                      <div>
                        <img src={loader} alt="SAML" style={{width: '50px'}} />
                      </div>
                      Please wait we are verifying your tenant...
                    </div>
                  }
                  { login.isUserLoggedIn && login.data.is_new_user &&
                    <Redirect to={ROUTES.ONBOARDING} />
                  }
                  { login.isUserLoggedIn && !login.data.is_new_user &&
                    <Redirect to={ROUTES.PROFILE} />
                  }
                  { 
                    login.error &&
                      this.redirectErrorResponse(login.error)
                  }
                </div> 
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => ({
  login: state.login,
  location: state.router.location
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _samlAuth: samlAuth,
      _checkTenatExist: checkTenatExist
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SamlAuth)
