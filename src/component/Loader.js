import React from 'react'
// import { Modal } from 'reactstrap'
import loader from '../assets/img/loader.gif'
import Modal from 'react-responsive-modal'

export const Loader = ({
  isLoading
}) => {
  const closeModal = () => {
    return !!isLoading
  }
  return(
  // <Modal isOpen={!!isLoading} fade={false} className={'tsz-loader'}>
  //   <img src={loader} alt="Loading..." />
  // </Modal>
    <Modal open={!!isLoading} center onClose={closeModal} className={'tsz-loader'}>
      <img src={loader} alt="Loading..." />
    </Modal>
)}