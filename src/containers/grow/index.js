import React from 'react'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import {  Nav, NavItem, Row, Col } from 'reactstrap';
import { connect } from 'react-redux'

import CareerLadderContainer from './CareerLadderContainer'
import CreateCourse from './createCourse/index'
import QuizBuilder from './createCourse/quizBuilder'
import LearningAnalytic from './LearningAnalytic'
import Can from '../../component/Can'
import { getUserRoleName } from '../../transforms'
import { ROUTES } from '../../constants/routeConstants';

const routeResource = "COMPONENT"
const Heading = () => (
  <Row>
    <Col className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
      <div className="section-title">Grow</div>
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
          <NavItem className={activeTopNav === ROUTES.CREATE_COURSE || activeTopNav === ROUTES.GROW ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.CREATE_COURSE}>Create Course</Link>
          </NavItem>
          <NavItem className={activeTopNav === ROUTES.LEARNING ? "active" : ""}>
            <Link className="nav-link" to={ROUTES.LEARNING}>Learning Analytics</Link>
          </NavItem>
          <NavItem className={activeTopNav === ROUTES.CAREER_PATH ? "active" : ""} >
            <Link className="nav-link" to={ROUTES.CAREER_PATH}>Career Path</Link>
          </NavItem>

          {/* <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"GROW:LEARNING"}
            yes={(attr) => (
              <NavItem className={activeTopNav === ROUTES.LEARNING ? "active" : ""}>
                <Link className="nav-link" to={ROUTES.LEARNING}>Learning Analytics</Link>
              </NavItem>
            )}
            no={() => (
              null
            )}
          /> */}
        </Nav>
      </Col>
    </Row>
  )
}


const Grow = (props) => {
  let activeTopNav = props.router.location.pathname
  let overlayBehindSceneCls = props.quizBuilder.isOpenBuilder? 'overlay-behind-scene' : ''
  return (
    <div className="main-page page-admin">
      <div className="container clearfix">
        <div className={overlayBehindSceneCls}>
          <div className="page-header">
            <Heading />
          </div>
          <NavBar activeTopNav={activeTopNav} />
          <Switch>
            <Route 
              exact 
              path={ROUTES.CAREER_PATH}
              component={CareerLadderContainer}
            />
            <Route 
              exact 
              path={ROUTES.CREATE_COURSE}
              component={CreateCourse} 
            />
            
            <Route 
              exact
              path={ROUTES.GROW}
              component={CreateCourse}
            />
            
            <Can
              role={getUserRoleName()}
              resource={'ROUTES'}
              action={activeTopNav}
              yes={(attr) => (
                <Route 
                  exact 
                  path={ROUTES.LEARNING}
                  component={LearningAnalytic}
                />
              )}
              no={() => (
                <Redirect to={{ pathname: ROUTES.CAREER_PATH, state: { from: props.location } }} />
              )}
            />
          </Switch>
        </div>
        
        <div className="overlay-component">
          { props.quizBuilder.isOpenBuilder &&
              <QuizBuilder isPreviewMode={props.quizBuilder.isPreviewMode}/>
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ router, quizBuilder }) => ({
  router,
  quizBuilder
})

export default connect(
  mapStateToProps,
  null
)(Grow)
