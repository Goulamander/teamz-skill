import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Input, Form, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import styled from 'styled-components'
import classnames from 'classnames'
import _ from 'lodash'
import { Doughnut } from 'react-chartjs-2';
import ShowMoreText from 'react-show-more-text';

import SelectTable from '../../../component/SelectTable'
import { ROUTES } from '../../../constants/routeConstants'
import Can from '../../../component/Can'
import { get_analytics_my_learning, get_analytics_my_learning_by_id } from '../../../actions/analytics';
import { appConstant, filterIntervals, filterCType, assignCourseState } from '../../../constants/appConstants'
import defaultPP from '../../../assets/img/profile_default.png'; 
import blastOff from '../../../assets/img/blast-off.png'
import moonLanding from '../../../assets/img/moon_landing.png'
import expandIcon from '../../../assets/img/expandIcon.png'
import crossIcon from '../../../assets/img/crossIcon.png'
import { getUserRoleName } from '../../../transforms'
const routeResource = "COMPONENT"


const Styles = styled.div`
  padding: 1rem 0 1rem 0;

  table {
    border-spacing: 0;
    width: 100%;
    
    .table-header-analytics{
      background-color: #ffffff;
      
      .th-completion {
        margin-bottom: 0;
        margin-left: -30px;
        margin-right: 30px;
      }
    }
    tr {
       
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    & .table-content-analytics{
      box-shadow: none;
      td{
        :first-child {
          width: 107px;
        }
        :nth-child(2) {
          max-width: 240px;
        }
        padding-right: 25px;
        padding-left: 25px;
        line-height: 30px;
        
        .custom-multi-progress {
          margin-left: -30px;
        }
      }
      .cell-index {
        margin-bottom: 0
      }
      &.selected-row, &:hover {
        background-color: #feefe9;
        
        .cell-index {
          display: none;
        }
        .select-row-input {
          display: flex !important;
          justify-content: space-between;
          align-items: center;

          .expand-btn {
            max-width: 30px;
            max-height: 30px;
            cursor: pointer;
            img {
              max-width: 100%;
              max-height: 100%;
              vertical-align: top;
            }
          }
        }
      }
    }

    th{
      font-size: 16px;
      font-weight: 700;
      color: #181818;
      border-bottom: 5px solid #edeffd!important;
      border-top: none;
      padding: 10px 25px 10px 25px!important;

      .fa {
        width: 40px;
        text-align: center;
        line-height: 38px;
        font-size: 24px;
        color: #5352ed;
        transition: all 0.3s ease-out;
        cursor: pointer
      }
      & .disable{
        color: #d2d6db;
      }
      .fa.fa-caret-down:before {
        content: "\f0d7";
      }
      .fa-caret-up:before {
        content: "\f0d8";
      }
    }
    td {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 5px solid #edeffd!important;
      line-height: 40px;
    }
  }
`
const userBadges = [
  { category: 'The Basics', badges: [{ img: blastOff, name:"Blast Off!", desc:"Finished TeamsSkill Basics course" }, { img: moonLanding, name: "Blast Off!", desc:"Finished TeamsSkill Basics course" }]},
  { category:"Hall Of Fame", badges: [] }
]

