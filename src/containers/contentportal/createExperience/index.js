import React, { Component, useState, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link, withRouter } from 'react-router-dom';

import { get_library_images } from '../../../actions/contentPortal'
import ampereLogo from '../../../assets/img/ampere.png'
import { getTenantSite } from '../../../transforms'
import { appConstant, micrositeConst } from '../../../constants/appConstants'
import { ROUTES } from '../../../constants/routeConstants'
import ExperienceCutomizeForm from './experienceCustomizeform'
import ExperienceTopics from './experienceTopics'
import { create_experiences, get_experience_by_link, update_experiences, reset_exp_data_by_link } from '../../../actions/experiences'
import { getQueryParams, handleTopicIframeLink } from '../../../transforms';
import backButton from '../../../assets/img/back_button.png'

let customerName = 'TSZ';

class CreateExperience extends Component {

    constructor(props) {
        super(props)
        console.log("data", this.props.location.state);
        this.draftData = this.props.location.state || null 
        this.state = {
            bgImagesAndColors : [],
            selectedBackground : {},
            libraryLogos: [],
            selectedLogo: '',
            previewLogo: '',
            previewBg: '',
            headerTitle: '',
            headerDes: '',
            customizeFormOpen: true,
            isNextClicked: false,
            textToDisplay: '',
            topics: [],
            imgContent:{},
            isBuildExpErr: false,
            buildErrorMsg: null,
            reEdit: !!this.draftData,
            isIframeLinkSet: false,
            iframeEmbedLink: '',
            isMicrositeLink: false
        }
    }

    componentDidMount() {
        let { _get_experience_by_link } = this.props
        if (this.draftData && this.draftData.exp_link) {
            let exp_link = this.draftData.exp_link;
            // get experience details expLINK
            _get_experience_by_link(exp_link)
        }
        this.setCustomerName();

        this.props._get_library_images();
        if(this.props.LibraryImg.bgImg.length) {
            this.setState({
                bgImagesAndColors: this.props.LibraryImg.bgImg,
                libraryLogos: this.props.LibraryImg.logoImg
            });
        }
        // if (this.draftData && this.draftData.exp_link) {
        //     let expDataDetail = this.props.expDataByLink;
        //     if (Object.keys(expDataDetail).length) {
        //         console.log("re-edit did mount", this.props.LibraryImg)
        //         this.setState({
        //             reEdit: true,
        //             headerTitle: expDataDetail.title,
        //             headerDes: expDataDetail.description,
        //             topics: expDataDetail.topics,
        //             textToDisplay: expDataDetail.text_to_display,
        //             selectedBackground: {image: expDataDetail.background_img, color: expDataDetail.header_color !== null ? expDataDetail.header_color : micrositeConst.header_def_color},
        //             selectedLogo: expDataDetail.logo,
        //             isNextClicked: true,
        //             customizeFormOpen: false
        //         });
        //     }
        //     if(this.props.LibraryImg.bgImg.length) {
        //         this.setState({
        //             bgImagesAndColors: this.props.LibraryImg.bgImg,
        //             libraryLogos: this.props.LibraryImg.logoImg
        //         });
        //     }
        // }
    }

    componentDidUpdate(prevProps) {
        if (this.draftData && this.draftData.exp_link) {
            let expDataDetail1 = prevProps.expDataByLink
            let expDataDetail = this.props.expDataByLink
            if (expDataDetail1.exp_id !== expDataDetail.exp_id) {
                console.log("re-edit", this.props.LibraryImg)
                this.setState({
                    reEdit: true,
                    headerTitle: expDataDetail.title,
                    headerDes: expDataDetail.description,
                    topics: expDataDetail.topics,
                    textToDisplay: expDataDetail.text_to_display,
                    selectedBackground: {image: expDataDetail.background_img, color: expDataDetail.header_color !== null ? expDataDetail.header_color : micrositeConst.header_def_color},
                    selectedLogo: expDataDetail.logo,
                    isNextClicked: true,
                    customizeFormOpen: false
                });
            }
            if(this.props.LibraryImg.bgImg.length !== prevProps.LibraryImg.bgImg.length) {
                this.setState({
                    bgImagesAndColors: this.props.LibraryImg.bgImg,
                    libraryLogos: this.props.LibraryImg.logoImg
                });
            }
        } else {
            if(this.props.LibraryImg.bgImg.length !== prevProps.LibraryImg.bgImg.length) {
                this.setState({
                    bgImagesAndColors: this.props.LibraryImg.bgImg,
                    selectedBackground: this.props.LibraryImg.bgImg[0],
                    libraryLogos: this.props.LibraryImg.logoImg,
                    selectedLogo: this.props.LibraryImg.logoImg[0].image
                });
            }
        }
    }

