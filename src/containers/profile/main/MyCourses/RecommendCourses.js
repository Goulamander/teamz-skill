import React, {Component, Fragment, seState, useEffect, useRef, useState} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'

import {
  fetchRecommendCourses
} from '../../../../actions/myCourses'
import { Loader } from '../../../../component/Loader'
import courseImgDefault from '../../../../assets/img/course_small_default.jpg'
import defaultLinkedInImg from '../../../../assets/img/linkedIn_default_1.jpg';

class RecommendCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewAllCourses: false,
      loaded: false
    }
  }

  componentDidMount() {
    this.props._fetchRecommendCourses();
  }

  toggleViewAllCourses = () => {
    this.setState({
      viewAllCourses: !this.state.viewAllCourses
    })
  }

  renderToggleViewBtn = () => {
    let label = this.state.viewAllCourses? 'View less' : 'View all' 

    return(
      <h4 className="common-head">Recommended Courses for You <a className="view-btn float-right" href="javascript:void(0)" onClick={this.toggleViewAllCourses}>{label}</a></h4>
    )
  }

  render() {
    let { recommendCourses, isLoading } = this.props.myCourses
    let { viewAllCourses } = this.state
    
    // filter fruitful data only
    let filterCourses = recommendCourses.filter(course => course.length > 0)

    let coursesData = []
    // filterCourses.forEach(course => {
    //   recommendCoursesFlatList = [...recommendCoursesFlatList, ...course.courses]
    // })
    if(filterCourses.length) {
      var myNewArray = filterCourses.reduce(function(prev, curr) {
        return prev.concat(curr);
      });

      // Temporary logic to bubble new records
      myNewArray.sort((obj1, obj2) => !!obj1.is_new? -1 : 1)


      coursesData = viewAllCourses? myNewArray.slice(0,15) : myNewArray.slice(0,3)
    }

    return (
        
      <div className="events-box">
        {recommendCourses.length > 0 &&
        <Fragment>
          {
            this.renderToggleViewBtn()
          }
          <div className="events-card">
            <Row>
              {coursesData.map(
                (r_course, index) => (
                <Fragment>
                  <RenderRecommendCourse r_course={r_course} index={index} />
                </Fragment>  
              ))
              }
            </Row>
          </div>
      </Fragment>
      }
       <Loader isLoading={isLoading} />

      </div>
    )
  }
}

const RenderRecommendCourse = (props) => {
  let {r_course, index} = props;
  let courseImg = r_course.merchant_image_url || courseImgDefault,
  shortDes = r_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline";
  
  const [loaded, setLoaded] = useState(false);
  
  return (
  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
    <div className="card course-single-group">
      <div className="img-box">
        <img src={courseImg} style={{display: 'none'}} onLoad={() => setLoaded(true)}/>

        { loaded ? <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div> : 
          <div className="card-img-background-default" style={{backgroundImage: `url(${defaultLinkedInImg})`}}></div>
        }
      </div>
      <div className="card-body p-0 pt-3">
        <h5 className="card-title"><a href={r_course.merchant_deep_link} target={'blank'} >{r_course.c_name}</a></h5>
        <div className="course-company-logo">
          <p>{r_course.merchant_name? r_course.merchant_name: ''}</p>
        </div>
        <ul className="card-info card-info-course">
          <li><i className="fa fa-calendar"></i>{r_course.course_duration} {r_course.skill_value !== "Default" ? `| ${r_course.skill_value}`: ``}</li>
        </ul>
        <p className="card-text" title={shortDes}>{shortDes} 
        </p>
        
        <p className="by-card-text">| By {r_course.course_provider}</p>
        {/* <div className="action-bottom-dots">
          <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => this.openEditCourseModal(course, index)}></a>
        </div> */}
      </div>
    </div>
  </Col>
)
}

const mapStateToProps = ( state ) => ({
  myCourses: state.myCourses
})

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      _fetchRecommendCourses: fetchRecommendCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecommendCourses)
