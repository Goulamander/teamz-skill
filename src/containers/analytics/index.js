import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Switch,  Redirect, Link } from 'react-router-dom'
import {  Nav, NavItem, NavLink, Row, Col, Input, Label, TabContent, TabPane } from 'reactstrap';
import { ROUTES } from '../../constants/routeConstants';
import '../../assets/css/style-d3.css'

import  RampTime  from './rampTime/index';
import  AnalyticsPeople  from './peopleanalytics';
import ContentAnalytics from './contentanalytics';

const Heading = () => (
  <Row>
    <Col className=" pr-0 pl-0 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
      <div className="section-title">Analytics</div>
    </Col>
  </Row>
)

const NavBar = ({
  activeTopNav
}) => {
  return (
    <Row className="mt-2">
      <Col className="pl-0 pr-0" sm={12}> 
        <Nav tabs className="top-nav" style={{background: '#fff'}}>
          <NavItem className={activeTopNav === ROUTES.ANALYTICS_SALES || activeTopNav === ROUTES.ANALYTICS ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.ANALYTICS_SALES}>Sales Performance</Link>
          </NavItem>
          <NavItem className={activeTopNav === ROUTES.CONTENT_ANALYTICS || activeTopNav === ROUTES.ANALYTICS ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.CONTENT_ANALYTICS}>Content Analytics</Link>
          </NavItem>
          <NavItem className={activeTopNav === ROUTES.ANALYTICS_PEOPLE ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.ANALYTICS_PEOPLE}>People Analytics</Link>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  )
}

class Admin extends Component {
  constructor(props) {
    super(props)

    let { location } = this.props
    this.draftData = location.state || null 
    this.state = {
      activeTopNav: this.props.router.location.pathname
    }
  }

  render() {
    let activeTopNav = this.props.router.location.pathname;
    if(this.props.admin.data.uploadFileUrl[activeTopNav])
      this.renderChats(this.props.admin.data.uploadFileUrl[activeTopNav]);

    return (
      <div className="main-page page-admin analytics-ramp-time">
        <div className="container clearfix">
          <div className="page-header">
            <Heading />
          </div>

          <NavBar activeTopNav={activeTopNav} />
          <Switch>
            <Route
              exact 
              path={ROUTES.ANALYTICS_SALES}
              component={RampTime}
            />
            <Route 
              exact 
              path={ROUTES.ANALYTICS_PEOPLE}
              component={AnalyticsPeople} 
            />
            <Route 
              exact 
              path={ROUTES.CONTENT_ANALYTICS}
              component={ContentAnalytics} 
            />
            <Route
              exact
              path={ROUTES.ANALYTICS}
              render={() => {
                  return (
                    <Redirect to={ROUTES.ANALYTICS_SALES} />
                  )
              }}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ admin, router }) => ({
  router,
  admin
})

export default connect(
  mapStateToProps
)(Admin)
