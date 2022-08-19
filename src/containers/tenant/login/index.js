import React from 'react'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Form, FormGroup, Input, Alert } from 'reactstrap'

import { ROUTES } from '../../../constants/routeConstants'
import { appConstant } from '../../../constants/appConstants'
import { getSlackRediredirectBaseURL } from '../../../transforms'
import {
  edit_email_login,
  edit_pass_login,
  login
} from '../../../actions/login'
import slackLogo from '../../../assets/img/slack-logo.jpg'

const TenantLogin = ({
  email,
  password,
  error,
  isUserLoggedIn,
  data,
  _edit_email_login,
  _edit_pass_login,
  _login
}) => {
  let slackRedirectURI = getSlackRediredirectBaseURL() + ROUTES.TENANT_SLACK_AUTH
    return (
      <div className="page-landing tenant-login">
        <Container>
          <div className="landing-group">
            <div className="content-center">
              <h2 className="heading">Up-Skill Your Team</h2>
              <p className="title my-5">TeamzSkill gives your team the lift they need to propel at work.</p>
              <div className="login-group">
                { isUserLoggedIn && data.is_new_user &&
                  <Redirect to={ROUTES.ONBOARDING} />
                }
                { isUserLoggedIn && !data.is_new_user &&
                  <Redirect to={ROUTES.PROFILE} />
                }
                <Form id="form_id" method="post" name="myform">
                  {!!error && typeof error === "string" &&
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
                  {/* <Link className="btn btn-theme" to={ROUTES.SignUp}>Sign Up</Link> */}
                  <input type="button" className="btn btn-theme my-2" defaultValue="Sign In" id="submit" onClick={()=>_login({email,password})} />
                </div>
                <div className="text-center my-2">
                  Or
                </div>
                <div className="saml-login">
                  <a href={`${appConstant.BASE_URL}/api/okta/saml/login`} className="btn btn-theme my-2 mb-5">Sign in using Single Sign-On</a>
                </div>
                <div className="login-slack">
                  <div className="login-slack-title">Already have a Slack team? </div>
                  {/* <a href={'#'} className="btn btn-slack"><img src={slackLogo} alt="Slack" /> Sign in with <span>Slack</span></a> */}
                  <a href={`https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${process.env.REACT_APP_SLACK_SECRET}&redirect_uri=${slackRedirectURI}`} className="btn btn-slack"><img src={slackLogo} alt="Slack" /> Sign in with <span>Slack</span></a>
                </div>
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
      _login            : login
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantLogin)
