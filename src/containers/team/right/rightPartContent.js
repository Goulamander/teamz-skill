import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col, Button, Nav, NavItem, NavLink } from 'reactstrap'
import { Link } from 'react-router-dom';

import createTeam from '../../../assets/img/create_team.jpg'
import addMembers from '../../../assets/img/Add_members.png'
import existingTeam from '../../../assets/img/existing_team.png'
import { AddTeamModal } from '../addTeamModal'
import {
    list_teams,
    add_team,
    update_team,
    remove_team,
    insert_teams
  } from '../../../actions/add_team'
  import {
    get_teams_listing,
    get_team_members,
    delete_team_member
  } from '../../../actions/team'
import { validateEmail , validateName, getUserRoleName } from '../../../transforms'
import { ROUTES } from '../../../constants/routeConstants';
import TeamMembers from './teamMembers'
import TeamSettings from './teamSettings'
import { ConfirmationBox } from '../../../component/ConfirmationBox'
import Can from '../../../component/Can'
const routeResource = "COMPONENT"

const RightPartContent = (props) => {
    let { addTeam, teamDetails } = props;
    const [modalShow, setModalShow] = useState(false)
    const [activeTopNav, setActiveTopNav] = useState('members')
    const [teamMembers, setTeamMembers] = useState([])
    const [teamMembersLengthCheck, setTeamMembersLengthCheck] = useState([])
    const [openConfirmationBox, setOpenConfirmationBox] = useState(false)
    const [deleteMemberId, setDeleteMemberId] = useState(null)

    useEffect(() => {
        if(modalShow === true) {
            props._get_teams_listing()
        }
        setModalShow(false)
    }, [addTeam.success])

    useEffect(() => {
        if(teamDetails.selectedTeam != null) {
            let { team_id } = teamDetails.selectedTeam ;
            props._get_team_members(team_id)
        }
    }, [teamDetails.selectedTeam])

    useEffect(() => {
        if(teamDetails.teamsData.length > 0) {
            setTeamMembers(teamDetails.teamMembers)
            setTeamMembersLengthCheck(teamDetails.teamMembers)
        } else {
            setTeamMembers([])
            setTeamMembersLengthCheck([])
        }
    }, [teamDetails.teamMembers, teamDetails.teamsData])

    useEffect(() => {
        if(openConfirmationBox === true) {
            if(teamDetails.selectedTeam != null) {
                let { team_id } = teamDetails.selectedTeam ;
                props._get_team_members(team_id)
            }
        }
        setOpenConfirmationBox(false)
    }, [teamDetails.isTeamMembersDeleted])

    const addTeams = (e) => {
        e.preventDefault();

        // check validation error
        if(validateAddteamForm())
            props._insert_teams();
    }

    const handleMemberSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value
  
        if(!!searchTxt === false) {
          if(teamDetails.teamMembers.length > 0) {
            setTeamMembers(teamDetails.teamMembers)
          } else {
            setTeamMembers([])
          }
          return false
        }
  
        let filteredMember = teamDetails.teamMembers.filter(member => member.user_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1)
  
        if(filteredMember.length > 0) {
          setTeamMembers(filteredMember)
        } else {
          setTeamMembers([])
        }
    }
    
    const validateAddteamForm = () => {
        let { teams } = props.addTeam
        let isValid = true
        teams.forEach((user) => {
            if(user.error.name)
            isValid=false
        })
        return isValid
    }
    
    const toggleAddTeamModal = () => {
        if(modalShow === false) {
            setModalShow(true)
        } else {
            setModalShow(false)
        }
    }

    const add_team = () => {
        let user = {
          team_name:'',
          team_des: '',
          error: {
            team_name: null,
            team_des: null
          }
        }
        props._add_team(user)
    }
    
    const edit_team = (e, user, index, inputType) => {
        let input = e.target.value;
        user[inputType] = input
        if(inputType === 'team_des') {
            // Validate email address
            user.error[inputType] = (input.length === 0)? null : !validateEmail(input) 
        } else if(inputType === 'team_name'){
            user.error[inputType] = !validateName(input)
        }
        props._update_team(index, user)
    }
    
    const selectTopNav = (navMenu) => {
        setActiveTopNav(navMenu);
    }

    const deleteMember = (row) => {
        setOpenConfirmationBox(true)
        setDeleteMemberId(row.original.user_id)
    }

    const closeConfBox = () => {
        setOpenConfirmationBox(false)
        setDeleteMemberId(null)
    }
    
    const onECDeleteHandler = () => {
        let { selectedTeam } = teamDetails;
        props._delete_team_member(deleteMemberId, selectedTeam.team_id)
    }

    return (
        <div className=" page-admin team-right-wrapper">
            { teamDetails.selectedTeam !== null ?
                <div className="">
                    {
                        teamMembersLengthCheck.length === 0 ? 
                        <NoTeamMembers /> :
                        <Fragment>
                            <NavBar activeTopNav={activeTopNav} _selectTopNav={selectTopNav} />
                        
                            { activeTopNav === 'members' &&
                                <TeamMembers _members= {teamMembers} _handleMemberSearch={handleMemberSearch} deleteMember={deleteMember} selectedTeam = {teamDetails.selectedTeam} />
                            }
                            { activeTopNav === 'settings' &&
                                <TeamSettings />
                            }
                        </Fragment>
                    }
                </div> : 
                <NoTeam _toggleAddTeamModal={toggleAddTeamModal}/>
            }    

            <AddTeamModal 
                isModalShow={modalShow}
                teams={addTeam.teams}
                showError={addTeam.error}  
                loading={addTeam.sending}
                _toggle={toggleAddTeamModal}
                _add_team={add_team}
                _onChange={edit_team}
                _addTeams={addTeams}
            />  
            <ConfirmationBox 
                title="Confirmation!"
                bodyText="You want to delete this member from team. Are you sure?"
                isOpen={openConfirmationBox}
                _toggle={closeConfBox}
                _confirmed={onECDeleteHandler}
            /> 
        </div>    
    )
}

const NoTeam = ({_toggleAddTeamModal}) => {
    return (
        <Col lg={3} md={12} className={'mt-2 p-0'}>
            <div className="card team-right">        
                <div className="img-box"> 
                <div className="card-img-background team-image" style={{backgroundImage: `url(${createTeam})`}}></div>
                </div>
                {/* <div className="card-body p-0 pt-2 mt-4 mb-2 text-center">
                    <Button className={'btn-theme team-btn'} onClick={_toggleAddTeamModal}>Create a team</Button>
                </div> */}
                <Can
                    role={getUserRoleName()}
                    resource={routeResource}
                    action={"TEAM:ADD-TEAM"}
                    yes={(attr) => (
                        <div className="card-body p-0 pt-2 mt-4 mb-2 text-center">
                            <Button className={'btn-theme team-btn'} onClick={_toggleAddTeamModal}>Create a team</Button>
                        </div>
                    )}
                    no={() => (
                        null
                    )}
                />
            </div>
        </Col>
    )
}

const NoTeamMembers = ({}) => {
    return (
        <Fragment>
            <div className="welcome-text">
                <div className="text">Welcome to the team!</div>
                <div className="description">Here are some things to do next...</div>
            </div>
            <Row className="m-0">
                <Col lg={3} md={12} className={'mt-2 p-0'}>
                    <div className="card team-right mt-4">        
                        <div className="img-box">
                            <div className="card-img-background team-image" style={{backgroundImage: `url(${existingTeam})`}}></div>
                            {/* <img src={existingTeam} /> */}
                        </div>
                        <div className="card-body p-0 pt-2 mt-4 mb-2 text-center">
                            <Link to={ROUTES.ADD_TO_TEAM}><Button className={'btn-theme team-btn'} >Add from your org</Button></Link>
                        </div>
                    </div>
                </Col>
                <Col lg={3} md={12} className={'mt-2 ml-3 p-0'}>
                    <div className="card team-right mt-4">        
                        <div className="img-box">
                            <div className="card-img-background team-image" style={{backgroundImage: `url(${addMembers})`}}></div>
                            {/* <img src={addMembers} /> */}
                        </div>
                        <div className="card-body p-0 pt-2 mt-4 mb-2 text-center">
                            <Link to={ROUTES.MY_TEAM}><Button className={'btn-theme team-btn'}>Add members from outside your org</Button></Link>
                        </div>
                    </div>
                </Col>
            </Row> 
        </Fragment>
    )
}

const NavBar = ({
    activeTopNav,
    _selectTopNav
  }) => {
    return (
      <Row className="mt-2 ml-0 mr-0">
        <Col sm={12} className="p-0">
          <div className="tab-bar-team" style={{background: '#ffffff'}}>
            <Nav tabs className="top-nav">
              <NavItem className={activeTopNav === "members" ? "active" : ""} onClick={ () => _selectTopNav('members')}>
                <NavLink href="javascript:void(0)" className="">Members</NavLink>
              </NavItem>
              <NavItem className={activeTopNav === "settings" ? "active" : ""} onClick={ () => _selectTopNav('settings')}>
                <NavLink href="javascript:void(0)" className="">Setting</NavLink>
              </NavItem>
            </Nav>
          </div> 
        </Col>
      </Row>
    )
  }

const mapStateToProps = ( state ) => ({
    router: state.router,
    addTeam: state.addTeam,
    teamDetails: state.team
})
  
const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
        _add_team              :  add_team,
        _update_team           :  update_team,
        _remove_team           :  remove_team,
        _insert_teams          :  insert_teams,
        _get_teams_listing     :  get_teams_listing,
        _get_team_members      :  get_team_members,
        _delete_team_member    :  delete_team_member
    },
    dispatch
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightPartContent)