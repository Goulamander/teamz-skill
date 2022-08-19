import React, {Component, Fragment} from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import courseImgDefault from '../../../assets/img/course_small_default.jpg';
import { courseTypes, appConstant } from '../../../constants/appConstants';
import AssignedCoursesList from '../../../component/common/AssignedCourses';
import { getTenantSite } from '../../../transforms';
import ampereLogo from '../../../assets/img/ampere.png';
import default_logo from '../../../assets/img/your_logo.png'
import { get_custom_assign_courses } from '../../../actions/myCourses';

class AssignedPublicView extends Component{
    constructor(props) {
    super(props)
    this.state={
        viewAllCourses: false
    }
    this.customerName = "TZS"
    this.setCustomerName()
    }

    setCustomerName = () => {
        let cust = getTenantSite()
        if(cust !== 'app') {
          this.customerName = cust
        }
        if(cust === 'ampere') {
          this.customerName = cust
        }
    }

    renderToggleViewBtn = () => {
        let label = this.state.viewAllCourses? 'View less' : 'View all' 
    
        return(
          <h4 className="common-head">Assigned Courses In Progress<a className="view-btn float-right" href="javascript:void(0)" onClick={this.toggleViewAllCourses}>{label}</a></h4>
        )
    }

    toggleViewAllCourses = () => {
      this.setState({
        viewAllCourses: !this.state.viewAllCourses
      })
    }

    render(){
        const {assignCourses} = this.props;
        const {viewAllCourses} = this.state;
        const assignCourseData = assignCourses && assignCourses.length > 0 ? assignCourses : '';
        let courseData = viewAllCourses? assignCourseData :  assignCourseData.slice(0,3)
        return(
            <div className="events-box">
                <Fragment>
                    {
                    this.renderToggleViewBtn()
                    }
                    {assignCourses && assignCourses.length == 0 && 
                    <Col>
                        <h4 className="no-course my-5 py-5">No assigned course in progress</h4>
                    </Col>
                    }
                    {assignCourses && assignCourses.length > 0 &&
                    <div className="events-card">
                    <Row>
                        {courseData.map((c_course, index) => {
                            // static ampere logo for customer courses
                            c_course.merchant_logo = null;
                            if(this.customerName == 'ampere'){
                            c_course.merchant_logo = ampereLogo;
                            }
                                    let courseImg = courseImgDefault,
                                    cLogo = c_course.merchant_logo || default_logo,
                                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"

                                    if(!!c_course.c_image === true){
                                    courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                                    }
                                    
                                return (
                                <AssignedCoursesList key={`course-${index}`} courseImg={courseImg} cLogo={cLogo} c_course={c_course} shortDes={shortDes} />
                                )
                            })
                        }
                    </Row>
                </div>
                }
            </Fragment>
        </div>
        );
    }
}

export default AssignedPublicView;