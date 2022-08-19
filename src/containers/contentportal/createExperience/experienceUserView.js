import React, { Component, Fragment, useState } from "react";
import { Row, Col, Input, Form, Button, Label, FormGroup } from "reactstrap";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ExperienceTopics from "./experienceTopics";
import logo from "../../../assets/img/logo_placeholder.png";
import backButton from '../../../assets/img/back_button.png'

import { appConstant, micrositeConst } from '../../../constants/appConstants'
import { get_experience_by_link, reset_exp_data_by_link } from '../../../actions/experiences'
import { get_library_images } from '../../../actions/contentPortal'
import { getQueryParams, handleTopicIframeLink } from '../../../transforms';

class ExperienceUserView extends Component {

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
            isMicrositeLink: false
        }
    }

    componentDidMount() {
        console.log("props", this.props);
        let experienceLink = this.props.match.params.id;
        this.props._get_experience_by_link(experienceLink);
        this.props._get_library_images();
        
        let expDataDetail = this.props.expDataByLink;
        
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
        let expDataDetail1 = prevProps.expDataByLink
        let expDataDetail = this.props.expDataByLink
        if (expDataDetail1.exp_id !== expDataDetail.exp_id) {
            console.log("re-edit", this.props.LibraryImg)
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
        this.props._reset_exp_data_by_link();
    } 

    pressClickHandler = () => {
        this.setState(previousState => ({
            isPressClick: !previousState.isPressClick
        }))
    };

    handleTopic = () => {

    }

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

    render() {
        let { headerDes, headerTitle, isIframeLinkSet, iframeEmbedLink, isMicrositeLink } = this.state;
        return (
            <div id="content-portal">
                <div className="microsite-wrapper">
                    { !isMicrositeLink &&
                        <Row className="micrositer-title m-0" style={this.state.previewBg === '' ? {backgroundColor: this.state.selectedBackground.color} : {backgroundColor: micrositeConst.header_def_color}}>
                            <Col sm="8">
                                <div className="d-flex align-items-center">
                                    <div className="microsite-logo mr-sm-3">
                                        <img src={this.state.selectedLogo ? appConstant.BASE_URL + this.state.selectedLogo.replace("dist", "") : ''} width="100" />
                                    </div>
                                    <div>
                                        <h3>{headerTitle}</h3>
                                        <p className="short-des mb-0">{headerDes}</p>
                                    </div>
                                </div>
                            </Col>
                            <div className="upper-button">
                                <div className="share-link">
                                    <a
                                    href="javascript:void"
                                    >
                                    Share
                                    </a>
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
                    <div className="content-cards-wrapper" style={{backgroundImage: `url(${this.state.previewBg === '' ? this.state.selectedBackground.image ? appConstant.BASE_URL + this.state.selectedBackground.image.replace("dist", "") : '' : this.state.previewBg})`}}>
                        {
                            !this.state.isPressClick ? 
                            <div className="press-start" onClick={this.pressClickHandler}>PRESS START</div> : <ExperienceTopics userView={true} _topics={this.handleTopic} _handleTopicLink = {this.handleTopicLink} />
                        }
                    </div>
                    }
                </div>
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
        _get_experience_by_link     :       get_experience_by_link,
        _get_library_images         :       get_library_images,
        _reset_exp_data_by_link      :      reset_exp_data_by_link
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExperienceUserView);