const columns = [
  {
    Header: () => (
      <div>
        <input type="checkbox" />
      </div>
    ),
    accessor: 'index',
    disableSortBy: true,
    Cell: ({row, handleExpandClick}) => (
      <div className="">
        <p className="cell-index">{row.index+1}</p>
        <div className="d-none select-row-input">
          <input type="checkbox" />
          <div className="expand-btn" title="Expand Record" onClick={() => handleExpandClick(row)}><img src={expandIcon} /></div>
        </div>
      </div>),
  },
  {
    Header: 'Name',
    id: "link",
    disableSortBy: true,
    accessor: 'coursename',
    Cell: ({ row }) => {
      if(row.original.c_state === 'Complete'){
        return <Link to={{pathname: `${ROUTES.COURSE}/${row.original.c_id}/complete`, state:{courseType: 'COMPLETE'}}}>{row.original.coursename}</Link>
      }

      if(row.original.c_state === 'UnStart'){
        return <Link  to={`${ROUTES.COURSE}/${row.original.c_id}`}>{row.original.coursename}</Link>
      }

      if(row.original.c_state === 'Start'){
        return <Link to={`${ROUTES.COURSE}/${row.original.c_id}/assigned`}>{row.original.coursename}</Link>
      }
    }
  },
  {
    Header: 'Assigned To',
    accessor: 'assignedto',
    sortDescFirst: true,
    id: 'assignTo',
    Cell: ({ row }) => (row.original.assignedto > 0)? row.original.assignedto : 0
  },
  {
    Header: 'Score',
    accessor: 'score',
    disableSortBy: true,
    Cell: ({ row }) => {
      return row.original.avg_score != null ?
      <div className="course-score">
           <span className={classnames({"good":row.original.avg_score>=80, "average": (row.original.avg_score>=40&&row.original.avg_score<80), "fail": row.original.avg_score<40})}>{`${Number(row.original.avg_score).toFixed()}%`}</span>
      </div> : '-- --'
    }
  },
  {
    Header: 'Created By',
    accessor: 'createdby',
    disableSortBy: true,
    Cell: ({ row }) => 
    {
      if (!!row.original.profile_pic2) {
        var meta = appConstant.BASE_URL + row.original.profile_pic2.replace("dist", "");
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.createdby}</Link>;
      } else if (row.original.profile_pic1) {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.profile_pic1} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.createdby}</Link>;
      } else {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.createdby}</Link>;
      }
    },
  },
  {
    Header: ()=>(
      <div>
        <div>Completion</div>
        <div style={{fontSize:'11px'}}>(Min | Max Weeks)</div>
      </div>
    ),
    accessor: 'completion',
    disableSortBy: true,
    Cell: ({ row }) => <div>{`${Number(row.original.min_week).toFixed(1)} | ${Number(row.original.max_week).toFixed(1)}`}</div>
  }
]

