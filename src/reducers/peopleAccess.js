import { peopleAccessConstants } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  peopleAccessData: [],
  error: null,
  isUpdatingRole: false,
  isRoleUpdate: false,
  roleUpdateError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
  
        case peopleAccessConstants.GETTING_PEOPLE_ACCESS:
            return {
            ...state,
            isLoading: true
            }
      
        case peopleAccessConstants.GET_PEOPLE_ACCESS_SUCCESS:
            return {
                ...state,
                peopleAccessData: action.payload,
                error: null,
                isLoading: false
            }
  
        case peopleAccessConstants.GET_PEOPLE_ACCESS_FAIL:
            return {
            ...state,
            error: action.payload,
            isLoading: false
            }
            
        case peopleAccessConstants.UPDATING_PEOPLE_ACCESS:
            return {
            ...state,
            isRoleUpdate: false,
            isUpdatingRole: true
            }
        
        case peopleAccessConstants.UPDATE_PEOPLE_ACCESS_SUCCESS:
            return {
                ...state,
                isRoleUpdate: true,
                roleUpdateError: null,
                isUpdatingRole: false
            }
    
        case peopleAccessConstants.GET_PEOPLE_ACCESS_FAIL:
            return {
            ...state,
            roleUpdateError: action.payload,
            isUpdatingRole: false
            }    
  
        default:
            return state   
    }
};