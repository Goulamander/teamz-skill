import React, {Component} from 'react'

import { Link } from 'react-router-dom'

import { Progress } from 'reactstrap'
import { ROUTES } from '../../../constants/routeConstants'
import { nestedCourseForm } from '../../../constants/appConstants'
import CustomActionBox from '../../../component/CustomActionBox'
import EditCourseModal from '../../../component/common/EditNewCourse';
import CourseRecommendModal from '../../../component/common/Recommend';
import Can from '../../../component/Can'
import { getUserRoleName } from '../../../transforms'

const routeResource = "COMPONENT"

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
    let { myCourses } = this.props
    return (
      <div className="courses-box">
        <Can
          role={getUserRoleName()}
          resource={routeResource}
          action={"SHOW:ALLCOURSES"}
          yes={(attr) => (
            <>
            <h3 className="text-center">Courses</h3>
            <div className="d-flex justify-content-between pt-4 mb-4">
              <Link to={ROUTES.COURSES_LIBRARY} className="btn btn-add-course btn-all-course">All Courses</Link>
              <Link to={ROUTES.MY_COURSES} className="btn btn-primary btn-add-course">My Courses</Link>
            </div>  
            <hr className="mb-4" />
            <h3>Courses I'm taking</h3>
            </>
          )}
          no={() => (
            <h3>Courses I'm taking <Link to={ROUTES.MY_COURSES} className="btn btn-primary btn-add-course">My Courses</Link></h3>
          )}
        />

        {myCourses.courses.length > 0 && 
          myCourses.courses.slice(0,3).map((course, index) => {
            let courseAuthor = (course.c_author_name)? `${course.c_author_name} - `: '';

            return (
              <div key={`course-${index}`} className="courses-list">
                <div className="action-bottom-dots">
                  <CustomActionBox listData={nestedCourseForm} handleClick={(key) => this.handleDraftActions(key, course, index)}/>
                </div>
                <h4>{course.c_name}</h4>
                <p>
                  <span>Course by </span>
                  <a href={course.c_link}>{courseAuthor}{course.c_by}</a>
                </p>

                <Progress value={course.c_progress}><span className="progress-value">{`${course.c_progress}%`}</span></Progress>
              </div>
            )
          })
        }
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
        }
      </div>
    )
  }
}

export default MyCourses

