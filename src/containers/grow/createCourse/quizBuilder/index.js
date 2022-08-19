import React from 'react'
import { Row, Col } from 'reactstrap'
import classnames from 'classnames'
import SimpleReactValidator from 'simple-react-validator';

import './css/style.scss'

import LeftSide from './LeftSide'
import RightSide from './RightSide'

const QuizBuilder = (props) => {

  const validator = new SimpleReactValidator({messages: {default: "Required field"}});

  return(
    <div className="main-page page-admin quiz-builder">
      <div className={classnames({"tsz-container":true, "preview-mode": props.isPreviewMode})}>
        <Row>
          <Col lg="6" md="12" className={classnames({"d-none": props.isPreviewMode})}>
            <div className="d-block">
              <LeftSide validator={validator} />
            </div>
          </Col>
          <Col lg="6" md="12" className={classnames({"col-lg-12": props.isPreviewMode})}>
            <div className="d-none d-md-block">
              <RightSide validator={validator} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default QuizBuilder