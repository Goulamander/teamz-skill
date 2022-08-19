import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, HashRouter } from 'react-router-dom'
import {  Nav, NavItem, NavLink, Row, Col, Input, TabContent, TabPane, Progress, Form, Button, Card, CardBody, CardSubtitle, CardTitle, CardText } from 'reactstrap';
import styled from 'styled-components'
import moment from 'moment'

import Courses from './courses'
import Learners from './learners'
import MyLearning from './myLearning'
import Can from '../../../component/Can'
import { ROUTES } from '../../../constants/routeConstants'
import { get_analytics_direct_reports, get_custom_assign_courses } from '../../../actions/myCourses'
import defaultPP from '../../../assets/img/profile_default.png'
import { appConstant } from '../../../constants/appConstants'
import DataTable from '../../../component/TSZDataTable'
import { getUserRoleName } from '../../../transforms'
import './learning.css'

const SUB_ROUTES = {
  DIRECT_REPORT: 'DIRECT_REPORT',
  LEARNERS: 'LEARNERS',
  COURSES: 'COURSES',
  MY_LEARNING: 'MY_LEARNING' 
}

const routeResource = "COMPONENT"

const NavBarSecondary = ({
  activeSubNav
}) => {
  return (
    <Row className="mt-4 sub-nav-container learningAnalytic">
      <Col sm={12} className="pr-0 pl-0">
        <Nav tabs className="sub-nav">
          <NavItem className={activeSubNav === SUB_ROUTES.MY_LEARNING ? "active" : ""}>
            <HashRouter
              hashType={'noslash'}
            >
              <Link 
                className="nav-link"
                to={SUB_ROUTES.MY_LEARNING}
              >
                My Learning
              </Link>
            </HashRouter>
          </NavItem>
          <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"GROW:LEARNING:LEARNERS"}
            yes={(attr) => (
              <NavItem className={activeSubNav === SUB_ROUTES.LEARNERS ? "active" : ""}>
                <HashRouter
                  hashType={'noslash'}
                >
                  <Link 
                    className="nav-link"
                    to={SUB_ROUTES.LEARNERS}
                  >
                    Learners
                  </Link>
                </HashRouter>
              </NavItem>
            )}
            no={() => (
              null
            )}
          />
          <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"GROW:LEARNING:DIRECT_REPORT"}
            yes={(attr) => (
              <NavItem className={activeSubNav === SUB_ROUTES.DIRECT_REPORT ? "active" : ""}>
                <HashRouter
                  hashType={'noslash'}
                >
                  <Link 
                    className="nav-link"
                    to={SUB_ROUTES.DIRECT_REPORT}
                  >
                    Direct Reports
                  </Link>
                </HashRouter>
              </NavItem>
            )}
            no={() => (
              null
            )}
          />
          <NavItem className={activeSubNav === SUB_ROUTES.COURSES ? "active" : ""}>
            <HashRouter
              hashType={'noslash'}
            >
              <Link 
                className="nav-link"
                to={SUB_ROUTES.COURSES}
              >
                Courses
              </Link>
            </HashRouter>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  )
}

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    width: 100%;
    
    tr {
       
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th{
      font-size: 16px;
      font-weight: 700;
      color: #171717;
      border-bottom: none;
      border-top: none;
      padding: 10px 15px 10px 0!important;
    }
    td {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 15px solid #edeffd!important;
      line-height: 40px;
    }
  }
