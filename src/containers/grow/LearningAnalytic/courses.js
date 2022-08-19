import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Input, Form, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import styled from 'styled-components'
import classnames from 'classnames'
import SweetAlert from 'react-bootstrap-sweetalert';
import _ from 'lodash'
import { Doughnut } from 'react-chartjs-2';
import ShowMoreText from 'react-show-more-text';
import StarRatingComponent from 'react-star-rating-component';

import HalfStarRating from '../../../component/TZS_Rating/HalfStarRating';
import TZS_Rating from '../../../component/TZS_Rating';
import { ConfirmationBox } from '../../../component/ConfirmationBox'
import { custCourseStepTypeConstant } from '../../../constants/appConstants'

import SelectTable from '../../../component/SelectTable'
import Can from '../../../component/Can'
import { ROUTES } from '../../../constants/routeConstants'
import { get_oembed } from '../../../actions/customCourse'
import { get_analytics_courses, get_analytics_course_by_id, delete_learning_analytics_courses } from '../../../actions/analytics'
import { appConstant, filterIntervals, filterCType } from '../../../constants/appConstants'
import defaultPP from '../../../assets/img/profile_default.png'
import expandIcon from '../../../assets/img/expandIcon.png'
import delIcon from '../../../assets/img/quiz/del-icon.png'
import crossIcon from '../../../assets/img/crossIcon.png'
import { iframeyStepLinks, youtubeRegx, getUserRoleName, checkCourseRowSelected } from '../../../transforms'
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, handleExpandedClick, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const columns = [
  {
    Header: ({ getToggleAllRowsSelectedProps, isAllRowsSelected, selectedFlatRows }) => {
      return (
      <div>
        <div>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      </div>
      )
    },
    accessor: 'index',
    disableSortBy: true,
    Cell: ({row, handleExpandClick, selectedFlatRows}) => {
      let isSelected = checkCourseRowSelected(row, selectedFlatRows)
      return (
      <div className="">
          <p className={classnames({"cell-index": true, "d-none": isSelected})}>{row.index+1}</p>
          <div className={classnames({"select-row-input":true, "d-none" : !isSelected})}>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()}/>
            <div className="expand-btn" title="Expand Record" onClick={() => handleExpandClick(row)}><img src={expandIcon} /></div>
          </div>
    </div>)},
  },
  {
    Header: 'Name',
    id: "link",
    disableSortBy: true,
    accessor: 'coursename',
    Cell: ({ row }) => <Link to={`${ROUTES.COURSE}/${row.original.id}`}>{row.original.coursename}</Link>
  },
  {
    Header: 'Assigned To',
    accessor: 'assignedto',
    sortDescFirst: true,
    id: 'assignTo',
    Cell: ({ row }) => (row.original.assignedto > 0)? row.original.assignedto : 0
  },
  {
    Header: () => <p className="th-completion">{'% Completion'}</p>,
    accessor: 'courseProgress',
    disableSortBy: true,
    Cell: ({ row }) => {
      let completeVal = Number(row.original.completion_rate),
      inPrgVal = +completeVal + +Number(row.original.in_progress/row.original.assigned_user*100).toFixed(2),
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

export const Courses = (props) => {

  const courseTabRef = useRef(null)
  const coursesTableRef = useRef(null)
  const [courseIntv, setCourseIntv] = useState()
  const [courseType, setCourseType] = useState()
  const [isCDMOpen, setIsCDMOpen] = useState(false)
  const [isCDM2Open, setIsCDM2Open] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex ] = useState(null)
  const [analyticsCourses, setAnalyticsCourses] = useState([])
  const [averageOverDueRate, setAverageOverDueRate] = useState(0)
  const [averageCompleteRate, setAverageCompleteRate] = useState(0)
  const [averageParticipationRate, setAverageParticipationRate] = useState(0)
  const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
  const [isCourseDeletion, setIsCourseDeletion] = useState(true);
  const [isAddedCoursesDeleted, setIsAddedCoursesDeleted] = useState(false);
  const [isAddedCoursesDeleteErr, setIsAddedCoursesDeleteErr] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState([]);

  useEffect(() => {
    if(props.analyticsCourses.length > 0) {
      setAnalyticsCourses(createUpdateCourseData(props.analyticsCourses))
      setAverageOverDueRate(getAverageOverDueRate(props.analyticsCourses))
      setAverageCompleteRate(getAverageCompleteRate(props.analyticsCourses))
      setAverageParticipationRate(getAverageParticipationRate(props.analyticsCourses))
    } else {
      setAnalyticsCourses([])
      setAverageOverDueRate(0)
      setAverageCompleteRate(0)
      setAverageParticipationRate(0)
    }
  }, [props.analyticsCourses])

  useEffect(() => {
    // if(props.analyticsCourseDetails.length > 0){
      setTimeout(() => {
        try {
          courseTabRef.current.scrollIntoView({block: 'start', behavior: 'smooth'}) 
        } catch (error) {
          console.log("Browser not supported")
        }        
      }, 200);
    // }
  }, [props.analyticsCourseDetails])

  useEffect(() => {
    fetchCourses()
  }, [courseIntv, courseType])
  
  const fetchCourses = () => {
    // Call api to fetch data
    let params = {
      "interval": courseIntv || 'all',
      "c_type": courseType || 'all'
    }
    props._get_analytics_courses(params)
  }
  const createUpdateCourseData = (data) => {    
    return data.map(course => (
      {
        ...course,
        id: course.c_id,
        coursename: course.c_title,
        createdby: `${course.fname} ${course.lname}`,
        assignedto: course.assigned_user,
        user_id: course.user_id,
        min_week: course.min_week || 0.0,
        max_week: course.max_week || 0.0
      }
    ))
  }

  const getAverageOverDueRate = (data) => {
    let totalOverdue = _.sumBy(data, (o)=> Number(o.overdue_rate))
    return Math.round(totalOverdue/data.length)
  }

  const openConfirmationModal = () => {
    if(courseToDelete.length > 0) {
      setOpenConfirmationBox(true);
    }
  }

  const closeConfBox = () => {
    setOpenConfirmationBox(false);  
  }

  const onECDeleteHandler = () => {
    let json = {
      course_ids : courseToDelete
    }
    closeConfBox();
    // console.log("courseToDelete", courseToDelete);
    props._delete_learning_analytics_courses(json, (err, success) => {
      if(err) {
        setIsAddedCoursesDeleteErr(true);
        return 
      }
      setIsAddedCoursesDeleted(true);
      fetchCourses();
    })
  }

  const getAverageCompleteRate = (data) => {
    let totalCompletion = _.sumBy(data, (o)=> Number(o.completion_rate))
    return Math.round(totalCompletion/data.length)
  }

  const getAverageParticipationRate = (data) => {
    let totalParticipationRate = _.sumBy(data, (o)=> Number(o.participation_rate))
    return Math.round(totalParticipationRate/data.length)
  }
  
  const handleCourseSearch = (e) => {
    e.preventDefault();
    let searchTxt = e.target.value

    if(!!searchTxt === false) {
      if(props.analyticsCourses.length > 0) {
        setAnalyticsCourses(createUpdateCourseData(props.analyticsCourses))
        setAverageOverDueRate(getAverageOverDueRate(props.analyticsCourses))
        setAverageCompleteRate(getAverageCompleteRate(props.analyticsCourses))
        setAverageParticipationRate(getAverageParticipationRate(props.analyticsCourses))
      } else {
        setAnalyticsCourses([])
        setAverageOverDueRate(0)
        setAverageCompleteRate(0)
        setAverageParticipationRate(0)
      }
      return false
    }

    let filteredCourses = analyticsCourses.filter(course => course.c_title.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1)

    if(filteredCourses.length > 0) {
      setAnalyticsCourses(createUpdateCourseData(filteredCourses))
      setAverageOverDueRate(getAverageOverDueRate(filteredCourses))
      setAverageCompleteRate(getAverageCompleteRate(filteredCourses))
      setAverageParticipationRate(getAverageParticipationRate(filteredCourses))
    } else {
      setAnalyticsCourses([])
      setAverageOverDueRate(0)
      setAverageCompleteRate(0)
      setAverageParticipationRate(0)
    }
  }

  const handleExpandClick = (row) => {
    setIsCDMOpen(true)
    setSelectedRowIndex(row.index)
    if(row.original.c_id)
      props._get_analytics_course_by_id(row.original.c_id)
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

  const onChangeCourseIntv = (intv) => {
    console.log("setCourseIntv", intv)
    setCourseIntv(intv)
    // fetchCourses()
  }

  const onChangeCourseType = (type) => {
    console.log("setCourseType", type)
    setCourseType(type)
    // fetchCourses()
  }

  const cancelCourseDeletion = () => {
    setIsCourseDeletion(false);
    setAnalyticsCourses(createUpdateCourseData(props.analyticsCourses))
    setAverageOverDueRate(getAverageOverDueRate(props.analyticsCourses))
    setAverageCompleteRate(getAverageCompleteRate(props.analyticsCourses))
    setAverageParticipationRate(getAverageParticipationRate(props.analyticsCourses))
  }

  const processDeleteCourses = (selectedCourses) => {
    if(selectedCourses.length > 0) {
      let courses = [];
      for(let i=0; i<selectedCourses.length; i++) {
        courses.push(selectedCourses[i].original.c_id);
      }
      setCourseToDelete(courses);
    } else {
      setCourseToDelete([])
    }
  }

  const getFlatedRowsArr = (data) => {
    processDeleteCourses(data);
    if(!isCourseDeletion) {
      setIsCourseDeletion(true);
    }
  }

  // ------Code below removed intentionally------

const mapStateToProps = ({analytics}) => ({
  ...analytics
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_analytics_courses:       get_analytics_courses,
      _get_analytics_course_by_id:  get_analytics_course_by_id,
      _get_oembed:                  get_oembed,
      _delete_learning_analytics_courses : delete_learning_analytics_courses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses)