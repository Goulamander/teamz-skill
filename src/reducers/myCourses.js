import { 
  myCoursesConstants, 
  recommendCoursesConstants, 
  customCoursesConstants,
  assignConstant,
  myAchievements,
  analyticsCourses,
  analyticsDirectReports,
  publicViewPage
} from '../constants/storeConstants'
import logo1 from '../assets/img/certifiedLogo/aws-logo-1.png'
import logo2 from '../assets/img/certifiedLogo/aws-logo-2.png'
import logo3 from '../assets/img/certifiedLogo/kbernetes-logo.png'
import logo4 from '../assets/img/certifiedLogo/deep-learning-logo.png'
import logo5 from '../assets/img/certifiedLogo/azure-logo.png'


const initialState = {
  isLoading: false,
  isCompRequest: false,
  isLibraryRequest: false,
  isAssignCourses: false,
  error: '',
  achievementTypes: [
    {
      id: 1,
      name: 'Certificate',
      title: 'Certificate' 
    },
    {
      id: 2,
      name: 'Licence',
      title: 'Licence'
    },
    {
      id: 3,
      name: 'Qualification',
      title: 'Qualification'
    },
    {
      id: 4,
      name: 'Others',
      title: 'Others'
    }
  ],
  achievements: [],
  courses: [],
  newCourse: {
    c_name: '',
    c_author_name: '',
    c_by: '',
    c_link: '',
    c_progress: 0,
    c_short_des: '',
    c_logo: '',
    c_image:'',
    c_start_date: '',
    c_end_date: '',
    error: {}
  },
  userRecommendCourses: [],
  recommendCourses: [],
  customCourses: [],
  customCoursesLibrary: {},
  assignedCourses: [],
  directReportsLoding:false,
  directReportsCourses:[],
  getAchievements: [],
  customCourseDetail: {},
  startingAssignCourse: {
    starting: false,
    course_id: '',
    error: null
  },
  userdetails: [],
  userDetailLoading: false,
  isUploadingPitch: false,
  isAddingStepInfo: false
}

export default (state = initialState, action) => {
  switch (action.type) {

    case myCoursesConstants.LIST_ACHIEVEMENTS:
      return {
        ...state
      }
    
    case myCoursesConstants.EDIT_NEW_COURSE:
      return {
        ...state,
        newCourse: action.payload
      }
    
    case myCoursesConstants.EDIT_COURSE:
      return {
        ...state,
        courses: [...state.courses.slice(0, action.courseId), action.payload, ...state.courses.slice(action.courseId + 1)]
      }

    case myCoursesConstants.GETTING_COURSES:
      return {
        ...state,
        isLoading: true,
        error: ''
      }
    
    case myCoursesConstants.GET_COURSES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        courses: action.payload,
        error: ''
      }

    case myCoursesConstants.GET_COURSES_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    
    case myCoursesConstants.UPDATING_COURSE:
      return {
        ...state,
        isLoading: true,
        error: ''
      }
    
    case myCoursesConstants.UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: ''
      }

    case myCoursesConstants.UPDATE_COURSE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    
    case myCoursesConstants.DELETING_COURSE:
      return {
        ...state,
        isLoading: true,
        error: ''
      }
    
    case myCoursesConstants.DELETE_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: '',
        courses: action.payload
      }

    case myCoursesConstants.DELETE_COURSE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case myCoursesConstants.ADDING_COURSE:
      return {
        ...state,
        isLoading: true,
        error: ''
      }

    case myCoursesConstants.ADD_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        courses: [...state.courses, action.payload]
      }
      
    case myCoursesConstants.ADD_COURSE_ERROR:
        return {
          ...state,
          isLoading: false,
          error: action.payload
        }
      
    case myCoursesConstants.RESET_COURSE:
      return {
        ...state,
        newCourse: {
          c_name: '',
          c_author_name: '',
          c_by: '',
          c_link: '',
          c_progress: 0,
          c_short_des: '',
          c_logo: '',
          c_image:'',
          c_start_date: null,
          c_end_date: null,
          error: {}
        }
      }
    
    case myCoursesConstants.GETTING_USER_RECOMMEND:
      return {
        ...state,
        isLoading: true,
        error: ''
      }
    
    case myCoursesConstants.GET_USER_RECOMMEND_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userRecommendCourses: action.payload,
        error: ''
      }

    case myCoursesConstants.GET_USER_RECOMMEND_ERROR:
      return {
        ...state,
        isLoading: false
      }

    case recommendCoursesConstants.FETCH_COURSES_START:
      return {
        ...state,
        isLoading: true,
        error: ''
      }

    case recommendCoursesConstants.FETCH_COURSES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        recommendCourses: action.payload
      }
      
    case recommendCoursesConstants.FETCH_COURSES_FAIL:
        return {
          ...state,
          isLoading: false,
          error: action.payload
        } 
    
    case customCoursesConstants.GETTING_CUSTOM_COURSES:
      return {
        ...state,
        isLoading: true,
        customCourses: []
      }
    case customCoursesConstants.GET_CUSTOM_COURSES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customCourses: action.payload
      }
    case customCoursesConstants.GET_CUSTOM_COURSES_FAIL:
      return {
        ...state,
        isLoading: false,
      }
  
    case customCoursesConstants.GETTING_CUSTOM_COURSE:
      return {
        ...state,
        isLoading: true,
        customCourseDetail: {}
      }
    case customCoursesConstants.GET_CUSTOM_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customCourseDetail: action.payload
      }
    case customCoursesConstants.GET_CUSTOM_COURSE_FAIL:
      return {
        ...state,
        isLoading: false,
      }
    
    case customCoursesConstants.UPLOADING_STEP_PITCH:
      return {
        ...state,
        isUploadingPitch: true
      }
    case customCoursesConstants.UPLOAD_STEP_PITCH_SUCCESS:
    case customCoursesConstants.UPLOAD_STEP_PITCH_FAIL:
      return {
        ...state,
        isUploadingPitch: false
      }

    case customCoursesConstants.ADDING_STEP_INFO:
      return {
        ...state,
        isAddingStepInfo: true
      }
    case customCoursesConstants.ADD_STEP_INFO_SUCCESS:
    case customCoursesConstants.ADD_STEP_INFO_FAIL:
      return {
        ...state,
        isAddingStepInfo: false
      }
    
    case assignConstant.GETTING_CUSTOM_ASSIGNS_COURSE:
      return {
        ...state,
        isAssignCourses: true,
        assignedCourses: []
      }
    case assignConstant.GET_CUSTOM_ASSIGN_COURSES_SUCCESS:
      return {
        ...state,
        isAssignCourses: false,
        assignedCourses: action.payload
      }
    case assignConstant.GET_CUSTOM_ASSIGN_COURSES_FAIL:
      return {
        ...state,
        isAssignCourses: false,
      }

    case assignConstant.STARTING_COURSE:
      return {
        ...state,
        startingAssignCourse: {
          starting: true,
          course_id: action.payload
        }
      }
    
    case assignConstant.START_COURSE_SUCCESS:
      return {
        ...state,
        startingAssignCourse: {
          starting: false,
          course_id: ''
        }
      }
    
    case assignConstant.START_COURSE_FAIL:
      return {
        ...state,
        startingAssignCourse: {
          starting: false,
          error: action.payload,
          course_id: ''
        }
      }
        
    
    case assignConstant.MARKING_COURSE_STEP:
      return {
        ...state,
        isLoading: true
      }
    
    case assignConstant.START_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    
    case assignConstant.START_COURSE_FAIL:
      return {
        ...state,
        isLoading: false
      }
    
    case assignConstant.COMPELETING_CUSTOM_COURSE:
      return {
        ...state,
        isCompRequest: true
      }
    
    case assignConstant.COMPELETE_CUSTOM_COURSE_SUCCESS:
    case assignConstant.COMPELETE_CUSTOM_COURSE_FAIL:
      return {
        ...state,
        isCompRequest: false
      }

    case customCoursesConstants.GETTING_CUSTOM_COURSES_LIBRARY:
      return {
        ...state,
        isLibraryRequest: true,
        customCoursesLibrary: {}
      }
    case customCoursesConstants.GET_CUSTOM_COURSES_LIBRARY_SUCCESS:
      return {
        ...state,
        isLibraryRequest: false,
        customCoursesLibrary: action.payload
      }
    case customCoursesConstants.GET_CUSTOM_COURSES_LIBRARY_FAIL:
      return {
        ...state,
        isLibraryRequest: false,
      }
      
      case myAchievements.ADD_ACHIVEMENTS_START:
        return {
            ...state,
            isLoading: true,
            error: ''
        }

        case myAchievements.ADD_ACHIVEMENTS_SUCCESS:
        return {
            ...state,
            isLoading: false
        }
        
        case myAchievements.ADD_ACHIVEMENTS_FAIL:
            return {
            ...state,
            isLoading: false,
            error: action.payload
        }

        case myAchievements.GET_ACHIVEMENTS_START:
        return {
            ...state,
            isLoading: true,
            error: ''
        }

        case myAchievements.GET_ACHIVEMENTS_SUCCESS:
        return {
            ...state,
            isLoading: false,
            achievements: action.payload,
            error: ''
        }
        
        case myAchievements.GET_ACHIVEMENTS_FAIL:
            return {
            ...state,
            isLoading: false,
            error: action.payload
        }

    case analyticsDirectReports.GETTING_DIRECT_REPORTS:
      return {
        ...state,
        directReportsLoding: true,
        error: ''
      }
    case analyticsDirectReports.GET_DIRECT_REPORTS_SUCCESS:
      return {
        ...state,
        directReportsLoding: false,
        directReportsCourses: action.payload,
      }
    case analyticsDirectReports.GET_DIRECT_REPORTS_FAIL:
      return {
        ...state,
        directReportsLoding: false
      }

    case customCoursesConstants.UPDATE_STEP_IFRAME_URL:
      return {
        ...state,
        customCourseDetail: action.payload
      }  

    default: 
      return state
  }
}