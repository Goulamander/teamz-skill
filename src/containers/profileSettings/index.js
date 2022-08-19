import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, FormGroup, Label, Input, Col, Row, ListGroup, Table } from 'reactstrap'
import SweetAlert from 'react-bootstrap-sweetalert';

import {
  list_team_members,
  add_team_member,
  update_team_member,
  delete_team_member,
  send_invites
} from '../../actions/invite_team'
import {
  get_skills, get_user_skills, edit_user_skills, set_user_skills
} from '../../actions/skills'
import { skillsConstant } from '../../constants/appConstants'
import { Loader } from '../../component/Loader'
import { validateEmail , validateName } from '../../transforms'
import { ROUTES } from '../../constants/routeConstants';


import { ConfirmationBox } from '../../component/ConfirmationBox'
import { InviteTeamModal } from '../../containers/onboarding/InviteTeamModal'

class ProfileSettings extends Component {

  state = {
    isModalShow: false,
    isCancelForm: false,
    selectedFuncSkill: {},
    isConfirmationShow: false,
    updateSkillsSuccess: false,
    updateSkillsError: false
  }

  componentDidMount() {
    this.props._get_skills();
    this.props._get_user_skills();
  }


  toggleInviteModal = () => {
    this.setState(prevState => ({
      isModalShow: !prevState.isModalShow
    }));
  }


  functionalSkillSelect = (id) => {
    let selectedSkill = this.props.skills.data[2].skills.filter(skill => {
      return skill.id === id
    })
    this.setState({
      selectedFuncSkill: selectedSkill[0]
    })
  }

  _onChange = (e, inputType='') => {
    let { userSkills } = this.props.profileSettings.data
    if(inputType === 'checkbox') {
      if(e.skill_level){
        e.skill_level = "Default"
        userSkills.push(e)
      }
      else {
        // remove already added skill
        userSkills = userSkills.filter((skill) => {
          return skill.skill_id !== e.skill_id 
        })
      }
    } else if(inputType === 'radio') {
      let skillsData = userSkills.filter((skill) => {
        return skill.skill_id !== e.skill_id 
      })
      skillsData.push(e)
      userSkills = skillsData
    }

    this.props._edit_user_skills(userSkills)
  }

