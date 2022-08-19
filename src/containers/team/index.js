import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {  Row, Col } from 'reactstrap';

import { LeftPart } from './left';
import RightPart from './right';

class Team extends Component {
  
  render() {
    return (
      <section className="main-content">
        <div className="tsz-container">
          <Row className="">
            <LeftPart />
            <RightPart />
          </Row>
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state
})

export default connect(
  mapStateToProps,
  null
)(Team)
