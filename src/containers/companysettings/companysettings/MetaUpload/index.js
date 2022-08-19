import React, { Component } from 'react';
import { Row, Col, Input, Label, Form, Alert, FormGroup, Container, Button } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Formik, Field } from 'formik';
import * as yup from 'yup'
import SweetAlert from 'react-bootstrap-sweetalert';

import { saveSamlMetadata } from '../../../../actions/saml_auth'
import { Loader } from '../../../../component/Loader'

const schema = yup.object({
  meta_data: yup.string().required()
});


class MetaDataUpload extends Component{
  constructor(props) {
    super(props)

    this.state = {
      successResponse: false,
      errorResponse: false
    }
  }

  submitDetails = (values, actions) => {
    let data = {...values}
    console.log("submitDetails", values)
    this.props._saveSamlMetadata(data, this.props.type, (res) => {
      if(res.success === true) {
        this.setState({ successResponse: true})
        // actions.resetForm()
      } else {
        if(res.message)
          this.setState({ errorResponse: res.message})
        else 
          this.setState({ errorResponse: 'Failed to save metadata'})
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
    const metadataPlaceholder = '<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor entityID="http://www.okta.com/exko347kzag9pExb20h7" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"'+'>'+
    '……' +
    '……' +
    
    'md:IDPSSODescriptor></md:EntityDescriptor>';

    let { data } = this.props.saml,
    { successResponse, errorResponse } = this.state
    
    return (
      <Row>
        <Col className="meta-data-container">
          <div className="pt-4">
            <h4 className="meta-data-heading">XML Metadata</h4>
          </div>
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={this.submitDetails}
            initialValues={{
              meta_data: data.meta_data
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
                                  <Input 
                                      type="textarea" 
                                      name="meta_data"
                                      placeholder={metadataPlaceholder}
                                      className="bottom-border"
                                      value={values.meta_data}
                                      onChange={handleChange}
                                      invalid={touched.meta_data && !!errors.meta_data}
                                  />
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
        { successResponse &&
          <SweetAlert
            success
            title="Woot!"
            onConfirm={this.hideAlert}
          >
            Saml Metadata Saved!
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
      _saveSamlMetadata       : saveSamlMetadata
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetaDataUpload)
