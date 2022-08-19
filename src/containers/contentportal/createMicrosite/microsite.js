import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TagManager from 'react-gtm-module'
// import ReactGA from 'react-ga';
import SweetAlert from 'react-bootstrap-sweetalert';

import ampereLogo from '../../../assets/img/ampere.png'
import delIcon from '../../../assets/img/quiz/del-icon.png'
import crossIcon from '../../../assets/img/crossIcon.png'
import addIcon from '../../../assets/img/add_tag_icon.png'
import contentSelectedIcon from '../../../assets/img/stepcomplete.png'
import default_logo from '../../../assets/img/your_logo.png'
import backButton from '../../../assets/img/back_button.png'
import cp_image_1 from '../../../assets/img/cp_image_1.jpg'
import cp_image_2 from '../../../assets/img/cp_image_2.jpg'
import cp_image_3 from '../../../assets/img/cp_image_3.jpg'
import cp_image_4 from '../../../assets/img/cp_image_4.jpg'
import cp_image_5 from '../../../assets/img/cp_image_5.jpg'
import cp_image_6 from '../../../assets/img/cp_image_6.jpg'
import cp_image_7 from '../../../assets/img/cp_image_7.jpg'
import cp_image_8 from '../../../assets/img/cp_image_8.jpg'
import cp_image_9 from '../../../assets/img/cp_image_9.jpg'
import cp_image_10 from '../../../assets/img/cp_image_10.jpg'
import { get_microsite_by_link, update_microsite, delete_microsite_contents } from '../../../actions/microsites'
import { get_library_images } from '../../../actions/contentPortal'
import { get_logo_placeholder_images } from '../../../actions/userProfilePage'
import { getTenantSite } from '../../../transforms'
import { appConstant, micrositeConst, MicrositeStyle } from '../../../constants/appConstants'
import { ROUTES } from '../../../constants/routeConstants'
import likeZero from '../../../assets/img/like_zero.png'
import likeIcon from '../../../assets/img/like-icon.png'
import ShareMicrositeForm from './shareForm'
import CutomizeForm from './cutomizeform'
import MicrositeVideoContent from './/VideoContent';
import HelmetMetaData from "../../../component/HelmetMetaData";
import { ConfirmationBox } from '../../../component/ConfirmationBox'
import { actions as authActions } from "../../../containers/app/auth";

let customerName = 'TSZ';
let imageArray = [cp_image_1, cp_image_2, cp_image_3, cp_image_4, cp_image_5, cp_image_6, cp_image_7, cp_image_8, cp_image_9, cp_image_10];

// if(window.location.search) {
//     ReactGA.initialize("UA-15399295-15");
//     // console.log("location", window.location.pathname);
//     ReactGA.set({ page: window.location.pathname });
//     ReactGA.pageview(window.location.pathname + window.location.search);
// }
// ReactGA.initialize("UA-181731835-1");
// // console.log("location", window.location.pathname);
// ReactGA.set({ page: window.location.pathname });
// ReactGA.pageview(window.location.pathname + window.location.search);

class MicroSite extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            microSiteData : [],
            isShareModalOpen : false,
            customizeFormOpen: false,
            bgImagesAndColors : [],
            selectedBackground : {image:'', color:''},
            libraryLogos: [],
            selectedLogo: '',
            previewLogo: '',
            previewBg: '',
            headerTitle: '',
            styleType: '',
            videoContent: '',
            headerDes: '',
            modifyMsErr: '',
            isModifyMsErr: false,
            isIframeLinkSet: false,
            iframeEmbedLink: '',
            isPopupBarOpen: false,
            isShared: false,
            selectedItems: [],
            openConfirmationBox: false,
            showDeleteContentsErr: false,
            deleteContentsErrMsg: '',
            showDeleteContentsSuccess: false,
            showMinMicrositeCardsErr: false,
            minMicrositeCardsErrMsg: '',
        }
    }

    componentDidMount() {
        console.log("props", this.props);
        let microSiteLink = this.props.match.params.id;
        this.setCustomerName();
        this.props._get_microsite_by_link(microSiteLink);
        this.props._get_library_images();
        this.props._get_logo_placeholder_images();

        let tagManagerArgs = {
            dataLayer: {
                microSiteId: microSiteLink,
                userProject: 'teamzskill',
                page: 'microsites/:id'
            },
            dataLayerName: 'PageDataLayer'
        }
        TagManager.dataLayer(tagManagerArgs)
        
        let { getMSDataByLink } = this.props;
        
        if(getMSDataByLink.contentsData.length && getMSDataByLink.title != '') {
            
            this.setState({
                microSiteData: getMSDataByLink,
                selectedLogo: getMSDataByLink.logo,
                selectedBackground: {image: getMSDataByLink.background_img, color: getMSDataByLink.header_color !== null ? getMSDataByLink.header_color : micrositeConst.header_def_color},
                headerTitle: getMSDataByLink.title,
                headerDes: getMSDataByLink.description,
                textToDisplay: getMSDataByLink.customize_link,
                isShared: getMSDataByLink.isShared,
                styleType: getMSDataByLink.style_type,
                videoContent: getMSDataByLink.video_link
            });
        }
        if(this.props.LibraryImg.bgImg.length) {
            this.setState({
                bgImagesAndColors: this.props.LibraryImg.bgImg,
                libraryLogos: this.props.LibraryImg.logoImg
            });
        }
    }

    componentDidUpdate(prevProps) {
        let { getMSDataByLink } = this.props;
        
        if(getMSDataByLink.title !== prevProps.getMSDataByLink.title) {
            this.setState({
                microSiteData: getMSDataByLink,
                selectedLogo: getMSDataByLink.logo,
                selectedBackground: {image: getMSDataByLink.background_img, color: getMSDataByLink.header_color !== null ? getMSDataByLink.header_color : micrositeConst.header_def_color},
                headerTitle: getMSDataByLink.title,
                headerDes: getMSDataByLink.description,
                textToDisplay: getMSDataByLink.customize_link,
                isShared: getMSDataByLink.isShared,
                styleType: getMSDataByLink.style_type,
                videoContent: getMSDataByLink.video_link
            });
        }
        if(this.props.LibraryImg.bgImg.length !== prevProps.LibraryImg.bgImg.length) {
            this.setState({
                bgImagesAndColors: this.props.LibraryImg.bgImg,
                libraryLogos: this.props.LibraryImg.logoImg
            });
        }
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

    handleOpneShareModal = () => {
        this.setState(previousState => ({
            isShareModalOpen: !previousState.isShareModalOpen
        }))
    }

    _handleCustomizeFormOpen = () => {
        this.setState(previousState => ({
            customizeFormOpen: !previousState.customizeFormOpen
        }))
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

    changeTextToDisplay = (e) => {
        this.setState({
            textToDisplay : e.target.value
        });
    }

    upadteMicrosite = (data) => {
        this.props._update_microsite(data, (err, data) => {
            if(err) {
                this.setState({
                    isModifyMsErr: true,
                    modifyMsErr: err
                })
            }
            this._handleCustomizeFormOpen();
        });
    }

    handleCardLink = (link, mimetype) => {
        if(mimetype === 'application/vnd.google-apps.presentation') {
            let fileId = link.substr(link.indexOf('presentation/d/')+15).split("/")[0] || ''
            let driveEmbedUrl;
            if(link.includes('docs.google.com')) {
                driveEmbedUrl = `https://docs.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
            } else {
                driveEmbedUrl = `https://drive.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
            }
            this.setState({
                isIframeLinkSet : true,
                iframeEmbedLink : driveEmbedUrl
            });
        } else {
            this.setState({
                isIframeLinkSet : true,
                iframeEmbedLink : link
            });
        }
    }

    backToMicrosite = () => {
        this.setState({
            isIframeLinkSet : false,
            iframeEmbedLink : ''
        });
    }

    _selectedData = (content) => {
        let { selectedItems, isPopupBarOpen } = this.state;
        if(this.checkItemAlreadyExist(content)) {
          let items = selectedItems.filter(data => {
            return data.doc_id != content.doc_id
          });
          this.setState({
            selectedItems : items
          })
        } else {
            this.setState({
                selectedItems:  [...selectedItems, content]
            });
        }
        if(!isPopupBarOpen) {
            this.setState({
                isPopupBarOpen : true
            });
        }
    }

    checkItemAlreadyExist = (content) => {
        let { selectedItems } = this.state;
        for(let i=0; i<selectedItems.length; i++) {
          if(selectedItems[i].doc_id === content.doc_id) {
            return true;
          }
        }
        return false;
    }

    cancelEditSelection = () => {
        this.setState({
            isPopupBarOpen : false,
            selectedItems: []
        })
    }

    openConfirmationModal = () => {
        this.setState({
            openConfirmationBox: true
        })
    }

    closeConfBox = () => {
        this.setState({
          openConfirmationBox: false
        })
    }

    onECDeleteHandler = () => {
        let { _delete_microsite_contents, getMSDataByLink } = this.props;
        let { selectedItems } = this.state;
        if(getMSDataByLink.contentsData.length === 1) {
            this.setState({
                showMinMicrositeCardsErr: true,
                minMicrositeCardsErrMsg: 'Microsite contents could not be less than 1',
            });
            this.closeConfBox();
            this.cancelEditSelection();
            return false;
        }
        let microsite_contents = selectedItems.map(data => data.microsite_content_id)
        let payload = {
            "link": getMSDataByLink.link,
            "microsite_id": getMSDataByLink.microsite_id,
            "microsite_contents": microsite_contents
        }
        _delete_microsite_contents(payload, (err, success) => {
            if(err) {
                this.closeConfBox();
                this.cancelEditSelection();
                let microSiteLink = this.props.match.params.id;
                this.props._get_microsite_by_link(microSiteLink);
                this.setState({
                    showDeleteContentsErr: true,
                    deleteContentsErrMsg: err,
                });
            } else {
                this.closeConfBox();
                this.cancelEditSelection();
                let microSiteLink = this.props.match.params.id;
                this.props._get_microsite_by_link(microSiteLink);
                this.setState({
                    showDeleteContentsSuccess: true
                });
            }
        })
    }

    handleAddNewContents = () => {
        this.props.history.push(ROUTES.CONTENT_PORTAL_ALL_CONTENT);
    }

    render() {
        let { getMSDataByLink } = this.props;
        let { isShared, selectedItems, isPopupBarOpen, openConfirmationBox, showDeleteContentsErr, deleteContentsErrMsg, showDeleteContentsSuccess, showMinMicrositeCardsErr, minMicrositeCardsErrMsg, styleType, videoContent } = this.state;
        let { headerDes, headerTitle, textToDisplay, isIframeLinkSet, iframeEmbedLink } = this.state;
        
        return (
            <div id="content-portal">
                <HelmetMetaData title={getMSDataByLink.title} description={getMSDataByLink.description} image={getMSDataByLink.background_img ? appConstant.BASE_URL + getMSDataByLink.background_img.replace("dist", "") : ''} />
                
                {getMSDataByLink && 
                    <div className="microsite-wrapper">
                        <Row className="micrositer-title m-0" style={this.state.previewBg === '' ? {backgroundColor: this.state.selectedBackground.color} : {backgroundColor: micrositeConst.header_def_color}}>
                            <Col sm="8" className="mt-sm-0 mt-3">
                                <div className="d-flex align-items-center">
                                    { this.state.previewLogo != '' ?
                                        <div className="microsite-logo mr-sm-3">
                                            <img src={this.state.previewLogo} width="100" />
                                        </div> : <div className="microsite-logo mr-sm-3">
                                            <img src={this.state.selectedLogo ? appConstant.BASE_URL + this.state.selectedLogo.replace("dist", "") : ''} width="100" />
                                        </div>
                                    }
                                    
                                    <div className="microsite-info">
                                        <h3>{headerTitle}</h3>
                                        <p className="short-des mb-0">{ headerDes }</p>
                                    </div>
                                </div>    
                            </Col>
                            <div className="upper-button">
                                { (styleType === MicrositeStyle.videoContent && videoContent === '') ? '' :
                                    <div className="share-link" onClick={this.handleOpneShareModal}>
                                        <a href="javascript:void(0);">Share</a>
                                    </div>
                                }
                                { !isShared && authActions.isLoggedIn() &&
                                    <div className="modify-link" onClick={this._handleCustomizeFormOpen}>
                                        <a href="#">Customize</a>
                                    </div>
                                }
                            </div>
                            {
                            isIframeLinkSet ?
                                <div className="back-button" onClick={this.backToMicrosite}>
                                    <img src={backButton} width="30" height="30" />
                                </div> : ''
                            }    
                        </Row>
                        {
                            isIframeLinkSet ?
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe className="embed-responsive-item" src={iframeEmbedLink} name="micrositeIframe" allowFullScreen></iframe>
                            </div> :    
                            <div className="content-cards-wrapper"  style={{backgroundImage: `url(${this.state.previewBg === '' ? this.state.selectedBackground.image ? appConstant.BASE_URL + this.state.selectedBackground.image.replace("dist", "") : '' : this.state.previewBg})`}}>
                                { styleType === MicrositeStyle.videoContent &&
                                    <MicrositeVideoContent {...this.props} />
                                }
                                <div className="events-card" style={{position: 'relative'}}>
                                    <div className="d-flex flex-wrap justify-content-xl-center">
                                        {
                                            getMSDataByLink.contentsData.map((contents, i) => {
                                                return (
                                                    <MicroSiteContentCard     key={i}
                                                        contents = {contents}
                                                        customerName = {customerName}
                                                        imageArray = {imageArray}
                                                        index = {i}
                                                        _handleCardlink={this.handleCardLink}
                                                        logoImages={this.props.logoImages}
                                                        isShared={isShared}
                                                        _selectedData = {this._selectedData}
                                                        selectedItems = {selectedItems}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                    { authActions.isLoggedIn() && !isShared &&
                                        <div className="add-new-content-btn">
                                            <Button className="btn btn-add-contents" onClick={this.handleAddNewContents}><img src={addIcon} /></Button>
                                        </div>
                                    } 
                                </div> 
                            </div>
                        }
                        { this.state.isShareModalOpen &&
                            <ShareMicrositeForm 
                                _handleOpneShareModal= {this.handleOpneShareModal}
                                _getMSDataByLink = {getMSDataByLink}
                            />
                        }
                        { this.state.customizeFormOpen &&
                        <CutomizeForm 
                            bgImagesAndColors= {this.state.bgImagesAndColors} 
                            selectedBackground = {this.state.selectedBackground} 
                            changeBg= {this.handleOnChangeBg}
                            libraryLogos= {this.state.libraryLogos}
                            selectedLogo= {this.state.selectedLogo}
                            changeLogo= {this.handleOnChangeLogo}
                            changeTitle= {this.changeTitle}
                            changeTextToDisplay= {this.changeTextToDisplay}
                            changeShortDes = {this.changeShortDes}
                            headerTitle = {headerTitle}  
                            headerDes = {headerDes}
                            textToDisplay = {textToDisplay}
                            previewBg= {this.state.previewBg}
                            _handleCustomizeFormOpen = {this._handleCustomizeFormOpen}
                            editMicroSite = {true}
                            _upadteMicrosite = {this.upadteMicrosite}
                            site_link = {getMSDataByLink.link}
                            selecledStyle= {getMSDataByLink.style_type}
                        />
                    }
                    </div>
                }
                { this.state.isModifyMsErr &&
                    <SweetAlert
                        danger
                        title="Error!"
                        onConfirm={() => {
                            this.setState({
                                isModifyMsErr: false,
                                modifyMsErr: ''
                            })
                        }}
                        >
                        {this.state.modifyMsErr}
                    </SweetAlert>
                }
                { showDeleteContentsErr &&
                    <SweetAlert
                        danger
                        title="Error!"
                        onConfirm={() => {
                            this.setState({
                                showDeleteContentsErr: false,
                                deleteContentsErrMsg: ''
                            })
                        }}
                        >
                        {deleteContentsErrMsg}
                    </SweetAlert>
                }
                { showDeleteContentsSuccess &&
                    <SweetAlert
                    success
                    title="Woot!"
                    onConfirm={() => {
                        this.setState({
                            showDeleteContentsSuccess: false
                        })
                    }}
                    >
                    Contents deleted successfully
                    </SweetAlert>
                }
                { showMinMicrositeCardsErr &&
                    <SweetAlert
                    danger
                    title="Error!"
                    onConfirm={() => {
                        this.setState({
                            showMinMicrositeCardsErr: false,
                            minMicrositeCardsErrMsg: ''
                        })
                    }}
                    >
                    {minMicrositeCardsErrMsg}
                    </SweetAlert>
                }
                <div className="container selection-popup-bar">
                    { isPopupBarOpen && selectedItems.length > 0 ?
                    <div className="add-tags d-flex justify-content-around col-sm-12">
                        <div className="card-count">
                            <div className="count">[{selectedItems.length}]selected</div>
                        </div>
                        <div className="popup-bar-icons delete-icon" onClick={this.openConfirmationModal}>
                            <img src={delIcon} className="" width="15" />
                        </div>
                        <div className="popup-bar-icons cross-icon" onClick={this.cancelEditSelection}>
                            <img src={crossIcon} className="" width="15" height="15" />
                        </div>
                    </div> : ''
                    }
                </div>
                <ConfirmationBox 
                    title="Are you sure?"
                    bodyText="You want to remove this content from the microsite?"
                    isOpen={openConfirmationBox}
                    _toggle={this.closeConfBox}
                    _confirmed={this.onECDeleteHandler}
                />
            </div>
        )
    }
}

const MicroSiteContentCard = ({
    contents,
    imageArray,
    customerName,
    index,
    _handleCardlink,
    logoImages,
    _selectedData,
    selectedItems,
    isShared
}) => {
    const [contentImg, SetContentImg] = useState('');
    const [ cardSelected, SetCarSelected ] = useState(false);

    useEffect(() => {
        if(!!contents.doc_thumbnail === true){
            if(contents.doc_thumbnail.includes("dist")) {
                let contentImg1 = appConstant.BASE_URL + contents.doc_thumbnail.replace("dist", "");
                SetContentImg(contentImg1);
                // contentImg = contents.doc_thumbnail;
            } else {
                let contentImg1 = contents.doc_thumbnail;
                SetContentImg(contentImg1);
            }
        } else {
          //the num will generate a random number in the range 0 to 9
          let num = Math.floor(Math.random() * 10);
          let disPlayImage = imageArray[num];
          SetContentImg(disPlayImage)
        }
    }, []);
    
    useEffect(() => {
    if(!!contents.doc_thumbnail === true){
        if(contents.doc_thumbnail.includes("dist")) {
            let contentImg1 = appConstant.BASE_URL + contents.doc_thumbnail.replace("dist", "");
            SetContentImg(contentImg1);
            // contentImg = contents.doc_thumbnail;
        } else {
            let contentImg1 = contents.doc_thumbnail;
            SetContentImg(contentImg1);
        }
    }
    }, [contents]);

    useEffect(() => {
        SetCarSelected(false);
        selectedItems.forEach(data => {
          if(data.doc_id === contents.doc_id) {
            SetCarSelected(true);
          }
        });
    }, [selectedItems])

    const linkClick = (link, mimetype) => {
        _handleCardlink(link, mimetype);
    }

    // static ampere logo for customer courses
    contents.merchant_logo = null;
    if(customerName == 'ampere'){
    contents.merchant_logo = ampereLogo;
    }
    let Tags = [...contents.content_tags , ...contents.content_stage_tags]
    
    let cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo;
    let shortDes = contents.doc_des || ""

    const changeSelection = (content) => {
        if(cardSelected) {
          SetCarSelected(false);
          _selectedData(content);
        } else {
          SetCarSelected(true);
          _selectedData(content);
        }
    }

    return (
        <div className="card course-single-group mx-sm-4 mb-5" style={{width:"300px"}}>
            { !isShared && authActions.isLoggedIn() &&
                <div className="card-top-icons card-selection" onClick={() => changeSelection(contents)}>
                {
                    cardSelected ?
                    <div className="selected">
                    <img src={contentSelectedIcon} width="22" height="22" />
                    </div>:
                    <div className="non-selection-icon"></div> 
                }
                </div>
            }
            <div className="img-box">
                <img className="card-img-top" src={contentImg} alt="Card image" style={{width:"100%", height:"inherit"}} />
                { contents.doc_mimetype.substr(0, 5) === 'video' ?
                    <i className="fa fa-play-circle" aria-hidden="true"></i> : null
                }
            </div>    
            <div className="card-body p-0 pt-3">
                <h5 className="card-title">
                    <a id={"doc_" + contents.doc_ser_id} href={contents.doc_embed_url} target="micrositeIframe" onClick={() => linkClick(contents.doc_embed_url, contents.doc_mimetype)}>{contents.doc_name}</a>
                </h5>
                
                <div className="course-company-logo">
                    <img src={cLogo} />
                </div>

                <div className="d-flex justify-content-center tags-wrapper px-3 mt-3 mb-3" style={{backgroundColor: Tags[0].tag_color, border: 'none'}} key={index}>
                    <div className="tag-label">{Tags[0].tag_name}</div>
                </div>
                    
                <p className="card-text" title={shortDes}>{shortDes}</p>
                <div className="d-flex mt-3">
                    <div className="d-flex justify-content-center like-icon mr-4">
                        { parseInt(contents.thumbs_count) > 0 ?
                            <img src={likeIcon} width="21" height="21" /> :
                            <img src={likeZero} width="21" height="21" />
                        }
                        <div className="ml-2">{contents.thumbs_count}</div>
                    </div>
                </div>  
            </div>
        </div>
    )
}

const mapStateToProps = ({ microSites, contentPortal, profileSettings }) => ({
    ...microSites,
    ...contentPortal,
    ...profileSettings
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_microsite_by_link            :       get_microsite_by_link,
        _get_library_images               :       get_library_images,
        _update_microsite                 :       update_microsite,
        _get_logo_placeholder_images      :       get_logo_placeholder_images,
        _delete_microsite_contents        :       delete_microsite_contents,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MicroSite)