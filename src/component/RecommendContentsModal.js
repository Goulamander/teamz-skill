import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, FormGroup, Alert, Tag } from 'reactstrap';

export const RecommendContentsTeamModal = ({
    isModalShow,
    _toggle,
    teams,
    currentContentToRecommendTeam,
    _isTeamRecommendError,
    _teamRecommendError,
    _send_recommended_content_to_team
  }) => {
    
    const [teamList, setTeamList] = useState([]);
    const [teamToRecommend, setTeamToRecommend] = useState([]);
  
    useEffect(() => {
      if(teams.length > 0) {
        setTeamList(teams)
      } else {
        setTeamList([])
      }
    }, [teams])
    
    const handleTeamSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value
  
      if(!!searchTxt === false) {
        if(teams.length > 0) {
          setTeamList(teams)
        } else {
          setTeamList([])
        }
        return false
      }
  
      let filteredTeam = teams.filter(team => {
        if(team.team_name != null)
        return team.team_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })
  
      if(filteredTeam.length > 0) {
        setTeamList(filteredTeam)
      } else {
        setTeamList([])
      }
    }
  
    const handleTeamCheck = (team) => {
      let teamsToAdd = [];
      if(checkTeamExist(teamToRecommend, team.team_id)) {
          teamsToAdd = teamToRecommend.filter(data => {
            return team.team_id != data
          });
          setTeamToRecommend(teamsToAdd);
      } else {
        teamsToAdd = [...teamToRecommend, team.team_id]
        setTeamToRecommend(teamsToAdd);
      }
    }
  
    const checkTeamExist = (teamToRecommend, team_id) => {
      if(teamToRecommend.length) {
        for(let i=0; i<teamToRecommend.length; i++) {
          if(teamToRecommend[i] === team_id) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
  
    const sendTeamAssignee = () => {
      console.log(currentContentToRecommendTeam);
      let json = {
        doc_id : currentContentToRecommendTeam.doc_id,
        doc_serial_id : currentContentToRecommendTeam.doc_serial_id,
        teams: teamToRecommend
      }
      _send_recommended_content_to_team(json, () => {
        _toggle("callbackCalled");
        setTeamToRecommend([]);
      });
    }
  
    const _toggleClick = () => {
      _toggle("noCallbackCalled");
      setTeamToRecommend([]);
    }
    //console.log("assignee.isTeamAssigneeError", _isTeamRecommendError)
    return (
    <Modal 
      className={'modal-dialog-centered modal-team-member'} 
      modalClassName={'modal-theme tzs-modal'} 
      
      isOpen={isModalShow} 
      toggle={_toggle}
    >
      <ModalHeader toggle={_toggleClick}>Recommend Content to Teams</ModalHeader>
      <ModalBody>
        <Alert color="danger" isOpen={_isTeamRecommendError}>
          { _teamRecommendError != null ? _teamRecommendError : 'Something went wrong.' }
        </Alert>
        <Row className="mt-2 mb-2 p-2">
            <Col md={8} sm={12}>
              {/* <Form className="form-inline srch-box ml-0">
                <Input type="search" id="search-add-to-member" placeholder="Find a team" aria-label="Search" className="w-100" onChange={handleTeamSearch} />
              </Form> */}
              <div className="has-search mt-2">
                <Input type="search" className="form-control" placeholder="Find a team" onChange={handleTeamSearch}  />
                <span className="fa fa-search form-control-feedback"></span>
              </div>
            </Col>    
        </Row>
        <Form className="modal-theme-form">
            <div className="assign-course-team-modal p-3">
                {
                teamList.map((team, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="team-list d-flex align-items-center">
                                <input type="checkbox" onChange={() => handleTeamCheck(team)} />
                                <div className="ml-4 initial-letter mr-3 text-center" style={{backgroundColor : team.color}}>{team.initial_letter}</div>
                                <div className="team-name">{team.team_name}</div>
                            </div>
                            {/* <div className="divider"></div> */}
                        </Fragment>
                    )
                })
                }
            </div>
            <div className="form-actions d-flex justify-content-around mt-2">
                <Button className="btn-cancel" data-dismiss="modal" onClick={_toggleClick} >Cancel</Button>
                <Button className="btn-theme" data-dismiss="modal" onClick={sendTeamAssignee}>Recommend</Button>
            </div>
        </Form>
      </ModalBody>
    </Modal>
    )
}

export default RecommendContentsTeamModal