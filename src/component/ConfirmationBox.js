import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
export const ConfirmationBox = ({
  title,
  bodyText,
  isOpen,
  _toggle,
  _confirmed
}) => { 

  return (
    <Modal isOpen={isOpen} toggle={_toggle}>
      <ModalHeader toggle={_toggle}>{title}</ModalHeader>
      <ModalBody>
        {bodyText}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={_confirmed}>Yes</Button>{' '}
        <Button color="secondary" onClick={_toggle}>No</Button>
      </ModalFooter>
    </Modal>
  )
}