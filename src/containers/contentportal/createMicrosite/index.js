import React, { Component, useState, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert';

import { get_gdrive_content, get_library_images } from '../../../actions/contentPortal'
import { get_logo_placeholder_images } from '../../../actions/userProfilePage'
import ampereLogo from '../../../assets/img/ampere.png'
import default_logo from '../../../assets/img/your_logo.png'
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
import likeZero from '../../../assets/img/like_zero.png'
import likeIcon from '../../../assets/img/like-icon.png'
import { getTenantSite, getToken } from '../../../transforms'
import { appConstant, micrositeConst, MicrositeStyle } from '../../../constants/appConstants'
import { ROUTES } from '../../../constants/routeConstants'
import CutomizeForm from './cutomizeform'
import RecordVideoContent from './VideoContent/components/RecordVideoContent';

let customerName = 'TSZ';
let imageArray = [cp_image_1, cp_image_2, cp_image_3, cp_image_4, cp_image_5, cp_image_6, cp_image_7, cp_image_8, cp_image_9, cp_image_10];

class CreateMicrosite extends Component {

    constructor(props) {
        super(props)
        
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
            selectedMicrositeContents: [],
            selecledStyle: '',
            contentIdsArr: []
        }
    }

    componentDidMount() {
        console.log("props", this.props);
        const route = new URLSearchParams(window.location.search);
        const contentIds = route.get('contents');
        const selecledStyle = route.get('selecledstyle');
        console.log("selecledStyle", selecledStyle);
        const contentIdsArr = contentIds.split(',');
        this.setState({
            selecledStyle: selecledStyle,
            contentIdsArr: contentIdsArr
        })
        this.setCustomerName();
        // if(this.props.selectedMicrositeContents.length === 0) {
        //     this.props.history.push(ROUTES.CONTENT_PORTAL_ALL_CONTENT);
        // }

        this.props._get_library_images();
        this.props._get_gdrive_content();
        this.props._get_logo_placeholder_images();
    }

    componentDidUpdate(prevProps) {
        if(this.props.LibraryImg.bgImg.length !== prevProps.LibraryImg.bgImg.length) {
            this.setState({
                bgImagesAndColors: this.props.LibraryImg.bgImg,
                selectedBackground: this.props.LibraryImg.bgImg[0],
                libraryLogos: this.props.LibraryImg.logoImg,
                selectedLogo: this.props.LibraryImg.logoImg[0].image
            });
        }
        if(this.props.gDriveContent.length !== prevProps.gDriveContent.length) {
            this.processCardData(this.props.gDriveContent, this.state.contentIdsArr);
        }
    }

    processCardData = (contentsData, contentIds) => {
        let selectedCards = [];
        contentIds.forEach(data => {
            contentsData.forEach(content => {
                if(parseInt(data) === parseInt(content.doc_serial_id)) {
                    selectedCards.push(content);
                }
            })
        });
        this.setState({
            selectedMicrositeContents : selectedCards
        })
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

    hideAlert = () => {
        this.setState({
            error: false,
            errMsg: ''
        })
    }

    _handleCustomizeFormOpen = () => {
        this.setState(previousState => ({
            customizeFormOpen: !previousState.customizeFormOpen
        }))
    }

    // handleFileUpload = event => {
    //     let fileName = event.target.files[0].name.replace(/ /g,"_");
    //     let fileType = event.target.files[0].type;
    //     let fileSize= event.target.files[0].size;
    //     if(fileSize > 200000000) {
    //         alert("file size can't be more than 200 MB")
    //         return false;
    //     }
    //     let token = getToken();
    //     let file = event.target.files[0];

    //     const options = {
    //         headers: {
    //             "content-type": "application/json",
    //             "JWTAuthorization": "Bearer "+ token
    //         },
    //     };
    //     axios.post(`${appConstant.BASE_URL}/api/v1/get-signed-url`, {
    //         fileName: fileName,
    //         fileType: fileType
    //     }, options).then((response) => {
    //         let { data } = response;
    //         if(data.status) {
    //             let url = data.result.signedUrl;
    //             console.log(url);
    //             axios({
    //                 method: "put",
    //                 url,
    //                 data: file,
    //                 maxContentLength: 200000000,
    //                 maxBodyLength: 200000000,
    //                 headers: {
    //                     'Access-Control-Allow-Origin': '*',
    //                     'Access-Control-Allow-Methods': '*'
    //                 }
    //             }).then((result) => {
    //                 console.log('result', result);
    //             }).catch((err) => {
    //                 console.log('err', err.message);
    //             });
    //         }
    //     }, (error) => {
    //         console.log(error);
    //     });
    // };

    render() {
        let { headerDes, headerTitle, selecledStyle, error, errMsg } = this.state;
        
        return (
            <div id="content-portal">
                <div className="microsite-wrapper">
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
                                <div className="microsite-info">
                                    <h3>{ headerTitle != '' ? headerTitle : 'Add a catchy title to grab attention'}</h3>
                                    <p className="short-des mb-0">{ headerDes != '' ? headerDes : 'Add a short description to connect with prospects & customers'}</p>
                                </div>
                            </div>    
                        </Col>
                        <div className="upper-button">
                            <div className="share-link">
                                <a href="#">Share</a>
                            </div>
                            <div className="modify-link" onClick={this._handleCustomizeFormOpen}>
                                <a href="#">Customize</a>
                            </div>
                        </div>    
                    </Row>    
                    <div className="content-cards-wrapper"  style={{backgroundImage: `url(${this.state.previewBg === '' ? this.state.selectedBackground.image ? appConstant.BASE_URL + this.state.selectedBackground.image.replace("dist", "") : '' : this.state.previewBg})`}}>
                        {
                            selecledStyle === MicrositeStyle.videoContent &&
                            <>
                                <Row className="justify-content-md-center mt-4">
                                    <Col lg={9}>
                                        <RecordVideoContent disabled={true} />
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-center">
                                    <Col lg={9}>
                                        <div className="mt-4 d-flex align-items-center justify-content-center line-divider">
                                            <div className="line flex-fill"></div>
                                            <div className="px-2 or-text">OR</div>
                                            <div className="line flex-fill"></div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-center mt-3">
                                    <Col lg={9}>
                                        {/* <input
                                        ref="fileInput"
                                        onChange={this.handleFileUpload}
                                        type="file"
                                        accept=".mp4,.mov,.mpg"
                                        style={{ display: "none" }}
                                        // multiple={false}
                                        /> */}
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <Button className="addMembers" onClick={() => this.refs.fileInput.click()} disabled>Upload Video</Button>
                                            <div className="max-size-text file-name mt-2">{this.state.selectedVideoFileName}</div>
                                            <div className="max-size-text mt-2">Max size 200MB (mp4, mov, mpg)</div>
                                        </div>    
                                    </Col>
                                </Row>        
                            </>
                        }
                        <div className="events-card">
                            <Row>
                            {
                                this.state.selectedMicrositeContents.map((contents, i) => {
                                    return (
                                        <MicroSiteContentCard key={i}
                                            contents = {contents}
                                            customerName = {customerName}
                                            imageArray = {imageArray}
                                            index = {i}
                                            logoImages={this.props.logoImages}
                                        />
                                    )
                                })
                            }
                            </Row>
                        </div>    
                    </div>
                    { this.state.customizeFormOpen &&
                        <CutomizeForm 
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
                            micrositeStyle= {this.props.micrositeStyle}
                            previewBg= {this.state.previewBg}
                            _handleCustomizeFormOpen = {this._handleCustomizeFormOpen}
                            selecledStyle= {this.state.selecledStyle}
                            _selectedMicrositeContents ={this.state.selectedMicrositeContents}
                        />
                    }
                </div>
                {
                    error && 
                    <SweetAlert
                    danger
                    title="Error"
                    onConfirm={this.hideAlert}
                    >
                    {errMsg}
                    </SweetAlert>
                }
            </div>    
        )
    } 
}

const MicroSiteContentCard = ({
    contents,
    imageArray,
    customerName,
    index,
    logoImages
}) => {
    const [contentImg, SetContentImg] = useState('');

    useEffect(() => {
        if(!!contents.doc_thumbnail === true){
            if(contents.doc_thumbnail.includes("dist")) {
                let contentImg1 = appConstant.BASE_URL + contents.doc_thumbnail.replace("dist", "");
                SetContentImg(contentImg1);
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

    // static ampere logo for customer courses
    contents.merchant_logo = null;
    if(customerName == 'ampere'){
    contents.merchant_logo = ampereLogo;
    }
    let Tags = [...contents.content_tags , ...contents.content_stage_tags]
    
    let cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo;
    let shortDes = contents.doc_des || ""

    return (
        <Col key={`course-${index}`} sm={12} md={6} xl={4}  className={'mt-4 px-md-3 px-lg-5'}>
            <div className="card course-single-group m-2">
                <div className="img-box">	
                    {/* <div className="card-img-background" style={{backgroundImage: `url(${contentImg})`}}></div> */}
                    <img className="card-img-top" src={contentImg} alt="Card image" style={{width:"100%", height:"inherit"}} />
                    { contents.doc_mimetype.substr(0, 5) === 'video' ?
                        <i className="fa fa-play-circle" aria-hidden="true"></i> : null
                    }
                </div>
                
                <div className="card-body p-0 pt-3">
                    <h5 className="card-title">
                    <a href={contents.doc_url} target="blank">{contents.doc_name}</a>
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
        </Col>
    )
}

const mapStateToProps = ({ contentPortal, profileSettings }) => ({
    ...contentPortal,
    ...profileSettings
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {

        _get_library_images                 :       get_library_images,
        _get_gdrive_content                 :       get_gdrive_content,
        _get_logo_placeholder_images        :       get_logo_placeholder_images,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateMicrosite)