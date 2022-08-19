import React, {Component} from 'react'

import { Link } from 'react-router-dom'

import { Progress } from 'reactstrap'
import { ROUTES } from '../../../constants/routeConstants'
import { nestedCourseForm } from '../../../constants/appConstants'
import CustomActionBox from '../../../component/CustomActionBox'
import EditCourseModal from '../../../component/common/EditNewCourse';
import CourseRecommendModal from '../../../component/common/Recommend';

class MyCourses extends Component{
  state={
    isShowEditModal: false,
    editableID: null,
    editCourseData: {},
    isShowRecommendModal: false,
    errMsg: '',
    recommendee: [
        {
        email: '',
        error: {
            email: null
        }
        },
        {
        email: '',
        error: {
            email: null
        }
        },
        {
        email: '',
        error: {
            email: null
        }
        },
    ]
  }
  handleDraftActions = (key, course, id) => {
      
    switch(key) {
      case "editCourse":
        this.setState({
          isShowEditModal: !this.state.isShowEditModal,
          editableID: id,
          editCourseData: course
        })
      break;
      case "recommendedCourse":
        this.setState({
          isShowRecommendModal: true,
          editableID: id,
          editCourseData: course
        })
      break;
        default:
    }
  }

  toggleEditCourseModal = () => {
    // this.props.this.toggleEditCourseModal()
    this.setState({
      isShowEditModal: false
    })
  }

  toggleRecommendModal = () => {
    this.setState({
      isShowRecommendModal: false,
        errMsg: '',
        recommendee: [
            {
            email: '',
            error: {
                email: null
            }
            },
            {
            email: '',
            error: {
                email: null
            }
            },
            {
            email: '',
            error: {
                email: null
            }
            },
        ]
    });
  }


  render(){
    let {isShowEditModal, editCourseData, editableID, isShowRecommendModal} = this.state
    const { courses } = this.props;
    const courseData = courses && courses.length > 0 ? courses : '';
    let courseAuthor = (courseData.c_author_name)? `${courseData.c_author_name} - `: '';
    return (
      <div className="courses-box">
        <h3>Courses I'm taking</h3>
       
      { courseData && courseData.length > 0 && courseData.slice(0,3).map((course, index)=>{
      return <div className="courses-list" key={index}>
        <div className="action-bottom-dots">
          {/* <CustomActionBox listData={nestedCourseForm} handleClick={(key) => this.handleDraftActions(key, course)}/> */}
        </div>
        <h4>{course.c_name}</h4>
        <p>
          <span>Course by </span>
          <a href={course.c_link}>{courseAuthor}{course.c_by}</a>
        </p>

        <Progress value={course.c_progress}><span className="progress-value">{`${course.c_progress}%`}</span></Progress>
      </div>})
  }

{/* edit and recommend model */}
{/*     
        { isShowEditModal &&
          <EditCourseModal 
            editCourseData={editCourseData}
            isShowEditModal={isShowEditModal}
            editableID={editableID}
            toggleEditCourseModal={this.toggleEditCourseModal}
          />
        }
        { isShowRecommendModal &&
          <CourseRecommendModal 
            editCourseData={editCourseData}
            isShowRecommendModal={isShowRecommendModal}
            editableID={editableID}
            toggleRecommendModal={this.toggleRecommendModal}
          />
        } */}
      </div>
    )
  }
}

export default MyCourses