    componentWillUnmount() {
        this.props._reset_exp_data_by_link();
    } 

    setCustomerName = () => {
        let cust = getTenantSite()
        if(cust !== 'app') {
        customerName = cust
        }
        if(cust === 'ampere') {
        customerName = cust
        }
    }

    handleOnChangeBg = (img, preview) => {
        this.setState({
            selectedBackground : img,
            previewBg : preview
        })
    }

    handleOnChangeLogo = (img, preview) => {
        this.setState({
            selectedLogo : img,
            previewLogo : preview
        })
    }

    changeShortDes = (e) => {
        this.setState({
            headerDes : e.target.value
        });
    }

    changeTitle = (e) => {
        this.setState({
            headerTitle : e.target.value
        });
    }

    _handleCustomizeFormOpen = () => {
        this.setState(previousState => ({
            customizeFormOpen: !previousState.customizeFormOpen
        }))
    }

    changeTextToDisplay = (e) => {
        this.setState({
            textToDisplay : e.target.value
        });
    }

    handleSave = (json) => {
        if(this.state.isNextClicked === false) {
            this.setState(previousState => ({
                customizeFormOpen: !previousState.customizeFormOpen,
                isNextClicked: !previousState.isNextClicked
            }));
        }
    }
    onHandleBuildExperiences = (exp_state) => {
        const{headerDes,headerTitle,textToDisplay ,selectedLogo,topics,selectedBackground,imgContent}=this.state
        const{experience_link ,uploaded_bgimage,uploaded_logo}= imgContent;
        
        // let validateTopics = topics.every(item => item.topic_name && item.topic_bgcolor && item.topic_text_color && item.topic_link && item.topic_link_type);
        // console.log(validateTopics);
        // let validateTopics = true;
        // for(let i=0;i<topics.length;++i){
        //     if(Object.keys(topics[i]).length===0) {
        //         validateTopics =false;
        //         break;
        //     }
        // }

        // if(!validateTopics) {
        //     this.setState({
        //         isBuildExpErr : true,
        //         buildErrorMsg: "Some of the fields are empty in topics. All topics fields are required"
        //     });
        //     return false;
        // }

        let json = {
            "exp_id": this.state.reEdit ? this.props.expDataByLink.exp_id : null,
            "short_des": headerDes,
            "title": headerTitle,
            "link": this.state.reEdit ? this.props.expDataByLink.link : experience_link,
            "text_to_display": textToDisplay ? textToDisplay : headerTitle,
            "logo":selectedLogo,
            "background_image":selectedBackground.image ? selectedBackground.image : '',
            "exp_state":exp_state,
            "topics":topics,
        }

        let formData = new FormData();
        formData.append('experienceData', JSON.stringify(json));
        formData.append('logo', uploaded_logo);
        formData.append('background', uploaded_bgimage);
        if(this.state.reEdit) {
            console.log("experienceData", json)
            this.props._update_experiences(formData, (err, data) => {
                if(err) {
                    this.setState({
                        isBuildExpErr : true,
                        buildErrorMsg: err
                    })
                    return false
                }
                this.props.history.push(`${ROUTES.EXPERIENCES_LISTING}`);
            });
        } else {
            console.log("experienceData", json)
            this.props._create_experiences(formData, (err, data) => {
                if(err) {
                    this.setState({
                        isBuildExpErr : true,
                        buildErrorMsg: err
                    })
                    return false
                }
                this.props.history.push(`${ROUTES.EXPERIENCES_LISTING}`);
            });
        }
    }

    handleTopic = (data) => {
        this.setState({
            topics : data
        });
    }
    uploadedData = (data) => {
        this.setState({
            imgContent: data
        });
    }

    hideAlert = () => {
        this.setState({
            isBuildExpErr : false,
            buildErrorMsg : null
        })
    }

    handleTopicLink = (link, linkType) => {
        if(linkType === 'FILE_LINK') {
            let driveEmbedUrl = handleTopicIframeLink(link, 'draft');
            this.setState({
                isIframeLinkSet : true,
                iframeEmbedLink : driveEmbedUrl
            });
        } else {
            this.setState({
                isIframeLinkSet : true,
                iframeEmbedLink : link,
                isMicrositeLink: true
            });
        }
    }

    backToMicrosite = () => {
        this.setState({
            isIframeLinkSet : false,
            iframeEmbedLink : '',
            isMicrositeLink: false
        });
    }

    render() {
        let { headerDes, headerTitle, textToDisplay, isIframeLinkSet, iframeEmbedLink, isMicrositeLink, reEdit } = this.state;
        
        return (
            <div id="content-portal">
                <div className="microsite-wrapper">
                    { !isMicrositeLink &&
                        <Row className="micrositer-title m-0" style={this.state.previewBg === '' ? {backgroundColor: this.state.selectedBackground.color} : {backgroundColor: micrositeConst.header_def_color}}>
                            <Col sm="8">
                                <div className="d-flex align-items-center">
                                    { this.state.previewLogo != '' ?
                                        <div className="microsite-logo mr-sm-3">
                                            <img src={this.state.previewLogo} width="100" />
                                        </div> : <div className="microsite-logo mr-sm-3">
                                            <img src={this.state.selectedLogo ? appConstant.BASE_URL + this.state.selectedLogo.replace("dist", "") : ''} width="100" />
                                        </div>
                                    }
                                    <div>
                                        <h3>{ headerTitle != '' ? headerTitle : 'Add a title for your buyer’s experience'}</h3>
                                        <p className="short-des mb-0">{ headerDes != '' ? headerDes : 'Add a short description to connect with buyers - this will be the landing site for their experience'}</p>
                                    </div>
                                </div>    
                            </Col>
                            <div className="upper-button">
                                <div className="share-link">
                                    { this.state.isNextClicked &&
                                        <a href="javascript:void(0);" onClick={() => this.onHandleBuildExperiences('Save')}>Publish</a>
                                    }
                                </div>
                                <div className="share-link">
                                    { this.state.isNextClicked &&
                                        <a href="javascript:void(0);" onClick={() => this.onHandleBuildExperiences('Draft')}>Save</a>
                                    }
                                </div>
                                <div className="modify-link" onClick={this._handleCustomizeFormOpen}>
                                    <a href="javascript:void(0);">Customize</a>
                                </div>
                            </div>
                            {
                                isIframeLinkSet ?
                                <div className="back-button" onClick={this.backToMicrosite}>
                                    <img src={backButton} width="30" height="30" />
                                </div> : ''
                            }    
                        </Row>
                    }
                    { isIframeLinkSet ?
                    <div className="embed-responsive embed-responsive-16by9">
                        {
                            isMicrositeLink ?
                            <div className="back-button" onClick={this.backToMicrosite}>
                                <img src={backButton} width="30" height="30" />
                            </div> : ''
                        }
                        <iframe className="embed-responsive-item" src={iframeEmbedLink} allowFullScreen></iframe>
                    </div> :        
                        <div className="content-cards-wrapper"  style={{backgroundImage: `url(${this.state.previewBg === '' ? this.state.selectedBackground.image ? appConstant.BASE_URL + this.state.selectedBackground.image.replace("dist", "") : '' : this.state.previewBg})`}}>
                            { this.state.isNextClicked && 
                                <ExperienceTopics reEdit={reEdit} _topics={this.handleTopic} _handleTopicLink = {this.handleTopicLink} />   
                            }  
                        </div>
                    }
                    { this.state.customizeFormOpen &&
                        <ExperienceCutomizeForm 
                            uploadedImage={this.uploadedData}
                            bgImagesAndColors= {this.state.bgImagesAndColors} 
                            selectedBackground = {this.state.selectedBackground} 
                            changeBg= {this.handleOnChangeBg}
                            libraryLogos= {this.state.libraryLogos}
                            selectedLogo= {this.state.selectedLogo}
                            changeLogo= {this.handleOnChangeLogo}
                            changeTitle= {this.changeTitle}
                            changeShortDes = {this.changeShortDes}
                            headerTitle = {headerTitle}  
                            headerDes = {headerDes}
                            textToDisplay = {textToDisplay}
                            changeTextToDisplay = {this.changeTextToDisplay}
                            micrositeStyle= {this.props.micrositeStyle}
                            previewBg= {this.state.previewBg}
                            _handleCustomizeFormOpen = {this._handleCustomizeFormOpen}
                            _handleSave = {this.handleSave}
                            isNextClicked = {this.state.isNextClicked}
                        />
                    }
                </div>
                { this.state.isBuildExpErr &&
                    <SweetAlert
                        danger
                        title="Error!"
                        onConfirm={this.hideAlert}
                    >
                    {this.state.buildErrorMsg}
                    </SweetAlert>
                }
            </div>    
        )
    } 
}

const mapStateToProps = ({ contentPortal, experiences }) => ({
    ...contentPortal,
    ...experiences
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {

        _get_library_images         :       get_library_images,
        _create_experiences         :       create_experiences,
        _get_experience_by_link     :       get_experience_by_link,
        _update_experiences         :       update_experiences,
        _reset_exp_data_by_link      :      reset_exp_data_by_link
    },
    dispatch
)

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateExperience))