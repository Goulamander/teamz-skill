import React, { useState, useEffect, useRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Input, Label, Form, Button } from 'reactstrap';

import { appConstant } from '../../../constants/appConstants';
import defaultLogo from '../../../assets/img/logo_placeholder.png'
import yourLogo from '../../../assets/img/your_logo.png'
import { save_logo_placeholder_images, get_logo_placeholder_images } from '../../../actions/userProfilePage'

const Heading = () => (
    <Row>
      <Col className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pb-2">
        <div className="company-section-title">Brand Kit</div>
      </Col>
    </Row>
)

export const ManageBrandKit = (props) => {

    const inputLogoFile = useRef(null);
    const inputPlaceholderFile = useRef(null);

    const [logoImageName, SetLogoImageName] = useState('');
    const [logoUploadImage, SetLogoUploadImage] = useState(null);
    const [logoPlaceholderName, SetLogoPlaceholderName] = useState('');
    const [logoPlaceholderUploadImage, SetlogoPlaceholderUploadImage] = useState(null);
    const [previewLogo, SetPreviewLogo] = useState('');
    const [previewPlaceholder, SetPreviewPlaceholder] = useState('');
    const [ companyLogo, SetCompanyLogo ] = useState(null);
    const [ placeholder, SetPlaceholder ] = useState(null);

    useEffect(() => {
        props._get_logo_placeholder_images();
    }, [])

    useEffect(() => {
        if(props.logoImages) {
            SetCompanyLogo(props.logoImages.company_logo)
            SetPlaceholder(props.logoImages.placeholder_logo)
        }
    }, [props.logoImages])

    const handleSaveImages = () => {
        if(logoPlaceholderUploadImage === null && logoUploadImage === null) {
            alert("please upload logo")
        } else {
            let formData = new FormData();
            formData.append('logo', logoUploadImage);
            formData.append('placeholder_logo', logoPlaceholderUploadImage);
            props._save_logo_placeholder_images(formData, function(err, data) {
                if(err) {
                    return false;
                }
                props._get_logo_placeholder_images();
            })
        }
    }

    const onLogoButtonClick = () => {
        inputLogoFile.current.click();
    };

    const onPlaceholderButtonClick = () => {
        inputPlaceholderFile.current.click();
    };

    const onLogoFileChange = (e) => {
        SetLogoImageName(e.target.files[0].name);
        SetLogoUploadImage(e.target.files[0]);
        SetPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }

    const onPlaceholderFileChange = (e) => {
        SetLogoPlaceholderName(e.target.files[0].name);
        SetlogoPlaceholderUploadImage(e.target.files[0]);
        SetPreviewPlaceholder(URL.createObjectURL(e.target.files[0]));
    }

    return(
        <div className="manage-brand-kit">
            <Row>
                <Col className="meta-data-container">
                <Heading />
                </Col>
            </Row>
            <div className="brand-kit-wrapper">
                <Row>
                    <Col className="content-portal-logo">
                        <div className="logo-title">Your company logo for Content Portal (best if used 180 x 180 .png file)</div>
                    </Col>
                </Row>
                <Row className="pt-4">    
                    <Col className="logo-add-btn">
                        <div className="d-flex">
                            <div className="plus-icon-wrapper">
                                <div className="plus-icon" onClick={onLogoButtonClick}>
                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="logo-image-wrapper">
                                <div className="logo-image">
                                    {
                                        previewLogo != '' ? <img className="logo-round-image" src={previewLogo} height="180" width="180" />  :
                                        companyLogo != null ?
                                        <img className="logo-round-image" src={appConstant.BASE_URL + companyLogo.replace('dist', '')} height="180" width="180" /> : <img className="logo-round-image" src={defaultLogo} height="180" width="180" />
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="pt-5">
                    <Col className="content-portal-logo">
                        <div className="logo-title">Your company logo for Content & Course cards (best if used 40 x 20 .png file)</div>
                    </Col>
                </Row>
                <Row className="pt-4">    
                    <Col className="logo-add-btn">
                        <div className="d-flex">
                            <div className="plus-icon-wrapper">
                                <div className="plus-icon" onClick={onPlaceholderButtonClick}>
                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="logo-image-wrapper">
                                <div className="logo-image">
                                {
                                    previewPlaceholder != '' ? <img className="cmp-logo" src={previewPlaceholder} height="20" width="40" />  :
                                    placeholder != null ?
                                    <img className="cmp-logo" src={appConstant.BASE_URL + placeholder.replace('dist', '')} height="20" width="40" /> :
                                    <img src={yourLogo} height="20" width="40" />
                                }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <input type='file' id='logo' ref={inputLogoFile} style={{display: 'none'}} onChange={(e) => onLogoFileChange(e)} />
                <input type='file' id='placeholder' ref={inputPlaceholderFile} style={{display: 'none'}} onChange={(e) => onPlaceholderFileChange(e)} />
                <Row className="pt-4">
                    <Col>
                        <Button className="save-btn pull-right" onClick={handleSaveImages}>Save</Button>
                    </Col>
                </Row>    
            </div>
        </div>    
    )
}

const mapStateToProps = ({ profileSettings }) => ({
    ...profileSettings
})

const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
    _save_logo_placeholder_images       :  save_logo_placeholder_images,
    _get_logo_placeholder_images        :  get_logo_placeholder_images,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageBrandKit)