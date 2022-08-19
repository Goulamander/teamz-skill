import React from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../constants/routeConstants'
import { getSlackRediredirectBaseURL } from '../../transforms'
import slackLogo from '../../assets/img/slack-logo.jpg'

const SignUp = () => {
  let slackRedirectURI = getSlackRediredirectBaseURL() + ROUTES.SLACK_AUTH
    return (
      <div className="page-landing">
        <div className="container">
          <div className="landing-group">
            <div className="content-center">
              <div className="landing-title">Up-Skill Your Team</div>
              <div className="login-group">
                <div className="login-btns signup-btns">
                  <Link className="btn btn-theme" to={ROUTES.SignUp2}>Sign Up</Link>
                </div>
                { process.env.REACT_APP_NODE_ENV !== 'sandbox' &&
                  <div className="login-slack">
                    <div className="login-slack-title">Already have a Slack team? </div>
                    <a href={`https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=${process.env.REACT_APP_SLACK_SECRET}&redirect_uri=${slackRedirectURI}`} className="btn btn-slack"><img src={slackLogo} alt="Slack" /> Sign in with <span>Slack</span></a>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default SignUp
