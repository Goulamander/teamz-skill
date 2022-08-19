import React, {useState, useEffect} from 'react'
import { Row, Col, Input, Form, FormGroup, Modal } from 'reactstrap'
import { Formik } from 'formik';
import * as yup from 'yup'

import step from '../../../assets/img/step.png'

const schema = yup.object({
  step_title: yup.string().required(),
  step_link: yup.string().required().url(),
});

const StepVideoLinkModal = ({
  isStepVideoLinkModalShow,
  stepData,
  index,
  courseId,
  isAddingStepInfo,
  _getTypeIcon,
  _closeModal,
  _onSubmit,
  _get_custom_assign_course
}) => {

  const handleSubmit = (values, { resetForm }) => {
    console.log("handleSubmit", values)

    let data = {
      course_id: courseId,
      step_id: stepData.step_id,
      ...values
    }

    _onSubmit(data, (res) => {

      if(res.success) 
        _closeModal()

      _get_custom_assign_course(courseId)
    })
  }

  return (
    <Modal className={'modal-dialog-centered modal-user-step-input'} 
      modalClassName={'modal-theme tzs-modal'} 
      isOpen={isStepVideoLinkModalShow} 
      toggle={_closeModal}>
      <Row className="review-step">
        <Col xs="12">
          <img className={"ts-icon icon-check"} src={step}/>
          <span className="pl-2">{`Step ${index+1}`}</span>
        </Col>
      </Row>
      <Row> 
        <Col>
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{
              step_title: '',
              step_link: ''
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
              <Form className={"modal-form pt-4"} noValidate onSubmit={handleSubmit} >
                <FormGroup className="step-title">
                  <Input
                      placeholder="Pick a title for your demo video"
                      name="step_title"
                      value={values.step_title}
                      onChange={handleChange}
                      invalid={touched.step_title && !!errors.step_title}
                  />
                </FormGroup>
                <FormGroup className={"step-link mb-1"}>
                  <div className="step-link-img">
                    <img className={"ts-icon icon-int-content py-1"} src={_getTypeIcon(stepData.step_type)} />
                  </div>
                  <Input
                      placeholder="Enter URL for your demo video and submit for review"
                      name="step_link"
                      value={values.step_link}
                      onChange={handleChange}
                      invalid={touched.step_link && !!errors.step_link}
                  />
                  <div className="step-submit-btn text-right">
                    {isAddingStepInfo?
                      <span className="btn btn-theme">Submiting...</span>
                    :
                      <span className="btn btn-theme" onClick={handleSubmit}>Submit</span>
                    }
                  </div>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Modal>
  )
}

export default StepVideoLinkModal