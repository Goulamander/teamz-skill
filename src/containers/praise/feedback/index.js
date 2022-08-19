import React, { Component, Fragment } from 'react'
import { Link, HashRouter } from 'react-router-dom'
import {  Nav, NavItem, Row, Col, TabContent, TabPane } from 'reactstrap';

import FeedbackRequested from './requested'
import FeedbackForMe from './forMe'

const SUB_ROUTES = {
  FEEDBACK_REQUESTED: 'FEEDBACK_REQUESTED',
  FEEDBACK_FOR_ME: 'FEEDBACK_FOR_ME',
}

const NavBarSecondary = ({
  activeSubNav
}) => {
  return (
    <Row className="mt-4 sub-nav-container feedback">
      <Col sm={12} className="pr-0 pl-0">
        <Nav tabs className="sub-nav">
          <NavItem className={activeSubNav === SUB_ROUTES.FEEDBACK_REQUESTED ? "active" : ""}>
            <HashRouter
              hashType={'noslash'}
            >
              <Link 
                className="nav-link"
                to={SUB_ROUTES.FEEDBACK_REQUESTED}
              >
                Feedback Requested
              </Link>
            </HashRouter>
          </NavItem>
          <NavItem className={activeSubNav === SUB_ROUTES.FEEDBACK_FOR_ME ? "active" : ""}>
            <HashRouter
              hashType={'noslash'}
            >
              <Link 
                className="nav-link"
                to={SUB_ROUTES.FEEDBACK_FOR_ME}
              >
                Feedback For Me
              </Link>
            </HashRouter>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  )
}

class Feedback extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSubNav: SUB_ROUTES.FEEDBACK_REQUESTED
    }

  }

  setHash = (hash) => {
    let activeHash = SUB_ROUTES.FEEDBACK_REQUESTED
    switch(hash) {
      case SUB_ROUTES.FEEDBACK_REQUESTED:
        activeHash = SUB_ROUTES.FEEDBACK_REQUESTED
        break;
      case SUB_ROUTES.FEEDBACK_FOR_ME:
        activeHash = SUB_ROUTES.FEEDBACK_FOR_ME
        break;
      default:
        activeHash = SUB_ROUTES.FEEDBACK_REQUESTED
        window.location.hash = SUB_ROUTES.FEEDBACK_REQUESTED
    }
    this.setState({
      activeSubNav: activeHash
    })
  }

  componentDidMount() {
    const { activeSubNav } = this.state;
    let hash = window.location.hash.replace('#', '')

    if(hash != activeSubNav) {
      this.setHash(hash)
    }
  }

  componentDidUpdate(prevProps) {
    const { activeSubNav } = this.state;
    let hash = window.location.hash.replace('#', '')
    if(hash != activeSubNav) {
      this.setHash(hash)
    }
  }

  render() {
    const { activeSubNav } = this.state;

    return (
      <Fragment>
        <NavBarSecondary 
          activeSubNav={activeSubNav}
        />
        <TabContent id="fdbck" className="page-content" activeTab={this.state.activeSubNav}>

          <TabPane tabId={SUB_ROUTES.FEEDBACK_REQUESTED}> 
            <Row>
              <Col lg={12} className="pl-0 pr-0">
                <FeedbackRequested />
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId={SUB_ROUTES.FEEDBACK_FOR_ME}> 
            <Row>
              <Col lg={12} className="pl-0 pr-0">
                <FeedbackForMe />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Fragment>
    )         
  }
}

export default Feedback