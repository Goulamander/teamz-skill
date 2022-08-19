import { integrationsConstants } from '../constants/storeConstants'

const initialState = {
    isSetSalesForceEmailLoading: false,
    setSalesForceEmailSuccess: false,
    setSalesForceEmailError: null,
    isGetSalesForceEmailLoading: false,
    getSalesForceEmail: '',
    getSalesForceEmailError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
  
        case integrationsConstants.SETTING_SALESFORCE_EMAIL:
            return {
                ...state,
                setSalesForceEmailSuccess: false,
                isSetSalesForceEmailLoading: true
            }
        
        case integrationsConstants.SET_SALESFORCE_EMAIL_SUCCESS:
            return {
                ...state,
                setSalesForceEmailSuccess: true,
                setSalesForceEmailError: null,
                isSetSalesForceEmailLoading: false
            }
    
        case integrationsConstants.SET_SALESFORCE_EMAIL_FAIL:
            return {
                ...state,
                setSalesForceEmailError: action.payload,
                isSetSalesForceEmailLoading: false
            }
            
        case integrationsConstants.GETTING_SALESFORCE_EMAIL:
            return {
                ...state,
                getSalesForceEmail: '',
                isGetSalesForceEmailLoading: true
            }
        
        case integrationsConstants.GET_SALESFORCE_EMAIL_SUCCESS:
            return {
                ...state,
                getSalesForceEmail: action.payload,
                setSalesForceEmailError: null,
                isGetSalesForceEmailLoading: false
            }
    
        case integrationsConstants.GET_SALESFORCE_EMAIL_FAIL:
            return {
                ...state,
                setSalesForceEmailError: action.payload,
                isGetSalesForceEmailLoading: false
            }    
  
        default:
            return state   
    }
};