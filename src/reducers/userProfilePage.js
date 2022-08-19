import {
    publicViewPage,
    searchApi
  } from '../constants/storeConstants'
  
  const initialState = {
    userdetails: [],
    userDetailLoading: false,
    searchResult:[]
  }
  
  export default (state = initialState, action) => {
    switch (action.type) {
        case publicViewPage.GETTING_PUBLIC_DATA:
          return {
            ...state,
            userDetailLoading: true,
            error: ''
          }
        case publicViewPage.GETTING_PUBLIC_DATA_SUCCESS:
          return {
            ...state,
            userDetailLoading: false,
            userdetails: action.payload,
          }
        case publicViewPage.GETTING_PUBLIC_DATA_FAIL:
          return {
            ...state,
            userDetailLoading: false
          }

          case searchApi.SEARCH_REQUEST_START:
          return {
            ...state,
            userDetailLoading: true,
            error: ''
          }
        case searchApi.SEARCH_REQUEST_SUCCESS:
          return {
            ...state,
            userDetailLoading: false,
            searchResult: action.payload,
          }
        case searchApi.SEARCH_REQUEST_FAIL:
          return {
            ...state,
            userDetailLoading: false
          }
  
      default: 
        return state
    }
  }