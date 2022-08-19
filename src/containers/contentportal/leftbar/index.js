import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col, Input, Label, Form, FormGroup } from 'reactstrap'
import { Link, Redirect } from 'react-router-dom';
import Avatar from 'react-avatar-edit'

import { appConstant } from '../../../constants/appConstants';
// import defaultLogo from '../../../assets/img/your_logo.png'
import defaultLogo from '../../../assets/img/logo_placeholder.png'
import editIcon from '../../../assets/img/user-edit.png'
import { ROUTES } from '../../../constants/routeConstants'
import Can from '../../../component/Can' 
import { getUserRoleName } from '../../../transforms'
const routeResource = "COMPONENT"

const ProfilePhoto = ({userData, _onFileLoad, _onCrop, _onBeforeFileLoad}) => {
    return (
      <div className={'avtar-container'}>
        <Avatar
          width={180}
          height={180}
          onCrop={_onCrop}
          // onClose={this.onClose}
          onBeforeFileLoad={_onBeforeFileLoad}
          onFileLoad={_onFileLoad}
          // src={userData.profile_pic}
        />
      </div>
    )
}

class LeftBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isEdit : false,
            uploadProfilePic: null,
            companyLogo: null,
            placeholder: null
        }
    }

    _handleEdit = (data) => {
        if(data === 'CANCEL') {
            this.setState({
                isEdit : false
            })
        } else {
            this.setState({
                isEdit : true
            })
        }
    }

    _onFileLoad = (file) => {
        console.log("files", file)
        this.setState({
        uploadProfilePic: file
        })
    }

    _onCrop = (image) => {
        // update file object based on image (base64)
        
        var ImageURL = image;
        // Split the base64 string in data and contentType
        var block = ImageURL.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    
        // Convert it to a blob to upload
        var blob = this.b64toBlob(realData, contentType);
    
        this.setState({
          uploadProfilePic: blob
        })
    
    }

    b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
    
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
    
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
    
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    _onBeforeFileLoad = (elem) => {
        // 1000000 = 1MB
        let maxFileSize = 1000000 * 10
            if(elem.target.files[0].size > maxFileSize){
            alert("File size should not excced 10MB!");
            elem.target.value = "";
            };
        }

    __onUserSave = () => {
        alert("working")
    }
    
    componentDidUpdate(prevProps) {
        let { companyLogo, placeholder } = this.state
        if (this.props.profileSettings.logoImages !== prevProps.profileSettings.logoImages) {
            this.setState({
                companyLogo: this.props.profileSettings.logoImages.company_logo,
                placeholder: this.props.profileSettings.logoImages.placeholder_logo
            })
        }
    }

    render() {
        let activeRoute = this.props.router.location.pathname;
        let { isEdit } = this.state;
        return (
        <Col xl="4" lg="4" md="4" className="pl-0 col-xxl-4">
            <div className="content-left company-settings-left-bar">
                { isEdit ? 
                    <Form className="prof-info text-center">
                        <span className="cancel-icon tzs-link" onClick={() => this._handleEdit("CANCEL")}>Cancel</span>
                        <ProfilePhoto _onFileLoad={this._onFileLoad} _onCrop={this._onCrop} _onBeforeFileLoad={this._onBeforeFileLoad} />
                        <span className="edit-icon tzs-link active" onClick={() => this.__onUserSave()}>Save</span>
                        {/* <Col md="12" className="text-left mt-5">
                
                            <FormGroup >
                                <Label for="firstname">Camera: </Label>
                                <Input id="firstname" type="file" accept="video/*" capture />
                            </FormGroup>
                        </Col>  */}
                    </Form> :
                    <Fragment>       
                        <div className="logo-info text-center">
                            {
                                this.state.companyLogo != null ?
                                <img className="logo-img" src={appConstant.BASE_URL + this.state.companyLogo.replace('dist', '')} height="180" width="180" /> : <img className="logo-img" src={defaultLogo} alt="company-logo" height="180" />
                            }
                        </div>
                        {/* <span className="logo-edit-icon" onClick={() => this._handleEdit("USER_PROFILE")}><img className="pro-edit" src={editIcon} alt="..." /></span> */}
                    </Fragment>    
                }
                <div className="left-bar-content">
                    <div className="all-content pb-4">
                        <h3>All Content</h3>
                        <Link to={ROUTES.EXPERIENCES_LISTING} className={`anchor-links${(activeRoute === ROUTES.EXPERIENCES_LISTING)? ` active`: ``}`}>Experiences</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_POPULAR_CONTENT} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_POPULAR_CONTENT)? ` active`: ``}`}>Popular Content</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_RECOMMENDED_FOR_YOU_CONTENT} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_RECOMMENDED_FOR_YOU_CONTENT)? ` active`: ``}`}>Recommended for you</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_MYCONTENT} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_MYCONTENT)? ` active`: ``}`}>My contents</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_ALL_CONTENT} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_ALL_CONTENT)? ` active`: ``}`}>All Contents</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_CONTENT_PICKER} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_CONTENT_PICKER)? ` active`: ``}`}>Content picker</Link>
                    </div>
                    <div className="add-content pb-4">
                        <h3>Add Content</h3>
                        <Link to={ROUTES.CONTENT_PORTAL_ADD_GDRIVE_CONTENT} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_ADD_GDRIVE_CONTENT)? ` active`: ``}`}>Add from Google Drive</Link>
                        <Link to="#" className="anchor-links">Add from OneDrive</Link>
                    </div>
                    <div className="add-content pb-4">
                        <h3>My Shares</h3>
                        <Link to={ROUTES.CONTENT_PORTAL_MY_SHARES} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_MY_SHARES)? ` active`: ``}`}>Emails & sites</Link>
                        <Link to={ROUTES.CONTENT_PORTAL_MY_SITES} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_MY_SITES)? ` active`: ``}`}>My sites</Link>
                    </div>
                    <Can
                        role={getUserRoleName()}
                        resource={routeResource}
                        action={"CONTENTS:EXPERINCES"}
                        yes={(attr) => (
                        <>
                            <div className="add-content pb-4">
                                <h3>Build Experiences</h3>
                                <Link to={ROUTES.CONTENT_PORTAL_BUILD_EXPERIENCES} className={`anchor-links${(activeRoute === ROUTES.CONTENT_PORTAL_BUILD_EXPERIENCES)? ` active`: ``}`}>Create experiences</Link>
                            </div>
                        </>  
                        )}
                        no={() => (
                            null
                        )}
                    />
                </div>
            </div>
        </Col>
        )
    }
}

const mapStateToProps = ( state ) => ({
    router: state.router,
    profileSettings : state.profileSettings
})
  
export default connect(
    mapStateToProps,
    null
)(LeftBar)