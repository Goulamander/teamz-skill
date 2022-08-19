import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Input, Form, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import classnames from 'classnames';
import styled from 'styled-components';

import { get_analytics_learners, get_analytics_learner_by_id } from '../../../actions/analytics';
import { ROUTES } from '../../../constants/routeConstants'
import { appConstant, filterIntervals, filterCType } from '../../../constants/appConstants';
import SelectTable from '../../../component/SelectTable';
import defaultPP from '../../../assets/img/profile_default.png';
import expandIcon from '../../../assets/img/expandIcon.png';
import crossIcon from '../../../assets/img/crossIcon.png';
import stepComplete from '../../../assets/img/stepcomplete.png';

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
            <div className="expand-btn" title="Expand Record" onClick={() => handleExpandClick(row)}><img src={expandIcon} alt={'...'} /></div>
          </div>
        </div>),
    },
    {
      Header: 'Name',
      id: "link",
      disableSortBy: true,
      accessor: 'learnerName',
      Cell: ({ row }) => 
      {
        if (!!row.original.profile_pic2) {
          var meta = appConstant.BASE_URL + row.original.profile_pic2.replace("dist", "");
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} alt={'...'} />{row.original.learnerName}</Link>;
        } else if (row.original.profile_pic1) {
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.profile_pic1} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} alt={'...'} />{row.original.learnerName}</Link>;
        } else {
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} alt={'...'} />{row.original.learnerName}</Link>;
        }
      },
    },
    {
      Header: 'Courses',
      accessor: 'assignedto',
      id: 'assignTo',
      disableSortBy: true,
      Cell: ({ row }) => (row.original.assignedto > 0)? row.original.assignedto : 0
    },
    {
      Header: () => <p className="th-completion">{'% Completion'}</p>,
      accessor: 'courseProgress',
      disableSortBy: true,
      Cell: ({ row }) => {
        let completeVal = Number(row.original.completion_rate),
        inPrgVal = +completeVal + +Number(row.original.in_progress/row.original.course_assigned*100).toFixed(2),
        notStVal = 100
        return row.original.completion_rate != undefined? (
          <div className="custom-multi-progress">
            <div className="progres">
              <Progress className="complete" value={completeVal} />
              <Progress className="inprogress" value={inPrgVal} />
              <Progress className="notstarted" value={notStVal} />
            </div>
            {/* <Progress multi>
              <Progress bar className="complete" value={completeVal} />
              <Progress bar className="inprogress" value={inPrgVal} />
              <Progress bar className="notstarted" value={notStVal} />
            </Progress> */}
            <div className="completion-rate">{`${row.original.completion_rate}%`}</div>
          </div>
        ) : '-- --'
      }
    },
    {
      Header: 'Scores',
      accessor: 'scores',
      Cell: ({ row }) => {
        return row.original.avg_score != null ?
        <div className="course-score">
             <span className={classnames({"good":row.original.avg_score>=80, "average": (row.original.avg_score>=40&&row.original.avg_score<80), "fail": row.original.avg_score<40})}>{`${Number(row.original.avg_score).toFixed()}%`}</span>
        </div> : '-- --'
      }
    },
    {
      Header: 'Overdue',
      accessor: 'overdue',
      disableSortBy: true,
      Cell: ({ row }) => <div>{row.original.overdue}</div>
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

export const Learners = (props) => {

    const learnerTabRef = useRef(null)
    const learnersTableRef = useRef(null)
    const [courseIntv, setCourseIntv] = useState()
    const [courseType, setCourseType] = useState()
    const [isCDMOpen, setIsCDMOpen] = useState(false)
    const [selectedRowIndex, setSelectedRowIndex ] = useState(null)
    const [analyticsLearners, setAnalyticsLearners] = useState([])
    const [averageOverDueRate, setAverageOverDueRate] = useState(0)
    const [averageCompleteRate, setAverageCompleteRate] = useState(0)
    const [averageParticipationRate, setAverageParticipationRate] = useState(0)

    useEffect(() => {
        if(props.analyticsLearners.length > 0) {
          setAnalyticsLearners(createUpdateLearnerData(props.analyticsLearners))
          setAverageOverDueRate(getAverageOverDueRate(props.analyticsLearners))
          setAverageCompleteRate(getAverageCompleteRate(props.analyticsLearners))
          setAverageParticipationRate(getAverageParticipationRate(props.analyticsLearners))
        } else {
          setAnalyticsLearners([])
          setAverageOverDueRate(0)
          setAverageCompleteRate(0)
          setAverageParticipationRate(0)
        }
    }, [props.analyticsLearners])

    useEffect(() => {
      // if(props.analyticsLearnerDetails.length > 0){
        setTimeout(() => {
          try {
            learnerTabRef.current.scrollIntoView({block: 'start', behavior: 'smooth'}) 
          } catch (error) {
            console.log("Browser not supported")
          }        
        }, 200);
      // }
    }, [props.analyticsLearnerDetails])

    useEffect(() => {
        fetchCourses()
    }, [courseIntv, courseType])
    
    const fetchCourses = () => {
        // Call api to fetch data
        let params = {
            "interval": courseIntv || 'all',
            "c_type": courseType || 'all'
        }
        props._get_analytics_learners(params)
    }

    const createUpdateLearnerData = (data) => {    
        return data.map(learner => (
          {
            ...learner,
            learnerName: `${learner.f_name} ${learner.l_name}`,
            assignedto: learner.course_assigned,
            user_id: learner.user_id,
            completion: learner.completion_rate,
            scores: learner.avg_score,
            overdue: learner.overdue
          }
        ))
    }

    const getAverageOverDueRate = (data) => {
        let totalOverdue = _.sumBy(data, (o)=> Number(o.overdue_rate))
        return Math.round(totalOverdue/data.length)
    }

    const getAverageCompleteRate = (data) => {
        let totalCompletion = _.sumBy(data, (o)=> Number(o.completion_rate))
        return Math.round(totalCompletion/data.length)
    }

    const getAverageParticipationRate = (data) => {
        let totalParticipationRate = _.sumBy(data, (o)=> Number(o.participation_rate))
        return Math.round(totalParticipationRate/data.length)
    }

    const onChangeCourseIntv = (intv) => {
        console.log("setCourseIntv", intv)
        setCourseIntv(intv)
    }
    
    const onChangeCourseType = (type) => {
        console.log("setCourseType", type)
        setCourseType(type)
    }

    const globalClick = (e) => {
      // function to close courseDetailModal from outside click
      if (isCDMOpen === true && e.target.closest('#courseDetailModal #rightView') === null) {
        setIsCDMOpen(false); setSelectedRowIndex(null);
        setTimeout(() => {
          try {
            learnersTableRef.current.scrollIntoView({block: 'center', behavior: 'smooth'}) 
          } catch (error) {
            console.log("Browser not supported")
          }
        }, 100);
      }
    }

    const handleLearnerSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value
    
        if(!!searchTxt === false) {
          if(props.analyticsLearners.length > 0) {
            setAnalyticsLearners(createUpdateLearnerData(props.analyticsLearners))
            setAverageOverDueRate(getAverageOverDueRate(props.analyticsLearners))
            setAverageCompleteRate(getAverageCompleteRate(props.analyticsLearners))
            setAverageParticipationRate(getAverageParticipationRate(props.analyticsLearners))
          } else {
            setAnalyticsLearners([])
            setAverageOverDueRate(0)
            setAverageCompleteRate(0)
            setAverageParticipationRate(0)
          }
          return false
        }
    
        let filteredLearners = analyticsLearners.filter(learner => (learner.f_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1 || learner.l_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1))
    
        if(filteredLearners.length > 0) {
          setAnalyticsLearners(createUpdateLearnerData(filteredLearners))
          setAverageOverDueRate(getAverageOverDueRate(filteredLearners))
          setAverageCompleteRate(getAverageCompleteRate(filteredLearners))
          setAverageParticipationRate(getAverageParticipationRate(filteredLearners))
        } else {
          setAnalyticsLearners([])
          setAverageOverDueRate(0)
          setAverageCompleteRate(0)
          setAverageParticipationRate(0)
        }
    }

    const handleExpandClick = (row) => {
        console.log(row)
        setIsCDMOpen(true)
        setSelectedRowIndex(row.index)
        if(row.original.user_id) {
          let params = {
            "interval": courseIntv || 'all',
            "c_type": courseType || 'all',
            "id": row.original.user_id
          }
          props._get_analytics_learner_by_id(params)
        }
    }

    const onCloseLearnerDetailsModal = () => {
        console.log(learnersTableRef.current)
        setIsCDMOpen(false); 
        setSelectedRowIndex(null);
        setTimeout(() => {
          try {
            learnersTableRef.current.scrollIntoView({block: 'center', behavior: 'smooth'}) 
          } catch (error) {
            console.log("Browser not supported")
          }
        }, 100);
    }

    return (
    <Row onClick={globalClick}>
        <Col lg={12} className="pl-0 pr-0">
            <div className="table-responsive learners-content courses-tbl" ref={learnerTabRef}>
                <Row className="card report-card">
                    <Col>
                        <div className="label">Learners</div>
                        <div className="value">{analyticsLearners.length}</div>
                    </Col>
                    <Col>
                        <div className="label">Overdue</div>
                        <div className="value danger">{`${averageOverDueRate}%`}</div>
                        <Progress className="mylearning-progress-value" color={'danger'} value={averageOverDueRate}><span className="progress-value">{`${averageOverDueRate}%`}</span></Progress>
                    </Col>
                    <Col>
                        <div className="label">Completion</div>
                        <div className="value">{`${averageCompleteRate}%`}</div>
                        <Progress className="mylearning-progress-value" value={averageCompleteRate}><span className="progress-value">{`${averageCompleteRate}%`}</span></Progress>
                    </Col>
                    <Col>
                        <div className="label">Participation</div>
                        <div className="value">{`${averageParticipationRate}%`}</div>
                        <Progress className="mylearning-progress-value" value={averageParticipationRate}><span className="progress-value">{`${averageParticipationRate}%`}</span></Progress>
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
                            <Input type="search" placeholder="Find a member" aria-label="Search" onChange={handleLearnerSearch} />
                            <Button type="submit" className="searchCourseSubBtn"><i className="fa fa-search" /></Button>
                          </Form> */}
                          <div className="form-group has-search my-2">
                            <Input type="search" className="form-control" placeholder="Find a member" onChange={handleLearnerSearch}  />
                            <span className="fa fa-search form-control-feedback"></span>
                          </div> 
                        </Col>
                        <Col md={5} sm={12}>
                            <div className="statuses">
                            <div className="status status-complete"><span className="status-color"></span>Complete</div>
                            <div className="status status-in-progress"><span className="status-color"></span>In Progress</div>
                            <div className="status status-not-started"><span className="status-color"></span>Not Started</div>
                            </div>
                        </Col>
                        <Col md={3} sm={12}>
                            <div className="other-info">
                            <div className="score-percent">Pass Score > 80%</div>
                            </div>
                        </Col>
                        </Row>
                    </Col>
                    {/* change Col to div because Col component does not have ref property */}
                    <div className="col-sm-12" ref={learnersTableRef}>
                        <Styles>
                            <SelectTable columns={columns} data={analyticsLearners} handleExpandClick={handleExpandClick} selectedRowIndex={selectedRowIndex} />
                        </Styles>
                    </div>
                </Row>

                {isCDMOpen &&
                    <LearnerDetails
                        selectedRowIndex={selectedRowIndex}
                        analyticsLearners={analyticsLearners}
                        analyticsLearnerDetails={props.analyticsLearnerDetails}
                        isALDLoading={props.isALDLoading}
                        onClose={onCloseLearnerDetailsModal}
                    />
                }

            </div>  
        </Col>
    </Row>          
    )
    
}

