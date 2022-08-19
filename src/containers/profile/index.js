import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { SectionBanner } from './SectionBanner'
import { SectionContent } from './SectionContent'
import { get_user_details, set_user_details } from '../../actions/user'
import { get_logo_placeholder_images } from '../../actions/userProfilePage'
import { get_courses } from '../../actions/myCourses'
import { Loader } from '../../component/Loader'
import { userConstant } from '../../constants/storeConstants'
import { ROUTES } from '../../constants/routeConstants';

class Profile extends Component {

  state = {
    user: this.props.user,
    closeBanner: false,
    uploadProfilePic: null
  }

  componentDidMount() {
    // Call get_user_details api to get user data
    this.props._get_user_details()
    this.props._get_courses()
    this.props._get_logo_placeholder_images();
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({user: this.props.user})
    }
  }

  handleEdit = (type) => {
    switch(type) {
      case "USER_PROFILE":
        let {_set_user_edit_mode, user} = this.props
        _set_user_edit_mode(!user.isEditMode)

      default:
        // Nothing to do
    }
  }

  onUserChange = (evt, type) => {
    let {user} = this.state
        user.data[type] = evt.target.value
        user.formError[type] = (evt.target.value.length > 0)? false : true
        this.setState({ user: user })
  }

  onUserSave = () => {
    let {_set_user_details, user} = this.props
    let { uploadProfilePic } = this.state

    if(this.checkValidation())
      return false

    if(uploadProfilePic !== null){
      const data = new FormData();
      data.append('file', uploadProfilePic)
      data.append('userData', JSON.stringify(user.data))
      _set_user_details(data, false)
    } else {
      _set_user_details(JSON.stringify(user.data), true)
    }

  }

  checkValidation = () => {
    let { formError } = this.props.user
    return (formError.name || formError.job_title || formError.job_level || formError.motto) 
  }

  handleCloseBanner = () => {
    this.setState({
      closeBanner: true
    })
  }

  onBeforeFileLoad = (elem) => {
    // 1000000 = 1MB
    let maxFileSize = 1000000 * 10
    if(elem.target.files[0].size > maxFileSize){
      alert("File size should not excced 10MB!");
      elem.target.value = "";
    };
  }

  onFileLoad = (file) => {
    console.log("files", file)
    this.setState({
      uploadProfilePic: file
    })
  }

  onCrop = (image) => {
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

  render() {
    let { user, closeBanner } = this.state,
        { location } = this.props.router,
        noBanner = this.props.router.location.pathname === ROUTES.COURSES_LIBRARY ? true: false,
        hideDiv = closeBanner || noBanner ? 'hidediv' : ''
        
    return (
      <Fragment>
        {
          user.data.email &&
          <Fragment>
            { !noBanner && !closeBanner &&
            <SectionBanner 
              user={user} 
              _handleCloseBanner={this.handleCloseBanner}
            />
            }

            <SectionContent 
              user={user}
              myCourses={this.props.myCourses} 
              hideDiv={hideDiv}
              _handleEdit={this.handleEdit} 
              _onUserChange={this.onUserChange}
              _onUserSave={this.onUserSave}
              _onFileLoad={this.onFileLoad}
              _onCrop={this.onCrop}
              _onBeforeFileLoad={this.onBeforeFileLoad}
            />
          </Fragment>
        }
        <Loader isLoading={this.props.user.isLoading || this.props.myCourses.isLoading} />
      </Fragment>
    )
  }
}

const mapStateToProps = ({ user, myCourses, router }) => ({
  user,
  myCourses,
  router
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_user_details   : get_user_details,
      _set_user_details   : set_user_details,
      _get_courses        : get_courses,
      _get_logo_placeholder_images :  get_logo_placeholder_images,
      _set_user_edit_mode : (mode) => dispatch({ type: userConstant.SET_EDIT_MODE, payload: mode}),
      _user_edit          : (data) => dispatch({ type: userConstant.EDIT_USER, payload: data})
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
