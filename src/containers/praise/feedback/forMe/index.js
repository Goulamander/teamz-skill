import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { Row, Col } from 'reactstrap'
import { get_feedback_for_me } from '../../../../actions/ccStepFeedback'
import { ROUTES } from '../../../../constants/routeConstants';
import { Loader } from '../../../../component/Loader'

class FeedbackForMe extends Component {

  componentDidMount() {
    let { _get_feedback_for_me } = this.props
    _get_feedback_for_me()
  }

  render() {
    let { isLoading, feedbackForMe } = this.props
    return (
      <div className="events-card">
        <Row>
          <Col>
            <h4 className="common-head"><span className="btn view-btn float-right">View all</span></h4>
          </Col>
        </Row>
        <Row className="px-5">
          
        {feedbackForMe.map((feedback, index) => {
          let now = moment(),
          days = now.diff(feedback.submitted_date, "days"),
          daysAgo = (days > 1)? `${days} days ago` : `1 day ago`
          
          return(
            <Col key={`course-${index}`} lg={3} md={12} className={'mt-2'}>
              <div className="card course-single-group feedback-card">
                
                <div className="d-flex justify-content-center text-center video-preview">
                  {!!feedback.video_thumbnail === true ?
                    <div id="video-feedback-img" style={{backgroundImage: `url(${feedback.video_thumbnail})`}}>
                    </div>
                  :
                    <video id="video-feedback" src={feedback.video_url} controls autoPlay={false} />
                  }
                </div>
                
                <div className="card-body p-0 pt-3">
                  <h5 className="card-title">
                    <Link to={{pathname: ROUTES.PRAISE, state:{feedbackData: feedback, feedbackType:'FORME'}}}>{feedback.course_title}</Link>
                  </h5>
                  <div className="card-info">
                    <p className="card-text">Reviewed by</p>
                    <h4 className="pt-4">{`${feedback.first_name} ${feedback.last_name}`}</h4>
                    <h5>{daysAgo}</h5>
                  </div>
                </div>
              </div>
            </Col>
          )}
        )}
        </Row>
        <Fragment>
          <Loader isLoading={isLoading} />
        </Fragment>
      </div>
    )
  }
}

const mapStateToProps = ({ stepFeedback }) => ({
  ...stepFeedback
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_feedback_for_me  : get_feedback_for_me
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackForMe)