import React from 'react'
import { Col } from 'reactstrap'
import LeftContent from './leftContent'

export const LeftSection = () => {

  return (
    <Col xl="4" lg="4" md="4" className="pl-0 col-xxl-4">
      <div className="content-left company-settings-left-bar">
        <LeftContent />
      </div>
    </Col>
  )
}