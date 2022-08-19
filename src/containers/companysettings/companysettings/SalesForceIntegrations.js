import React, { Component, Fragment, useState, useEffect } from 'react';
import {  Nav, NavItem, NavLink, Row, Col, Input, Label, Form, Alert, FormGroup, Container, Button, FormFeedback } from 'reactstrap';
import { Formik, Field } from 'formik';
import * as yup from 'yup'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';

import { setSalesforceEmail, getSalesforceEmail } from '../../../actions/integrations'

const schema = yup.object({
  salesforce_email: yup.string().email('Please enter valid email').required('This field is required')
});

const Heading = (props) => (
  <Row>
    <Col className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pb-2">
      <div className="company-section-title">SalesForce Integration</div>
    </Col>
  </Row>
)

const NavBar = ({
  activeTopNav,
  _selectTopNav
}) => {
  return (
    <Row className="mt-2">
      <Col sm={12} className="pr-0">
        <div className="tab-bar-company" style={{background: '#ffffff'}}>
          <Nav tabs className="top-nav">
            <NavItem className={activeTopNav === "getting-started" ? "active" : ""} onClick={ () => _selectTopNav('getting-started')}>
              <NavLink href="javascript:void(0)" className="">Getting Started</NavLink>
            </NavItem>
            <NavItem className={activeTopNav === "fromSalesforce" ? "active" : ""} onClick={ () => _selectTopNav('fromSalesforce')}>
              <NavLink href="javascript:void(0)" className="">From Salesforce</NavLink>
            </NavItem>
            <NavItem className={activeTopNav === "toSalesforce" ? "active" : ""} onClick={ () => _selectTopNav('toSalesforce')}>
              <NavLink href="javascript:void(0)" className="">To Salesforce</NavLink>
            </NavItem>
          </Nav>
        </div> 
      </Col>
    </Row>
  )
}

class SalesForceIntegrations extends Component{
  constructor(props) {
    super(props)

    let { location } = this.props
    this.state = {
      activeTopNav: 'fromSalesforce',
    }
  }


  componentDidMount() {    
  }

  selectTopNav = (navMenu) => {
    this.setState({
      activeTopNav: navMenu
    })
  }

  render(){
    const { activeTopNav } = this.state
    const { type, gettingStartedText } = this.props;

    return(
      <div className="page-admin saml-section">
        <Heading type={type} />
        <NavBar activeTopNav={activeTopNav} _selectTopNav={this.selectTopNav} />
        { activeTopNav === 'getting-started' ?
            <div>Getting Started</div> : ''
        }
        { activeTopNav === 'fromSalesforce' &&
            <FromSalesforce props={this.props} />
        }
        { activeTopNav === 'toSalesforce' &&
          <div>To SalesForce</div>
        }
      </div>
    );
  }
}

const FromSalesforce = ({props}) => {

  const [successResponse, SetSuccessResponse] = useState(false);
  const [errorResponse, SetErrorResponse] = useState(false);

  useEffect(() => {
    props._getSalesforceEmail();
  }, [])

  const submitDetails = (values, actions) => {
    let data = {...values}
    props._setSalesforceEmail(data, function(err, data) {
      if(err) {
        SetErrorResponse(true);
      } else {
        SetSuccessResponse(true);
      }
    })
  }

  const hideAlert = () => {
    SetErrorResponse(false);
    SetSuccessResponse(false);
  }

  return (
    <Row>
      <Col className="salesforce-container">
        <div className="pt-4">
          <h4 className="sales-heading">Integration user</h4>
          <p>TeamzSkill requires a valid Salesforce user email in order to setup and maintain server-to-server integration with Salesforce. This Salesforce user should have system admin privilieges within Salesforce. The Salesforce user email you entered here will be saved as the integration user. You can change the integration user email id at any time - pls make sure the new user has appropriate admin privileges in your Salesforce instance.</p>
        </div>
        <Formik
          enableReinitialize
          validationSchema={schema}
          onSubmit={submitDetails}
          initialValues={{
            salesforce_email: props.salesforceEmail
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
              <Row className = "pt-2">
                  <Container className="pt-3"> 
                    <div className="modal-form">
                      <Row>
                          <Col xl="10" lg="10" md="10" sm="12" className="pl-0 pr-0">
                            <div className="salesforce-email-wrapper">
                              <FormGroup>
                                  <Input
                                    type="text" 
                                    name="salesforce_email"
                                    placeholder={"Enter email for integration user"}
                                    className="bottom-border"
                                    value={values.salesforce_email}
                                    onChange={handleChange}
                                    invalid={touched.salesforce_email && !!errors.salesforce_email}
                                  />
                                  <FormFeedback>{errors.salesforce_email}</FormFeedback>
                              </FormGroup>
                              <div className="submit-btn">
                                <Button type={'submit'} className={`btn btn-theme company-save-btn`} >
                                  Save
                                </Button>
                              </div>  
                            </div>    
                          </Col>
                      </Row>
                    </div>
                  </Container>
              </Row>
          </Form>  
        )}
        </Formik>
      </Col>
      { successResponse &&
        <SweetAlert
          success
          title="Woot!"
          onConfirm={hideAlert}
        >
        Salesforce Email saved successfully!
        </SweetAlert>
      }
      {
        errorResponse && 
        <SweetAlert
          danger
          title="Error"
          onConfirm={hideAlert}
        >
        {props.setEmailError}
        </SweetAlert>
      }
    </Row>     
  )
}

const mapStateToProps = ({ integrations }) => ({
  setEmailError: integrations.setSlaesForceEmailError,
  salesforceEmail : integrations.getSalesForceEmail
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _setSalesforceEmail       : setSalesforceEmail,
      _getSalesforceEmail       : getSalesforceEmail
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesForceIntegrations)
