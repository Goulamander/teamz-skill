import { experiencesConstant } from '../constants/storeConstants'

const initialState = {
    CELoading: false,
    CEError: null,
    CESuccess: false,
    getExpDataLoading: false,
    experiencesData: [],
    getExpDataErr: null,
    getExpDataByLinkLoading: false,
    getExpDataByLinkError: null,
    expDataByLink: {},
    UELoading: false,
    UEError: null,
    UESuccess: false,
    getDefExpTemDataLoading: false,
    defExpTemData: [],
    getDefExpTemDataErr: null,
    getDefExpTemDataByLinkLoading: false,
    getDefExpTemDataByLinkError: null,
    getDefExpTemDataByLink: {},
};

export default (state = initialState, action) => {
    switch (action.type) {   
            
        case experiencesConstant.CREATING_EXPERIENCE:
            return {
                ...state,
                CELoading: true
            }
        
        case experiencesConstant.CREATE_EXPERIENCE_SUCCESS:
            return {
                ...state,
                CESuccess: true,
                CEError: null,
                CELoading: false
            }
    
        case experiencesConstant.CREATE_EXPERIENCE_ERROR:
            return {
                ...state,
                CEError: action.payload,
                CELoading: false
            }
            
        case experiencesConstant.GETTING_EXPERIENCES:
            return {
                ...state,
                getExpDataLoading: true
            }
        
        case experiencesConstant.GET_EXPERIENCES_SUCCESS:
            return {
                ...state,
                getExpDataLoading: true,
                getExpDataErr: null,
                experiencesData: action.payload
            }
    
        case experiencesConstant.CREATE_EXPERIENCE_ERROR:
            return {
                ...state,
                getExpDataErr: action.payload,
                getExpDataLoading: false
            }
            
        case experiencesConstant.GETTING_EXPERIENCE_BY_LINK:
            return {
            ...state,
                getExpDataByLinkLoading: true
            }
        
        case experiencesConstant.GET_EXPERIENCE_BY_LINK_SUCCESS:
            return {
                ...state,
                expDataByLink: action.payload,
                getExpDataByLinkError: null,
                getExpDataByLinkLoading: false
            }
    
        case experiencesConstant.GET_EXPERIENCE_BY_LINK_ERROR:
            return {
                ...state,
                getExpDataByLinkError: action.payload,
                getExpDataByLinkLoading: false
            }
            
        case experiencesConstant.UPDATING_EXPERIENCE:
            return {
                ...state,
                UELoading: true
            }
        
        case experiencesConstant.UPDATE_EXPERIENCE_SUCCESS:
            return {
                ...state,
                UESuccess: true,
                UEError: null,
                UELoading: false
            }
    
        case experiencesConstant.UPDATE_EXPERIENCE_ERROR:
            return {
                ...state,
                UEError: action.payload,
                UELoading: false
            }
            
        case experiencesConstant.RESET_EXP_BY_LINK_DATA:
            return {
                ...state,
                getExpDataByLinkLoading: false,
                getExpDataByLinkError: null,
                expDataByLink: {},
            }
        
        case experiencesConstant.GETTING_DEF_EXP_TEMPLATES:
            return {
                ...state,
                getDefExpTemDataLoading: true
            }
        
        case experiencesConstant.GET_DEF_EXP_TEMPLATES_SUCCESS:
            return {
                ...state,
                defExpTemData: action.payload,
                getDefExpTemDataErr: null,
                getDefExpTemDataLoading: false
            }
    
        case experiencesConstant.GET_DEF_EXP_TEMPLATES_ERROR:
            return {
                ...state,
                getDefExpTemDataErr: action.payload,
                getDefExpTemDataLoading: false
            }
            
        case experiencesConstant.GETTING_DEF_EXP_TEMPLATES_BY_LINK:
            return {
            ...state,
                getDefExpTemDataByLinkLoading: true
            }
        
        case experiencesConstant.GET_DEF_EXP_TEMPLATES_BY_LINK_SUCCESS:
            return {
                ...state,
                getDefExpTemDataByLink: action.payload,
                getDefExpTemDataByLinkError: null,
                getDefExpTemDataByLinkLoading: false
            }
    
        case experiencesConstant.GET_DEF_EXP_TEMPLATES_BY_LINK_ERROR:
            return {
                ...state,
                getDefExpTemDataByLinkError: action.payload,
                getDefExpTemDataByLinkLoading: false
            }
            
        case experiencesConstant.RESET_DEF_EXP_TEMPLATES_BY_LINK:
            return {
                ...state,
                getDefExpTemDataByLinkLoading: false,
                getDefExpTemDataByLinkError: null,
                getDefExpTemDataByLink: {},
            }    

        default:
            return state   
    }
};