import React from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col, Row, Button, Alert } from 'reactstrap'


const InviteUser = ({user, index, _onChange}) => (
  <Row key={`inviteUser-${index}`}>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Email Address*</Label>
        <Input type="email" placeholder="name@domain.com" value={user.email} valid={user.error.email!=null && !user.error.email} invalid={user.error.email!=null && user.error.email} onChange={(e) => _onChange(e, user, index, "email")} />
      </FormGroup>
    </Col>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Name</Label>
        <Input type="text" placeholder="First Name Last Name (Optional)" value={user.name} onChange={(e) => _onChange(e, user, index, "name")} />
      </FormGroup>
    </Col>
  </Row>
)

export const InviteTeamModal = ({
  isModalShow,
  invites,
  showError,
  loading,
  _toggle,
  _add_member,
  _onChange,
  _sendInvites
}) => (
  <Modal 
    className={'modal-dialog-centered modal-team-member'} 
    modalClassName={'modal-theme tzs-modal'} 
    
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>Invite Team Members</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={showError}>
          Something went wrong.
      </Alert>
      <Form className="modal-theme-form">
        <div className="invite-team-member">
          {
            invites.map((user, index) => <InviteUser key={`invite-${index}`} user={user} index={index} _onChange={_onChange} /> )
          }
        </div>
        <div className="add-member-group">
          <a href="javascript:void(0)" className="btn" onClick={_add_member}>+ Add another</a>
          <a href="javascript:void(0)" className="btn">Invite more people at once</a>					
        </div>
        <div className="form-actions">
          <Button className="btn-theme btn-block" data-dismiss="modal" disabled={loading} onClick={_sendInvites} >Send Invitation</Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
)