const FilterDropdowns = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const toggleDD = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleClick = (option) => {
    setSelectedItem(option.title)
    if(typeof props.handleChange === 'function' ) props.handleChange(option.key)
  }
  return (
    <Dropdown className="filter-dd" isOpen={dropdownOpen} toggle={toggleDD}>
      <DropdownToggle>
        <div className="d-flex">
          <Input disabled value={selectedItem} placeholder={props.placeholder} />
          <span className={classnames({'fa': true, 'fa-caret-down': !dropdownOpen, 'fa-caret-up': dropdownOpen})}></span>
        </div>
      </DropdownToggle>
      <DropdownMenu className="mx-3">
        {props.data.map((val, index) => {
          return <DropdownItem key={`interval-${index}`} onClick={() => handleClick(val)}>{val.title}</DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  )
}

export const MyLearning = (props) => {

  const courseTabRef = useRef(null)
  const coursesTableRef = useRef(null)
  const badgesRef = useRef(null)
  const [courseIntv, setCourseIntv] = useState()
  const [courseType, setCourseType] = useState()
  const [isCDMOpen, setIsCDMOpen] = useState(false)
  const [isCDM2Open, setIsCDM2Open] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex ] = useState(null)
  const [analyticsMyLearnings, setAnalyticsMyLearnings] = useState([])
  const [completedCourses, setCompletedCourses] = useState([])
  const [isBadgeEarned, setIsBadgeEarned] = useState(false)
  const [badgeCount, setBadgeCount] = useState(0)
  
  useEffect(() => {
    if(props.location.state) {
      if(props.location.state.detail === 'earned-badge') {
        badgesRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })

  useEffect(() => {
    let completedAssignCourses = props.myCourses.assignedCourses.filter(course => course.c_state === assignCourseState.COMPLETE);
    setCompletedCourses(completedAssignCourses);
  }, [props.myCourses.assignedCourses])

  useEffect(() => {
    if(props.analyticsMyLearnings.courses.length > 0) {
      setAnalyticsMyLearnings(createUpdateCourseData(props.analyticsMyLearnings.courses))
    } else {
      setAnalyticsMyLearnings([])
    }
  }, [props.analyticsMyLearnings.courses])

  useEffect(() => {
    // if(props.analyticsMyLearningsDetails.length > 0){
      setTimeout(() => {
        try {
          courseTabRef.current.scrollIntoView({block: 'start', behavior: 'smooth'}) 
        } catch (error) {
          console.log("Browser not supported")
        }        
      }, 200);
    // }
  }, [props.analyticsMyLearningsDetails])

  useEffect(() => {
    fetchMyCourses()
  }, [courseIntv, courseType])
  
  const fetchMyCourses = () => {
    // Call api to fetch data
    let params = {
      "interval": courseIntv || 'all',
      "c_type": courseType || 'all'
    }
    props._get_analytics_my_learning(params)
  }
  const createUpdateCourseData = (data) => {    
    return data.map(course => (
      {
        ...course,
        coursename: course.course_title,
        createdby: course.created_by,
        assignedto: course.assigned_to,
        user_id: course.user_id,
        scores: course.avg_score,
        min_week: course.min_week || 0.0,
        max_week: course.max_week || 0.0
      }
    ))
  }
  
  const handleCourseSearch = (e) => {
    e.preventDefault();
    let searchTxt = e.target.value

    if(!!searchTxt === false) {
      if(props.analyticsMyLearnings.courses.length > 0) {
        setAnalyticsMyLearnings(createUpdateCourseData(props.analyticsMyLearnings.courses))
      } else {
        setAnalyticsMyLearnings([])
      }
      return false
    }

    let filteredCourses = analyticsMyLearnings.filter(course => course.course_title.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1)

    if(filteredCourses.length > 0) {
      setAnalyticsMyLearnings(createUpdateCourseData(filteredCourses))
    } else {
      setAnalyticsMyLearnings([])
    }
  }

  const handleExpandClick = (row) => {
    setIsCDMOpen(true)
    setSelectedRowIndex(row.index)
    if(row.original.c_id)
      props._get_analytics_my_learning_by_id(row.original.c_id)
  }

  const onCloseCourseDetailsModal = () => {
    console.log(coursesTableRef.current)
    setIsCDMOpen(false); 
    setSelectedRowIndex(null);
    setTimeout(() => {
      try {
        coursesTableRef.current.scrollIntoView({block: 'center', behavior: 'smooth'}) 
      } catch (error) {
        console.log("Browser not supported")
      }
    }, 100);
  }
  
  const globalClick = (e) => {
    // function to close courseDetailModal from outside click
    if (isCDMOpen === true && isCDM2Open === false && e.target.closest('#courseDetailModal #rightView') === null) {
      setIsCDMOpen(false); setSelectedRowIndex(null);
      setTimeout(() => {
        try {
          coursesTableRef.current.scrollIntoView({block: 'center', behavior: 'smooth'}) 
        } catch (error) {
          console.log("Browser not supported")
        }
      }, 100);
    }
  }

  const executeBadgeScroll = (e) => { 
    window.scrollTo(0, badgesRef.current.offsetTop)
  }

  const onChangeCourseIntv = (intv) => {
    console.log("setCourseIntv", intv)
    setCourseIntv(intv)
  }

  const onChangeCourseType = (type) => {
    console.log("setCourseType", type)
    setCourseType(type)
  }

  const isDefaultCourseComplete = (completedCourses) => {
    let isCourseComplete = false;
    completedCourses.forEach(data => {
      if(data.is_default_course) {
        isCourseComplete = true;
        return;
      }
    })
    
    setIsBadgeEarned(isCourseComplete);
    return isCourseComplete;
  }

  const defaultCourseCompleteCount = (completedCourses) => {
    let defCompleteCourses = 0;
    completedCourses.forEach(data => {
      if(data.is_default_course) {
        defCompleteCourses += 1;
      }
    });
    setBadgeCount(defCompleteCourses);
    return defCompleteCourses;
  }

  return (
    <Row onClick={globalClick}>
      <Col lg={12} className="pl-0 pr-0">
        <div className="table-responsive courses-content courses-tbl" ref={courseTabRef}>
            <Row className="card report-card">
              <Col>
                <div className="label">Courses To Do</div>
                <div className="value">{props.analyticsMyLearnings.course_todo}</div>
                <div className="averagePer"><span>{`${props.analyticsMyLearnings.course_todo_rate}%`}</span> of current assigned courses</div>
                <Progress className="mylearning-progress-value" value={props.analyticsMyLearnings.course_todo_rate}><span className="progress-value">{`${props.analyticsMyLearnings.course_todo_rate}%`}</span></Progress>
              </Col>
              <Col>
                <div className="label">Overdue</div>
                <div className="value danger">{`${props.analyticsMyLearnings.overdue}`}</div>
                <div className="averagePer"><span>{`${props.analyticsMyLearnings.overdue_rate}%`}</span> of current assigned courses</div>
                <Progress className="mylearning-progress-value" color={'danger'} value={props.analyticsMyLearnings.overdue_rate}><span className="progress-value">{`${props.analyticsMyLearnings.overdue_rate}%`}</span></Progress>
              </Col>
              <Col>
                <div className="label">Courses Created</div>
                <div className="value">{`${props.analyticsMyLearnings.course_created}`}</div>
                <div className="averagePer"><span>{`${props.analyticsMyLearnings.created_rate}%`}</span> of all published courses</div>
                <Progress className="mylearning-progress-value" value={props.analyticsMyLearnings.created_rate}><span className="progress-value">{`${props.analyticsMyLearnings.created_rate}%`}</span></Progress>
              </Col>
              <Col onClick={executeBadgeScroll}>
                <div className="label">Badges Earned</div>
                <div className="value">{isBadgeEarned ? badgeCount : 0}</div>
                <div className="averagePer"><span>{isBadgeEarned ? badgeCount : 0}/20</span> badges earned</div>
                <Progress className="mylearning-progress-value" value={isBadgeEarned ? (badgeCount/20)*100 : 0}><span className="progress-value">{`${100}%`}</span></Progress>
              </Col>
            </Row>

            <Row className="my-4">
              <Col sm="12" md="6" lg="4">
                <span className="filter-label">Courses Assigned During</span>
                <FilterDropdowns placeholder="Select interval" data={filterIntervals} handleChange={onChangeCourseIntv} />
              </Col>
              <Col sm="12" md="6" lg="4">
                <span className="filter-label">Course Type</span>
                <FilterDropdowns placeholder="Select course type" data={filterCType} handleChange={onChangeCourseType} />
              </Col>
            </Row>

            <Row>
              <Col className="sperator"></Col>
            </Row>

            <Row>
              <Col sm="12" className="mt-4">
                <Row>
                  <Col md={4} sm={12}>
                    {/* <Form className="form-inline my-2 srch-box">
                      <Input type="search" placeholder="Find a course" aria-label="Search" onChange={handleCourseSearch} />
                      <Button type="submit" className="searchCourseSubBtn"><i className="fa fa-search" /></Button>
                    </Form> */}
                    <div className="form-group has-search my-2">
                      <Input type="search" className="form-control" placeholder="Find a course" onChange={handleCourseSearch}  />
                      <span className="fa fa-search form-control-feedback"></span>
                    </div> 
                  </Col>
                  <Col md={5} sm={12}>
                    {/* <div className="statuses">
                      <div className="status status-complete"><span className="status-color"></span>Complete</div>
                      <div className="status status-in-progress"><span className="status-color"></span>In Progress</div>
                      <div className="status status-not-started"><span className="status-color"></span>Not Started</div>
                    </div> */}
                  </Col>
                  <Col md={3} sm={12}>
                    <div className="other-info">
                      <div className="score-percent">Pass Score > 80%</div>
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* change Col to div because Col component does not have ref property */}
              <div className="col-sm-12" ref={coursesTableRef}>
                <Styles>
                  <SelectTable columns={columns} data={analyticsMyLearnings} handleExpandClick={handleExpandClick} selectedRowIndex={selectedRowIndex} />
                </Styles>
              </div>
            </Row>

            <Row className="mt-5 mb-5">
                <Col className="sperator"></Col>
            </Row>
            <Row>
              <div className="col-sm-12" ref={badgesRef}>
                <EarnedBadges completedCourses={completedCourses} isDefaultCourseComplete={isDefaultCourseComplete}
                defaultCourseCompleteCount={defaultCourseCompleteCount}
                badgeCount={badgeCount}></EarnedBadges>
              </div>
            </Row>  

            {isCDMOpen &&
              <CourseDetails 
                selectedRowIndex={selectedRowIndex}
                analyticsMyLearnings={analyticsMyLearnings}
                analyticsMyLearningsDetails={props.analyticsMyLearningsDetails}
                isAMLDLoading={props.isAMLDLoading}
                onClose={onCloseCourseDetailsModal}
              />
            }

        </div>
      </Col>
    </Row>
  )
}

const EarnedBadges = (props) => {
  let { completedCourses, badgeCount } = props;

  useEffect(() => {
    props.defaultCourseCompleteCount(completedCourses)
  }, [completedCourses])

  return (
    <Fragment>
    { props.isDefaultCourseComplete(completedCourses) &&
      <div className="earned-badges-wrapper">
        <div className="heading text-center">
          <h4>Badges</h4>
          <div className="subtitle pt-2">{badgeCount}/20 Badges Earned!</div>
        </div>
        <div className="earned-badges">
          <div className="">
          <div className="badge-category pt-3 pb-3">The Basics ({badgeCount}/6)</div>
            <div className="badges d-flex pt-5 pb-5">
              { (badgeCount === 1 || badgeCount === 2 ) &&
                <Col sm="6" md="4">
                  <div className="badges-info d-flex align-items-center">
                    <div className="badge-img">
                      <img className="image" src={blastOff} width="84" height="84" />
                    </div>
                    <div className="badge-meta-data ml-4">
                      <h6 className="badge-name mb-2">Blast Off!</h6>
                      <div className="description">Finished TeamzSkill Basics course</div>
                    </div>
                  </div>
                </Col>
              }
              { badgeCount === 2 &&
                <Col sm="6" md="4">
                  <div className="badges-info d-flex align-items-center">
                    <div className="badge-img">
                      <img className="image" src={moonLanding} width="84" height="84" />
                    </div>
                    <div className="badge-meta-data ml-4">
                      <h6 className="badge-name mb-2">Moon landing!</h6>
                      <div className="description">Finished TeamzSkill Pro course</div>
                    </div>
                  </div>
                </Col>
              }
            </div>  
          </div>    
        </div>  
      </div> 
    }
    </Fragment>  
  )
}

const CourseDetails = ({
  selectedRowIndex,
  analyticsMyLearnings,
  analyticsMyLearningsDetails,
  isAMLDLoading,
  onClose
}) => {

  const doughnutConfig = {
    responsive: true, 
    cutoutPercentage: 90, 
    tooltips: { enabled: true }, 
    legend:{ display: false }
  }
  const selectedCourse = analyticsMyLearnings[selectedRowIndex];

  analyticsMyLearningsDetails.sort((a,b) => {
    return b.avg_score - a.avg_score
  });

  const onCancel = (e) => {
    e.preventDefault(); 
    onClose()
  }

  const cDetails = analyticsMyLearningsDetails.map((course, i) => {
    let metaImg= '';
    if(!!course.profile_pic2) {
      metaImg = appConstant.BASE_URL + course.profile_pic2.replace("dist", "");
    }  else if(course.profile_pic1) {
      metaImg = course.profile_pic1;
    } else {
      metaImg = defaultPP;
    }
   
    return (
      <Row key={`crs-${i}`} className={classnames({"px-2 py-3 pb-4 listing": true})} >
        <Col sm="5" className="d-flex">
          <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: course.user_id}}} >
            <img src={metaImg} style={{borderRadius: '50%', marginRight: '38px', width: '66px', height: '66px'}} />
          </Link>  
          <div>
            <div className="user-name mb-1">{course.f_name} {course.l_name}</div>
            <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: course.user_id}}}>View Profile</Link>
          </div>
        </Col>
        <Col sm="4" className="course-score">
          {course.avg_score != null ? <span className={classnames({"good":course.avg_score>=80, "average": (course.avg_score>=40&&course.avg_score<80), "fail": course.avg_score<40})}>{`${Number(course.avg_score).toFixed()}%`}</span> : '-- --'}
        </Col>
        <Col sm="3">
          {course.completion_time !== null ? course.completion_time + ' weeks' : '-- --'}
        </Col>
      </Row>
    )
  })
  const getlearnersDoughnutData = () => {
    let complete = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.course_state === 'Complete') }, 0);
    let start = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.course_state === 'Start') }, 0);
    let unstart = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.course_state === 'UnStart') }, 0);
    console.log([complete, start, unstart])
    return [complete, start, unstart]
  }
  const getoverdueDoughnutData = () => {
    let notOverdue = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.overdue === false) }, 0);
    let overdue = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.overdue === true) }, 0);
    return [notOverdue, overdue]
  }

  const getOverdueRate = () => {
    let overdue = analyticsMyLearningsDetails.reduce((n, val) => { return n + (val.overdue === true) }, 0);
    return parseFloat((overdue/analyticsMyLearningsDetails.length*100).toFixed())
  }

  const getAvgScores = () => {
    let avgscores = []
    let goodScr = 0
    let avgScr = 0
    let lowScr = 0
    
    analyticsMyLearningsDetails.forEach(learner => {
       if(learner.avg_score != null){
         if(learner.avg_score >= 80){
          ++goodScr
         } else if(learner.avg_score >= 40) {
           ++avgScr
         } else {
           ++lowScr
         }
       }
    })
    avgscores = [goodScr, avgScr, lowScr]
    return avgscores
  }
  const getAvgScore = () => {
    let sc = analyticsMyLearningsDetails.filter(learner => learner.avg_score != null)
    if(sc.length === 0) return 0
    let sumAvg = _.sumBy(sc, (o)=> Number(o.avg_score))
    return sumAvg/sc.length
  }

  return (
    <Row id="courseDetailModal" className="h-100">
      <Col lg="6" id="leftView" className="p-0"></Col>
      <Col lg="6" id="rightView" className="px-lg-2">
        <Row>
          <Col className="d-flex">
            <div className="list-header flex-fill">
              <div className="list-title pb-1 pt-3 pl-3 pr-2">
                Leaderboard - Top 5 Scorers
              </div>
              <div className="list-subtitle-link pb-3 pl-3 pr-2">
              <Link to={`${ROUTES.COURSE}/${selectedCourse.c_id}`}>{selectedCourse.c_title}</Link>
              </div>
            </div>
            <div className="pull-right cancel-icon mt-2" onClick={onCancel}>
              <img src={crossIcon} className="icon" />
            </div>
          </Col>
        </Row>
        <div className="listing-seperator"></div>
        <Row>
          <Col> 
          {isAMLDLoading? "Loading...": analyticsMyLearningsDetails.length>0 ?
          <>
            <Row className="dougnut-wrapper">
              <Col sm="4">
                <Doughnut data= {{
                  labels: ["Completed", "In Progress", "Not Started"],
                  datasets: [
                    {
                      data: getlearnersDoughnutData(),
                      backgroundColor: ['#33ca6f', '#b2d3bf', '#8494a5'],
                      borderWidth: 0
                    }
                  ]
                }} 
                options={{ ...doughnutConfig }} 
                />
                <div className="course-stats">
                  <div>{analyticsMyLearningsDetails.length}</div>
                  <div>Learners</div>
                </div>
              </Col>
              <Col sm="4">
                <Doughnut data= {{
                  labels: ["Good", "Average", "Low"],
                  datasets: [
                    {
                      data: getAvgScores(),
                      backgroundColor: ['#d1f7c4', '#ffeab6', '#eb0000'],
                      borderWidth: 0
                    }
                  ]
                }} 
                options={{ ...doughnutConfig }} 
                />
                <div className="course-stats">
                  <div>{`${parseFloat(getAvgScore().toFixed())}%`}</div>
                  <div>Avg score</div>
                </div>
              </Col>
              <Col sm="4">
                <Doughnut data= {{
                  labels: ["Not due", "Overdue"],
                  datasets: [
                    {
                      data: getoverdueDoughnutData(),
                      backgroundColor: ['#f7a482', '#eb0000'],
                      borderWidth: 0
                    }
                  ]
                }} 
                options={{ ...doughnutConfig }} 
                />
                <div className="course-stats">
                  <div>{`${getOverdueRate()}%`}</div>
                  <div>Overdue</div>
                </div>
              </Col>
            </Row>
            <div className="listing-seperator"></div>
            {cDetails}
          </>
           : ""}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const CourseDescription = ({
  text
}) => {

  const executeOnClick = (isExpanded) => {
    console.log(isExpanded);
  }
  
  return (
    <ShowMoreText
        /* Default options */
        lines={3}
        more='view more'
        less='view less'
        anchorClass='view-more'
        onClick={executeOnClick}
        expanded={false}
    >{text}</ShowMoreText>
  )
}

const mapStateToProps = ({analytics, myCourses}) => ({
  ...analytics,
  myCourses : myCourses
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_analytics_my_learning        : get_analytics_my_learning,
      _get_analytics_my_learning_by_id  : get_analytics_my_learning_by_id
    },
    dispatch
  )

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLearning))