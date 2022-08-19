import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { Row, Col, Input } from 'reactstrap'
import StarRatingComponent from 'react-star-rating-component'

import './css/style.css'
import cldrIcon from '../../../assets/img/calendr.png'

import { custCourseStepTypeConstant } from '../../../constants/appConstants'
import TZS_Rating from '../../../component/TZS_Rating'
import HalfStarRating from '../../../component/TZS_Rating/HalfStarRating'
import { save_feedback } from '../../../actions/ccStepFeedback'
import { get_oembed } from '../../../actions/customCourse'
import { ROUTES } from '../../../constants/routeConstants';
import { iframeyStepLinks, youtubeRegx } from '../../../transforms'

class FeedbackDetails extends Component {

  state={
    what_went: '',
    what_improve: '',
    acpp: 0,
    cvp: 0,
    hd: 0,
    spp: 0,
    cs: 0,
    ccca: 0,
    bca: 0,
    ae: 0,
    storytelling: 0,
    cp: 0,
    cqh: 0,
    caat: 0,
    
    v_err: {
      what_went: null,
      what_improve: null,
      overall_rating: null,
    },
    embededVideoLink: null
  }

  componentDidMount() {
    this.extractVideoLink()
  }

  extractVideoLink = async () => {
    let { feedbackData, _get_oembed } = this.props
    let videoLink = feedbackData.video_url || ''
    if(feedbackData.course_step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO){
      if(youtubeRegx.test(videoLink)) {
        await _get_oembed(videoLink, (res) => {
          // console.log("_get_oembed", !!res.html)
          if(!!res.html === true){
            // extract src from oembed's embed code response
            let embedUrl = res.html.split('src=')[1].split(/[ >]/)[0].replace('"', '').replace('"', '')
            this.setState({
              embededVideoLink: embedUrl
            })
          } else {
            this.setState({
              embededVideoLink: false
            })
          }
        })
      } else {
        let elink = await iframeyStepLinks(videoLink)
        this.setState({
          embededVideoLink: elink
        })
      }
    }

  }
  renderVideoLink = (link) => {
    let {embededVideoLink} = this.state
    if(embededVideoLink) {
      return <div className="embed-responsive embed-responsive-16by9"><iframe id="videoPlayer" className="embed-responsive-item" src={embededVideoLink} allowFullScreen /></div>
    } else if(embededVideoLink === null) {
      return <div id="videoPlayerLoader" className="embed-responsive embed-responsive-16by9">{'Loading...'}</div>
    } else {
      return <div className="embed-responsive embed-responsive-16by9">
        {/* <iframe id="videoPlayer" className="embed-responsive-item" src={link} allowFullScreen /> */}
        <div className="embed-responsive-item" allowFullScreen>
          <div className="no-iframe">
            Open in new window.&nbsp;<a href={link} target="_blank">{'Click here '}</a>
          </div>
        </div>  
      </div>
    }
  }

  onChange = (e) => {
    let {name, value} = e.target
    this.state[name] = value
    if(this.state.v_err[name] === true || !!value === true) {
      this.state.v_err[name] = false
    }
    this.setState(this.state)
  }

  _onStarClick = (nextValue, prevValue, name) => {
    this.state[name]=nextValue
    this.state.v_err.overall_rating = false
    this.setState(this.state)
  }

  calculateOverallRating = () => {
    let { feedbackType, feedbackData } = this.props;
    let type = feedbackData.course_step_type

    let { acpp,cvp,hd,spp,cs,ccca,bca,ae,storytelling,cp,cqh,caat } = this.state
    if(feedbackType === "FORME") {
      acpp = this.props.feedbackData.acpp
      cvp = this.props.feedbackData.cvp
      hd = this.props.feedbackData.hd
      spp = this.props.feedbackData.spp
      cs = this.props.feedbackData.cs
      ccca = this.props.feedbackData.ccca
      bca = this.props.feedbackData.bca
      ae = this.props.feedbackData.ae
      storytelling = this.props.feedbackData.storytelling
      cp = this.props.feedbackData.cp
      cqh = this.props.feedbackData.cqh
      caat = this.props.feedbackData.caat
    }
 

    if(type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO){
      return ((acpp+cvp+hd+spp+cs+ccca)/6).toFixed(1)
    } else {
      return ((bca+ae+storytelling+cp+cqh+caat)/6).toFixed(1)
    }
  }

  onSubmit = () => {
    let { feedbackData, _save_feedback, history } = this.props
    let data = {
      ...this.state,
      course_id: feedbackData.course_id,
      assign_to: feedbackData.assign_to
    }
    if(this.isValidation()) {
      // console.log("onsubmit", data)
      _save_feedback(data, () => {

        setTimeout(() => {
          let { feedbackSaveError } = this.props
          if(!!feedbackSaveError === false){
            history.replace(ROUTES.PRAISE, ROUTES.PRAISE);
          } else {
            alert(feedbackSaveError)
          }
        }, 200)        
      })
    }

  }

