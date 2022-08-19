import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import {
  slackAuth
} from '../../actions/slack_auth'
import { ROUTES } from '../../constants/routeConstants'
import { getQueryCode, getSlackRediredirectBaseURL } from '../../transforms'
import loader from '../../assets/img/loader.gif'

class SlackAuth extends Component {

  componentDidMount() {
    let { location } = this.props
    if(location.search) {
      let code = getQueryCode(location.search)

      // begin auth
      this.props._slackAuth(code, getSlackRediredirectBaseURL() + ROUTES.SLACK_AUTH)
    }
  }

  render() {
    let { login } = this.props
    return (
      <div className="page-landing">
        <div className="container">
          <div className="landing-group">
            <div className="content-center">
              <div className="login-group">
                <div className="login-slack">
                  {
                    login.isLoading && <img src={loader} alt="Slack" />
                  }
                  { login.isUserLoggedIn && login.data.is_new_user &&
                    <Redirect to={ROUTES.ONBOARDING} />
                  }
                  { login.isUserLoggedIn && !login.data.is_new_user &&
                    <Redirect to={ROUTES.PROFILE} />
                  }
                  { login.error &&
                    <Redirect to={ROUTES.LOGIN} />
                  }
                </div>
              </div>
            </div>
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
      _slackAuth: slackAuth
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlackAuth)
