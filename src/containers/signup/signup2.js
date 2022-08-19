import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { ROUTES } from '../../constants/routeConstants'
import { Form, FormGroup, Input, Button, Alert } from 'reactstrap'
import { editSignUp, signUp } from '../../actions/signup'
import {  update_login_cred } from '../../actions/login'
import { validateEmail, validatePassword, isTenantSite } from '../../transforms'
import loader from '../../assets/img/loader.gif'

class SignUp2 extends Component {

  _onChange = (val, inputType) => {
    let { data } = this.props.signup
    data[inputType] = val
    this.props._editSignUp(data)
  }

  onSubmit = (e) => {
    e.preventDefault();

    let { data } = this.props.signup
    if(this.validateSignUpForm(data)) {
      this.props._signUp(data, () => {
        // if(process.env.REACT_APP_NODE_ENV === 'sandbox' && !isTenantSite()) {
        //   localStorage.setItem("user_data", JSON.stringify(data))
        //   let json = {
        //     email : data.email,
        //     password: data.password
        //   }
        //   this.props._update_login_cred(json);
        // }
        localStorage.setItem("user_data", JSON.stringify(data))
        let json = {
          email : data.email,
          password: data.password
        }
        this.props._update_login_cred(json);
      })
    }
  }

  validateSignUpForm = (data) => {
    data.error.email = !validateEmail(data.email)
    data.error.password = !validatePassword(data.password)
    this.props._editSignUp(data)
    if(data.error.email || data.error.password) {
      return false
    }
    return true
  }

  render() {
    let { signup } = this.props
    let signupData = signup.data
    return (
      <div className="page-landing">
        <div className="container">
          <div className="landing-group">
            <div className="content-center">
              <div className="landing-title small-font">Let’s get you started on TeamzSkill!</div>
              <div className="landing-subtitle small-font">Create your new TeamzSkill account.</div>
              <div className="login-group">
                  { signup.isUserSignUp &&
                    <Redirect to={ROUTES.LOGIN} />
                  }
                <Form id="form_id" onSubmit={this.onSubmit}>
                  { this.props.signup.error &&
                    <Alert color="danger" >{this.props.signup.error}</Alert>
                  }
                  <div className="login-form">
                    <FormGroup>
                      <Input type="text" name="email" id="email" placeholder="Email" value={signupData.email} onChange={(e)=>this._onChange(e.target.value, 'email')} valid={signupData.error.email} invalid={signupData.error.email} />
                    </FormGroup>
                    <FormGroup>
                      <Input type="password" name="password" id="password" placeholder="Create Password" value={signupData.password} onChange={(e)=>this._onChange(e.target.value, 'password')} valid={signupData.error.password} invalid={signupData.error.password} />
                      <div className="help-line">Your password must be 6 or more characters long</div>
                    </FormGroup>
                  </div>
                </Form>
                <div className="login-btns">
                  <Button className={'btn-theme'} disabled={this.props.signup.isLoading} onClick={this.onSubmit} >Start Using TeamzSkill</Button>
                </div>
                {
                  signup.isLoading && <img src={loader} width="50" height="50" alt="Loading..." />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = ({ login, signup }) => ({
  login,
  signup
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _editSignUp: editSignUp,
      _signUp: signUp,
      _update_login_cred : update_login_cred
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp2)
