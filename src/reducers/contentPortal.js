import { contentPortalConstant } from '../constants/storeConstants'

const initialState = {
    isAddgDriveCntLoading: false,
    addgDriveCntError: null,
    addgDriveCntSuccess: false,
    isGetgDriveCntLoading: false,
    GetgDriveCntError: null,
    gDriveContent: [],
    pContentTagLoading: false,
    pContentTagError: null,
    popularContentTag: {},
    isAddTagsLoading: false,
    addTagsError: null,
    addTagsSuccess: false,
    deleteContentsLoading: false,
    deleteContentsErr: null,
    deleteContentsSuccess: false,
    addCTPLoaing: false,
    addCTPErr: null,
    addCTPSuccess: false,
    isEditgCntLoading: false,
    editgCntError: null,
    editgCntSuccess: false,
    isAddMyCntLoading: false,
    addMyCntError: null,
    addMyCntSuccess: false,
    isGetMyCntLoading: false,
    GetMyCntError: null,
    myContent: [],
    selectedMicrositeContents : [],
    micrositeStyle: '',
    isGetLibraryImgLoading: false,
    GetLibraryImgError: null,
    LibraryImg: {
        bgImg: [],
        logoImg: []
    },
    isGetPopularCntLoading: false,
    GetPopularCntError: null,
    popularContents: [],
    isGetRecommendedCntLoading: false,
    GetRecommendedCntError: null,
    recommendedContents: [],
    isSendRecommendedCntLoading: false,
    SendRecommendedCntError: null,
    isSendRecommendedCntError: false,
    SendRecommendedCntSuccess: false,
    contentTagSerachinput: null,
    whenToShareSerachInput: null,
    dateModifiedSearchInput: null,
    globalContentSearchInput: null,
    isGetAnalyticdCntLoading: false,
    GetAnalyticdCntError: null,
    analyticsContent: [],
};

