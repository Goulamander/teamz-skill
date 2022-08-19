import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Nav, NavItem, Row, Col } from 'reactstrap';

import Feedback from './feedback'
import FeedbackDetails from './feedback/feedbackDetails'
import { ROUTES } from '../../constants/routeConstants';

const Heading = () => (
  <Row>
    <Col className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
      <div className="section-title">Praise</div>
    </Col>
  </Row>
)

const NavBar = ({
  activeTopNav
}) => {
  return (
    <Row className="mt-2">
      <Col sm={12}> 
        <Nav tabs className="top-nav" style={{background: '#fff'}}>
          <NavItem className={activeTopNav === ROUTES.FEEDBACK || activeTopNav === ROUTES.PRAISE ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.FEEDBACK}>Feedback</Link>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  )
}

const Praise = (props) => {
  let activeTopNav = props.router.location.pathname
  let { state } = props.location

  if(state && state.feedbackData) {
    let { feedbackData, feedbackType } = state

    return <FeedbackDetails feedbackData={feedbackData} feedbackType={feedbackType} />

  } else {
    
    return (
      <div className="main-page page-admin praise">
        <div className="container clearfix">
          <div className="page-header">
            <Heading />
          </div>
          <NavBar activeTopNav={activeTopNav} />
          <Switch>
            <Route 
              exact 
              path={ROUTES.FEEDBACK}
              component={Feedback}
            />

            <Route 
              exact
              path={ROUTES.PRAISE}
              component={Feedback}
            />
          </Switch>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ router }) => ({
  router
})

export default connect(
  mapStateToProps,
  null
)(Praise)