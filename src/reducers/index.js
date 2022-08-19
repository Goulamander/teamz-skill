import { combineReducers } from 'redux'
import login from './login'
import inviteTeam from './inviteTeam'
import profile from './profile'
import skills from './skills'
import signup from './signup'
import user from './user'
import admin from './admin'
import profileUpdates from './profileUpdates'
import myCourses from './myCourses'
import careerLadder from './careerLadder'
import customCourse from './customCourse'
import inviteAssignee from './inviteAssignee'
import saml from './saml'
import userProfilePage from './userProfilePage'
import profileSettings from './profileSettings'
import stepFeedback from './cc_StepFeedback'
import quizBuilder from './quizBuilder'
import analytics from './analytics'
import peopleAccess from './peopleAccess'
import { logInConstant } from '../constants/storeConstants'
import addTeam from './addTeam'
import team from './team'
import contentPortal from './contentPortal'
import microSites from './microsites'
import integrations from './integrations'
import experiences from './experiences'

const appReducer = combineReducers({
  login,
  inviteTeam,
  profile,
  skills,
  signup,
  user,
  admin,
  profileUpdates,
  myCourses,
  careerLadder,
  customCourse,
  inviteAssignee,
  saml,
  userProfilePage,
  profileSettings,
  stepFeedback,
  quizBuilder,
  analytics,
  peopleAccess,
  addTeam,
  team,
  contentPortal,
  microSites,
  integrations,
  experiences
  })

  const rootReducer = (state, action) => {
  if(action.type === logInConstant.LOGOUT_SUCCESS){
  state = undefined
  }
  return appReducer(state, action)
  }
  
  export default rootReducer
