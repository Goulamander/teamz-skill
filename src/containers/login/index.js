import React, {useEffect} from 'react'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Input, Alert } from 'reactstrap'

import { ROUTES } from '../../constants/routeConstants'
import { getSlackRediredirectBaseURL, isTenantSite } from '../../transforms'
import {
  edit_email_login,
  edit_pass_login,
  login,
  update_login_cred
} from '../../actions/login'
import slackLogo from '../../assets/img/slack-logo.jpg'

const Login = ({
  email,
  password,
  error,
  isUserLoggedIn,
  data,
  _edit_email_login,
  _edit_pass_login,
  _login,
  _update_login_cred
}) => {
  let slackRedirectURI = getSlackRediredirectBaseURL() + ROUTES.SLACK_AUTH
    useEffect(() => {
      // if(process.env.REACT_APP_NODE_ENV === 'sandbox' && !isTenantSite()) {
      //   let userData = localStorage.getItem("user_data");
      //   if(userData)
      //   _update_login_cred(JSON.parse(userData))
      // }
      let userData = localStorage.getItem("user_data");
        if(userData)
        _update_login_cred(JSON.parse(userData))
      }, [])
    
    return (
      <div className="page-landing">
        <Container>
          <div className="landing-group">
            <div className="content-center">
              <div className="login-group">
                { isUserLoggedIn && data.is_new_user &&
                  <Redirect to={ROUTES.ONBOARDING} />
                }
                { isUserLoggedIn && !data.is_new_user &&
                  <Redirect to={ROUTES.PROFILE} />
                }
                <Form id="form_id" method="post" name="myform">
                  {!!error && error.errorType === undefined &&
                    <Alert color="danger">{error}</Alert>
                  }
                  <div className="login-form">
                    <FormGroup>
                      <Input type="text" name="email" id="email" placeholder="Email" value={email} onChange={(e)=> {_edit_email_login(e.target.value)}} />
                    </FormGroup>
                    <FormGroup>
                      <Input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e)=> {_edit_pass_login(e.target.value)}} />
                    </FormGroup>
                    <div className="forgot-password">
                      <a href="forgot-password.html">Forgot Password?</a>
                    </div>
                  </div>
                </Form>
                <div className="login-btns">
                  <Link className="btn btn-theme" to={ROUTES.SignUp}>Sign Up</Link>
                  <input type="button" className="btn btn-theme" defaultValue="Sign In" id="submit" onClick={()=>_login({email,password})} />
                </div>
                {
                  process.env.REACT_APP_NODE_ENV !== 'sandbox' &&
                  <div className="login-slack">
                    <div className="login-slack-title">Already have a Slack team? </div>
                    <a href={`https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${process.env.REACT_APP_SLACK_SECRET}&redirect_uri=${slackRedirectURI}`} className="btn btn-slack"><img src={slackLogo} alt="Slack" /> Sign in with <span>Slack</span></a>
                  </div>
                }
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
}
const mapStateToProps = ({ login }) => ({
  ...login
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _edit_email_login : edit_email_login,
      _edit_pass_login  : edit_pass_login,
      _update_login_cred : update_login_cred, 
      _login            : login
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
