import React from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col, Row, Button, Alert } from 'reactstrap'

export const EditTeamModal = ({
  isModalShow,
  team,
  showError,
  loading,
  _toggle,
  _editTeam,
  _cancelTeam,
  _onChange,
  error
}) => (
  <Modal 
    className={'modal-dialog-centered modal-edit-team-member'} 
    modalClassName={'modal-theme tzs-modal'} 
    
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>Edit team</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={showError}>
        { error != '' ? error : 'Something went wrong.' }
      </Alert>
      <Form className="modal-theme-form edit-team-form">
        <div className="edit-team">
            <FormGroup>
                <Label for="teamName">Team name</Label>
                <Input type="text" name="teamname" id="teamName" value={team.team_name} placeholder="team name" onChange={(e) => _onChange(e, team, "team_name")}/>
            </FormGroup>
            <FormGroup>
                <Label for="teamDes">Description</Label>
                <Input type="text" name="teamdes" id="teamDes" value={team.team_des} placeholder="team description" onChange={(e) => _onChange(e, team, "team_des")}/>
            </FormGroup>
        </div>
    
        <div className="form-actions d-flex justify-content-around">
          <Button className="btn-cancel" data-dismiss="modal" disabled={loading} onClick={_cancelTeam} >Cancel</Button>
          <Button className="btn-theme" data-dismiss="modal" disabled={loading} onClick={_editTeam} >Save</Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
)