  isValidation = () => {
    let { what_improve, what_went, v_err } = this.state
    
    v_err.what_improve = !(!!what_improve)
    v_err.what_went = !(!!what_went)
    v_err.overall_rating = this.calculateOverallRating() > 0? false : true 
    this.setState({
      v_err: v_err
    })
    if(Object.values(v_err).includes(true)) {
      return false
    }
    return true
  }

  render() {
    let { feedbackData, feedbackType } = this.props,
        title = feedbackData.course_title || '',
        desc = feedbackData.course_description || '',
        videoLink = feedbackData.video_url || '',
        videoBy = `${feedbackData.first_name} ${feedbackData.last_name}`,
        videoSubDate = feedbackData.submitted_date || null,
        videoReviewDate = feedbackData.review_date || null,
        courseStepType = feedbackData.course_step_type || null

    let { what_went, what_improve, v_err } = this.state

    return(
      <div className="main-page page-admin praise no-tabs praise-nopadding">
        <section className="main-content">
          <div id="custom-course-step-feedback" className="tsz-container">
            <Row>
              <Col md="12">
                <div className="separator-border mt-2"></div>
              </Col>
            </Row>
            <Row className="feedback-form-container">
              <Col md="12">
                <Row>
                  <Col xl="8" md="12" className="f-leftarea px-0 pr-md-2">
                    <div className="card video-sec">
                      <div className="video-wrapper">
                        {courseStepType === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO && 
                          <video id="videoPlayer" src={videoLink} controls autoPlay={false} />
                        }
                        {courseStepType === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO && 
                          this.renderVideoLink(videoLink)
                        }
                      </div>
                    </div>
                    <div className="card mt-1 px-2 px-lg-4" style={{minHeight: '40vh'}}>
                      <div className="course-info mt-4">
                        <p className="f-c-desc">{desc}</p>
                      </div>
                      {
                        feedbackType=== "REQUESTED" &&
                        <div className="video-info p-2">
                          <Row>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p className="emph-box text-center">Submitted by</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p className="author-name">{videoBy}</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0" className="p-0">
                              <img className="icon" src={cldrIcon} alt=""/>
                              <p>Submission date</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p>{moment(videoSubDate).format('MM/DD/YYYY')}</p>
                            </Col>
                          </Row>
                        </div>
                      }
                      { 
                        feedbackType === "FORME" &&
                        <div className="video-info p-3">
                          <Row>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p className="emph-box text-center">Reviewed By</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p className="author-name">{videoBy}</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <img className="icon" src={cldrIcon} alt=""/>
                              <p>Reviewed date</p>
                            </Col>
                            <Col md="3" sm="6" className="py-sm-2 py-md-0">
                              <p>{moment(videoReviewDate).format('MM/DD/YYYY')}</p>
                            </Col>
                          </Row>
                        </div>
                      }
                      
                      <ReviewCriteria 
                        feedbackType={feedbackType} 
                        data={feedbackData} 
                        {...this.state} 
                        overallRating={this.calculateOverallRating()}
                        _onStarClick={this._onStarClick}
                      />
                    </div>
                    
                  </Col>
                  <Col xl="4" md="12" className="card f-rightarea">
                    <div className="course-info">
                      <h4 className="f-c-title">{title}</h4>
                    </div>
                    <div className="f-wht-wnt-well">
                      <h4>Feedback - what went well </h4>
                      {feedbackType === "FORME"? 
                        <Input 
                          id="wht-wnt-wl" 
                          type="textarea" 
                          placeholder="Write your feedback or use your device mic to record." 
                          name="what_went"
                          value={feedbackData.what_went}  
                        />
                      :
                        <Input 
                          id="wht-wnt-wl" 
                          type="textarea" 
                          placeholder="Write your feedback or use your device mic to record." 
                          name="what_went"
                          value={what_went} 
                          onChange={this.onChange} 
                          invalid={v_err.what_went}  
                        />
                      }
                    </div>
                    <div className="f-wht-cn-imp">
                      <h4>Feedback - what can improve </h4>
                      {feedbackType === "FORME"? 
                        <Input 
                          id="wht-cn-imp" 
                          type="textarea" 
                          placeholder="Write your feedback or use your device mic to record." 
                          name="what_improve"
                          value={feedbackData.what_improve}
                        />
                      :
                        <Input
                          id="wht-cn-imp" 
                          type="textarea" 
                          placeholder="Write your feedback or use your device mic to record." 
                          name="what_improve"
                          value={what_improve} 
                          onChange={this.onChange} 
                          invalid={v_err.what_improve}  
                        />
                    }
                    </div>
                    { feedbackType === "REQUESTED" &&
                    <div className="action-btn">
                      <button className="btn btn-theme" onClick={this.onSubmit}>Submit Review</button>
                    </div>
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = ({ router, stepFeedback }) => ({
  router,
  ...stepFeedback
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _save_feedback  : save_feedback,
      _get_oembed     : get_oembed
    },
    dispatch
  )

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackDetails))

const ReviewCriteria = ({
  feedbackType,
  data,
  acpp,
  cvp,
  hd,
  spp,
  cs,
  ccca,
  bca,
  ae,
  storytelling,
  cp,
  cqh,
  caat,
  v_err,
  overallRating,
  _onStarClick
}) => {
  let { course_step_type } = data,
      readMode = feedbackType === "REQUESTED"? false : true

  if(course_step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO){
    let criteriaData = [
      {
        label: "Articulation of customer pain point",
        name: 'acpp',
        value: readMode ? data.acpp : acpp
      },
      {
        label: "Clarity of value proposition",
        name: 'cvp',
        value: readMode ? data.cvp : cvp
      },
      {
        label: "Highlight differentiation",
        name: 'hd',
        value: readMode ? data.hd : hd
      },
      {
        label: "Share proof points",
        name: 'spp',
        value: readMode ? data.spp : spp
      },
      {
        label: "Customer stories",
        name: 'cs',
        value: readMode ? data.cs : cs
      },
      {
        label: "Closing - A clear call to action",
        name: 'ccca',
        value: readMode ? data.ccca : ccca
      }
    ],
    invalidCls = v_err.overall_rating? 'invalid' : ''

    return(
      <div className="review-sec">
        <h4>Review</h4>
        <Row>
          <Col className={`pl-md-4 criterias ${invalidCls}`}>
            <Row>
              <Col md="6" sm="12" className="mb-1">
                <p>Success Criteria</p>
              </Col>
              <Col md="6" sm="12"></Col>
            </Row>
            <Row>
              <Col md="6" sm="12"><p className="pt-1">Overall Score</p></Col>
              <Col md="6" sm="12" className="overall-score-rating-cmp">
                <Row>
                  <Col xl="9" md="10" xs="11" className="pr-md-0 pl-md-0">
                    <StarRatingComponent 
                      name="os"
                      starColor="#ff824e"
                      emptyStarColor="#8494a5"
                      starCount={5}
                      editing={false}
                      value={overallRating}
                      renderStarIconHalf={() => 
                        <HalfStarRating rating={overallRating} />
                      }
                    />
                  </Col>
                  <Col xl="3" md="2" xs="1">
                    <div className="star-count">{overallRating}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
            {
              criteriaData.map((criteria, index) => (
                <Row key={`criteria-${index}`}>
                  <Col md="6" sm="12"><p>{criteria.label}</p></Col>
                  <Col md="6" sm="12">
                    <Row>
                      <Col xl="9" md="10" xs="11" className="p-md-0">
                        <TZS_Rating 
                          name={criteria.name}
                          rating={criteria.value}
                          starCount={5}
                          editing={!readMode}
                          _onStarClick={_onStarClick}
                        />
                      </Col>
                      <Col xl="3" md="2" xs="1">
                        <div className="star-count">{criteria.value}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))
            }
          </Col>
        </Row>
      </div>
    )
  }
  else {
    let criteriaData = [
      {
        label: "Background research on audience",
        name: 'bca',
        value: readMode? data.bca : bca
      },
      {
        label: "Audience engagement",
        name: 'ae',
        value: readMode? data.ae : ae
      },
      {
        label: "Storytelling",
        name: 'storytelling',
        value: readMode? data.storytelling : storytelling
      },
      {
        label: "Credibility & Presence",
        name: 'cp',
        value: readMode? data.cp : cp
      },
      {
        label: "Customer question handling",
        name: 'cqh',
        value: readMode? data.cqh : cqh
      },
      {
        label: "Closing - alignment with account team",
        name: 'caat',
        value: readMode? data.caat : caat
      }
    ],
    invalidCls = v_err.overall_rating? 'invalid' : ''

    return(
      <div className="review-sec">
        <h4>Review</h4>
        <Row>
          <Col className={`pl-md-4 criterias ${invalidCls}`}>
            <Row>
              <Col md="6" sm="12">
                <p>Success Criteria</p>
              </Col>
              <Col md="6" sm="12"></Col>
            </Row>
            <Row>
              <Col md="6" sm="12"><p className="pt-1">Overall Score</p></Col>
              <Col md="6" sm="12" className="overall-score-rating-cmp">
                <Row>
                  <Col xl="9" md="10" xs="11" className="pr-md-0 pl-md-0">
                    <StarRatingComponent 
                      name="os"
                      starColor="#ff824e"
                      emptyStarColor="#8494a5"
                      starCount={5}
                      editing={false}
                      value={overallRating}
                      renderStarIconHalf={() => 
                        <HalfStarRating rating={overallRating} />
                      }
                    />
                  </Col>
                  <Col xl="3" md="2" xs="1">
                    <div className="star-count">{overallRating}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
            {
              criteriaData.map((criteria, index) => (
                <Row key={`criteria-${index}`}>
                  <Col md="6" sm="12"><p>{criteria.label}</p></Col>
                  <Col md="6" sm="12">
                    <Row>
                      <Col xl="9" md="10" xs="11" className="p-md-0">
                        <TZS_Rating 
                          name={criteria.name}
                          rating={criteria.value}
                          starCount={5}
                          editing={!readMode}
                          _onStarClick={_onStarClick}
                        />
                      </Col>
                      <Col xl="3" md="2" xs="1">
                        <div className="star-count">{criteria.value}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))
            }
          </Col>
        </Row>
      </div>
    )
  }
}