import { analyticsCourses, analyticsLearners, analyticsMyLearning, deleteLearningAnalyticsCourses } from '../constants/storeConstants'

const defaultMyLearnings = {
  assigned_courses: 0,
  course_todo: 0,
  course_todo_rate: 0,
  overdue: 0,
  overdue_rate: 0,
  course_completed: 0,
  total_courses: 3,
  course_created: 0,
  created_rate: 0,
  courses: []
};

const initialState = {
  isACLoading: false,
  isALLoading: false,
  isAMLLoading: false,
  isACDLoading: false,
  isALDLoading: false,
  isAMLDLoading: false,
  isLACourseDeleting: false,
  analyticsCourses:[],
  analyticsCourseDetails:[],
  analyticsLearners:[],
  analyticsLearnerDetails:[],
  analyticsMyLearnings: defaultMyLearnings,
  analyticsMyLearningsDetails:[],
  acError: false,
  acdError: false,
  alError: false,
  aldError: false,
  amlError: false,
  amldError: false,
  isLACourseError: false,
  isLACoursesDeleted: false
}

export default (state = initialState, action) => {
  switch (action.type) {

    case analyticsCourses.GETTING_ANALYTICS_COURSES:
      return {
        ...state,
        isACLoading: true,
        acError: false
      }
    case analyticsCourses.GET_ANALYTICS_COURSES_SUCCESS:
      return {
        ...state,
        isACLoading: false,
        analyticsCourses: action.payload
      }
    case analyticsCourses.GET_ANALYTICS_COURSES_FAIL:
      return {
        ...state,
        isACLoading: false,
        acError: true
      }

    case analyticsCourses.GETTING_ANALYTICS_COURSE:
      return {
        ...state,
        isACDLoading: true,
        acdError: false,
        analyticsCourseDetails: []
      }
    case analyticsCourses.GET_ANALYTICS_COURSE_SUCCESS:
      return {
        ...state,
        isACDLoading: false,
        analyticsCourseDetails: action.payload
      }
    case analyticsCourses.GET_ANALYTICS_COURSE_FAIL:
      return {
        ...state,
        isACDLoading: false,
        acdError: true
      }
    
    case analyticsLearners.GETTING_ANALYTICS_LEARNERS:
      return {
        ...state,
        isALLoading: true,
        alError: false
      }
    case analyticsLearners.GET_ANALYTICS_LEARNERS_SUCCESS:
      return {
        ...state,
        isALLoading: false,
        analyticsLearners: action.payload
      }
    case analyticsLearners.GET_ANALYTICS_LEARNERS_FAIL:
      return {
        ...state,
        isALLoading: false,
        alError: true
      }

      case analyticsLearners.GETTING_ANALYTICS_LEARNER:
        return {
          ...state,
          isALDLoading: true,
          aldError: false,
          analyticsLearnerDetails: []
        }
      case analyticsLearners.GET_ANALYTICS_LEARNER_SUCCESS:
        return {
          ...state,
          isALDLoading: false,
          analyticsLearnerDetails: action.payload
        }
      case analyticsLearners.GET_ANALYTICS_LEARNER_FAIL:
        return {
          ...state,
          isALDLoading: false,
          aldError: true
      }  

      case analyticsMyLearning.GETTING_MY_LEARNING:
        return {
          ...state,
          isAMLLoading: true,
          amlError: false,
          analyticsMyLearnings: defaultMyLearnings
        }
      case analyticsMyLearning.GET_MY_LEARNING_SUCCESS:
        return {
          ...state,
          isAMLLoading: false,
          analyticsMyLearnings: {...action.payload}
        }
      case analyticsMyLearning.GET_MY_LEARNING_FAIL:
        return {
          ...state,
          isAMLLoading: false,
          amlError: true
      }  

      case analyticsMyLearning.GETTING_TOP_LEARNINGS:
        return {
          ...state,
          isAMLDLoading: true,
          amldError: false,
          analyticsMyLearningsDetails: []
        }
      case analyticsMyLearning.GET_TOP_LEARNINGS_SUCCESS:
        return {
          ...state,
          isAMLDLoading: false,
          analyticsMyLearningsDetails: action.payload
        }
      case analyticsMyLearning.GET_TOP_LEARNINGS_FAIL:
        return {
          ...state,
          isAMLDLoading: false,
          amldError: true
      }
      
      case deleteLearningAnalyticsCourses.DELETING_LEARNING_ANALYTICS_COURSES:
        return {
          ...state,
          isLACourseDeleting: true,
          isLACourseError: false,
          isLACoursesDeleted: false
        }
      case deleteLearningAnalyticsCourses.DELETE_LEARNING_ANALYTICS_COURSES_SUCCESS:
        return {
          ...state,
          isLACourseDeleting: false,
          isLACoursesDeleted: true
        }
      case deleteLearningAnalyticsCourses.DELETE_LEARNING_ANALYTICS_COURSES_FAIL:
        return {
          ...state,
          isLACourseDeleting: false,
          isLACourseError: action.payload
      }

    default:
      return state   
  }
};
