import { micrositesConstant } from '../constants/storeConstants'

const initialState = {
    CMLoading: false,
    CMError: null,
    CMSuccess: false,
    getMSDataByLinkLoading: false,
    getMSDataByLinkError: null,
    getMSDataByLink: {
        style_type: '',
        title: '',
        description: '',
        logo: '',
        link: '',
        customize_link: '',
        background_img: '',
        header_color: '',
        contentsData: []
    },
    getMicrositesLoading: false,
    getMicrosites : [],
    getMicrositesError: [],
    updateMSLoading: false,
    updateMSError: '',
    updateMSSuccess: false,
    saveShareLinkDataLoading: false,
    saveShareLinkDataSuccess: false,
    saveShareLinkDataError: false,
    getMyShareLoading: false,
    getMyShareData: [],
    getMyShareError: '',
    deleteMSCLoading: false,
    deleteMSCError: '',
    deleteMSCSuccess: false,
    addContentToMSLoading: false,
    addContentToMSError: '',
    isAddContentToMSError: false,
    addContentToMSSuccess: false,
    saveUploadVideoDataLoading: false,
    saveUploadVideoDataSuccess: false,
    saveUploadVideoDataError: false,
    saveCTATextDataLoading: false,
    saveCTATextDataSuccess: false,
    saveCTATextDataError: false,
    isRecordedVideoUploading: false
};

export default (state = initialState, action) => {
    switch (action.type) {   
            
        case micrositesConstant.CREATING_MICROSITE:
            return {
            ...state,
                CMLoading: true
            }
        
        case micrositesConstant.CREATE_MICROSITE_SUCCESS:
            return {
                ...state,
                CMSuccess: true,
                CMError: null,
                CMLoading: false
            }
    
        case micrositesConstant.CREATE_MICROSITE_ERROR:
            return {
                ...state,
                CMError: action.payload,
                CMLoading: false
            }
            
        case micrositesConstant.GETTING_MICROSITE_BY_LINK:
            return {
            ...state,
                getMSDataByLinkLoading: true
            }
        
        case micrositesConstant.GET_MICROSITE_BY_LINK_SUCCESS:
            return {
                ...state,
                getMSDataByLink: action.payload,
                getMSDataByLinkError: null,
                getMSDataByLinkLoading: false
            }
    
        case micrositesConstant.GET_MICROSITE_BY_LINK_ERROR:
            return {
                ...state,
                getMSDataByLinkError: action.payload,
                getMSDataByLinkLoading: false
            }
            
        case micrositesConstant.GETTING_MICROSITES:
            return {
            ...state,
                getMicrositesLoading: true
            }
        
        case micrositesConstant.GET_MICROSITES_SUCCESS:
            return {
                ...state,
                getMicrosites: action.payload,
                getMicrositesError: null,
                getMicrositesLoading: false
            }
    
        case micrositesConstant.GET_MICROSITES_ERROR:
            return {
                ...state,
                getMicrositesError: action.payload,
                getMicrositesLoading: false
            }
            
        case micrositesConstant.UPDATING_MICROSITE:
            return {
            ...state,
                updateMSLoading: true
            }
        
        case micrositesConstant.UPDATE_MICROSITE_SUCCESS:
            return {
                ...state,
                updateMSSuccess: true,
                updateMSError: null,
                updateMSLoading: false
            }
    
        case micrositesConstant.UPDATE_MICROSITE_ERROR:
            return {
                ...state,
                updateMSError: action.payload,
                updateMSLoading: false
            }
            
        case micrositesConstant.SAVING_GET_SHARE_LINK:
            return {
            ...state,
                saveShareLinkDataLoading: true
            }
        
        case micrositesConstant.SAVE_GET_SHARE_LINK_SUCCESS:
            return {
                ...state,
                saveShareLinkDataSuccess: true,
                saveShareLinkDataError: null,
                saveShareLinkDataLoading: false
            }
    
        case micrositesConstant.SAVE_GET_SHARE_LINK_ERROR:
            return {
                ...state,
                saveShareLinkDataError: action.payload,
                saveShareLinkDataLoading: false
            }
            
        case micrositesConstant.GETTING_MY_SHARES:
            return {
            ...state,
                getMyShareLoading: true
            }
        
        case micrositesConstant.GET_MY_SHARES_SUCCESS:
            return {
                ...state,
                getMyShareData: action.payload,
                getMyShareError: null,
                getMyShareLoading: false
            }
    
        case micrositesConstant.GET_MY_SHARES_ERROR:
            return {
                ...state,
                getMyShareError: action.payload,
                getMyShareLoading: false
            }
            
        case micrositesConstant.DELETING_MICROSITE_CONTENTS:
            return {
            ...state,
                deleteMSCLoading: true
            }
        
        case micrositesConstant.DELETE_MICROSITE_CONTENTS_SUCCESS:
            return {
                ...state,
                deleteMSCSuccess: true,
                deleteMSCError: null,
                deleteMSCLoading: false
            }
    
        case micrositesConstant.DELETE_MICROSITE_CONTENTS_ERROR:
            return {
                ...state,
                deleteMSCError: action.payload,
                deleteMSCLoading: false
            }
            
        case micrositesConstant.ADDING_CONTENT_TO_MICROSITE:
            return {
            ...state,
                addContentToMSLoading: true
            }
        
        case micrositesConstant.ADD_CONTENT_TO_MICROSITE_SUCCESS:
            return {
                ...state,
                addContentToMSSuccess: true,
                addContentToMSError: null,
                isAddContentToMSError: false,
                addContentToMSLoading: false
            }
    
        case micrositesConstant.ADD_CONTENT_TO_MICROSITE_ERROR:
            return {
                ...state,
                isAddContentToMSError: true,
                addContentToMSError: action.payload,
                addContentToMSLoading: false
            }
            
        case micrositesConstant.RESET_ADD_CONTENT_TO_MICROSITE_ERROR:
            return {
                ...state,
                addContentToMSError: null,
                isAddContentToMSError: false,
            }
            
        case micrositesConstant.SAVING_UPLOAD_VIDEO_DATA:
            return {
            ...state,
                saveUploadVideoDataLoading: true
            }
        
        case micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_SUCCESS:
            return {
                ...state,
                saveUploadVideoDataSuccess: true,
                saveUploadVideoDataError: null,
                saveUploadVideoDataLoading: false
            }
    
        case micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_ERROR:
            return {
                ...state,
                saveUploadVideoDataError: action.payload,
                saveUploadVideoDataLoading: false
            }
        
        case micrositesConstant.SAVING_CTX_TEXT_DATA:
            return {
                ...state,
                saveCTATextDataLoading: true
            }
        
        case micrositesConstant.SAVE_CTX_TEXT_DATA_SUCCESS:
            return {
                ...state,
                saveCTATextDataSuccess: true,
                saveCTATextDataError: null,
                saveCTATextDataLoading: false
            }
    
        case micrositesConstant.SAVE_CTX_TEXT_DATA_ERROR:
            return {
                ...state,
                saveCTATextDataError: action.payload,
                saveCTATextDataLoading: false
            }
            
        case micrositesConstant.UPLOADING_MICROSITE_RECORDED_VIDEO:
            return {
                ...state,
                isRecordedVideoUploading: true
            }
            
        case micrositesConstant.UPLOAD_MICROSITE_RECORDED_VIDEO_SUCCESS:
            case micrositesConstant.UPLOAD_MICROSITE_RECORDED_VIDEO_FAIL:
                return {
                ...state,
                isRecordedVideoUploading: false
                }    

        default:
            return state   
    }
};