  toggleConfirmModal = () => {
    this.setState(prevState => ({
      isConfirmationShow: !prevState.isConfirmationShow
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

  confirmedCancel = () => {
    this.toggleConfirmModal()
    
    // this.props.history.push(ROUTES.PROFILE)
  }

  onCancelForm = () => {
    this.setState({ isCancelForm: true})
  }

  _onSubmitProfile = () => {
    if(this.validateProfileSkillsForm()) {
      this.props._set_user_skills((success) => {
        if(success) {
          this.setState({ 
            updateSkillsSuccess: true,
            updateSkillsError: false
          })
        } else {
          this.setState({ 
            updateSkillsSuccess: false,
            updateSkillsError: 'Failed to update profile skills!'
          })
        }
      })
    } else {
      this.setState({
        updateSkillsError: 'Please select at least one skill from the list.'
      })
    }
  }

  validateProfileSkillsForm = () => {
    let { data} = this.props.profileSettings
    
    let isValid = true

    if(data.userSkills.length === 0) isValid = false
    return isValid
  }

  hideAlert = () => {
    this.setState({
      updateSkillsError: false,
      updateSkillsSuccess: false
    })
  }

  render() {
    let { isModalShow, isCancelForm, selectedFuncSkill, isConfirmationShow, updateSkillsSuccess, updateSkillsError } = this.state
    let { inviteTeam } = this.props;
    let mgtSkillsData = this.props.skills.data[0];
    let peopleSkillsData = this.props.skills.data[1];
    let funcSkillsData = this.props.skills.data[2];
    let otherSkillsData = this.props.skills.data[3];
    let profileData = this.props.profile.data;
    let userData = this.props.profileSettings.data
    let { isLoading } = this.props.profileSettings
    
    if(inviteTeam.success) {
      this.state.isModalShow = false
    }

    if(isCancelForm) {
      return <Redirect to={ROUTES.PROFILE} />
    }

    return (
      <div id="page-profile-settings">
        <section className="banner">
        <div className="tsz-container">
          <Container>
            <Row>
              <div className="col-lg-4 col-md-12">
                <div className="profile-settings-banner">
                  <h3 className="title">Hello {userData && userData.user_name && 
                   userData.user_name
                  }
                  </h3>
                </div>
              </div>
            </Row>
            <Row>
              <div className="col-lg-8 col-md-12">
                <div className="profile-settings-banner">
                  <p>Teamzskill gives your team members a common space to express their best work and share their passion for learning &amp; growing in your team.</p>
                  <p>Our goal is to make your skill-building experience unique and collaborative.</p>
                  <p>Review your skill selection.</p>
                </div>
              </div>
            </Row>
            {/* <Row>
              <div className="col-lg-12">
                <div className="add-team-member-btn">
                  <button className="btn csnew-btn" onClick={this.toggleInviteModal} >Add Team Members</button>
                </div>
              </div>
            </Row> */}
          </Container>
        </div>
        </section>
        <section>
          <Container className="profile-settings-container">
            <div className="modal-form">
              <Row>
                <div className="col-lg-12">
                  <div className="profile-settings-title">Change My Settings</div>
                </div>
              </Row>
              <FormGroup>
                <Label>Which skills are you interested to master? (Check all that applies to you)
                {/* {profileData.error.skills &&
                  <span className="text-danger">Please select at least one skill from the list below.</span>
                } */}
                </Label>
                <div className="quote-group">
                  {/* ROW 1 */}
                  <Row>
                    { mgtSkillsData && 
                      <Col xl="4" lg="4" md="4" sm="12">
                        <div className="quote-single">
                          <div className="quote-title">{mgtSkillsData.name}</div>
                          <ListGroup className="checkbox-list">
                            {
                              mgtSkillsData.skills.map(( skill, index ) => {
                                return (
                                  <li key={`m-skill-${skill.id}`} className="checkbox-theme">
                                    <Input id={`managementskills-${skill.id}`} className="styled" type="checkbox" checked={userData.userSkills.some(elem => elem.skill_id === skill.id)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.checked}, 'checkbox')} />
                                    <Label for={`managementskills-${skill.id}`} className="arrow-label">{skill.name}</Label>
                                  </li>
                                )
                              })
                            }
                          </ListGroup>
                        </div>
                      </Col>
                    }
                    { peopleSkillsData && 
                      <Col xl="4" lg="4" md="4" sm="12">
                        <div className="quote-single">
                          <div className="quote-title">{peopleSkillsData.name}</div>
                          <ListGroup className="checkbox-list">
                            {
                              peopleSkillsData.skills.map(( skill, index ) => {
                                return (
                                  <li key={`p-skill-${skill.id}`} className="checkbox-theme">
                                    <Input id={`peopleskills-${skill.id}`} className="styled" type="checkbox" checked={userData.userSkills.some(elem => elem.skill_id === skill.id)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.checked}, 'checkbox')} />
                                    <Label for={`peopleskills-${skill.id}`} className="arrow-label">{skill.name}</Label>
                                  </li>
                                )
                              })
                            }
                          </ListGroup>
                        </div>
                      </Col>
                    }
                    { funcSkillsData && 
                      <Col xl="4" lg="4" md="4" sm="12">
                        <div className="quote-single" id="domain-skill">
                          <div className="quote-title">{funcSkillsData.name}</div>
                          <ListGroup className="radio-list">
                            {
                              funcSkillsData.skills.map(( skill, index ) => {
                                return (
                                  <li key={`f-skill-${skill.id}`} className="radio-quote">
                                    <Input id={`functional${skill.id}`} className="styled" type="radio" name="function-domain-skill" onClick={() => this.functionalSkillSelect(skill.id)} />
                                    <Label for={`functional${skill.id}`} className="arrow-label">{skill.name}</Label>
                                  </li>
                                )
                              })
                            }
                          </ListGroup>
                        </div>
                      </Col>
                    }
                  </Row>
                  <div className="management-skill-group">
                    { (selectedFuncSkill.skills && selectedFuncSkill.skills.length) ?
                        <Row>
                          <Col xl="12" lg="12" md="12" sm="12">
                            <div className="quote-single">
                              <div className="quote-title">{`${selectedFuncSkill.name} Interests`}</div>
                              <div className="table-responsive">
                                <Table className="table-radio">
                                  <thead>
                                    <tr>
                                      <th>&nbsp;</th>
                                      <th>{skillsConstant.BEGINNER}</th>
                                      <th>{skillsConstant.INTERMEDIATE}</th>
                                      <th>{skillsConstant.ADVANCED}</th>
                                      <th>{skillsConstant.NOT_MY_THING}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      selectedFuncSkill.skills.map(( skill, index ) => {
                                        let inputId = skill.name
                                        return (
                                          <tr key={`o-skill-${index}`}>
                                            <td>{skill.name}</td>
                                            <td>
                                              <div className="radio-quote">
                                                <Input id={`${inputId}1`} className="styled" type="radio" name={skill.name} value={skillsConstant.BEGINNER} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} checked={userData.userSkills.some((elem) => elem.skill_id === skill.id && elem.skill_level === skillsConstant.BEGINNER)}  />
                                                <Label for={`${inputId}1`} className="arrow-label">&nbsp;</Label>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="radio-quote">
                                                <Input id={`${inputId}2`} className="styled" type="radio" name={skill.name} value={skillsConstant.INTERMEDIATE} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} checked={userData.userSkills.some((elem) => elem.skill_id === skill.id && elem.skill_level === skillsConstant.INTERMEDIATE)} />
                                                <Label for={`${inputId}2`} className="arrow-label">&nbsp;</Label>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="radio-quote">
                                                <Input id={`${inputId}3`} className="styled" type="radio" name={skill.name} value={skillsConstant.ADVANCED} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} checked={userData.userSkills.some((elem) => elem.skill_id === skill.id && elem.skill_level === skillsConstant.ADVANCED)} />
                                                <Label for={`${inputId}3`} className="arrow-label">&nbsp;</Label>
                                              </div>
                                            </td>
                                            <td>
                                              <div className="radio-quote">
                                                <Input id={`${inputId}4`} className="styled" type="radio" name={skill.name} value={skillsConstant.NOT_MY_THING} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} checked={userData.userSkills.some((elem) => elem.skill_id === skill.id && elem.skill_level === skillsConstant.NOT_MY_THING)} />
                                                <Label for={`${inputId}4`} className="arrow-label">&nbsp;</Label>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        : null
                      }
                    </div>
                  </div>
              </FormGroup>
              <FormGroup>
                <Label>Other than being an awesome professional, how else would you describe yourself?</Label>
                <div className="quote-group">
                  { otherSkillsData && 
                    <div className="quote-single">
                      <div className="quote-title">{otherSkillsData.name}</div>
                      <div className="table-responsive">
                        <Table className="table-radio">
                          <thead>
                            <tr>
                              <th>&nbsp;</th>
                              <th>{skillsConstant.BEGINNER}</th>
                              <th>{skillsConstant.INTERMEDIATE}</th>
                              <th>{skillsConstant.ADVANCED}</th>
                              <th>{skillsConstant.NOT_MY_THING}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              otherSkillsData.skills.map(( skill, index ) => {
                                let inputId = skill.name
                                return (
                                  <tr key={`o-skill-${index}`}>
                                    <td>{skill.name}</td>
                                    <td>
                                      <div className="radio-quote">
                                        <Input id={`${inputId}1`} className="styled" type="radio" name={skill.name} value={skillsConstant.BEGINNER} checked={userData.userSkills.some(elem => elem.skill_id === skill.id && elem.skill_level === skillsConstant.BEGINNER)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} />
                                        <Label for={`${inputId}1`} className="arrow-label">&nbsp;</Label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="radio-quote">
                                        <Input id={`${inputId}2`} className="styled" type="radio" name={skill.name} value={skillsConstant.INTERMEDIATE} checked={userData.userSkills.some(elem => elem.skill_id === skill.id && elem.skill_level === skillsConstant.INTERMEDIATE)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} />
                                        <Label for={`${inputId}2`} className="arrow-label">&nbsp;</Label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="radio-quote">
                                        <Input id={`${inputId}3`} className="styled" type="radio" name={skill.name} value={skillsConstant.ADVANCED} checked={userData.userSkills.some(elem => elem.skill_id === skill.id && elem.skill_level === skillsConstant.ADVANCED)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} />
                                        <Label for={`${inputId}3`} className="arrow-label">&nbsp;</Label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="radio-quote">
                                        <Input id={`${inputId}4`} className="styled" type="radio" name={skill.name} value={skillsConstant.NOT_MY_THING} checked={userData.userSkills.some(elem => elem.skill_id === skill.id && elem.skill_level === skillsConstant.NOT_MY_THING)} onChange={(e) => this._onChange({skill_id: skill.id, skill_level: e.target.value}, 'radio')} />
                                        <Label for={`${inputId}4`} className="arrow-label">&nbsp;</Label>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  }
                </div>
                <div className="form-actions full-form-actions">
                  <button type="button" className="btn btn-gray btn-cancel" onClick={this.onCancelForm}>Cancel</button>
                  <a href="javascript:void(0)" className="btn btn-theme submit-btn" onClick={this._onSubmitProfile} >Submit</a>
                </div>
              </FormGroup>
            </div>
          </Container>
        </section>

        
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

        { updateSkillsSuccess &&
          <SweetAlert
            success
            title="Woot!"
            onConfirm={this.hideAlert}
          >
            Skills has been updated
        </SweetAlert>
        }
        {
          !!updateSkillsError === true && 
          <SweetAlert
            danger
            title="Error"
            onConfirm={this.hideAlert}
          >
            {updateSkillsError}
        </SweetAlert>
        }
        { isLoading &&
          <Loader isLoading={isLoading} />
        }

      </div>
    )
  }
}

const mapStateToProps = ({ router, skills, inviteTeam, profile, profileSettings }) => ({
  router, 
  skills,
  inviteTeam,
  profile,
  profileSettings
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
      _get_user_skills    : get_user_skills,
      _edit_user_skills   : edit_user_skills,
      _set_user_skills    : set_user_skills
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSettings)
