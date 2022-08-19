import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Alert, Input, Form, Button, Modal, ModalHeader, ModalBody, FormGroup, Label, FormFeedback } from 'reactstrap';
import { Formik, Field } from 'formik';
import * as yup from 'yup'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';

import { get_microsite_by_link, save_CTA_text_data } from '../../../../../actions/microsites'

const CTAschema = yup.object({
    CTAtext: yup.string().required("This field is required"),
    CTAlink: yup.string().required("This field is required"),
});

const CTAModal = ({
    isModalShow,
    _toggle,
    _isAddCTAError,
    _addCTAError,
    _sendAddCTA
}) => {

    const _toggleClick = () => {
        _toggle("noCallbackCalled");
    }

    const submitDetails = (values) => {
        _sendAddCTA(values);
    }

    return (
        <Modal 
            className={'modal-dialog-centered modal-team-member'} 
            modalClassName={'modal-theme tzs-modal'} 
            
            isOpen={isModalShow} 
            toggle={_toggle}
        >
        <ModalHeader toggle={_toggleClick}></ModalHeader>
        <ModalBody>
            <Alert color="danger" isOpen={_isAddCTAError}>
            { _addCTAError != null ? _addCTAError : 'Something went wrong.' }
            </Alert>
            <Formik
            enableReinitialize
                validationSchema={CTAschema}
                onSubmit={submitDetails}
                initialValues={{
                    CTAtext: '',
                    CTAlink: ''
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
                    <Form onSubmit={handleSubmit} className="modal-theme-form">
                        <FormGroup>
                            <Label>CTA Text</Label>
                            <Input 
                                type="text" 
                                name="CTAtext" 
                                placeholder="CTA text"
                                value={values.CTAtext}
                                onChange={handleChange}
                                invalid={touched.CTAtext && !!errors.CTAtext} 
                            />
                            <FormFeedback>{errors.CTAtext}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>CTA Link</Label>
                            <Input 
                                type="text" 
                                name="CTAlink" 
                                placeholder="CTA text"
                                value={values.CTAlink}
                                onChange={handleChange}
                                invalid={touched.CTAlink && !!errors.CTAlink}  
                            />
                            <FormFeedback>{errors.CTAlink}</FormFeedback>
                        </FormGroup>

                        <div className="form-actions d-flex justify-content-end mt-2">
                            <Button className="btn-theme" data-dismiss="modal" type={'submit'}>Save</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </ModalBody>
    </Modal>
    )
}

const VideoContentView = (props) => {
    let { getMSDataByLink } = props;
    const [ isModalShow, setIsModalShow ] = useState(false);
    const [ isAddCTATextErr, setIsAddCTATextErr ] = useState(false);
    const [ addCTATextErr, setAddCTATextErr ] = useState(false);

    const handleCTA = () => {
        setIsModalShow(!isModalShow);
    }

    const toggleClick = () => {
        setIsModalShow(!isModalShow);
    }

    const sendAddCTA = (formData) => {
        let payload = {
            "CTAtext": formData.CTAtext,
            "CTAlink": formData.CTAlink,
            "microsite_id": getMSDataByLink.microsite_id
        }
        props._save_CTA_text_data(payload, function(err, success) {
            if(err) {
                console.log('err', err.message);
                setAddCTATextErr('');
                setIsAddCTATextErr(false);
                setIsModalShow(false);
            } else {
                props._get_microsite_by_link(getMSDataByLink.link);
                setAddCTATextErr('');
                setIsAddCTATextErr(false);
                setIsModalShow(false);
            }
        });
    }

    return (
        <>
            <Row className="justify-content-md-center mt-4">
                <Col lg={9}>
                    <div>
                        <video className="w-100 h-100" poster={props.video_thumbnail} muted loop autoPlay controls playsinline>
                            <source src={getMSDataByLink.video_link} />
                            Your browser does not support the video tag.
                        </video>
                        {/* <video className="w-100 h-100">
                            <source loop autoplay controls="true" playsinline src={getMSDataByLink.video_link}
                                    type="video/mp4" />
                            <source loop autoplay controls="true" playsinline src={getMSDataByLink.video_link}
                                    type="video/ogg" />
                            <source loop autoplay controls="true" playsinline src={getMSDataByLink.video_link}
                                    type='video/webm;codecs="vp8, vorbis"' />
                            <source muted controls autoPlay src={getMSDataByLink.video_link} />
                            Your browser does not support the HTML5 Video element.
                        </video> */}
                    </div>
                    <div className="d-flex justify-content-around video-content-buttons">
                        { !getMSDataByLink.isShared ?
                            <>  
                                {/* <Button className="addMembers">Show link as an animated gif</Button> */}
                                {
                                    (getMSDataByLink.cta_text !== '' && getMSDataByLink.cta_url !== '') ?  <Button className="addMembers cta-link-btn rounded"><a className="cta-link" href={getMSDataByLink.cta_url} target="_blank">{getMSDataByLink.cta_text}</a></Button> : <Button className="addMembers rounded" onClick={handleCTA}>Add a CTA (Optional)</Button>
                                }
                            </>    
                           : (getMSDataByLink.cta_text !== '' && getMSDataByLink.cta_url !== '') ?  <Button className="addMembers cta-link-btn rounded"><a className="cta-link" href={getMSDataByLink.cta_url} target="_blank">{getMSDataByLink.cta_text}</a></Button> : ''
                        }
                    </div>     
                </Col>
            </Row>
            <CTAModal
                isModalShow={isModalShow}
                _toggle={toggleClick}
                _isAddCTAError={false}
                _sendAddCTA={sendAddCTA}
            />
            { isAddCTATextErr &&
            <SweetAlert
                danger
                title="Error!"
                onConfirm={() => {
                    setAddCTATextErr('');
                    setIsAddCTATextErr(false);
                }}
                >
                {addCTATextErr}
                </SweetAlert>
            }
        </>
    )
}

const mapStateToProps = ({ microSites, contentPortal, profileSettings }) => ({
    ...microSites,
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_microsite_by_link          :       get_microsite_by_link,
        _save_CTA_text_data             :       save_CTA_text_data,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoContentView)