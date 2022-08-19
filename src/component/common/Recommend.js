import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'

import {
  recommend_new_course,
} from '../../actions/myCourses'
import { validateEmail } from '../../transforms/'
import closeIcon from '../../assets/img/close.png'

class CourseRecommendModal extends Component{

  state={
    recommendee: [
      {
        email: '',
        error: {
          email: null
        }
      },
      {
        email: '',
        error: {
          email: null
        }
      },
      {
        email: '',
        error: {
          email: null
        }
      },
    ],
    errMsg: this.props.errMsg,
      
    isModalShow: this.props.isShowRecommendModal,
    course: this.props.editCourseData,
  }

  resetRecommendeeState = () => {
    this.setState({
      recommendee: [
        {
          email: '',
          error: {
            email: null
          }
        },
        {
          email: '',
          error: {
            email: null
          }
        },
        {
          email: '',
          error: {
            email: null
          }
        },
      ],
    })
  }

  toggleRecommendModal = () => {
    this.props.toggleRecommendModal()
  }
  add_member = () => {
    let user = {
      email:'',
      error: {
        email: null
      }
    }
    this.setState((previousState) => ({
      recommendee: [...previousState.recommendee, user]
    }))
  }

  delete_member = (index) => {
    this.setState((previousState) => ({
      recommendee: [...previousState.recommendee.slice(0, index), ...previousState.recommendee.slice(index +1)]
    }))
  }
    
  edit_member = (e, user, index) => {
    let {value, name} = e.target;
    user[name] = value
    if(name === 'email') {
      // Validate email address
      user.error[name] = (value.length === 0)? null : !validateEmail(value) 
    }
    console.log("",user, index)
    this.setState((previousState) => ({
      recommendee: [...previousState.recommendee.slice(0, index), user, ...previousState.recommendee.slice(index + 1)]
    }))
  }
    
  send_recommendations = (e) => {
    e.preventDefault();
    let {course, recommendee} = this.state
    let {c_id} = course
    // console.log("send_recommendations", courseToAssign, recommendee)
    // check validation error
    if(this.validateRecommendForm()) {
      // eliminate empty emails
      let recommendeeToSend = recommendee.filter(user => user.email !== '')
      recommendeeToSend = recommendeeToSend.map(user => user.email)

      let data = {
        c_id,
        emails: recommendeeToSend
      }
        this.props._recommend_new_course(data , () => {
        this.toggleRecommendModal();
      });
    }
  }
    
  validateRecommendForm = () => {
    let { recommendee } = this.state
    let { loginData } = this.props
    let isValid = true
    this.setState({
      errMsg: ""
    })
    recommendee.forEach((user) => {
      if(user.error.email)
      isValid=false

      // current user should not recommend it self
      if(loginData.email === user.email){
        this.setState({
            errMsg: "Sorry you cannot recommend yourself"
        })
        isValid = false
      }
    })
    return isValid
  }

  render(){
    let { errMsg, isModalShow, recommendee } = this.state
    let invites = recommendee,
      _toggle = this.toggleRecommendModal,
      _add_member = this.add_member,
      _delete_member = this.delete_member,
      _onChange = this.edit_member,
      _sendInvites =  this.send_recommendations


  return (
      <Modal 
        className={'modal-dialog-centered modal-team-member'} 
        modalClassName={'modal-theme tzs-modal'} 
        
        isOpen={isModalShow} 
        toggle={_toggle}
        >
        <ModalHeader toggle={_toggle}>Recommend Course</ModalHeader>
        <ModalBody>
          <Alert color="danger" isOpen={!!errMsg}>
              {errMsg}
          </Alert>
          <Form className="modal-theme-form">
            <div className="invite-team-member">
              {
              invites.map((user, index) => <InviteUser key={`invite-${index}`} user={user} index={index} _onChange={_onChange} _delete_member={_delete_member} /> )
              }
            </div>
            <div className="add-member-group">
              <a href="javascript:void(0)" className="btn" onClick={_add_member}>+ Add another</a>
              <a href="javascript:void(0)" className="btn"></a>
            </div>
            <div className="form-actions">
              <Button className="btn-theme btn-block" data-dismiss="modal" onClick={_sendInvites} >Send</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    )
  }
} 
const InviteUser = ({user, index, _onChange, _delete_member}) => (
  <Row key={`inviteUser-${index}`}>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Email Address*</Label>
        <Input type="email" name="email" placeholder="name@domain.com" value={user.email} valid={user.error.email!==null && !user.error.email} invalid={user.error.email!==null && user.error.email} onChange={(e) => _onChange(e, user, index)} />
      </FormGroup>
      </Col>
      <Col className="d-flex align-items-center">
      <div className="closeIcon" onClick={() => _delete_member(index)}>
        <img src={closeIcon} alt="..." />
      </div>
    </Col>
  </Row>
)

const mapStateToProps = ( state ) => ({
  loginData: state.login.data 
})

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      _recommend_new_course : recommend_new_course
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseRecommendModal)