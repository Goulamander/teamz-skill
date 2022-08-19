import React, { Component } from 'react';
import {Col} from 'reactstrap';
import CustomActionBox from '../CustomActionBox';
import { nestedCourseForm } from '../../constants/appConstants';
import defaultLinkedInImg from '../../assets/img/linkedIn_default_2.jpg';

class CoursesList extends Component{
    constructor(){
        super();
        this.state = {loaded: false};
    }

    isLinkedInImage = (link) => {
        let str = link.substr(0,24);
        if(str === "https://www.linkedin.com") {
            return true
        } else {
            return false;
        }
    }

    render(){
        const {course, cLogo, handleDraftActions, shortDes, courseImg, editAble} = this.props;
        return(
            <Col xl={4} lg={6} md={12} className={'mt-2'}>
                <div className="card course-single-group">
                    <div className="img-box">
                        <img src={courseImg} style={{display: 'none'}} onLoad={() => this.setState({loaded: true})}/>		
                        <div className="card-img-background" style={{backgroundImage: `url(${this.state.loaded ? courseImg : this.isLinkedInImage(cLogo) &&  defaultLinkedInImg})`}}></div>
                    </div>
                    <div className="card-body p-0 pt-3">
                        <h5 className="card-title"><a href={course.c_link} target={'blank'} >{course.c_name}</a></h5>
                        <div className="course-company-logo">
                            <img src={cLogo} />
                        </div>
                        {/* <ul className="card-info card-info-course">
                            <li><i className="fa fa-calendar"></i>18 lectures | 3 hours | Expert</li>
                        </ul> */}
                        <p className="card-text">{shortDes} | By {course.c_by} {(course.c_author_name) ? `- ${course.c_author_name}` : ``}</p>
                        <div className="action-bottom-dots">
                            {/* <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => this.openEditCourseModal(course, index)}></a> */}
                           { editAble == false ?  ' ' : <CustomActionBox listData={nestedCourseForm} handleClick={(key) => handleDraftActions(key, course)} /> }
                        </div>
                    </div>
                </div>
            </Col>
        );
    }
}

export default CoursesList;