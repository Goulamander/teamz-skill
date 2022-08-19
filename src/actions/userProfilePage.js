import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { publicViewPage, searchApi, companyLogoConstant } from '../constants/storeConstants'

export const get_user_detail = (user_id) => {
  
  return dispatch => {
    dispatch({
      type: publicViewPage.GETTING_PUBLIC_DATA
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_USER_DETAIL_API}`;
    let token = getToken();
    
    if(!!user_id === true) {
      url += `/${user_id}` 
    } 

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: publicViewPage.GETTING_PUBLIC_DATA_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: publicViewPage.GETTING_PUBLIC_DATA_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: publicViewPage.GETTING_PUBLIC_DATA_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_search_data = (data) => {
  
  return dispatch => {
    dispatch({
      type: searchApi.SEARCH_REQUEST_START
    })

    let url = `${appConstant.BASE_URL}${appConstant.SEARCH_API}`;
    let token = getToken();

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
         dispatch({
            type: searchApi.SEARCH_REQUEST_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: searchApi.SEARCH_REQUEST_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: searchApi.SEARCH_REQUEST_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const save_logo_placeholder_images = (formData, cb) => {
  
  return (dispatch, getState) => {
      dispatch({
          type: companyLogoConstant.ADDING_COMPANY_LOGO
      })
  
      let url = `${appConstant.BASE_URL}${appConstant.SAVE_COMPANY_LOGO}`;
      let token = getToken();

      fetch(url, {
        method: 'post',
        headers: {
          "JWTAuthorization": "Bearer "+ token
        },
        body: formData
      })
      .then(res => res.json())
      .then((response) => {
          console.log("response : ", response)
          if(response.success) {
              if(response.success){
                  dispatch({
                      type: companyLogoConstant.ADD_COMPANY_LOGO_SUCCESS,
                      payload: response.result
                  })
                  cb(null, "logo updated") 
              } else {
                  dispatch({
                      type: companyLogoConstant.ADD_COMPANY_LOGO_ERROR,
                      payload: "something went wrong"
                  });
                  cb("something went wrong", null) 
              } 
          } else {
              console.log("Error", response.message)
              dispatch({
                  type: companyLogoConstant.ADD_COMPANY_LOGO_ERROR,
                  payload: response.message
              })
              cb(response.message, null)
          }
      },
      (error) => {
          console.log("Error", error)
          dispatch({
              type: companyLogoConstant.ADD_COMPANY_LOGO_ERROR,
              payload: 'something went wrong'
          });
          cb('something went wrong');
      })
  }
}

export const get_logo_placeholder_images = () => {
  
  return dispatch => {
    dispatch({
      type: companyLogoConstant.GETTING_COMPANY_LOGO
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_COMPANY_LOGO}`;
    let token = getToken();

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
         dispatch({
            type: companyLogoConstant.GET_COMPANY_LOGO_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: companyLogoConstant.GET_COMPANY_LOGO_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: companyLogoConstant.GET_COMPANY_LOGO_ERROR,
          payload: 'something went wrong'
        })
      }
    )
  }
}