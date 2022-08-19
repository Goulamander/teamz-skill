import React, {Component} from 'react'
import { Col } from 'reactstrap'
import { UserDetailSec } from './UserDetailSec'
import MyCourses from './MyCourses'
// import { Recommendations } from './Recommendations'

export const LeftSection = ({
        courses,
        profileData
    }) => {
    return (
      <Col xl="4" lg="4" md="5" className="pl-0 col-xxl-4">
        <div className="content-left">
          
          <UserDetailSec profileData={profileData}/>
          <MyCourses courses={courses} profileData={profileData}/>
          {/* <Recommendations data={myCourses.userRecommendCourses} /> */}
          
        </div>
      </Col>
    )
  }

  export default LeftSection;