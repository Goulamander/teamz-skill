import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import cryptoRandomString from 'crypto-random-string';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';

import { appConstant, MicrositeStyle } from '../../../constants/appConstants'
import { create_microsites } from '../../../actions/microsites'
import crossIcon from '../../../assets/img/crossIcon.png'
import ForwardArrowIcon from '../../../assets/img/add_tags_btn_icon.png'
import ForwardArrowIconWhite from '../../../assets/img/forward_icon_white.png'
import backwardArrowIcon from '../../../assets/img/backward_icon.png'
import selectedBg from '../../../assets/img/stepcomplete.png'
import { ROUTES } from '../../../constants/routeConstants'

const CutomizeForm = (props) => {
    const history = useHistory();
    let { bgImagesAndColors, selectedBackground, libraryLogos, selectedLogo, previewBg, selecledStyle } = props;
    const [isSelectBgOpen, SetIsSelectBgOpen] = useState(false);
    const [isSelectLogoOpen, SetIsSelectLogoOpen] = useState(false);
    const [logoImageName, SetLogoImageName] = useState('');
    const [logoUploadImage, SetLogoUploadImage] = useState(null);
    const [bgImageName, SetBgImageName] = useState('');
    const [bgUploadImage, SetBgUploadImage] = useState(null);
    const [micrositeLink, SetMicrositeLink] = useState('');
    const [micrositeCustmizeLink, SetMicrositeCustomizeLink] = useState('');
    const [ isCreateCourseError, SetIsCreateCourseError ] = useState(false);
    const [ createCourseError, SetCreateCourseError ] = useState('');
    
    const selectBackground = () => {
        if(isSelectBgOpen) {
            SetIsSelectBgOpen(false);
        } else {
            SetIsSelectBgOpen(true);
        }
    }

    useEffect(() => {
        let microsite_link = cryptoRandomString({length: 32, type: 'url-safe'});
        SetMicrositeLink(microsite_link);
        if(props.textToDisplay && props.editMicroSite) {
            SetMicrositeCustomizeLink(props.textToDisplay);
        }
    }, [])

    const selectLogo = () => {
        if(isSelectLogoOpen) {
            SetIsSelectLogoOpen(false);
        } else {
            SetIsSelectLogoOpen(true);
        }
    }

    const pickBgImage = (bgImg) => {
        props.changeBg(bgImg, '');
    }

    const pickLogoImage = (img) => {
        props.changeLogo(img, '');
    }

    const cancelCross = () => {
        //history.push(ROUTES.CONTENT_PORTAL_ALL_CONTENT);
        props._handleCustomizeFormOpen();
    }

    const SetUploadLogo = (e) => {
        SetLogoImageName(e.target.files[0].name);
        SetLogoUploadImage(e.target.files[0]);
        props.changeLogo('', URL.createObjectURL(e.target.files[0]));
    }

    const SetUploadBg = (e) => {
        SetBgImageName(e.target.files[0].name);
        SetBgUploadImage(e.target.files[0]);
        props.changeBg('', URL.createObjectURL(e.target.files[0]));
    }

    const handleCustomizeLink = (e) => {
        SetMicrositeCustomizeLink(e.target.value);
    }

    const handleSaveMicrosite = () => {
        if(props.editMicroSite) {
            let json = {
                "short_des": props.headerDes,
                "title": props.headerTitle,
                "customize_link": micrositeCustmizeLink,
                "background_image": props.selectedBackground.image ? props.selectedBackground.image : '',
                "logo": props.selectedLogo,
                "style_type": props.selecledStyle,
                link: props.site_link
            }
            
            if(validateCustomForm(json)) {
                let formData = new FormData();
                formData.append('micrositeData', JSON.stringify(json));
                formData.append('logo', logoUploadImage);
                formData.append('background', bgUploadImage);
                props._upadteMicrosite(formData)
            }
        } else {
            let mapContents = props._selectedMicrositeContents.map(data => {
                let content = {
                    "doc_id": data.doc_id,
                    "doc_serial_id": data.doc_serial_id
                }
                return content;
            });
            console.log("customize_link", micrositeCustmizeLink);
            let json = {
                "short_des": props.headerDes,
                "title": props.headerTitle,
                "link": micrositeLink,
                "customize_link": selecledStyle !== MicrositeStyle.videoContent ?micrositeCustmizeLink : '',
                "background_image": props.selectedBackground.image ? props.selectedBackground.image : '',
                "logo": props.selectedLogo,
                "style_type": props.selecledStyle,
                "contents": mapContents
            }
            
            if(validateCustomForm(json)) {
                let formData = new FormData();
                formData.append('micrositeData', JSON.stringify(json));
                formData.append('logo', logoUploadImage);
                formData.append('background', bgUploadImage);
                props._create_microsites(formData, (err, data) => {
                    if(err) {
                        SetIsCreateCourseError(true);
                        SetCreateCourseError(err);
                        return;
                    }
                    history.replace(`${ROUTES.MICROSITES}/${micrositeLink}`);
                });
            }
        }
    }

    const validateCustomForm = (data) => {
        if(!!data.title === false) {
            SetIsCreateCourseError(true);
            SetCreateCourseError("Please add a title");
            return false
        } if(!!data.customize_link === false && data.style_type !== MicrositeStyle.videoContent) {
            SetIsCreateCourseError(true);
            SetCreateCourseError("Please add text to display");
            return false
        } else {
            return true
        }
    }

    return (
        <Col xs={10} sm={8} lg={3} className="customize-form">
            { !isSelectBgOpen && !isSelectLogoOpen &&
            <Fragment>
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-theme save-btn" onClick={handleSaveMicrosite}>Save</button>
                    <div className="heading">Customize</div>
                    <div className="cancel-icon" onClick={cancelCross}>
                        <img src={crossIcon} width="15" height="15"/>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="modal-form">
                        <Form>
                            <FormGroup>
                                <Label>Title</Label>
                                <Input type="text" placeholder="Add a catchy title to grab attention" value={props.headerTitle} onChange={props.changeTitle} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input type="text" placeholder="Add a short description to connect with prospects & customers" value={props.headerDes} onChange={props.changeShortDes} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Logo</Label>
                                <div className="upload-input">
                                    <Input type="text" placeholder="image size - 150x150 pixel" value={logoImageName} readOnly/>
                                    <div className="icon forward-icon" onClick={selectLogo}>
                                        <img src={ForwardArrowIcon} width="20" height="15" />
                                    </div>
                                </div>    
                            </FormGroup>
                            { MicrositeStyle.videoContent !== selecledStyle &&
                                <FormGroup>
                                    <Label>Text to display</Label>
                                    <Input type="text" placeholder="Add text to display instead of long URL" value={micrositeCustmizeLink} onChange={(e) => {handleCustomizeLink(e); props.changeTextToDisplay(e)}} />
                                </FormGroup>
                            }
                            <div className="background-image">
                                <div className="background-heading px-3 py-2">Background</div>
                                <div className="title mt-4 mb-4">Background</div>
                                <div className="d-flex pb-4 pl-3">
                                    <img className="selected-image" src={previewBg != '' ? previewBg : selectedBackground.image ? appConstant.BASE_URL + selectedBackground.image.replace("dist", "") : ''} width="150" height="100" />
                                    <button onClick={selectBackground} className="p-3 btn selecteBg-btn">
                                        <img src={ForwardArrowIconWhite} width="20" height="15" />
                                    </button>
                                </div>
                            </div>       
                        </Form>    
                    </div>
                </div>
            </Fragment>
            }
            {
                isSelectLogoOpen && 
                <SelectLogoView 
                    selectLogoBack={selectLogo}
                    selectedLogo= {selectedLogo}
                    libraryLogos= {libraryLogos}
                    pickLogoImage = {pickLogoImage}
                    SetUploadLogo = {SetUploadLogo}
                />
            }
            {
                isSelectBgOpen && 
                <SelectBgView 
                    selectBgBack={selectBackground} 
                    selectedBackground={selectedBackground} 
                    bgImagesAndColors={bgImagesAndColors} 
                    pickBgImage={pickBgImage}
                    SetUploadBg= {SetUploadBg} 
                />
            }
            { isCreateCourseError &&
            <SweetAlert
                danger
                title="Error!"
                onConfirm={() => {
                    SetIsCreateCourseError(false);
                    SetCreateCourseError('');
                }}
                >
                {createCourseError}
                </SweetAlert>
            }       
        </Col>
    )
}

