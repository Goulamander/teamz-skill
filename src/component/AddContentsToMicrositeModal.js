import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, FormGroup, Alert, Tag } from 'reactstrap';

import { appConstant } from '../constants/appConstants';

export const AddContentToMicrositeModal = ({
    isModalShow,
    _toggle,
    currentContentToAddMicrosite,
    _userMicrositesData,
    _isAddMicrsositeError,
    _addMicrositeError,
    _add_content_to_microsite
  }) => {
    
    const [userMicrosite, setUserMicrosite] = useState([]);
    const [_userMicrosites, set_UserMicrosite] = useState([]);
    const [micrositeToAdd, setMicrositeToAdd] = useState({});
  
    useEffect(() => {
      if(_userMicrositesData.length > 0) {
        let unSharedMicrosites = _userMicrositesData.filter(data => !data.is_shared);
        set_UserMicrosite(unSharedMicrosites); 
        setUserMicrosite(unSharedMicrosites)
      } else {
        setUserMicrosite([])
      }
    }, [_userMicrositesData])
    
    const handleMicrositeSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value
  
      if(!!searchTxt === false) {
        if(_userMicrosites.length > 0) {
          setUserMicrosite(_userMicrosites)
        } else {
          setUserMicrosite([])
        }
        return false
      }
  
      let filteredMicrosite = _userMicrosites.filter(microsite => {
        if(microsite.title != null)
        return microsite.title.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })
  
      if(filteredMicrosite.length > 0) {
        setUserMicrosite(filteredMicrosite)
      } else {
        setUserMicrosite([])
      }
    }
  
    const handleMicrositeCheck = (e, microsite) => {
      setMicrositeToAdd(microsite);
    }
  
    const sendAddMicrositeContent = () => {
      let json = {
        content_doc_id : currentContentToAddMicrosite.doc_id,
        content_serial_id : currentContentToAddMicrosite.doc_serial_id,
        microsite_id: micrositeToAdd.microsite_id,
        link: micrositeToAdd.link
      }
      _add_content_to_microsite(json, (err, data) => {
        if(err) {
        //   _toggle("error");
        //   setMicrositeToAdd({});
        } else {
          _toggle("callbackCalled", micrositeToAdd.link);
          setMicrositeToAdd({});
        }
      });
    }
  
    const _toggleClick = () => {
      _toggle("noCallbackCalled");
      setMicrositeToAdd({});
    }
    return (
    <Modal 
      className={'modal-dialog-centered modal-team-member'} 
      modalClassName={'modal-theme tzs-modal'} 
      
      isOpen={isModalShow} 
      toggle={_toggle}
    >
      <ModalHeader toggle={_toggleClick}>Add Content to Microsite</ModalHeader>
      <ModalBody>
        <Alert color="danger" isOpen={_isAddMicrsositeError}>
          { _addMicrositeError != null ? _addMicrositeError : 'Something went wrong.' }
        </Alert>
        <Row className="mt-2 mb-2 p-2">
            <Col md={8} sm={12}>
              {/* <Form className="form-inline srch-box ml-0">
                <Input type="search" id="search-add-to-member" placeholder="Find a team" aria-label="Search" className="w-100" onChange={handleTeamSearch} />
              </Form> */}
              <div className="has-search mt-2">
                <Input type="search" className="form-control" placeholder="Find a microsite" onChange={handleMicrositeSearch}  />
                <span className="fa fa-search form-control-feedback"></span>
              </div>
            </Col>    
        </Row>
        <Form className="modal-theme-form">
            <div className="assign-course-team-modal p-3">
                {
                userMicrosite.map((microsite, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="team-list d-flex align-items-center">
                              <input type="checkbox" checked={microsite && microsite.microsite_id === micrositeToAdd.microsite_id} id={index} onChange={(e) => handleMicrositeCheck(e, microsite)} />
                              <img src={`${appConstant.BASE_URL + microsite.background_img.replace("dist", "")}`} className="ml-4 rounded mr-3 text-center" style={{width:"70px", height:"40px"}} />
                              <div className="team-name">{microsite.title}</div>
                            </div>
                            {/* <div className="divider"></div> */}
                        </Fragment>
                    )
                })
                }
            </div>
            <div className="form-actions d-flex justify-content-around mt-2">
                <Button className="btn-cancel" data-dismiss="modal" onClick={_toggleClick} >Cancel</Button>
                <Button className="btn-theme" data-dismiss="modal" onClick={sendAddMicrositeContent}>Add</Button>
            </div>
        </Form>
      </ModalBody>
    </Modal>
    )
}

export default AddContentToMicrositeModal