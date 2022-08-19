import React from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col, Row, Button, Alert } from 'reactstrap'


const AddTeam = ({user, index, _onChange}) => (
  <Row key={`inviteUser-${index}`}>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Team name*</Label>
        <Input type="text" placeholder="Team name" value={user.team_name} valid={user.error.team_name!=null && !user.error.team_name} invalid={user.error.team_name!=null && user.error.team_name} onChange={(e) => _onChange(e, user, index, "team_name")} />
      </FormGroup>
    </Col>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Description</Label>
        <Input type="text" placeholder="What is this team about (Optional)" value={user.team_des} onChange={(e) => _onChange(e, user, index, "team_des")} />
      </FormGroup>
    </Col>
  </Row>
)

export const AddTeamModal = ({
  isModalShow,
  teams,
  showError,
  loading,
  _toggle,
  _add_team,
  _onChange,
  _addTeams,
  _errMsg,
}) => (
  <Modal 
    className={'modal-dialog-centered modal-team-member'} 
    modalClassName={'modal-theme tzs-modal'} 
    
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>Add details about your team</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={showError}>
        {_errMsg != null ? _errMsg : 'Something went wrong.'}
      </Alert>
      <Form className="modal-theme-form">
        <div className="invite-team-member">
          {
            teams.map((team, index) => <AddTeam key={`invite-${index}`} user={team} index={index} _onChange={_onChange} /> )
          }
        </div>
        <div className="add-member-group">
          <a href="javascript:void(0)" className="btn text-left" onClick={_add_team}>+ Add another</a>				
        </div>
        <div className="form-actions">
          <Button className="btn-theme btn-block" data-dismiss="modal" disabled={loading} onClick={_addTeams} >Create team</Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
)