const SelectLogoView = ({
    selectLogoBack,
    pickLogoImage,
    libraryLogos,
    selectedLogo,
    SetUploadLogo
}) => {
    const inputFile = useRef(null);
    const [imageName, SetImageName] = useState('');
    const [uploadImage, SetUploadImage] = useState('');

    const onButtonClick = () => {
        inputFile.current.click();
    };

    const onFileChange = (e) => {
        SetImageName(e.target.files[0].name);
        SetUploadImage(e.target.files[0]);
        SetUploadLogo(e);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center add-heading px-3 py-3">
                <div className="icon back-icon" onClick={selectLogoBack}>
                    <img src={backwardArrowIcon} width="20" height="15"/>
                </div>
                <div className="flex-fill text-center">Add Logo</div>
            </div>
            <div className="modal-form mt-3">
                <FormGroup>
                    <Label>Add from your computer</Label>
                    <div className="upload-input">
                        <Input type="text" placeholder="Add customer logo" value={imageName} readOnly/>
                        <div className="upload-button">
                            <button className="btn btn-theme btn-upload" onClick={onButtonClick}>Upload</button>
                        </div>
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={(e) => onFileChange(e)} />
                    </div>    
                </FormGroup>
            </div>
            <div className="background-heading px-3 py-2">Pick from the ones you used earlier</div>
            <div className="row mt-4">
                {
                    libraryLogos.map((data, index) => {
                        return (
                            <div className="col-4 library-logo mt-3" key={index} onClick={() => pickLogoImage(data.image)}>
                                <img className="logo-image" src={data.image ? appConstant.BASE_URL + data.image.replace("dist", "") : ''} />
                                {/* { data === selectedLogo &&
                                    <div className="selected-logo" >
                                        <img src={selectedBg} width="18" height="18" />
                                    </div>
                                } */}
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const SelectBgView = ({
    pickBgImage,
    selectBgBack,
    bgImagesAndColors,
    selectedBackground,
    SetUploadBg
}) => {
    const inputFile = useRef(null);
    const [imageName, SetImageName] = useState('');
    const [uploadImage, SetUploadImage] = useState('');

    const onButtonClick = () => {
        inputFile.current.click();
    };

    const onFileChange = (e) => {
        SetImageName(e.target.files[0].name);
        SetUploadImage(e.target.files[0]);
        SetUploadBg(e);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center add-heading px-3 py-3">
                <div className="icon back-icon" onClick={selectBgBack}>
                    <img src={backwardArrowIcon} width="20" height="15"/>
                </div>
                <div className="flex-fill text-center">Pick background image</div>
            </div>
            <div className="modal-form mt-3">
                <FormGroup>
                    <Label>Add from your computer</Label>
                    <div className="upload-input">
                        <Input type="text" placeholder="image size - less than 500KB" value={imageName} readOnly/>
                        <div className="upload-button">
                            <button className="btn btn-theme btn-upload" onClick={onButtonClick}>Upload</button>
                        </div>
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={(e) => onFileChange(e)} />
                    </div>    
                </FormGroup>
            </div>
            <div className="background-heading px-3 py-2">Pick from our library</div>
            <div className="mt-3">
                {
                    bgImagesAndColors.map((data, index) => {
                        return (
                            <div className="library-bg mt-3" key={index} onClick={() => pickBgImage(data)}>
                                <img className="bg-image" src={data.image ? appConstant.BASE_URL + data.image.replace("dist", "") : ''} />
                                { data.image === selectedBackground.image &&
                                    <div className="selected-bg" >
                                        <img src={selectedBg} width="18" height="18" />
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const mapStateToProps = ({ contentPortal }) => ({
    ...contentPortal
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _create_microsites          :       create_microsites
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CutomizeForm)
