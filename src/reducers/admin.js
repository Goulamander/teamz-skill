import { adminConstant, rampTimeData } from '../constants/storeConstants'

const resetState = {
  isLoading: false,
  data: {
    uploadFileUrl: {},
    topPeopleFileUrl: null,
    csvText: null
  },
  error: null,
  opportunityAmtData : [],
  opportunityAmtLoading: false,
  opportunityAmtError: null,
  quotaAttainmentData : [],
  quotaAttainmentLoading: false,
  quotaAttainmentError: null
}

const initialState = {
  isLoading: false,
  data: {
    // uploadFileUrl: {
    //   'your-people': 'dist/upload/csv/1565680828095-sample-data.csv',
    //   'top-performers': 'dist/upload/csv/1565690460135-sample-data.csv'
    // },
    uploadFileUrl: {},
    csvText: null
  },
  error: null,
  opportunityAmtData : [],
  opportunityAmtLoading: false,
  opportunityAmtError: null,
  quotaAttainmentData : [],
  quotaAttainmentLoading: false,
  quotaAttainmentError: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case adminConstant.UPLOADING:
      return {
        ...state,
        isLoading: true
      }

    case adminConstant.UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: {...state.data, uploadFileUrl: { ...state.data.uploadFileUrl, ...action.payload} },
        error: null
      }
    
    case adminConstant.UPLOAD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case adminConstant.GET_CSV:
      return {
        ...state,
        isLoading: false,
        data: {...state.data, csvText: action.payload },
        error: null
      }

    case rampTimeData.GETTING_OPPORTUNITY_AMOUNT:
      return {
        ...state,
        opportunityAmtLoading: true,
        opportunityAmtError: null,
        opportunityAmtData: []
      }
    case rampTimeData.GET_OPPORTUNITY_AMOUNT_SUCCESS:
      return {
        ...state,
        opportunityAmtLoading: false,
        opportunityAmtData: action.payload
      }
    case rampTimeData.GET_OPPORTUNITY_AMOUNT_FAIL:
      return {
        ...state,
        opportunityAmtLoading: false,
        opportunityAmtError: action.payload,
      }
      case rampTimeData.GETTING_QUOTA_ATTAINMENT:
        return {
          ...state,
          quotaAttainmentLoading: true,
          quotaAttainmentError: null,
          quotaAttainmentData: []
        }
      case rampTimeData.GET_QUOTA_ATTAINMENT_SUCCESS:
        return {
          ...state,
          quotaAttainmentLoading: false,
          quotaAttainmentData: action.payload
        }
      case rampTimeData.GET_QUOTA_ATTAINMENT_FAIL:
        return {
          ...state,
          quotaAttainmentLoading: false,
          quotaAttainmentError: action.payload,
        }    

    case adminConstant.RESET_USER:
      return resetState

    default:
      return state   
  }
};
