import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ROUTES } from '../../constants/routeConstants'
import {
  login
} from '../../actions/login'

const Home = props => (
  <div className="page-landing">
    <div className="container">
      <div className="landing-group">
        <div className="content-center">
          <div className="landing-title">Up-Skill Your Team</div>
          <div className="landing-subtitle">TeamzSkill gives your team the lift they need to propel at work.</div>
          <div className="landing-btns">
            <Link className="btn btn-theme" to={ROUTES.SignUp} >Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = ({ login }) => ({
  ...login
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _login: login
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