`

const reportColumns = [
  {
    Header: 'Name',
    accessor: 'user_name',
    Cell: ({ row }) => 
    {
      if (!!row.original.img2) {
        var meta = appConstant.BASE_URL + row.original.img2.replace("dist", "");
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      } else if (row.original.img) {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.img} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      } else {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      }
    },
  },
  {
    Header: 'Courses Assigned',
    accessor: 'course_assigned',
  },
  {
    Header: 'Courses Completed',
    accessor: 'course_completed',
    Cell: ({row}) => {
      return (
        <div>
          <Progress value={row.original.course_completed} />
          <span>{`${row.original.course_completed}%`}</span>
        </div>
      )
    }
  },
  {
    Header: 'Access Level',
    accessor: 'access_level',
  },
  {
    Header: 'Last Login',
    accessor: 'last_login',
  },
]

class LearningAnalytic extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSubNav: SUB_ROUTES.MY_LEARNING,
    }

  }

  setHash = (hash) => {
    let activeHash = SUB_ROUTES.MY_LEARNING
    switch(hash) {
      case SUB_ROUTES.MY_LEARNING:
        activeHash = SUB_ROUTES.MY_LEARNING
        break;
      case SUB_ROUTES.DIRECT_REPORT:
        activeHash = SUB_ROUTES.DIRECT_REPORT
        break;
      case SUB_ROUTES.LEARNERS:
        activeHash = SUB_ROUTES.LEARNERS
        break;
      case SUB_ROUTES.COURSES: 
        activeHash = SUB_ROUTES.COURSES
        break
      default:
        activeHash = SUB_ROUTES.MY_LEARNING
        window.location.hash = SUB_ROUTES.MY_LEARNING
    }
    this.setState({
      activeSubNav: activeHash
    })
  }

  componentDidMount() {
    const { activeSubNav } = this.state;
    let hash = window.location.hash.replace('#', '')

    this.props._get_analytics_direct_reports();
    this.props._get_custom_assign_courses();
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
    let { directReportsCourses } = this.props.myCourses;

    const reportData = directReportsCourses.map(dt=>{
      let fname = dt.first_name || ''
      let lname = dt.last_name || ''
      let course_completed = dt.courses_assigned_completed || 0 
      let course_assigned = dt.courses_assigned || 0 
      let per = Math.round((course_completed/course_assigned) * 100) || 0
      let loginDate = dt.last_login? moment(dt.last_login).format('MM/DD/YYYY') : '--'
      let user_id = dt.user_id || ''
      return {
        user_name: `${fname} ${lname}`,
        img: dt.profile_pic1,
        img2: dt.profile_pic2,
        course_assigned: course_assigned,
        course_completed: per,
        access_level: dt.access_level,
        last_login: loginDate,
        user_id: user_id
      }
    })

    return (
      <Fragment>
        <NavBarSecondary 
          activeSubNav={activeSubNav}
        />
        <TabContent id="leaning" className="page-content mt-4" activeTab={this.state.activeSubNav}>

          <TabPane tabId={SUB_ROUTES.COURSES}> 
          {activeSubNav === SUB_ROUTES.COURSES &&
            <Courses />
          }
          </TabPane>
          <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"GROW:LEARNING:DIRECT_REPORT"}
            yes={(attr) => (
              <TabPane tabId={SUB_ROUTES.DIRECT_REPORT}>
                <Row>
                  <Col lg={12} className="pl-0 pr-0">
                    <div className="table-responsive direct-reports-tbl">

                      <Styles>
                        <DataTable columns={reportColumns} data={reportData} />
                      </Styles>

                    </div>
                  </Col>
                </Row>
              </TabPane>
            )}
            no={() => (
              null
            )}
          />
          <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"GROW:LEARNING:LEARNERS"}
            yes={(attr) => (
              <TabPane tabId={SUB_ROUTES.LEARNERS}>
                {activeSubNav === SUB_ROUTES.LEARNERS &&
                  <Learners />
                }
              </TabPane>
            )}
            no={() => (
              null
            )}
          />
          <TabPane id="my-learning" tabId={SUB_ROUTES.MY_LEARNING}> 
              {activeSubNav === SUB_ROUTES.MY_LEARNING &&
                <MyLearning />
              }
          </TabPane>
        </TabContent>
      </Fragment>
    )
  }
}


const mapStateToProps = (state) => ({
  
  myCourses: state.myCourses
  
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_analytics_direct_reports : get_analytics_direct_reports,
      _get_custom_assign_courses   : get_custom_assign_courses,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LearningAnalytic)