const LearnerDetails = ({
    selectedRowIndex,
    analyticsLearners,
    analyticsLearnerDetails,
    isALDLoading,
    onClose
}) => {

  const doughnutConfig = {
    responsive: true, 
    cutoutPercentage: 90, 
    tooltips: { enabled: true }, 
    legend:{ display: false }
  }
  const selectedLearner = analyticsLearners[selectedRowIndex];

  const [selectedRow, setSelectedRow] = useState(null);

  analyticsLearnerDetails.sort((a,b) => {
    return b.avg_score - a.avg_score
  });

  const onCancel = (e) => {
    e.preventDefault(); 
    onClose()
  }

  const lDetails = analyticsLearnerDetails.map((learner, i) => {
    
    return (
      <Row key={`crs-${i}`} className={classnames({"px-2 py-3 pb-4 listing": true})}>
        <Col sm="5" className="d-flex">
          <div className="step-complete-icon">
            <img className={"ts-icon icon-check"} src={stepComplete} style={{marginRight: '25px', width: '27px', height: '27px'}} alt={'...'} />
          </div>
          
          <Link to={`${ROUTES.COURSE}/${learner.c_id}`} >{learner.course_title}</Link>  
        </Col>
        <Col sm="4" className="course-score">
          {learner.avg_score != null ? <span className={classnames({"good":learner.avg_score>=80, "average": (learner.avg_score>=40&&learner.avg_score<80), "fail": learner.avg_score<40})}>{`${Number(learner.avg_score).toFixed()}%`}</span> : '-- --'}
        </Col>
        <Col sm="3">
          {learner.completion_time !== null ? learner.completion_time + ' weeks' : '-- --'}
        </Col>
      </Row>
    )
  });

  const learnersDoughnutData = [selectedLearner.completed, selectedLearner.in_progress, selectedLearner.not_started];
  const avgScoreDoughnutData =  [selectedLearner.completed, selectedLearner.in_progress, selectedLearner.not_started];
  const notOverdue = selectedLearner.course_assigned - selectedLearner.overdue
  const overdueDoughnutData = [notOverdue, selectedLearner.overdue];

  const getAvgScores = () => {
    let avgscores = []
    let goodScr = 0
    let avgScr = 0
    let lowScr = 0
    
    analyticsLearnerDetails.forEach(course => {
       if(course.avg_score != null){
         if(course.avg_score >= 80){
          ++goodScr
         } else if(course.avg_score >= 40) {
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
    let sc = analyticsLearnerDetails.filter(course => course.avg_score != null)
    if(sc.length === 0) return 0
    let sumAvg = _.sumBy(sc, (o)=> Number(o.avg_score))
    return sumAvg/sc.length
  }

  let metaImg= '';
    if(!!selectedLearner.profile_pic2) {
      metaImg = appConstant.BASE_URL + selectedLearner.profile_pic2.replace("dist", "");
    }  else if(selectedLearner.profile_pic1) {
      metaImg = selectedLearner.profile_pic1;
    } else {
      metaImg = defaultPP;
    }

  return (
    <Row id="courseDetailModal" className="h-100">
      <Col lg="6" id="leftView" className="p-0"></Col>
      <Col lg="6" id="rightView" className="px-lg-2">
        <Row>
          <Col className="d-flex">
            <div className="list-header flex-fill">
              <div className="list-title d-flex pb-3 pt-3 pl-3 pr-2">
                <div>
                  <img src={metaImg} style={{borderRadius: '50%', marginRight: '35px', width: '66px', height: '66px'}} alt={'...'} />
                </div>  
                <div className="user-name">
                  <span>{selectedLearner.f_name} {selectedLearner.l_name}</span>
                  <div className="profile-link mt-1">
                    <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: selectedLearner.user_id}}}>View Profile</Link>
                  </div> 
                </div> 
              </div>
            </div>
            <div className="pull-right cancel-icon mt-2" onClick={onCancel}>
              <img src={crossIcon} className="icon" alt={'...'} />
            </div>
          </Col>
        </Row>
        <div className="listing-seperator"></div>
        <Row>
          <Col> 
          {isALDLoading? "Loading...": analyticsLearnerDetails.length>0 ?
          <>
            <Row className="dougnut-wrapper">
              <Col sm="4">
                <Doughnut data= {{
                  labels: ["Completed", "In Progress", "Not Started"],
                  datasets: [
                    {
                      data: learnersDoughnutData,
                      backgroundColor: ['#33ca6f', '#b2d3bf', '#8494a5'],
                      borderWidth: 0
                    }
                  ]
                }} 
                options={{ ...doughnutConfig }} 
                />
                <div className="course-stats">
                  <div>{selectedLearner.course_assigned}</div>
                  <div>Courses</div>
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
                      data: overdueDoughnutData,
                      backgroundColor: ['#f7a482', '#eb0000'],
                      borderWidth: 0
                    }
                  ]
                }} 
                options={{ ...doughnutConfig }} 
                />
                <div className="course-stats">
                  <div>{`${selectedLearner.overdue_rate}%`}</div>
                  <div>Overdue</div>
                </div>
              </Col>
            </Row>
            <div className="listing-seperator"></div>
            {lDetails}
          </>
           : ""}
          </Col>
        </Row>
      </Col>
    </Row>
  )

}

const mapStateToProps = ({analytics}) => ({
    ...analytics
})
  
const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
    _get_analytics_learners:       get_analytics_learners,
    _get_analytics_learner_by_id:  get_analytics_learner_by_id
    },
    dispatch
)

export default connect(
mapStateToProps,
mapDispatchToProps
)(Learners)