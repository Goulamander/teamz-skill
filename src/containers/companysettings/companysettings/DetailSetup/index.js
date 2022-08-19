import React, { Component } from 'react';
import { Row, Col, Input, Label, Form, Alert, FormGroup, Container, Button } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Formik, Field } from 'formik';
import * as yup from 'yup'
import SweetAlert from 'react-bootstrap-sweetalert';

import { saveSamlDetail } from '../../../../actions/saml_auth'
import { Loader } from '../../../../component/Loader'

const schema = yup.object({
  saml_enable: yup.boolean().required(),
  allow_password_signin: yup.boolean().required(),
  sso_admin_email: yup.string().email().required(),
  entity_id: yup.string().required(),
  entry_point: yup.string().url('Valid entry point required').required(),
});


class DetailSetup extends Component{
  constructor(props) {
    super(props)

    this.state = {
      successResponse: false,
      errorResponse: false
    }
  }



  submitDetails = (values, actions) => {
    let data = {...values}
    // console.log("submitDetails", values)
    this.props._saveSamlDetail(data, (res) => {
      if(res.success === true) {
        this.setState({ successResponse: true})
        // actions.resetForm()
      } else {
        if(res.message)
          this.setState({ errorResponse: res.message})
        else 
          this.setState({ errorResponse: 'Failed to save details'})
      }
    })
  }

  hideAlert = () => {
    this.setState({
      successResponse: false,
      errorResponse: false
    })
  }

  render() {

    let { data } = this.props.saml,
      { successResponse, errorResponse } = this.state

    return (
      <Row>
        <Col className="details-setup-container">
          <div className="pt-4">
            <h4 className="details-setup-heading">Configure SAML SSO details by specifying the following values.</h4>
          </div>
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={this.submitDetails}
            initialValues={data}
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
                        <div className="d-flex checkbox-theme checkbox-company">
                            
                            <Field 
                              name="saml_enable"
                              render={({field}) => 
                                  <Input 
                                  {...field}
                                  id="samlEnable" 
                                  className="styled" 
                                  checked={field.value}
                                  type="checkbox" />
                              } 
                            />

                            <Label for="samlEnable" className="arrow-label">SAML Single Sign-On Enabled</Label>
                        </div>
                        <div className="d-flex checkbox-theme checkbox-company">
                            <Field 
                              name="allow_password_signin"
                              render={({field}) => 
                                <Input 
                                {...field}
                                id="samlPass" 
                                className="styled" 
                                checked={field.value}
                                type="checkbox" />
                              } 
                            />
                            <Label for="samlPass" className="arrow-label">Allow Password Sign in </Label>
                        </div>
                          <div className="modal-form">
                              <Row>
                                  <Col xl="10" lg="10" md="10" sm="12 pt-4">
                                  <FormGroup>
                                      <Label>Contact Email (Required)</Label>
                                      <Input 
                                          type="email" 
                                          name="sso_admin_email"
                                          placeholder="SSO Admin Email"
                                          className="bottom-border"
                                          value={values.sso_admin_email}
                                          onChange={handleChange}
                                          invalid={touched.sso_admin_email && !!errors.sso_admin_email}
                                      />
                                  </FormGroup>
                                  </Col>
                              </Row>
                              {/* <Row>
                                <Col xl="10" lg="10" md="10" sm="12">
                                  <FormGroup>
                                      <Label>User Sign In URL (You will need this for SP-initiated SAML flow)</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="hhh" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row> */}
                              <Row>
                                <Col xl="10" lg="10" md="10" sm="12">
                                  <FormGroup>
                                      <Label>IdP Entity ID (Auto-populated if you uploaded matadata file)</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="User ID" 
                                          name="entity_id"
                                          className="bottom-border"
                                          value={values.entity_id}
                                          onChange={handleChange}
                                          invalid={touched.entity_id && !!errors.entity_id}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="10" lg="10" md="10" sm="12">
                                  <FormGroup>
                                      <Label>IdP Single Sign-On Service URL (Auto-populated if you uploaded metadata)</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="mail" 
                                          name="entry_point"
                                          className="bottom-border"
                                          value={values.entry_point}
                                          onChange={handleChange}
                                          invalid={touched.entry_point && !!errors.entry_point}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row>
                              {/* User attributes comment for now                                  
                              <Row>
                                <Col><h3 className="user-attributes pb-4">User Attributes</h3></Col>
                              </Row>
                              <Row>
                                <Col><h5 className="user-attributes-subheading pb-4">Provide attribute names to map your IdP attribute names to TeamzSkill attributes. <Link to="">Attributes Help.</Link></h5></Col>
                              </Row>
                              <Row>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>First name attribute name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="FirstName" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>Last Name attribute Name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="LastName" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>Title attribute name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="title" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>Location ID attribute Name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="Location" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>Employee ID attribute name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="EmployeeID" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                                <Col xl="6" lg="6" md="6" sm="12">
                                  <FormGroup>
                                      <Label>Manager Email attribute Name</Label>
                                      <Input 
                                          type="text" 
                                          placeholder="managerEmail" 
                                          name="c_duration"
                                          className="bottom-border"
                                          // value={values.c_duration}
                                          // onChange={handleChange}
                                      />
                                  </FormGroup>
                                </Col>
                              </Row>
                            */}
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
        { successResponse &&
          <SweetAlert
            success
            title="Woot!"
            onConfirm={this.hideAlert}
          >
            Saml Details Saved!
        </SweetAlert>
        }
        {
          errorResponse && 
          <SweetAlert
            danger
            title="Error"
            onConfirm={this.hideAlert}
          >
            {errorResponse}
        </SweetAlert>
        }
      </Row>
    )
  }
}


const mapStateToProps = ({ saml }) => ({
  saml
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _saveSamlDetail       : saveSamlDetail
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailSetup)