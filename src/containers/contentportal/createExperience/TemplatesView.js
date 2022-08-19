import React, { Component, Fragment, useState } from "react";
import { Row, Col, Input, Form, Button, Label, FormGroup } from "reactstrap";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ExperienceTopics from "./experienceTopics";
import logo from "../../../assets/img/logo_placeholder.png";
import backButton from '../../../assets/img/back_button.png'
import { ROUTES } from '../../../constants/routeConstants'
import cryptoRandomString from 'crypto-random-string';
import SweetAlert from 'react-bootstrap-sweetalert';

import { appConstant, micrositeConst } from '../../../constants/appConstants'
import { reset_def_exp_templates_by_link, get_def_exp_templates_by_link, create_experiences } from '../../../actions/experiences'
import { get_library_images } from '../../../actions/contentPortal'
import { getQueryParams, handleTopicIframeLink } from '../../../transforms';

class TemplatesView extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            bgImagesAndColors : [],
            selectedBackground : {},
            libraryLogos: [],
            selectedLogo: '',
            headerTitle: '',
            headerDes: '',
            textToDisplay: '',
            selectedLogo: '',
            topics: [],
            isPressClick: false,
            previewLogo: '',
            previewBg: '',
            isIframeLinkSet: false,
            iframeEmbedLink: '',
            isMicrositeLink: false,
            isBuildExpErr: false,
            buildErrorMsg: null,
        }
    }

    componentDidMount() {
        console.log("props", this.props);
        let experienceLink = this.props.match.params.id;
        this.props._get_def_exp_templates_by_link(experienceLink);// for now static link
        this.props._get_library_images();
        
        let expDataDetail = this.props.getDefExpTemDataByLink;
        
        // if (Object.keys(expDataDetail).length) {
        //     console.log("re-edit did mount", this.props.LibraryImg)
        //     this.setState({
        //         headerTitle: expDataDetail.title,
        //         headerDes: expDataDetail.description,
        //         topics: expDataDetail.topics,
        //         textToDisplay: expDataDetail.text_to_display,
        //         selectedBackground: {image: expDataDetail.background_img, color: expDataDetail.header_color !== null ? expDataDetail.header_color : micrositeConst.header_def_color},
        //         selectedLogo: expDataDetail.logo,
        //     });
        // }
        // if(this.props.LibraryImg.bgImg.length) {
        //     this.setState({
        //         bgImagesAndColors: this.props.LibraryImg.bgImg,
        //         libraryLogos: this.props.LibraryImg.logoImg
        //     });
        // }
    }

    componentDidUpdate(prevProps) {
        let expDataDetail1 = prevProps.getDefExpTemDataByLink
        let expDataDetail = this.props.getDefExpTemDataByLink
        if (expDataDetail1.exp_id !== expDataDetail.exp_id) {
            // console.log("re-edit", expDataDetail);
            this.setState({
                headerTitle: expDataDetail.title,
                headerDes: expDataDetail.description,
                topics: expDataDetail.topics,
                textToDisplay: expDataDetail.text_to_display,
                selectedBackground: {image: expDataDetail.background_img, color: expDataDetail.header_color !== null ? expDataDetail.header_color : micrositeConst.header_def_color},
                selectedLogo: expDataDetail.logo
            });
        }
        if(this.props.LibraryImg.bgImg.length !== prevProps.LibraryImg.bgImg.length) {
            this.setState({
                bgImagesAndColors: this.props.LibraryImg.bgImg,
                libraryLogos: this.props.LibraryImg.logoImg
            });
        }
    }

    componentWillUnmount() {
        this.props._reset_def_exp_templates_by_link();
    }  

    pressClickHandler = () => {
        this.setState(previousState => ({
            isPressClick: !previousState.isPressClick
        }))
    };

    handleTopicLink = (link, linkType) => {
        if(linkType === 'FILE_LINK') {
            let driveEmbedUrl = handleTopicIframeLink(link, null);
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

    handleUseTemplate = () => {
        let { headerDes, headerTitle, textToDisplay, selectedBackground, topics, selectedLogo } = this.state;
        let experience_link = cryptoRandomString({length: 32, type: 'url-safe'});
        let json = {
            "exp_id": null,
            "short_des": headerDes,
            "title": headerTitle,
            "link": experience_link,
            "text_to_display": textToDisplay ? textToDisplay : headerTitle,
            "logo":selectedLogo,
            "background_image":selectedBackground.image ? selectedBackground.image : '',
            "topics":topics,
            "exp_state": 'Draft',
        }

        let formData = new FormData();
        formData.append('experienceData', JSON.stringify(json));
        formData.append('logo', null);
        formData.append('background', null);

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

    hideAlert = () => {
        this.setState({
            isBuildExpErr : false,
            buildErrorMsg : null
        })
    }

    render() {
        let { headerDes, headerTitle, isIframeLinkSet, iframeEmbedLink, isMicrositeLink, selectedBackground, selectedLogo } = this.state;
        const { getDefExpTemDataByLink } = this.props;
        
        return (
            <div id="content-portal">
                <div className="microsite-wrapper">
                    { !isMicrositeLink &&
                        <Row className="micrositer-title m-0" style={{backgroundColor: !!selectedBackground.color === true ? selectedBackground.color : micrositeConst.header_def_color}}>
                            <Col sm="8">
                                <div className="d-flex align-items-center">
                                    <div className="microsite-logo mr-sm-3">
                                        <img src={selectedLogo ? appConstant.BASE_URL + this.state.selectedLogo.replace("dist", "") : ''} width="100" />
                                    </div>
                                    <div>
                                        <h3>{headerTitle}</h3>
                                        <p className="short-des mb-0">{headerDes}</p>
                                    </div>
                                </div>
                            </Col>
                            <div className="use-template-button">
                                <Button className="btn use-template-btn" onClick={this.handleUseTemplate}>Use this template</Button>
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
                    <div className="content-cards-wrapper" style={{backgroundImage: `url(${this.state.previewBg === '' ? this.state.selectedBackground.image ? appConstant.BASE_URL + this.state.selectedBackground.image.replace("dist", "") : '' : this.state.previewBg})`}}>
                        {
                            !this.state.isPressClick ? 
                            <div className="press-start" onClick={this.pressClickHandler}>PRESS START</div> :
                            <div className="exp-topics-wrapper mt-3">
                                <div className="topics">
                                    <Row className="d-flex align-items-center justify-content-center">
                                    {getDefExpTemDataByLink.topics.map((data, index) =>  {
                                        return (
                                            <Col className="topic-col d-flex justify-content-center align-items-center my-3" key={index} sm={12} md={6} lg={4}>
                                                <div className="topic" style={{backgroundColor: data.topic_bgcolor, color: data.topic_text_color}} onClick={() => this.handleTopicLink(data.topic_link, data.topic_link_type)}>
                                                    <div className="topic-name">{data.topic_name}</div>
                                                </div>
                                            </Col>
                                        )
                                    })}
                                    </Row>
                                </div>
                            </div>    
                        }
                    </div>
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
        );
    }
}

const mapStateToProps = ({ contentPortal, experiences }) => ({
    ...contentPortal,
    ...experiences
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_def_exp_templates_by_link :   get_def_exp_templates_by_link,
        _get_library_images            :   get_library_images,
        _reset_def_exp_templates_by_link  :  reset_def_exp_templates_by_link,
        _create_experiences         :       create_experiences,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplatesView);
