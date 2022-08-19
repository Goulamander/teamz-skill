import React, { useState, useEffect, useRef } from 'react'
import { Col, Row } from 'reactstrap'
import LeftPartContent from './leftPartContent'

export const LeftPart = () => {

    return (
      <Col xl="4" lg="4" md="4" className="pl-0 pr-1 pb-2 col-xxl-4">
        <div className="team-left-bar">
          <LeftPartContent />
        </div>
      </Col>
    )
}