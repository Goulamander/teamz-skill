import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import { bindActionCreators } from 'redux'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Link, Redirect } from 'react-router-dom'

import courseImgDefault from '../../../../assets/img/recognition-image-with-star.png'
import DateInput from '../../../../component/DateInput'
import { validateHttpLink } from '../../../../transforms/'
import { add_new_achievements, get_new_achievements } from '../../../../actions/myCourses'
import prevArrowIcon from '../../../../assets/img/backward-arrow.png'
import nextArrowIcon from '../../../../assets/img/forward-arrow.png'
import { appConstant } from '../../../../constants/appConstants'
import AchievementsList from '../../../../component/common/Achievements'

class Achievements extends Component {

  constructor(props) {
    super(props) 
    this.state = {
      isAAModalShow: false,
      isEAModalShow: false,
      newCourse: {
        c_title: '',
        c_author_name: '',
        s_issuing_org: '',
        cert_type: '',
        cred_number: '',
        archived_date: '',
        cred_url:'',
        file: ''
      },
      responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false
            }
        },
        {
          breakpoint: 959,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: false
          }
      }
      ]
    }
  }

  componentDidMount(){
    this.props._get_new_achievements();
  }

  toggleAddAchModal = () => {
    this.setState(prevState => ({
      isAAModalShow: !prevState.isAAModalShow
    }));
  }

  onAAChange = (value, type) => {

  }

  onAASaveHandler = (data, cb) => {
    this.props._add_new_achievements(data, (res) => {
      this.toggleAddAchModal()
      this.props._get_new_achievements()
      cb()
    })
  }

  render() {
    let { achievements, achievementTypes } = this.props.myCourses
    let { isAAModalShow, newCourse } = this.state
    
    const CourseNextArrow = (props) => (
      <div className="slider-arrow next" onClick={props.onClick}> <img src={nextArrowIcon} /> </div>
    )
    
    const CoursePrevArrow = (props) => (
      <div className="slider-arrow prev" onClick={props.onClick}> <img src={prevArrowIcon} /> </div>
    )

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      useTransform: false,
      adaptiveHeight: true,
      nextArrow: <CourseNextArrow />,
      prevArrow: <CoursePrevArrow />,
      responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false
            }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false
          }
      }
      ]
    };

    return (
      <div className="weekly-box">
        <Row>
          <Col sm={4}>
            <h4 className="common-head">Achievements</h4>
          </Col>
          <Col sm={8}  className="text-right weekly-calendar">
            <div className="weekly-right">
              <div className="landing-btns">
                <Button className="btn btn-theme" onClick={this.toggleAddAchModal} >Add New Achievements</Button>
                {/* <a href="javascript:void(0)" data-toggle="modal" data-target="#addnewachievements" className="btn btn-theme">Add New Achievements</a> */}
              </div>
            </div>
          </Col>
        </Row>
          <div className="events-box achievements-list">
            <Fragment>
            {achievements.length == 0 && 
              <Col>
                <h4 className="no-course my-5 py-5">You have no achievements</h4>
              </Col>
            }
            { achievements.length > 0 &&
              <div className="events-card">
                <div className="tzs-slider">
                  <Slider {...settings}>
                  
                    { achievements.map((item, index)=>{
                      var courseImg = '';
                      if(!!item.cert_url === true){
                         courseImg = appConstant.BASE_URL + item.cert_url.replace('dist', '')
                      }else{
                         courseImg = courseImgDefault;
                      }

                      let dt = item.archived_date,
                          date = new Date(dt),
                          months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                          achievementDate = months[date.getMonth()] + ' ' + date.getFullYear();
                    return (
                      // <div className={'mt-2'} key={index}>
                      //   <div className="card course-single-group">
                      //     <div className="img-box">											
                      //       <div className="card-img-background achievements-certificate-image" style={{backgroundImage: `url(${courseImg})`}}></div>
                      //     </div>
                      //     <div className="card-body p-0 pt-3">
                      //       <h5 className="card-title achievements-title">
                      //       <a href={item.cred_url}>{item.c_title}</a>
                      //       </h5>
                      //     <div className="achievement-company-logo">
                      //       {/* <img src={cLogo} /> */}<p>{item.issuing_org}</p>
                      //     </div>
                      //     <div className="achievement-details">
                      //       <p>Issued {achievementDate} </p>
                      //       <p>{item.cred_number !== "" ? "Credential ID : " + item.cred_number : ''}</p>
                      //     </div>
                      //     {/* <div className="action-bottom-dots">
                      //       <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" ></a>
                      //     </div> */}
                      //     </div>
                      //   </div>
                      // </div>
                      <AchievementsList courseImg={courseImg} item={item} achievementDate={achievementDate} key={index}/>
                    )}
                  )}</Slider>
                </div>
              </div>
            }
          </Fragment>
        </div>
        <AchievementModal 
          isModalShow={isAAModalShow}
          showError={false}
          errMsg={''}
          isNew={true}
          achTypes={achievementTypes}
          _toggle={this.toggleAddAchModal}
          _onChange={this.onAAChange}
          _onSave={this.onAASaveHandler}
          _onDelete={null}
        />
      </div>
    )
  }
}


export class AchievementModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      certType: null,
      newCourse: {
        c_title: '',
        s_issuing_org: '',
        cert_type: '',
        cred_number: '',
        archived_date: '',
        cred_url: ''
      },
      uploadCertificate: null,
      certificateFilename: '',
      validationError: {
        c_title: false,
        s_issuing_org: false,
        cred_url: false,
        cert_type: false,
        archived_date: false
      },
    }
    
  }
  
  toggleSelectBox = () => {
    this.setState({
      show: !this.state.show
    })
  }

  onTypeChange = (option) => {
    let {newCourse} = this.state

    newCourse.cert_type = option.name

    this.setState({
      newCourse: newCourse
    })
    this.toggleSelectBox()
  }

  _onChange = (e) => {
    let {name, value} = e.target
    let {newCourse} = this.state
    newCourse[name] = value
    this.setState({
      newCourse: newCourse
    })
  }

  _onDateChange = (e, type) => {
    let {newCourse} = this.state
    newCourse['archived_date'] = e.target.value
    this.setState({
      newCourse: newCourse
    })
  }

  onValidate = (newCourse, event) => {
    let isValid = true
    let { validationError, uploadCertificate } = this.state

    Object.keys(validationError).map((value) => {
      validationError[value] = false
      if(newCourse[value] === ""){
        validationError[value] = true
        isValid = false
      }
    })

    // validate course link
    if(!validateHttpLink(newCourse.cred_url)) {
      isValid = false
      validationError.cred_url = true
    }
    this.setState({
      validationError: validationError
    })
    return isValid
  }

  onSave = () => {
    let {newCourse, uploadCertificate, certificateFilename} = this.state;
    if(this.onValidate(newCourse)){
      let formData = new FormData();
      formData.append('file', uploadCertificate)
      formData.append('userData', JSON.stringify(newCourse))
    
      // delete courseData.error;
      this.props._onSave(formData, () => {
        this.resetForm()
      })
    }
  }

  resetForm = () => {
    let {newCourse} = this.state
    let reset = {
      c_title: '',
      s_issuing_org: '',
      cert_type: '',
      cred_number: '',
      archived_date: '',
      cred_url: ''
    }

    this.setState({
      newCourse: reset,
      uploadCertificate: null,
      certificateFilename: ''
    })
  }

  onFileChange = (e, file) => {
    this.setState({
        uploadCertificate: e.target.files[0],
        certificateFilename: e.target.files[0].name
    })
  }

  unfurlMe = (e, isNew=false) => {
    let link = e.target.value;
    let {newCourse} = this.props.myCourses
    if(validateHttpLink(link)){
      if(isNew) {
        this.props._unfurling(link, newCourse)
      }
    }
  }



  render() {
    let {
      isModalShow,
      showError,
      errMsg,
      isNew,
      achTypes,
      _toggle,
      _onDelete
    } =  this.props

    let { show, newCourse, certificateFilename, validationError } = this.state,
      isShow = show? 'show' : '',
      course = newCourse
    
    return (
      <Modal 
        className={'modal-dialog-centered'} 
        modalClassName={'modal-theme tzs-modal'} 
        id={'addnewachievement'}
        isOpen={isModalShow} 
        toggle={_toggle}
      >
        <ModalHeader toggle={_toggle}>Add your new achievements!</ModalHeader>
        <ModalBody>
          <Alert color="danger" isOpen={showError}>
              {errMsg}
          </Alert>
          <Form className="modal-theme-form">
            <FormGroup>
              <Label>Name *</Label>
              <Input name="c_title" type="text" placeholder="Alexa Skill Builder" onChange={this._onChange} value={course.c_title} invalid={validationError.c_title} />
            </FormGroup>
            {/* <FormGroup>
              <Label>Course Author Name (Optional)</Label>
              <Input name="c_author_name" type="text" placeholder="John Johnson" onChange={this._onChange} value={course.c_author_name} invalid={validationError.c_author_name} />
            </FormGroup> */}
            <FormGroup>
              <Label>Issuing Organization *</Label>
              <Input name="s_issuing_org" type="text" placeholder="AWS" onChange={this._onChange} value={course.s_issuing_org} invalid={validationError.s_issuing_org} />
            </FormGroup>
            <FormGroup>
              <Label>Type *</Label>
              <div className={`feedback-formcontrol-group ${isShow}`}>	
                  <Input placeholder="Certificate" size="15" name="cert_type" type="text" value={course.cert_type} onChange={()=>console.log('')} invalid={validationError.cert_type}/>
                  <a href="javascript:void(0)" className="fa fa-caret-down caret-btn" onClick={this.toggleSelectBox}></a>
                  <ul className="feedback-list animated fadeInUp" id="typesizelist">
                  {
                    achTypes.map((option, i) => (
                      <li key={`at-opt-${i}`} className="dropdown-item" >
                        <a href="javascript:void(0)" onClick={()=>this.onTypeChange(option)} >{option.title}</a>
                      </li>    
                    ))
                  }
                  </ul>
                </div>
            </FormGroup>
            <FormGroup>
              <Label>Date Archived *</Label>
              <DateInput _onChange={this._onDateChange} requiredErr={validationError.archived_date} />
            </FormGroup>
            <FormGroup>
              <Label>Credential Number</Label>
              <Input name="cred_number" type="text" placeholder="" onChange={this._onChange} value={course.cred_number} invalid={validationError.cred_number} />
            </FormGroup>
            <FormGroup>
              <Label>Credential URL *</Label>
              <Input name="cred_url" type="text" placeholder="" onChange={this._onChange} value={course.cred_url} invalid={validationError.cred_url} />
            </FormGroup>
            <div className="form-actions full-form-actions">
              <div className="certificate-upload-button">
                <FormGroup>
                  <Input type="text" value={certificateFilename} className="certificate-name-input" disabled/>
                </FormGroup>
                <div className="input-file-container">  
                    <Input id="uploadImg" className="input-file-certificate" type="file" name="file" accept="image/png" onChange={(e) => this.onFileChange(e)}/>
                    <Label className="input-file-trigger btn btn-gray" tabIndex="0"  for="uploadImg">Upload Certificate Image (.png)</Label>
                </div>
              </div>
              {/* <a href="javascript:void(0)" className="btn btn-gray" _onFileLoad={this.onFileLoad} >Upload Certificate</a> */}
            </div>  
            <div className="form-actions full-form-actions">
              <button type="button" className="btn btn-gray" onClick={_toggle}>Cancel</button>
              <button type="button" className="btn btn-theme" onClick={this.onSave}>Save</button>
              { !isNew &&
                <button type="button" className="btn btn-danger" onClick={_onDelete}>Delete</button>
              }
            </div>
          </Form>
        </ModalBody>
      </Modal>
    )
  }
}


const mapStateToProps = ( state ) => ({
  myCourses: state.myCourses,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _add_new_achievements: add_new_achievements,
      _get_new_achievements: get_new_achievements
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Achievements)