export default (state = initialState, action) => {
    switch (action.type) {   
            
        case contentPortalConstant.GETTING_GDRIVE_CONTENT:
            return {
            ...state,
                isGetgDriveCntLoading: true
            }
        
        case contentPortalConstant.GET_GDRIVE_CONTENT_SUCCESS:
            return {
                ...state,
                gDriveContent: action.payload,
                GetgDriveCntError: null,
                isGetgDriveCntLoading: false
            }
    
        case contentPortalConstant.GET_GDRIVE_CONTENT_ERROR:
            return {
                ...state,
                GetgDriveCntError: action.payload,
                isGetgDriveCntLoading: false
            }   
            
        case contentPortalConstant.ADDING_GDRIVE_CONTENT:
            return {
            ...state,
                isAddgDriveCntLoading: true,
                addgDriveCntSuccess: false
            }
        
        case contentPortalConstant.ADD_GDRIVE_CONTENT_SUCCESS:
            return {
                ...state,
                addgDriveCntSuccess: true,
                addgDriveCntError: null,
                isAddgDriveCntLoading: false
            }
    
        case contentPortalConstant.ADD_GDRIVE_CONTENT_ERROR:
            return {
                ...state,
                addgDriveCntError: action.payload,
                isAddgDriveCntLoading: false
            }    
  
        case contentPortalConstant.GETTING_CONTENT_TAG:
            return {
            ...state,
                pContentTagLoading: true
            }
        
        case contentPortalConstant.GET_CONTENT_TAG_SUCCESS:
            return {
                ...state,
                popularContentTag: action.payload,
                pContentTagError: null,
                pContentTagLoading: false
            }
    
        case contentPortalConstant.GET_CONTENT_TAG_ERROR:
            return {
                ...state,
                pContentTagError: action.payload,
                pContentTagLoading: false
            }

        case contentPortalConstant.ADDING_TAGS_TO_CONTENTS:
            return {
            ...state,
                isAddTagsLoading: true,
                addTagsSuccess: false
            }
        
        case contentPortalConstant.ADD_TAGS_TO_CONTENTS_SUCCESS:
            return {
                ...state,
                addTagsSuccess: true,
                addTagsError: null,
                isAddTagsLoading: false
            }
    
        case contentPortalConstant.ADD_TAGS_TO_CONTENTS_ERROR:
            return {
                ...state,
                addTagsError: action.payload,
                isAddTagsLoading: false
            }
            
        case contentPortalConstant.DELETING_CONTENTS:
            return {
            ...state,
                deleteContentsLoading: true,
                deleteContentsSuccess: false
            }
        
        case contentPortalConstant.DELETE_CONTENTS_SUCCESS:
            return {
                ...state,
                deleteContentsSuccess: true,
                deleteContentsErr: null,
                deleteContentsLoading: false
            }
    
        case contentPortalConstant.DELETE_CONTENTS_ERROR:
            return {
                ...state,
                deleteContentsErr: action.payload,
                deleteContentsLoading: false
            }
            
        case contentPortalConstant.ADDING_CONTENTS_TO_PORTAL:
            return {
            ...state,
                addCTPLoaing: true,
                addCTPSuccess: false
            }
        
        case contentPortalConstant.ADD_CONTENTS_TO_PORTAL_SUCCESS:
            return {
                ...state,
                addCTPSuccess: true,
                addCTPErr: null,
                addCTPLoaing: false
            }
    
        case contentPortalConstant.ADD_CONTENTS_TO_PORTAL_ERROR:
            return {
                ...state,
                addCTPErr: action.payload,
                addCTPLoaing: false
            }
            
        case contentPortalConstant.EDITING_PORTAL_CONTENT:
            return {
            ...state,
                isEditgCntLoading: true,
                editgCntSuccess: false
            }
        
        case contentPortalConstant.EDIT_PORTAL_CONTENT_SUCCESS:
            return {
                ...state,
                editgCntSuccess: true,
                editgCntError: null,
                isEditgCntLoading: false
            }
    
        case contentPortalConstant.EDIT_PORTAL_CONTENT_ERROR:
            return {
                ...state,
                editgCntError: action.payload,
                isEditgCntLoading: false
            }
            
        case contentPortalConstant.GETTING_MY_CONTENT:
            return {
            ...state,
                isGetMyCntLoading: true
            }
        
        case contentPortalConstant.GET_MY_CONTENT_SUCCESS:
            return {
                ...state,
                myContent: action.payload,
                GetMyCntError: null,
                isGetMyCntLoading: false
            }
    
        case contentPortalConstant.GET_MY_CONTENT_ERROR:
            return {
                ...state,
                GetMyCntError: action.payload,
                isGetMyCntLoading: false
            }   
            
        case contentPortalConstant.ADDING_MY_CONTENT:
            return {
            ...state,
                isAddMyCntLoading: true,
                addMyCntSuccess: false
            }
        
        case contentPortalConstant.ADD_MY_CONTENT_SUCCESS:
            return {
                ...state,
                addMyCntSuccess: true,
                addMyCntError: null,
                isAddMyCntLoading: false
            }
    
        case contentPortalConstant.ADD_MY_CONTENT_ERROR:
            return {
                ...state,
                addMyCntError: action.payload,
                isAddMyCntLoading: false
            }
        
        case contentPortalConstant.SET_SELECTED_MICROSITE_CONTENTS:
            return {
                ...state,
                selectedMicrositeContents : action.payload.contents,
                micrositeStyle: action.payload.selectedStyle
            }
            
        case contentPortalConstant.RESET_SELECTED_MICROSITE_CONTENTS:
            return {
                ...state,
                selectedMicrositeContents : [],
                micrositeStyle: ''
            }
            
        case contentPortalConstant.GETTING_LIBRARY_IMAGES:
            return {
            ...state,
                isGetLibraryImgLoading: true
            }
        
        case contentPortalConstant.GET_LIBRARY_IMAGES_SUCCESS:
            return {
                ...state,
                LibraryImg: action.payload,
                GetLibraryImgError: null,
                isGetLibraryImgLoading: false
            }
    
        case contentPortalConstant.GET_LIBRARY_IMAGES_ERROR:
            return {
                ...state,
                GetLibraryImgError: action.payload,
                isGetLibraryImgLoading: false
            }
            
        case contentPortalConstant.GETTING_POPULAR_CONTENT:
            return {
            ...state,
                isGetPopularCntLoading: true
            }
        
        case contentPortalConstant.GET_POPULAR_CONTENT_SUCCESS:
            return {
                ...state,
                popularContents: action.payload,
                GetPopularCntError: null,
                isGetPopularCntLoading: false
            }
    
        case contentPortalConstant.GET_POPULAR_CONTENT_ERROR:
            return {
                ...state,
                GetPopularCntError: action.payload,
                isGetPopularCntLoading: false
            }
            
        case contentPortalConstant.GETTING_RECOMMENDED_CONTENT:
            return {
            ...state,
                isGetRecommendedCntLoading: true
            }
        
        case contentPortalConstant.GET_RECOMMENDED_CONTENT_SUCCESS:
            return {
                ...state,
                recommendedContents: action.payload,
                GetRecommendedCntError: null,
                isGetRecommendedCntLoading: false
            }
    
        case contentPortalConstant.GET_RECOMMENDED_CONTENT_ERROR:
            return {
                ...state,
                GetRecommendedCntError: action.payload,
                isGetRecommendedCntLoading: false
            }
        
        case contentPortalConstant.SENDING_RECOMMENDED_CONTENT:
            return {
            ...state,
                isSendRecommendedCntLoading: true,
            }
        
        case contentPortalConstant.SEND_RECOMMENDED_CONTENT_SUCCESS:
            return {
                ...state,
                SendRecommendedCntSuccess: true,
                SendRecommendedCntError: null,
                isSendRecommendedCntError: false,
                isSendRecommendedCntLoading: false
            }
    
        case contentPortalConstant.SEND_RECOMMENDED_CONTENT_ERROR:
            return {
                ...state,
                SendRecommendedCntError: action.payload,
                isSendRecommendedCntError: true,
                isSendRecommendedCntLoading: false,
                SendRecommendedCntSuccess: false,
            }

        case contentPortalConstant.RESET_RECOMMENDED_CONTENT_ERROR:
            return {
                ...state,
                SendRecommendedCntError: null,
                isSendRecommendedCntError: false,
            }    
            
        case contentPortalConstant.SAVE_SRCH_CONTENT_TAG:
            return {
                ...state,
                contentTagSerachinput: action.payload
            }
            
        case contentPortalConstant.SAVE_SRCH_WHEN_TO_SHARE:
            return {
                ...state,
                whenToShareSerachInput: action.payload
            }
            
        case contentPortalConstant.SAVE_SRCH_DATE_MODIFIED:
            return {
                ...state,
                dateModifiedSearchInput: action.payload
            }
            
        case contentPortalConstant.RESET_SRCH_FILTER:
            return {
                ...state,
                contentTagSerachinput: null,
                whenToShareSerachInput: null,
                dateModifiedSearchInput: null,

            }
        
        case contentPortalConstant.HANDLE_FILTER_SRCH:
            return {
                ...state,
                contentTagSerachinput: action.payload.srchContentTag,
                whenToShareSerachInput: action.payload.srchWhenToShare,
                dateModifiedSearchInput: action.payload.srchDateModifed,
            }
            
        case contentPortalConstant.HANDLE_GLB_CONTENT_SRCH:
            return {
                ...state,
                globalContentSearchInput: action.payload
            }
            
        case contentPortalConstant.RESET_SRCH_FILTER:
            return {
                ...state,
                contentTagSerachinput: null,
                whenToShareSerachInput: null,
                dateModifiedSearchInput: null,
                globalContentSearchInput: null
            }
            
        case contentPortalConstant.GETTING_CONTENT_ANALYTICS:
            return {
            ...state,
                isGetAnalyticdCntLoading: true
            }
        
        case contentPortalConstant.GET_CONTENT_ANALYTICS_SUCCESS:
            return {
                ...state,
                analyticsContent: action.payload,
                GetAnalyticdCntError: null,
                isGetAnalyticdCntLoading: false
            }
    
        case contentPortalConstant.GET_CONTENT_ANALYTICS_ERROR:
            return {
                ...state,
                GetAnalyticdCntError: action.payload,
                isGetAnalyticdCntLoading: false
            }   

        default:
            return state   
    }
};