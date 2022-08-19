import React from 'react'
import { connect } from 'react-redux'
import { ROUTES } from '../../constants/routeConstants'
import MainHeader from './MainHeader'
import HomeHeader from './HomeHeader'
import LoginHeader from './LoginHeader'
import { actions as authActions } from '../app/auth.js';

const HeaderConatiner = (props) => {
  return (
    <div>
      <Header {...props} />
    </div>
  )
}

const Header = (props) => {
  let pathName = props.router.location.pathname
  // handle query param paths
  if(pathName.indexOf('/course/') != -1){
    pathName = ROUTES.COURSE
  }
  if(pathName.indexOf('/microsites/') != -1){
    pathName = ROUTES.MICROSITES
  }
  if(pathName.indexOf('/experiences/') != -1){
    pathName = ROUTES.EXPERIENCES
  }
  if(pathName.indexOf('/templates/') != -1){
    pathName = ROUTES.TEMPLATES
  }
  // if(pathName.indexOf('/user-profile/') != -1){
  //   pathName = ROUTES.PUBLIC_VIEW
  // }



  // remove route last slash
  if(pathName.length > 1 && pathName.lastIndexOf('/') === pathName.length-1) {
    pathName = pathName.substr(0, pathName.length-1)
  }
  // Group all Grow routes
  switch(pathName) {
    case ROUTES.CREATE_COURSE:
    case ROUTES.CAREER_PATH:
    case ROUTES.LEARNING:
      pathName = ROUTES.GROW
      break;
    case ROUTES.COMPANY_SETTINGS:
      case ROUTES.CHANGE_PASSWORD:
      case ROUTES.MANAGE_ACCESS:
      case ROUTES.COMPANY_SETTINGS_AZURE:
      case ROUTES.COMPANY_SETTINGS_OKTA:
      case ROUTES.COMPANY_SETTINGS_SALESFORCE:
      case ROUTES.MANAGE_COMPANY_BRANDKIT:
      pathName = ROUTES.COMPANY_SETTINGS
      break;
    case ROUTES.TEAM:
      case ROUTES.MY_TEAM:
        case ROUTES.ADD_TO_TEAM:
        pathName = ROUTES.TEAM
        break;
    case ROUTES.ANALYTICS:
      case ROUTES.ANALYTICS_SALES:
        case ROUTES.ANALYTICS_PEOPLE:
        case ROUTES.CONTENT_ANALYTICS: 
        pathName = ROUTES.ANALYTICS
        break;
    case ROUTES.CONTENT_PORTAL:
      case ROUTES.CONTENT_PORTAL_ADD_GDRIVE_CONTENT:
      case ROUTES.CONTENT_PORTAL_CONTENT_PICKER:
      case ROUTES.CONTENT_PORTAL_MYCONTENT:
      case ROUTES.CONTENT_PORTAL_POPULAR_CONTENT:
      case ROUTES.CONTENT_PORTAL_RECOMMENDED_FOR_YOU_CONTENT:  
      case ROUTES.CONTENT_PORTAL_ALL_CONTENT:
      case ROUTES.CONTENT_PORTAL_MY_SITES:
      case ROUTES.CONTENT_PORTAL_BUILD_EXPERIENCES:
      case ROUTES.CONTENT_PORTAL_MY_SHARES:
      case ROUTES.CREATE_MICROSITE:
      case ROUTES.CREATE_EXPERIENCE:
      case ROUTES.EXPERIENCES_LISTING:
      pathName = ROUTES.CONTENT_PORTAL
      break;            
  }

  switch(pathName){
    case ROUTES.HOME:
    case ROUTES.SignUp:
    case ROUTES.SignUp2:
      return <HomeHeader />
      
    case ROUTES.LOGIN:
     return <LoginHeader />
    case ROUTES.MICROSITES:
    case ROUTES.EXPERIENCES:
    case ROUTES.TEMPLATES:
    return (
      <></>
    )
    case ROUTES.PROFILE:
    case ROUTES.MY_COURSES:
    case ROUTES.COURSE:
    case ROUTES.ANALYTICS:
    case ROUTES.GROW:
    case ROUTES.PRAISE:
    case ROUTES.FEEDBACK:
    case ROUTES.TEAM:
    case ROUTES.CONTENT_PORTAL:
    case ROUTES.COURSES_LIBRARY:
    case ROUTES.COMPANY_SETTINGS:
    case ROUTES.PUBLIC_VIEW_PAGE:
    case ROUTES.SEARCH_RESULT:
    case ROUTES.PROFILE_SETTINGS:
     return <MainHeader active={pathName}/>
       
    default :
      return <HomeHeader noLinks />
  }
}

const mapStateToProps = ( state ) => ({
  ...state
})

export default connect(
  mapStateToProps,
  null
)(HeaderConatiner)
