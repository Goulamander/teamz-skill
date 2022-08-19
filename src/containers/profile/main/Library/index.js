import React from 'react'
import { Col } from 'reactstrap'

import MainSection from './Main'

export const RightSection = () => {

  return (
    <Col xl="8" lg="8" md="7" className="col-xxl-8">
      <div className="content-right">
        <MainSection />  
      </div>
    </Col>
  )
}

export default RightSection