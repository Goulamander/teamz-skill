import React, {Component} from 'react';
import {Col} from 'reactstrap';
import { ROUTES } from '../../constants/routeConstants';
import { Link, Redirect } from 'react-router-dom';

class AssignedCoursesList extends Component{
    render(){
        const {courseImg, c_course, cLogo, shortDes} = this.props;
        return(
            <Col xl={4} lg={6} md={12} className={'mt-2'}>
                <div className="card course-single-group">
                    
                    <div className="img-box">											
                    <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                    </div>
                    
                    <div className="card-body p-0 pt-3">
                    
                    <h5 className="card-title">
                        <Link to={`${ROUTES.COURSE}/${c_course.c_id}/assigned`} >{c_course.c_title}</Link>
                        </h5>
                    
                    <div className="course-company-logo">
                        <img src={cLogo} />
                    </div>
                    
                    <ul className="card-info card-info-course">
                        <li><i className="fa fa-calendar"></i>
                        { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks" : c_course.c_duration + " Week"}
                        {/* {c_course.c_duration}  */}
                        {" "}| {c_course.c_tag}</li>
                    </ul>
                    
                    <p className="card-text" title={shortDes}>{shortDes}</p>
                    {/* <div className="action-bottom-dots">
                        <a href="javascript:void(0)" className={'br-link'} onClick={() => _startAssignCourse(c_course, index)}>Start Course > </a>
                    </div> */}
                    </div>
                </div>
            </Col>
        );
    }
}

export default AssignedCoursesList;