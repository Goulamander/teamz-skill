import React from 'react'
import { Col } from 'reactstrap'

import WeeklyUpdates from '../WeeklyUpdates'
import WorkHighlights from '../WorkHighlights'
import UpEvents from '../UpEvents'

export const MyProfile = () => {

  return (
    <Col xl="8" lg="8" md="7" className="col-xxl-8">
      <div className="content-right">
        
        <h3 className="main-head">My Profile</h3>
        <WeeklyUpdates />
        <WorkHighlights />
        <UpEvents />
      </div>
    </Col>
  )
}