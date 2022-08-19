import React from 'react'

import logo1 from '../../../assets/img/coursera_logo.png'
import logo2 from '../../../assets/img/zooh_logo.png'
import logo3 from '../../../assets/img/Bitmap.png'
import logo4 from '../../../assets/img/ted.png'
import defaultPP from '../../../assets/img/profile_default.png'
import { appConstant } from '../../../constants/appConstants';
import { ROUTES } from '../../../constants/routeConstants';
import { Link } from 'react-router-dom';

export const Recommendations = ({data}) => {
  return (
    <div className="recommend-box">
      <h3>Recommended by your team</h3>

      { data.length > 0 && data.map(course => {
        let profileImg = '';
        if(!!course.profile_pic2) {
          profileImg = appConstant.BASE_URL + course.profile_pic2.replace('dist', '')
        } else if(course.profile_pic1) {
          profileImg = course.profile_pic1
        } else {
          profileImg = defaultPP
        }
        return (
        <div className="card mb-3"  key={course.c_id}>
          <div className="row no-gutters">
            <div className="col-sm-4">
              <img src={profileImg} className="card-img recommended-profile-pic" alt="..." />
            </div>
            <div className="col-sm-8">
              <div className="card-body">
                <p className="card-text"><Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: course.user_id}}}>@{course.recommend_by}</Link> recommended this course for you - <a href={course.c_link} target={'blank'}>{course.c_name}</a>"</p>
              </div>
            </div>
          </div>
        </div>  
        )}  
      )}
  </div>
  )
}