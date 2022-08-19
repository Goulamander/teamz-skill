import React from 'react'
import { Col } from 'reactstrap'
import { UserDetailSec } from './UserDetailSec'
import MyCourses from './MyCourses'
import { Recommendations } from './Recommendations'

export const LeftSection = ({
  user,
  myCourses,
  _handleEdit,
  _onUserChange,
  _onUserSave,
  _onFileLoad,
  _onCrop,
  _onBeforeFileLoad
}) => {

  return (
    <Col xl="4" lg="4" md="5" className="pl-0 col-xxl-4">
      <div className="content-left">
        
        <UserDetailSec isEditMode={user.isEditMode} user={user} _handleEdit={_handleEdit} _onChange={_onUserChange} _onUserSave={_onUserSave} _onFileLoad={_onFileLoad} _onCrop={_onCrop} _onBeforeFileLoad={_onBeforeFileLoad} />
        <MyCourses myCourses={myCourses} />
        <Recommendations data={myCourses.userRecommendCourses} />
        
      </div>
    </Col>
  )
}