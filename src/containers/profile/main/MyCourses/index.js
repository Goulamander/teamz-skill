import React, { Component } from 'react'
import { Col } from 'reactstrap'

import Achievements from './Achievements'
import Courses from './Courses'
import RecommendCourses from './RecommendCourses'
import CustomCourses from './CustomCourses'

export default class MyCourses extends Component {
  render() {
    return (
      <Col xl="8" lg="8" md="7" className="col-xxl-8">
        <div className="content-right">
          <h3 className="main-head">My Courses</h3>
          <Achievements />
          <Courses />
          <CustomCourses />
          <RecommendCourses />
        </div>
      </Col>
    )
  }
}