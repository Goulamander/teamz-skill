import React, {Component, Fragment} from 'react';
import { Row, Col } from 'reactstrap';
import courseImgDefault from '../../../assets/img/course_small_default.jpg';
import default_logo from '../../../assets/img/your_logo.png';
import CoursesList from '../../../component/common/Courses';

class CoursesPublicView extends Component{
    state={
      editAble: false,
      viewAllCourses: false,
    }

    renderToggleViewBtn = () => {
        let label = this.state.viewAllCourses? 'View less' : 'View all' 
    
        return(
          <h4 className="common-head">Courses In Progress <a className="view-btn float-right" href="javascript:void(0)" onClick={this.toggleViewAllCourses}>{label}</a></h4>
        )
    }

    toggleViewAllCourses = () => {
      this.setState({
        viewAllCourses: !this.state.viewAllCourses
      })
    }

    render(){
        const {courses} = this.props;
        const {viewAllCourses} = this.state;
        const courseData = courses && courses.length > 0 ? courses : '';
        let coursesData = viewAllCourses? courseData : courseData.slice(0,3)
        return(
            <div className="events-box">
              {courses && courses.length == 0 && 
                    <Col className="p-0">
                      <h4 className="common-head">Courses In Progress</h4>
                        <h4 className="no-course my-5 py-5">No course in progress</h4>
                    </Col>
                    }
                {
                 courses && courses.length > 0 &&
                <Fragment>
                {
                    this.renderToggleViewBtn()
                }
                <div className="events-card">
                    <Row>
                    {coursesData.map((course, index) => {
                        let courseImg = course.c_image || courseImgDefault,
                        cLogo = course.c_logo || default_logo,
                        shortDes = course.c_short_des || ""

                        return (
                        <CoursesList course={course} courseImg={courseImg} cLogo={cLogo} shortDes={shortDes} key={`course-${index}`} editAble={this.state.editAble} />
                        )
                    })
                    }
                    </Row>
                </div>
            </Fragment>
            }
            </div>
        );
    }
}

export default CoursesPublicView;