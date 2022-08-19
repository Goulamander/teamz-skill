import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap'
import classnames from 'classnames'
import SweetAlert from 'react-bootstrap-sweetalert';

import { ROUTES } from '../../../constants/routeConstants'
import CustomActionBox from '../../../component/CustomActionBox'
import { ConfirmationBox } from '../../../component/ConfirmationBox'
import { nestedTeamOptions, nestedTeamICOptions } from '../../../constants/appConstants'
import { AddTeamModal } from '../addTeamModal'
import { EditTeamModal } from '../editTeamModal'
import {
  list_teams,
  add_team,
  update_team,
  remove_team,
  insert_teams
} from '../../../actions/add_team'
import {
  get_teams_listing,
  delete_team,
  edit_team,
  set_selected_team
} from '../../../actions/team'
import Can from '../../../component/Can'
import { validateEmail, getUserRoleName, validateName } from '../../../transforms'
const routeResource = "COMPONENT"
 
const LeftPartContent = (props) => {
  const history = useHistory();
  let { addTeam, teamDetails, _get_teams_listing } = props
  let activeRoute = props.router.location.pathname

  const [modalShow, setModalShow] = useState(false)
  // const [manageTeam, setManageTeam] = useState(false)
  // const [addToTeam, setAddToTeam] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [openConfirmationBox, setOpenConfirmationBox] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [team, setTeam] = useState({team_name:'', team_id:null, team_des: ''})
  const [teams, setTeams] = useState([])
  const [notAllowedToDelete, setNotAllowedToDelete] = useState(false);

  useEffect(() => {
    if(modalShow === true) {
      props._get_teams_listing()
    }
    setModalShow(false)
    history.push(ROUTES.MY_TEAM)
  }, [addTeam.success])

  useEffect(() => {
    if(openConfirmationBox === true) {
      props._get_teams_listing()
      props._set_selected_team(null)
      // if(addToTeam === true || manageTeam === true) {
      //   setAddToTeam(false)
      //   setManageTeam(false)
      // }
    }
    setOpenConfirmationBox(false)
    history.push(ROUTES.MY_TEAM)
  }, [teamDetails.isDeleted])

  useEffect(() => {
    if(isShowEditModal === true) {
      props._get_teams_listing()
    }
    setIsShowEditModal(false)
  }, [teamDetails.isEdited])

  useEffect(() => {
    props._get_teams_listing()
  }, [])

  useEffect(() => {
    if(teamDetails.teamsData.length > 0) {
      setTeams(teamDetails.teamsData)
      if(selectedTeam != null && props.selectedTeam != null) {
        setSelectedTeam(selectedTeam)
      } else {
        setSelectedTeam(teamDetails.teamsData[0])
      }
    } else {
      setTeams([])
      setSelectedTeam(null)
    }
  }, [props.teamDetails.teamsData, props.selectedTeam])

  useEffect(() => {
    props._set_selected_team(selectedTeam);
  }, [selectedTeam])

  const addTeams = (e) => {
    e.preventDefault();

    // check validation error
    if(validateAddteamForm())
      props._insert_teams();
  }

  const editTeam = (e) => {
    e.preventDefault();
    props._edit_team(team);
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

  const toggleEditTeamModal = () => {
    if(isShowEditModal === false) {
      setIsShowEditModal(true)
    } else {
      setIsShowEditModal(false)
    }
  }

  const cancelTeam = () => {
    setIsShowEditModal(false)
  }

  const onSelectTeam = (teamId, team) => {
    setSelectedTeam(team)
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

  const update_team = (e, user, index, inputType) => {
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

  const edit_team = (e, team, inputType) => {
    let input = e.target.value;
    if(inputType === 'team_des') {
      let newTeamData = {
        team_id: team.team_id,
        team_name: team.team_name,
        team_des: input
      }
      setTeam(newTeamData)
    } else if(inputType === 'team_name'){
      let newTeamData = {
        team_id: team.team_id,
        team_name: input,
        team_des: team.team_des
      }
      setTeam(newTeamData)
    }
  }

  const handleDraftActions = (key, team, id) => {
    if (key === "editTeam") {
      setIsShowEditModal(true)
      setTeam(team)
    } else if (key === "deleteTeam") {
      if(team.is_course_assigned) {
        setNotAllowedToDelete(true)
      } else {
        setOpenConfirmationBox(true)
        setTeam(team)
      }
    } else if (key === "manageTeam") {
      manageTeamSelect();
    } else if (key === "addToTeam") {
      addToTeamSelect();
    } else {

    }
  }

  const manageTeamSelect = () => {
    // setManageTeam(true);
    // setAddToTeam(false);
    history.push(ROUTES.MY_TEAM)
  }

  const addToTeamSelect = () => {
    // setAddToTeam(true)
    // setManageTeam(false)
    history.push(ROUTES.ADD_TO_TEAM)
  }

  const closeConfBox = () => {
    setOpenConfirmationBox(false)
  }

  const onECDeleteHandler = () => {
    props._delete_team(team)
  }

  const hideAlert = () => {
    setNotAllowedToDelete(false);
  }

  return(
    <div className="team-left-bar-content">
      <h3>My Teams</h3>
      <div className="team-content">
        <Row className="team-listing mt-2">
          <Col xl="12">
            <div className="team-listing-content">
              {
                teams.length <= 0 && 
                <div className="no-teams">No teams yet</div>
              }
              { teams.length > 0 &&
                teams.map((team, index) => {
                  return (
                    <div key={index} className={classnames({'team-list d-flex align-items-center mb-2 pt-1 pb-1':true, 'selected': team.team_id === selectedTeam.team_id})} onClick={() => onSelectTeam(team.team_id, team)}>
                      <div className="initial-letter mr-3 text-center" style={{backgroundColor : team.color}}>{team.initial_letter}</div>
                      <div className="team-name">{team.team_name}</div>
                      <div className="ml-auto action-bottom-dots mr-3">
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"TEAM:EDIT/DELETE"}
                          yes={(attr) => (
                            getUserRoleName() === 'MANAGER' ?
                            team.team_owner ?
                            <CustomActionBox listData={nestedTeamOptions} handleClick={(key) => handleDraftActions(key, team, index)}/> : null : <CustomActionBox listData={nestedTeamOptions} handleClick={(key) => handleDraftActions(key, team, index)}/>
                          )}
                          no={() => (
                            null
                          )}
                        />
                      </div>
                    </div>  
                  )
                })
              }
            </div>
            {/* {
              manageTeam ? <Redirect to={ROUTES.MY_TEAM} /> : ''
            }
            {
              addToTeam ? <Redirect to={ROUTES.ADD_TO_TEAM} /> : ''
            } */}
          </Col>
        </Row>
        <Can
          role={getUserRoleName()}
          resource={routeResource}
          action={"TEAM:ADD-TEAM"}
          yes={(attr) => (
            <Row className="add-team mt-2 p-2"  onClick={toggleAddTeamModal}>
              <Col xl="12">
                <span>+ Add a team</span>
              </Col>
            </Row>
          )}
          no={() => (
            null
          )}
        />

        <AddTeamModal 
          isModalShow={modalShow}
          teams={addTeam.teams}
          showError={addTeam.error}
          _errMsg={addTeam.errMsg}
          loading={addTeam.sending}
          _toggle={toggleAddTeamModal}
          _add_team={add_team}
          _onChange={update_team}
          _addTeams={addTeams}
        />

        <EditTeamModal 
          isModalShow={isShowEditModal}
          team={team}
          showError={teamDetails.isEditError != null ? true : false}  
          error={teamDetails.isEditError != null ? teamDetails.isEditError : ''}
          loading={teamDetails.isEditLoading}
          _toggle={toggleEditTeamModal}
          _editTeam={editTeam}
          _onChange={edit_team}
          _cancelTeam={cancelTeam}
        />

        <ConfirmationBox 
          title="Delete the team?"
          bodyText="No courses have been assigned to this team, you are allowed to delete this team."
          isOpen={openConfirmationBox}
          _toggle={closeConfBox}
          _confirmed={onECDeleteHandler}
        />

        { notAllowedToDelete &&
          <SweetAlert
          info
          title="Error"
          onConfirm={hideAlert}
          >You can't delete this team - courses are in-progress</SweetAlert>
        }

      </div>  
    </div>
  );
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
      _edit_team             :  edit_team,
      _delete_team           :  delete_team,
      _set_selected_team     :  set_selected_team
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPartContent)