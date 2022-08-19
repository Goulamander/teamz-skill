import React, {Component, Fragment, useState, useEffect} from 'react';
import { bindActionCreators } from 'redux'
import { Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, FormGroup, Alert } from 'reactstrap';
import { connect } from 'react-redux'
import { useHistory, Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import { ROUTES } from '../../../constants/routeConstants'
import { get_my_content, edit_portal_content, set_selected_microsites_contents, reset_selected_microsites_contents, get_library_images,send_recommended_content, reset_recommended_error } from '../../../actions/contentPortal'
import { get_microsites, add_content_to_microsite, reset_add_contents_microsite_error } from '../../../actions/microsites'
import { get_teams_listing } from '../../../actions/team'
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
import shareZeroIcon from '../../../assets/img/zero_share.png'
import shareIcon from '../../../assets/img/share.png'
import editIcon from '../../../assets/img/edit_icon.png'
import delIcon from '../../../assets/img/quiz/del-icon.png'
import crossIcon from '../../../assets/img/crossIcon.png'
import recommendZero from '../../../assets/img/recommend_zero.png'
import recommendIcon from '../../../assets/img/recommend.png'
import viewsIcon from '../../../assets/img/views_icon.png'
import contentSelectedIcon from '../../../assets/img/stepcomplete.png'
import grid from '../../../assets/img/grid.png'
import OneInRow from '../../../assets/img/One_in_a_row.png'
import VideoContentStyle from '../../../assets/img/video_content_type.jpg'

import { getUserRoleName, checkContentRowSelected, getTenantSite, copySharableLink } from '../../../transforms'
import Can from '../../../component/Can'
import { contentMyActionControls, contentMyActionWthRecControls } from '../../../constants/appConstants'
import CustomActionBox from '../../../component/CustomActionBox'
import { appConstant, MicrositeStyle } from '../../../constants/appConstants'
import RecommendContentsTeamModal from '../../../component/RecommendContentsModal'
import AddContentToMicrositeModal from '../../../component/AddContentsToMicrositeModal'
const routeResource = "COMPONENT"

export const MyContent = (props) => {
   const history = useHistory();

    const [myContentsData, SetMyContentsData] = useState([]);
    const [linkCopied, setLinkCopied] = useState(false);
    const [addToMicrositeModalShow, SetAddToMicrositeModalShow] = useState(false);
    const [currentContentToAddMicrosite, setCurrentContentToAddMicrosite] = useState(null);
    const [isRecommendCntTeamModalShow, SetIsRecommendCntTeamModalShow] = useState(false);
    const [contentRecommendedSuccess, SetContentRecommendedSuccess] = useState(false);
    const [currentContentToRecommend, SetCurrentContentToRecommend] = useState(null);
    const [contentToAddMicrositeSuccess, SetContentToAddMicrositeSuccess] = useState(false);
    const [micrositeLink, setMicrositeLink] = useState('');
    let customerName = 'TSZ';

    useEffect(() => {
      setCustomerName();
      props._get_my_content();
      props._get_teams_listing();
      props._get_microsites();
    }, []);

    useEffect(() => {
        if(props.myContent.length)
        SetMyContentsData(props.myContent)
    }, [props.myContent])

    useEffect(() => {
      let searchTxt = props.globalContentSearchInput;
      if(!!searchTxt === false) {
        if(props.myContent.length > 0) {
          SetMyContentsData(props.myContent)
        } else {
          SetMyContentsData([])
        }
      } else {
  
        let filteredData = props.myContent.filter(data => {
          if(data.doc_name != null)
          return data.doc_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
        })
    
        if(filteredData.length > 0) {
          SetMyContentsData(filteredData)
        } else {
          SetMyContentsData([])
        }
      }
    }, [props.globalContentSearchInput])

    useEffect(() => {
      if(!!props.contentTagSerachinput === true && !!props.whenToShareSerachInput === true) {
        let filterContent = props.myContent.filter((card) => {
          let content_tags = card.content_tags.filter( data => {
            if(data.tag_name !== null)
            return data.tag_name.toLowerCase().indexOf(props.contentTagSerachinput.toLowerCase()) !== -1
          });
          let content_stage_tags = card.content_stage_tags.filter( data => {
            if(data.tag_name !== null)
            return data.tag_name.toLowerCase().indexOf(props.whenToShareSerachInput.toLowerCase()) !== -1
          });
          if (content_tags.length > 0 && content_stage_tags.length > 0) {
            return true
          } else {
            return false;
          }
        });
        SetMyContentsData(filterContent)
      } else if(!!props.contentTagSerachinput === true && !!props.whenToShareSerachInput === false) {
        let filterContent = props.myContent.filter((card) => {
          let content_tags = card.content_tags.filter( data => {
            if(data.tag_name !== null)
            return data.tag_name.toLowerCase().indexOf(props.contentTagSerachinput.toLowerCase()) !== -1
          });
          if (content_tags.length > 0) {
            return true
          } else {
            return false;
          }
        });
        SetMyContentsData(filterContent)
      } else if(!!props.contentTagSerachinput === false && !!props.whenToShareSerachInput === true) {
        let filterContent = props.myContent.filter((card) => {
          let content_stage_tags = card.content_stage_tags.filter( data => {
            if(data.tag_name !== null)
            return data.tag_name.toLowerCase().indexOf(props.whenToShareSerachInput.toLowerCase()) !== -1
          });
          if (content_stage_tags.length > 0) {
            return true
          } else {
            return false;
          }
        });
        SetMyContentsData(filterContent)
      } else {
        if(props.myContent.length)
        SetMyContentsData(props.myContent)
      } 
    }, [props.contentTagSerachinput, props.whenToShareSerachInput])

    const setCustomerName = () => {
        let cust = getTenantSite()
        if(cust !== 'app') {
        customerName = cust
        }
        if(cust === 'ampere') {
        customerName = cust
        }
    }

    const getShareAbleLink = (uri) => {
        copySharableLink(uri);
        setLinkCopied(true);
    }

    const RecommendContentToTeams = (content) => {
      SetIsRecommendCntTeamModalShow(true);
      SetCurrentContentToRecommend(content);
    }
  
    const toggleRecommendContentTeamModal = (callback) => {
      SetIsRecommendCntTeamModalShow(false);
      SetCurrentContentToRecommend(null);
      props._reset_recommended_error();
      if(callback === 'callbackCalled') {
        SetContentRecommendedSuccess(true);
        props._get_my_content();
      }
    }

    const handleContentsActions = (key, content, index) => {
        switch(key) {
          case "RecommendContent": 
            RecommendContentToTeams(content);
            break;
          case "GetSharableLink": 
            getShareAbleLink(content.doc_url);
            break;
          case "addToMicrosite":
            AddContentToMicrosite(content)
            break;    
          default:
            console.log("No action")
        }
    }

    const editPortalContent = (data, cb) => {
      props._edit_portal_content(data, (err, res) => {
        if(err) {
          cb(err, null)  
        } else {
          cb(null, res);
        }
        props._get_my_content();
      })
    }

    const AddContentToMicrosite = (content) => {
      SetAddToMicrositeModalShow(true);
      setCurrentContentToAddMicrosite(content);
    }

    const toggleAddContentToMicrositeModal = (callback, link) => {
      SetAddToMicrositeModalShow(false);
      setCurrentContentToAddMicrosite(null);
      props._reset_add_contents_microsite_error();
      if(callback === 'callbackCalled') {
        // props._get_my_content();
        SetContentToAddMicrositeSuccess(true);
        setMicrositeLink(link);
      }
    }

    return (
        <Fragment>
            <MyContentsComponent 
                MyContents={myContentsData} 
                _handleContentsActions={handleContentsActions} 
                customerName={customerName}
                _editContent={editPortalContent}
                _setStoreSelectedContents={props._set_selected_microsites_contents} 
                _resetStoreSelectedContents={props._reset_selected_microsites_contents}
                logoImages={props.logoImages}
            />
            { linkCopied &&
              <SweetAlert
              success
              title="Woot!"
              onConfirm={() => {
                  setLinkCopied(false)
              }}
              >
              Link copied to clipboard
              </SweetAlert>
            }
            { contentRecommendedSuccess &&
              <SweetAlert
                success
                title="Woot!"
                onConfirm={() => {
                  SetContentRecommendedSuccess(false)
                }}
                >
                Content has been recommended successfully
              </SweetAlert>
            }
            { contentToAddMicrositeSuccess &&
              <SweetAlert
                success
                title="Woot!"
                onConfirm={() => {
                  SetContentToAddMicrositeSuccess(false);
                  setMicrositeLink('');
                }}
                >
                Content has been added to the microsite. <Link to={`${ROUTES.MICROSITES}/${micrositeLink}`}>See the microsite</Link>
              </SweetAlert>
            }
            <RecommendContentsTeamModal
              isModalShow = {isRecommendCntTeamModalShow}
              _send_recommended_content_to_team = {props._send_recommended_content}
              teams = {props.teamsData}
              _isTeamRecommendError = {props.isSendRecommendedCntError}
              _teamRecommendError = {props.SendRecommendedCntError}
              _toggle = {toggleRecommendContentTeamModal}
              currentContentToRecommendTeam = {currentContentToRecommend}
            />
            <AddContentToMicrositeModal
              isModalShow = {addToMicrositeModalShow}
              _add_content_to_microsite = {props._add_content_to_microsite}
              _userMicrositesData = {props.getMicrosites}
              _isAddMicrsositeError = {props.isAddContentToMSError}
              _addMicrositeError = {props.addContentToMSError}
              _toggle = {toggleAddContentToMicrositeModal}
              currentContentToAddMicrosite = {currentContentToAddMicrosite}
            />
        </Fragment>    
    )
}

const MyContentsComponent = ({
    customerName,
    MyContents,
    _editContent,
    _handleContentsActions,
    _setStoreSelectedContents,
    _resetStoreSelectedContents,
    logoImages
  }) => {
    let imageArray = [cp_image_1, cp_image_2, cp_image_3, cp_image_4, cp_image_5, cp_image_6, cp_image_7, cp_image_8, cp_image_9, cp_image_10];
    const history = useHistory();
    const [isECModalShow, SetIsECModalShow] = useState(false);
    const [selectedContent, SetSelectedContent] = useState({});
    const [viewAllCards, SetViewAllCards] = useState(false);
    const [isPopupBarOpen, SetIsPopupBarOpen] = useState(false);
    const [ selectedItems, SetSelectedItems ] = useState([]);
    const [ selectedStyle, SetSelectedStyle ] = useState('');

    let MyContentsData = MyContents ? MyContents : MyContents.slice(0,6);

    const toggleViewAllCards = () => {
      if(viewAllCards) {
        SetViewAllCards(false);
      } else {
        SetViewAllCards(true);
      }
    }

    const openEditContentsModal = (content) => {
      SetSelectedContent(content);
      toggleEditContentsModal();
    }

    const toggleEditContentsModal = () => {
      if(isECModalShow) {
        SetIsECModalShow(false);
        SetSelectedContent({});
      } else {
        SetIsECModalShow(true);
      }
    }

    const onAASaveHandler = (data, cb) => {
      _editContent(data, (err, res) => {
        if(err) {
          cb(err, null);
        } else {
          toggleEditContentsModal();
          cb(null, res);
        }
      })
    }

    const _selectedData = (content) => {
      if(checkItemAlreadyExist(content)) {
        let items = selectedItems.filter(data => {
          return data.doc_id != content.doc_id
        });
        SetSelectedItems(items);
      } else {
        SetSelectedItems([...selectedItems, content]);
      }
      if(!isPopupBarOpen) {
        SetIsPopupBarOpen(true);
      }
    }

    const checkItemAlreadyExist = (content) => {
      for(let i=0; i<selectedItems.length; i++) {
        if(selectedItems[i].doc_id === content.doc_id) {
          return true;
        }
      }
      return false;
    }

    const openMakeMicroSite = () => {
      if(!!selectedStyle === false) {
        alert("please pick microsite style");
        return false;
      }
      _setStoreSelectedContents(selectedItems, selectedStyle);
      // history.push(ROUTES.CREATE_MICROSITE);
      let contents = selectedItems.map(data => {
        return data.doc_serial_id
      });
      contents.join(',');
      const win = window.open(`${ROUTES.CREATE_MICROSITE}?contents=${contents}&selecledstyle=${selectedStyle}`, "_blank");
      win.focus();
    }

    const cancelMakeMicroSite = () => {
      SetIsPopupBarOpen(false);
      SetSelectedItems([]);
      _resetStoreSelectedContents();
    }

    const openConfirmationModal = () => {

    }

    const selectMicrositeStyle = (style) => {
      SetSelectedStyle(style);
    }

    return (
      <div className="events-box">
        <Fragment>
          <h4 className="common-head">{`My contents - ${MyContents  .length} contents`} <a className="view-btn float-right" href="javascript:void(0)" onClick={()=>toggleViewAllCards()}>{ viewAllCards ? 'View less' : 'View all' }</a></h4>
          
          {MyContentsData.length == 0 && 
            <Col>
              <h4 className="no-course my-5 py-5">no contents</h4>
            </Col>
          }
          {MyContentsData.length > 0 &&
          <div className="events-card">
            <Row>
              {MyContentsData.map((contents, i) => {
                // static ampere logo for customer courses
                return (
                  <ContentCard key={i}
                    contents = {contents}
                    openEditContentsModal= {openEditContentsModal}
                    _handleContentsActions = {_handleContentsActions}
                    customerName = {customerName}
                    imageArray = {imageArray}
                    index = {i}
                    _selectedData = {_selectedData}
                    selectedItems = {selectedItems}
                    logoImages={logoImages}
                  />
                )
                })
              }
            </Row>
          </div>
          }
          <div className="add-tags-wrapper">
          { isPopupBarOpen && selectedItems.length > 0 &&
            <div className="container add-tags-modal">
              <div className="selection-style">
                <div className="header-title p-3">
                  <h3>Make a microsite</h3>
                </div>
                <div className="style-card">
                  <Row>
                    <Col xs={6} sm={4} md={3} className="grid-view mr-5">
                      <div className="card-image">
                        <img src={grid} />
                      </div>
                      <div className="description">
                        <div className="selection-title">
                          <h5>Grid</h5>
                        </div>
                        <p className="m-0">Great for more than 2 content cards - cards will be arranged in rows of boxes</p>
                      </div>
                      <div className="select-style">
                        <button className="btn select-style-btn btn-theme-fill btn-block" onClick={() => selectMicrositeStyle(MicrositeStyle.gridView)}>{ selectedStyle === MicrositeStyle.gridView ? 'Selected Style' : 'Select style'}</button>
                      </div>
                    </Col>
                    <Col xs={6} sm={4} md={3} className="row-view">
                      <div className="card-image">
                        <img src={VideoContentStyle} />
                      </div>
                      <div className="description">
                        <div className="selection-title">
                          <h5>One in a row</h5>
                        </div>
                        <p className="m-0">Great for 1-2 content cards - easy to read single content in a row </p>
                      </div>
                      <div className="select-style">
                        <button className="btn select-style-btn btn-theme-fill btn-block" onClick={() => selectMicrositeStyle(MicrositeStyle.videoContent)}>{ selectedStyle === MicrositeStyle.videoContent ? 'Selected Style' : 'Select style'}</button>
                      </div>
                    </Col>
                  </Row>  
                </div>  
              </div>
            </div>
          }
          <div className="container selection-popup-bar">
            { isPopupBarOpen && selectedItems.length > 0 ?
              <div className="add-tags d-flex justify-content-around col-sm-12">
                  <div className="card-count">
                    <div className="count">[{selectedItems.length}]selected</div>
                  </div>
                  <div>
                    <button className="btn popup-bar-btn" onClick={openMakeMicroSite}><i className="fa fa-plus mr-1"></i> Make a microsite</button>
                  </div>
                  <div className="popup-bar-icons delete-icon" onClick={openConfirmationModal}>
                    <img src={delIcon} className="" width="15" />
                  </div>
                  <div className="popup-bar-icons cross-icon" onClick={cancelMakeMicroSite}>
                    <img src={crossIcon} className="" width="15" height="15" />
                  </div>
              </div> : ''
            }
          </div>
        </div>  
        </Fragment>
    </div>
    )
}

const ContentCard = ({
  contents,
  openEditContentsModal,
  _handleContentsActions,
  imageArray,
  customerName,
  index,
  _selectedData,
  selectedItems,
  logoImages
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

  const changeSelection = (content) => {
    if(cardSelected) {
      SetCarSelected(false);
      _selectedData(content);
    } else {
      SetCarSelected(true);
      _selectedData(content);
    }
  }

  contents.merchant_logo = null;
  if(customerName == 'ampere'){
    contents.merchant_logo = ampereLogo;
  }
  let Tags = [...contents.content_tags , ...contents.content_stage_tags]
  
  let cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
  shortDes = contents.doc_des || ""
  
  return (
    <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-4'}>
      <div className="card course-single-group">
        {/* <div className="card-top-icons edit-icon" onClick={() => openEditContentsModal(contents)}>
          <img src={editIcon} width="14" height="14" />
        </div> */}
        <div className="card-top-icons card-selection" onClick={() => changeSelection(contents)}>
          {
            cardSelected ?
            <div className="selected">
              <img src={contentSelectedIcon} width="22" height="22" />
            </div>:
            <div className="non-selection-icon"></div> 
          }
        </div>
        {/* <div className="img-box">											
          <div className="card-img-background" style={{backgroundImage: `url(${contentImg})`}}></div>
        </div> */}
        <div className="img-box" style={{height:"170px", minHeight:"170px"}}>
          <img className="card-img-top" src={contentImg} alt="Card image" style={{width:"100%", height:"170px"}} />
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
              <div className="d-flex justify-content-center align-items-center like-icon mr-3">
                { parseInt(contents.thumbs_count) > 0 ?
                  <img src={likeIcon} width="22" height="22" /> :
                  <img src={likeZero} width="22" height="22" />
                }
                <div className="ml-2">{contents.thumbs_count}</div>
              </div>
              <div className="d-flex justify-content-center align-items-center recommend-icon mr-3">
                { parseInt(contents.recommended_count) > 0 ?
                  <img src={recommendIcon} width="22" height="22" /> :
                  <img src={recommendZero} width="22" height="22" />
                }
                <div className="ml-2">{contents.recommended_count}</div>
              </div>
              <div className="d-flex justify-content-center align-items-center share-icon">
                { parseInt(contents.shared_count) > 0 ?
                  <img src={shareIcon} width="22" height="22" /> :
                  <img src={shareZeroIcon} width="22" height="22" />
                }
                <div className="ml-2">{contents.shared_count}</div>
              </div>
              <div className="d-flex justify-content-end ml-auto">
                <Can
                  role={getUserRoleName()}
                  resource={routeResource}
                  action={"CONTENTS:RECOMMENDATION"}
                  yes={(attr) => (
                    <div className="d-flex justify-content-end">
                      <CustomActionBox listData={contentMyActionControls} showIcon={true} handleClick={(key) => _handleContentsActions(key, contents, index)} />
                    </div>  
                  )}
                  no={() => (
                    <div className="d-flex justify-content-end">
                      <CustomActionBox listData={contentMyActionWthRecControls} showIcon={true} handleClick={(key) => _handleContentsActions(key, contents, index)} />
                    </div>
                  )}
                />
              </div>
            </div>
        </div>
      </div>
    </Col>
  )
}

const mapStateToProps = ({ contentPortal, team, profileSettings, microSites }) => ({
    ...contentPortal,
    ...team,
    ...profileSettings,
    ...microSites
})
  
const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
    _get_my_content                     :   get_my_content,
    _edit_portal_content                :   edit_portal_content,
    _set_selected_microsites_contents   :   set_selected_microsites_contents,
    _reset_selected_microsites_contents :   reset_selected_microsites_contents,
    _get_library_images                 :   get_library_images,
    _get_teams_listing                  :   get_teams_listing,
    _send_recommended_content           :   send_recommended_content,
    _reset_recommended_error            :   reset_recommended_error,
    _get_microsites                     :   get_microsites,
    _add_content_to_microsite           :   add_content_to_microsite,
    _reset_add_contents_microsite_error :   reset_add_contents_microsite_error
    },
    dispatch
)
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyContent)
