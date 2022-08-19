import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Redirect } from 'react-router-dom';

import { ConfirmationBox } from '../../component/ConfirmationBox'
import { InviteTeamModal } from './InviteTeamModal'
import { ROUTES } from '../../constants/routeConstants'
import { userRoles } from '../../constants/appConstants'
import { actions as authActions } from "../app/auth";
import { ProfileForm } from './ProfileForm'
import {
  list_team_members,
  add_team_member,
  update_team_member,
  delete_team_member,
  send_invites
} from '../../actions/invite_team'
import {
  get_skills
} from '../../actions/skills'
import {
  get_profile,
  edit_profile,
  save_profile
} from '../../actions/profile'
import { validateEmail , validateName, getUserRole } from '../../transforms'


class OnBoarding extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalShow: false,
      showInviteHeader: true,
      isConfirmationShow: false,
      selectedFuncSkill: {},
      isRolesInputOpen: false,
      checkValidationSubmit: false
    }
  }

  componentDidMount() {
    if(!authActions.isNewUser()) {
      this.props.history.push(ROUTES.PROFILE)
    }
    // getSkills
    this.props._get_skills();
    this.props._get_profile(() => {
      let { data } = this.props.profile
      if(data.role) {
        data.user_role = userRoles[data.role -1];
      } else {
        data.user_role = getUserRole();
      }
      data.role = (userRoles.indexOf(data.user_role) !== -1)? userRoles.indexOf(data.user_role)+1 : 1
      this.props._edit_profile(data);
    });
    
  }

  hideInviteHeader = () => {
    this.setState({ showInviteHeader: false })
  }

  toggleInviteModal = () => {
    this.setState(prevState => ({
      isModalShow: !prevState.isModalShow
    }));
  }

  add_member = () => {
    let user = {
      email:'',
      name: '',
      error: {
        email: null,
        name: null
      }
    }
    this.props._add_team_member(user)
  }

  edit_member = (e, user, index, inputType) => {
    let input = e.target.value;
    user[inputType] = input
    if(inputType === 'email') {
      // Validate email address
      user.error[inputType] = (input.length === 0)? null : !validateEmail(input) 
    } else if(inputType === 'name'){
      user.error[inputType] = !validateName(input)
    }
    this.props._update_team_member(index, user)
  } 

  send_invites = (e) => {
    e.preventDefault();

    // check validation error
    if(this.validateInviteForm())
      this.props._send_invites();
  }

  validateInviteForm = () => {
    let { invites } = this.props.inviteTeam
    let isValid = true
    invites.forEach((user) => {
      if(user.error.email)
        isValid=false
    })
    return isValid
  }

  hideAlert = () => {
    this.setState({
      checkValidationSubmit: false
    })
  }

  onCancelForm = () => {
    this.setState({ isConfirmationShow: true})
  }
  onSubmitProfile = () => {
    let { data } = this.props.profile
    if(this.validateProfileForm(data)){
      if(data.birthday === ""){
        data.birthday=null 
      }
      // console.log(data)
      // send save profile request
      this.props._save_profile(data)
    }else{
      this.setState({
        checkValidationSubmit: true
      })
    }
  }
  validateProfileForm = (data) => {
    let error = data.error

    // reset validation
    error.firstname=null;error.lastname=null;error.job_title=null;error.zipcode=null;error.skills=null;

    // required validation
    if(data.firstname === ""){
      error.firstname = true;
    } 
    if(data.lastname === ""){
      error.lastname = true;
    } 
    if(data.zipcode === ""){
      error.zipcode = true;
    } 
    // if(data.job_level === "") {
    //   error.job_level = true;
    // }
    if(data.job_title === "") {
      error.job_title = true
    }
    if(data.skills.length === 0) {
      error.skills = true
    }
    if(error.firstname || error.lastname || error.zipcode || error.job_title || error.skills) {
      data.error = error
      this.props._edit_profile(data)
      return false
    }
    return true
  }

  toggleConfirmModal = () => {
    this.setState(prevState => ({
      isConfirmationShow: !prevState.isConfirmationShow
    }));
  }
  confirmedCancel = () => {
    this.toggleConfirmModal()
    
    this.props.history.push(ROUTES.PROFILE)
  }

  edit_profile = (e, inputName, inputType='') => {
    let { data } = this.props.profile
    if(inputType === 'checkbox') {
      if(e.skill_value){
        e.skill_value = "Default"
        data[inputName].push(e)
      }
      else {
        // remove already added skill
        data[inputName] = data[inputName].filter((skill) => {
          return skill.skill_id !== e.skill_id 
        })
      }
    } else if(inputType === 'radio') {
      let skillsData = data[inputName].filter((skill) => {
        return skill.skill_id !== e.skill_id 
      })
      skillsData.push(e)
      data[inputName] = skillsData
    } else {
      let input = e.target.value
      data[inputName] = input
    }
    
    this.props._edit_profile(data)
  }

  onFunctionalSkillSelect = (id) => {
    let selectedSkill = this.props.skills.data[2].skills.filter(skill => {
      return skill.id === id
    })
    this.setState({
      selectedFuncSkill: selectedSkill[0]
    })
  }

  toggleRoleInput = () => {
    this.setState({
      isRolesInputOpen: !this.state.isRolesInputOpen
    })
  }
  changeAssignedRole = (role) => {
    let {data} = this.props.profile
    data.role = role.id
    data.user_role = userRoles[role.id -1]
    this.props._edit_profile(data)
    this.toggleRoleInput()
  }


  render() {
    let { isModalShow, showInviteHeader, isConfirmationShow, selectedFuncSkill, isRolesInputOpen } = this.state
    let { inviteTeam } = this.props;
    if(inviteTeam.success) {
      this.state.isModalShow = false
    }

    return  (
      <div className="page-onbaording">
        {
          !authActions.isNewUser() && 
          <Redirect 
            to={{
              pathname: ROUTES.PROFILE
            }}
          />
        }
        {showInviteHeader && 
          <div className="onbaording-header">
            <a className="cross-notify" href="javascript:void(0)" onClick={this.hideInviteHeader} ><i className="fa fa-times" /></a>
            <div className="container">
              <div className="onbaording-title">Welcome to <span className="logo">Teamz<span>Skill</span></span></div>
              <div className="onbaording-description">TeamzSkill gives your team members a common space to express their best work<br /> and share their passion for learning &amp; growing in your team.</div>
              <div className="onbaording-description">Our goal is to make your skill-building expeirence unique and collaborative.</div>
              <div className="onbaording-description">Tell us a bit about you.</div>
            </div>
            <Button className="btn orange-btn" onClick={this.toggleInviteModal} >Add Team Members</Button>
          </div>
        }
        
        <ProfileForm 
          profile={this.props.profile}
          skills={this.props.skills}
          selectedFuncSkill={selectedFuncSkill}
          isRolesInputOpen={isRolesInputOpen}
          _onChange={this.edit_profile}
          _onCancelForm={this.onCancelForm}
          _onSubmitProfile={this.onSubmitProfile}
          _onFunctionalSkillSelect={this.onFunctionalSkillSelect}
          _toggleInput={this.toggleRoleInput}
          _changeAssignedRole={this.changeAssignedRole}
          checkValidationSubmit={this.state.checkValidationSubmit}
          hideAlert={this.hideAlert}
        />
        
        <InviteTeamModal 
          isModalShow={isModalShow}
          invites={inviteTeam.invites}
          showError={inviteTeam.error}
          loading={inviteTeam.sending}
          _toggle={this.toggleInviteModal}
          _add_member={this.add_member}
          _onChange={this.edit_member}
          _sendInvites={this.send_invites}
        />

        <ConfirmationBox
          title={'Are you sure?'}
          bodyText={'Do you want to cancel onBoarding form'}
          isOpen={isConfirmationShow}
          _toggle={this.toggleConfirmModal}
          _confirmed={this.confirmedCancel}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ login, inviteTeam, profile, skills }) => ({
  ...login,
  inviteTeam,
  profile,
  skills
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _list_team_member   : list_team_members,
      _add_team_member    : add_team_member,
      _update_team_member : update_team_member,
      _delete_team_member : delete_team_member,
      _send_invites       : send_invites,
      _get_skills         : get_skills,
      _get_profile        : get_profile,
      _edit_profile       : edit_profile,
      _save_profile       : save_profile
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnBoarding)
