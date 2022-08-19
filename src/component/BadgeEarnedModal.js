import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
export const BadgeEarnedModal = ({
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
        <Button color="primary" className="badge-buttbon-color" onClick={_confirmed}>Check your badge</Button>
      </ModalFooter>
    </Modal>
  )
}