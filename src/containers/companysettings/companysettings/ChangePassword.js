import React, { Component } from 'react';
import { Row, Col, Input, Label, Form, Alert, FormGroup, FormFeedback, Container, Button } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Formik, Field } from 'formik';
import * as yup from 'yup'
import SweetAlert from 'react-bootstrap-sweetalert';

import { Loader } from '../../../component/Loader'
import { updateAdminPassword, changeAdminPasswordState } from '../../../actions/saml_auth'

const Heading = () => (
  <Row>
    <Col className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pb-2">
      <div className="company-section-title">Password</div>
    </Col>
  </Row>
)

const schema = yup.object({
  curr_pwd: yup.string().required("This field is required"),
  new_pwd: yup.string().min(8, "Must be 8 characters long").required("This field is required"),
  passwordConfirm: yup.string().required("This field is required").when("new_pwd", {
    is: val => (val && val.length > 0 ? true : false),
    then: yup.string().oneOf(
      [yup.ref("new_pwd")],
      "Must match with new password"
    )
  }),
});


class ChangePassword extends Component{

  submitDetails = (values, actions) => {
    let { _updateAdminPassword } = this.props
    let data = {...values}
    console.log(data)
    _updateAdminPassword(data);
  }

  hideAlert = () => {
    this.props._changeAdminPasswordState({
      updatePasswordSuccess: false,
      updatePasswordError: ''
    })
  }

  render() {
    let { isLoading, updatePasswordError, updatePasswordSuccess } = this.props
    return (
      <Row>
        <Col className="meta-data-container">
          <Heading />
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={this.submitDetails}
            initialValues={{
              curr_pwd: '',
              new_pwd: '',
              passwordConfirm: ''
            }}
          >
              {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
              }) => (
              <Form onSubmit={handleSubmit} className="form-container">
                  <Row className = "company-form pl-4 pr-4">
                      <Container className="pt-3"> 
                        <div className="modal-form">
                          <Row>
                              <Col xl="10" lg="10" md="10" sm="12 pt-4">
                              <FormGroup>
                                <Label>Current Password</Label>
                                <Input 
                                    type="password" 
                                    name="curr_pwd"
                                    placeholder={"XXXXXXXX"}
                                    className="bottom-border"
                                    value={values.curr_pwd}
                                    onChange={handleChange}
                                    invalid={touched.curr_pwd && !!errors.curr_pwd}
                                />
                                <FormFeedback>{errors.curr_pwd}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label>New Password</Label>
                                <Input 
                                    type="password" 
                                    name="new_pwd"
                                    placeholder={"Must be 8 characters long"}
                                    className="bottom-border"
                                    value={values.new_pwd}
                                    onChange={handleChange}
                                    invalid={touched.new_pwd && !!errors.new_pwd}
                                />
                                <FormFeedback>{errors.new_pwd}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label>Confirm Password</Label>
                                <Input 
                                    type="password" 
                                    name="passwordConfirm"
                                    placeholder={"XXXXXXXX"}
                                    className="bottom-border"
                                    value={values.passwordConfirm}
                                    onChange={handleChange}
                                    invalid={touched.passwordConfirm && !!errors.passwordConfirm}
                                />
                                <FormFeedback>{errors.passwordConfirm}</FormFeedback>
                              </FormGroup>
                              </Col>
                          </Row>
                        </div>
                      </Container>
                  </Row>
                  <div className="pt-4 save-btn-container">
                    <Button type={'submit'} className={`btn btn-theme company-save-btn`} >
                      Save
                    </Button>
                  </div>
              </Form>
                  
          )}
        </Formik>
        </Col>
        { updatePasswordSuccess &&
          <SweetAlert
            success
            title="Woot!"
            onConfirm={this.hideAlert}
          >
            Password has been updated
        </SweetAlert>
        }
        {
          !!updatePasswordError === true && 
          <SweetAlert
            danger
            title="Error"
            onConfirm={this.hideAlert}
          >
            {updatePasswordError}
        </SweetAlert>
        }
        { isLoading &&
          <Loader />
        }
      </Row>
    )
  }
}


const mapStateToProps = ({ saml }) => ({
  isLoading: saml.isLoading,
  updatePasswordSuccess: saml.updatePasswordSuccess,
  updatePasswordError: saml.updatePasswordError
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _updateAdminPassword       : updateAdminPassword,
      _changeAdminPasswordState  : changeAdminPasswordState
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword)
