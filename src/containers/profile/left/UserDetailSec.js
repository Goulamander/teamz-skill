import React from 'react'
import Avatar from 'react-avatar-edit'
import { Col, Input, Label, Form, FormGroup } from 'reactstrap'
import editIcon from '../../../assets/img/user-edit.png'
import defaultPP from '../../../assets/img/profile_default.png'
import { appConstant } from '../../../constants/appConstants';

const ProfilePhoto = ({userData, _onFileLoad, _onCrop, _onBeforeFileLoad}) => {
  return (
    <div className={'avtar-container'}>
      <Avatar
        width={180}
        height={180}
        onCrop={_onCrop}
        // onClose={this.onClose}
        onBeforeFileLoad={_onBeforeFileLoad}
        onFileLoad={_onFileLoad}
        // src={userData.profile_pic}
      />
    </div>
  )
}


export const UserDetailSec = ({
  user,
  isEditMode,
  _handleEdit,
  _onChange,
  _onUserSave,
  _onFileLoad,
  _onCrop,
  _onBeforeFileLoad
}) => {
  let userData = user.data
  if(isEditMode) {
    return (
      <Form className="prof-info text-center">
        <span className="cancel-icon tzs-link" onClick={() => _handleEdit("USER_PROFILE")}>Cancel</span>
        <ProfilePhoto userData={userData} _onFileLoad={_onFileLoad} _onCrop={_onCrop} _onBeforeFileLoad={_onBeforeFileLoad} />
        <span className="edit-icon tzs-link active" onClick={() => _onUserSave()}>Save</span>
        <Col md="12" className="text-left">
          {/* <Form> */}

            <FormGroup >
              <Label for="firstname">Camera: </Label>
              <Input id="firstname" type="file" accept="video/*" capture />
            </FormGroup>
            <FormGroup >
              <Label for="firstname">First Name: </Label>
              <Input id="firstname" type="text" placeholder="First Name" onChange={(e) => _onChange(e, 'first_name')} value={userData.first_name} invalid={user.formError.first_name} />
            </FormGroup>
            <FormGroup >
              <Label for="lastname">Last Name: </Label>
              <Input id="lastname" type="text" placeholder="Last Name" onChange={(e) => _onChange(e, 'last_name')} value={userData.last_name} invalid={user.formError.last_name} />
            </FormGroup>
            <FormGroup>
              <Label for="jobTitle">Job title: </Label>
              <Input id="jobTitle" type="text" placeholder="Job title"  value={userData.job_title} onChange={(e) => _onChange(e, 'job_title')} invalid={user.formError.job_title} />
            </FormGroup>
            <FormGroup>
              <Label for="jobLevel">Job level: </Label>
              <Input id="jobLevel" type="text" placeholder="Job level"  value={userData.job_level} onChange={(e) => _onChange(e, 'job_level')} invalid={user.formError.job_level} />
            </FormGroup>
            <FormGroup>
              <Label for="jobMotto">My Motto: </Label>
              <Input id="jobMotto" type="textarea" placeholder="Motto"  value={userData.motto} onChange={(e) => _onChange(e, 'motto')} invalid={user.formError.motto} />
            </FormGroup>
          {/* </Form> */}
        </Col>
        <hr />
      </Form>
    )
  } else {
    let profileImg = '';
    if(userData.image) {
      profileImg = appConstant.BASE_URL + userData.image.replace('dist', '')
    } else if(userData.profile_pic) {
      profileImg = userData.profile_pic
    } else {
      profileImg = defaultPP
    }

    return (
      <div className="prof-info text-center">
        <img className="profile-img" src={profileImg} alt={userData.first_name} />
        <span className="edit-icon" onClick={() => _handleEdit("USER_PROFILE")}><img className="pro-edit" src={editIcon} alt="..." /></span>
        <h4>{`${userData.first_name} ${userData.last_name}`}</h4>
        <p className="desg">{userData.job_title}</p>
        <span className="level6-badge">{userData.job_level}</span>
    
        <h5>My Motto</h5>
        <p className="prof-bio">{userData.motto}</p>
        <hr />
      </div>
    )
  }
}
