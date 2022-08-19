import React from 'react'
import { Container, FormGroup, Label, Input, Col, Row, ListGroup, Table } from 'reactstrap'

import DateInput from '../../component/DateInput'
import { skillsConstant, usersRoleTypes, userRoles, UserRolesTypeMap } from '../../constants/appConstants'
import { getUserRole } from '../../transforms'
import SweetAlert from 'react-bootstrap-sweetalert';

export const ProfileForm = ({
  profile,
  skills,
  selectedFuncSkill,
  isRolesInputOpen,
  _onChange,
  _onCancelForm,
  _onSubmitProfile,
  _onFunctionalSkillSelect,
  _toggleInput,
  _changeAssignedRole,
  checkValidationSubmit,
  hideAlert
}) => { 
  let profileData = profile.data
  let mgtSkillsData = skills.data[0]
  let peopleSkillsData = skills.data[1]
  let funcSkillsData = skills.data[2]
  let otherSkillsData = skills.data[3]
  let roleId = userRoles.indexOf(profileData.user_role)+1
  let roleValueArr = usersRoleTypes.filter(obj => obj.id == roleId)
  let roleValue = roleValueArr.length > 0? roleValueArr[0].role : usersRoleTypes[0].role
  let currentRole = getUserRole()

  return(
    <div className="onbaording-form">
      <Container>
        <div className="onbaording-title">Tell us a bit about you and your interests</div>				
        <div className="modal-form">
          <Row>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>First Name (Required)</Label>
                <Input type="text" placeholder="First Name" value={profileData.firstname}  onChange={(e) => _onChange(e, "firstname")} invalid={profileData.error.firstname} />
              </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>Last Name (Required)</Label>
                <Input type="text" placeholder="Last Name" value={profileData.lastname}  onChange={(e) => _onChange(e, "lastname")} invalid={profileData.error.lastname} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>ZipCode (Required)</Label>
                <Input type="text" placeholder="Zipcode" value={profileData.zipcode}  onChange={(e) => _onChange(e, "zipcode")} invalid={profileData.error.zipcode} />
              </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>Birthday (Optional)</Label>
                <DateInput _onChange={_onChange}/>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>Job Title (Required)</Label>
                <Input type="text" placeholder="Senior SW Development Manager" value={profileData.job_title} onChange={(e) => _onChange(e, "job_title")} invalid={profileData.error.job_title} />
              </FormGroup>
            </Col>
            <Col xl="6" lg="6" md="6" sm="12">
              <FormGroup>
                <Label>Job Level (Optional)</Label>
                <Input type="text" placeholder="Senior Manger Level 6" value={profileData.job_level} onChange={(e) => _onChange(e, "job_level")} />
              </FormGroup>
            </Col>
          </Row>
            {/* <Row>
              <Col lg="8">
                <FormGroup className={isRolesInputOpen? 'user-roles admin-feedback-group show' : 'user-roles admin-feedback-group'}>
                  <Label>Pick your role (Required)</Label>
                  <Input id="userRole" placeholder="Select role" name="user_role" type="text" value={roleValue} disabled />
                  <a href="javascript:void(0)"className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={_toggleInput}></a>
                  <ul className="feedback-list animated fadeInUp" id="sizelist">
                      {
                      usersRoleTypes.filter(role => {return role.type === UserRolesTypeMap[userRoles.indexOf(currentRole)] }).map((obj, i) => (
                          <li key={`role-${i}`} className="dropdown-item" >
                          <a href="javascript:void(0)" onClick={() => _changeAssignedRole(obj)}>{obj.role}</a>
                          </li>    
                      ))
                      }
                  </ul>
                </FormGroup>
              </Col>
            </Row> */}
          <FormGroup>
            <Label>Motto you live by</Label>
            <Input type="textarea" placeholder="“The quickest methods aren’t always the fastest methods.” - Annonymous" value={profileData.motto} onChange={(e) => _onChange(e, "motto")} />
          </FormGroup>
          <FormGroup>
						<Label>Which skills are you interested to master? (Check all that applies to you - required to select at least one)
            {profileData.error.skills &&
              <span className="text-danger">Please select at least one skill from the list below.</span>
            }
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
                                <Input id={`managementskills-${skill.id}`} className="styled" type="checkbox" onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.checked}, "skills", 'checkbox')} />
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
                                <Input id={`peopleskills-${skill.id}`} className="styled" type="checkbox" onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.checked}, "skills", 'checkbox')} />
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
                                <Input id={`functional${skill.id}`} className="styled" type="radio" name="function-domain-skill" onClick={() => _onFunctionalSkillSelect(skill.id)} />
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
                                            <Input id={`${inputId}1`} className="styled" type="radio" name={skill.name} value={skillsConstant.BEGINNER} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} checked={profileData.skills.some((elem) => elem.skill_id === skill.id && elem.skill_value === skillsConstant.BEGINNER)} />
                                            <Label for={`${inputId}1`} className="arrow-label">&nbsp;</Label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="radio-quote">
                                            <Input id={`${inputId}2`} className="styled" type="radio" name={skill.name} value={skillsConstant.INTERMEDIATE} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} checked={profileData.skills.some((elem) => elem.skill_id === skill.id && elem.skill_value === skillsConstant.INTERMEDIATE)} />
                                            <Label for={`${inputId}2`} className="arrow-label">&nbsp;</Label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="radio-quote">
                                            <Input id={`${inputId}3`} className="styled" type="radio" name={skill.name} value={skillsConstant.ADVANCED} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} checked={profileData.skills.some((elem) => elem.skill_id === skill.id && elem.skill_value === skillsConstant.ADVANCED)} />
                                            <Label for={`${inputId}3`} className="arrow-label">&nbsp;</Label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="radio-quote">
                                            <Input id={`${inputId}4`} className="styled" type="radio" name={skill.name} value={skillsConstant.NOT_MY_THING} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} checked={profileData.skills.some((elem) => elem.skill_id === skill.id && elem.skill_value === skillsConstant.NOT_MY_THING)} />
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
                                    <Input id={`${inputId}1`} className="styled" type="radio" name={skill.name} value={skillsConstant.BEGINNER} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} />
                                    <Label for={`${inputId}1`} className="arrow-label">&nbsp;</Label>
                                  </div>
                                </td>
                                <td>
                                  <div className="radio-quote">
                                    <Input id={`${inputId}2`} className="styled" type="radio" name={skill.name} value={skillsConstant.INTERMEDIATE} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} />
                                    <Label for={`${inputId}2`} className="arrow-label">&nbsp;</Label>
                                  </div>
                                </td>
                                <td>
                                  <div className="radio-quote">
                                    <Input id={`${inputId}3`} className="styled" type="radio" name={skill.name} value={skillsConstant.ADVANCED} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} />
                                    <Label for={`${inputId}3`} className="arrow-label">&nbsp;</Label>
                                  </div>
                                </td>
                                <td>
                                  <div className="radio-quote">
                                    <Input id={`${inputId}4`} className="styled" type="radio" name={skill.name} value={skillsConstant.NOT_MY_THING} onChange={(e) => _onChange({skill_id: skill.id, skill_value: e.target.value}, "skills", 'radio')} />
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
              {/* <button type="button" className="btn btn-gray btn-cancel" onClick={_onCancelForm}>Cancel</button> */}
              <a href="javascript:void(0)" className="btn btn-theme" onClick={_onSubmitProfile} >Submit</a>
            </div>
          </FormGroup>
        </div>
      </Container>
      { checkValidationSubmit &&
        <SweetAlert
        warning
          title=""
          onConfirm={hideAlert}
          >
            Please fill in all the required fields - almost done!
        </SweetAlert>
      }
    </div>  
    
  )
  
}

