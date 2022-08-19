import React, { useState, useEffect, useRef } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col } from 'reactstrap'

import { ROUTES } from '../../../constants/routeConstants';
import MyContent from './MyContent';
import PoularContent from './PopularContent';
import RecommendedForYouContent from './RecommendedForYou';
import ContentPicker from './ContentPicker';
import AddGdriveContent from './AddGdriveContent';
import BuildExperience from './experiences/BuildExperiences';
import AllContents from './AllContents';
import Experiences from './experiences/Experiences';
import MySites from './MySites';
import MyShares from './MyShares';
import { save_logo_placeholder_images, get_logo_placeholder_images } from '../../../actions/userProfilePage'

const RightArea = (props) => {
  let activeRoute = props.router.location.pathname

  useEffect(() => {
    props._get_logo_placeholder_images();
  }, [])

  return (
    <Col xl="8" lg="8" md="7" className="col-xxl-8">
      <div className="content-right">
      <Switch>
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_MYCONTENT}
            component={MyContent}
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_POPULAR_CONTENT}
            component={PoularContent}
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_ALL_CONTENT}
            component={AllContents}
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_CONTENT_PICKER}
            component={ContentPicker} 
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_ADD_GDRIVE_CONTENT}
            component={AddGdriveContent} 
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_BUILD_EXPERIENCES}
            component={BuildExperience} 
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_MY_SITES}
            component={MySites} 
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_MY_SHARES}
            component={MyShares} 
          />
          <Route 
            exact 
            path={ROUTES.CONTENT_PORTAL_RECOMMENDED_FOR_YOU_CONTENT}
            component={RecommendedForYouContent}
          />
          <Route 
            exact 
            path={ROUTES.EXPERIENCES_LISTING}
            component={Experiences}
          />
          <Route
              exact
              path={ROUTES.CONTENT_PORTAL}
              render={() => {
                  return (
                    <Redirect to={ROUTES.CONTENT_PORTAL_ALL_CONTENT} />
                  )
              }}
            />
        </Switch>
      </div>
    </Col>
  )
}

const mapStateToProps = ({ router }) => ({
  router
})

const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
    _save_logo_placeholder_images       :  save_logo_placeholder_images,
    _get_logo_placeholder_images        :  get_logo_placeholder_images,
    },
    dispatch
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightArea)