import { actions as authActions } from "../containers/app/auth"

import { logInConstant, samlSettingConstants, profileConstant } from '../constants/storeConstants'
import { appConstant } from '../constants/appConstants'
import { getToken } from '../transforms'

export const samlAuth = (tenantName) => {
  return (dispatch, getState) => {

    dispatch({
      type: logInConstant.LOGGING_IN
    })

    let data = { tenant: tenantName }
    let url = `${appConstant.BASE_URL}/api/okta/saml`;
    // let url = `http://tenant1.vcap.me:3000/api/okta/saml`;

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("saml response : ", response)
        if(response.success) {
          let userData = {
            is_new_user: response.result.first_time_user || false,
            is_slack_user: response.result.is_slack_user || false,
            user_role: response.result.role,
            email: response.result.email
          }
          let authResult = {
            access_token: response.result.token,
            token_type: 'Bearer',
            expires_in: 3600 * 24,
            user: userData
          }
          
          authActions.saveSession(authResult)

          dispatch({
            type: logInConstant.LOGIN_SUCCESS,
            payload: userData
          })

          // Prefill onboarding input 
          let { profile } = getState()
          let profileData = {
            ...profile.data,
            role: response.result.role,
            job_title: response.result.job_title,
            firstname: response.result.firstname,
            lastname: response.result.lastname,
            zipcode: response.result.zipcode,
            error: {
              firstname: false,
              lastname: false,
              job_title: false,
              zipcode: false,
            }
          }
          dispatch({
            type: profileConstant.EDIT_PROFILE,
            payload: profileData
          })

        } else {
          let loginError = {
            type: logInConstant.LOGIN_FAILURE,
            payload: {...response, errorType: 'tenant'}
          }

          dispatch(loginError)
        }
      },
      (error) => {
        console.log("Saml login error", error.message)
        dispatch({
          type: logInConstant.LOGIN_FAILURE,
          payload: error.message
        })
      }
    )
  }

}

// Company settings API's
export const getSamlDetail = () => {
  return dispatch => {

    dispatch({
      type: samlSettingConstants.GETTING_SAML_SETTINGS
    })
    
    let url = appConstant.BASE_URL + appConstant.GET_SAML_SETINGS_API;
    let token = getToken();

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: samlSettingConstants.GET_SAML_SETTINGS_SUCCESS,
            payload: response.result
          })
        } else {
          dispatch({
            type: samlSettingConstants.GET_SAML_SETTINGS_FAIL,
            payload: ''
          })
        }
      },
      (error) => {
        dispatch({
          type: samlSettingConstants.GET_SAML_SETTINGS_FAIL,
          payload: ''
        })
      }
    )
  }

}

export const saveSamlDetail = (data, cb) => {
  return (dispatch, getState) => {

    dispatch({
      type: samlSettingConstants.SAVING_SAML_SETTINGS
    })

    
    let url = appConstant.BASE_URL + appConstant.PUT_SAML_SETINGS_API;
    let token = getToken();

    let state = getState()
    let { saml } = state

    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("saml response : ", response)
        if(response.success) {
          dispatch({
            type: samlSettingConstants.SAVE_SAML_SETTINGS_SUCCESS,
            payload: {...saml.data, ...data}
          })
        } else {
          dispatch({
            type: samlSettingConstants.SAVE_SAML_SETTINGS_FAIL,
            payload: ''
          })
        }
        cb(response)
      },
      (error) => {
        dispatch({
          type: samlSettingConstants.SAVE_SAML_SETTINGS_FAIL,
          payload: ''
        })
        cb({
          success: false
        })
      }
    )
  }

}

export const saveSamlMetadata = (data, userType, cb) => {
  return (dispatch, getState) => {

    dispatch({
      type: samlSettingConstants.SAVING_SAML_METADATA
    })
    
    let endUrl = userType === 'Okta' ? appConstant.PUT_SAML_OKTA_METADATA_API : appConstant.PUT_SAML_AZURE_METADATA_API
    let url = appConstant.BASE_URL + endUrl;
    let token = getToken();

    let state = getState()
    let { saml } = state

    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("saml response : ", response)
        if(response.success) {
          data.entity_id = response.result.entity_id
          data.entry_point = response.result.entry_point
          data.meta_data = response.result.meta_data
          dispatch({
            type: samlSettingConstants.SAVE_SAML_METADATA_SUCCESS,
            payload: {...saml.data, ...data}
          })
        } else {
          dispatch({
            type: samlSettingConstants.SAVE_SAML_METADATA_FAIL,
            payload: ''
          })
        }
        cb(response)
      },
      (error) => {
        dispatch({
          type: samlSettingConstants.SAVE_SAML_METADATA_FAIL,
          payload: ''
        })
        cb({
          success: false
        })
      }
    )
  }

}

export const updateAdminPassword = (data) => {
  return dispatch => {

    dispatch({
      type: samlSettingConstants.SAVING_ADMIN_PASSWORD
    })

    
    let url = appConstant.BASE_URL + appConstant.PUT_ADMIN_PASSWORD_API;
    let token = getToken();

    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("update password response : ", response)
        if(response.success) {
          dispatch({
            type: samlSettingConstants.SAVE_ADMIN_PASSWORD_SUCCESS
          })
        } else {
          dispatch({
            type: samlSettingConstants.SAVE_ADMIN_PASSWORD_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log(error)
        dispatch({
          type: samlSettingConstants.SAVE_ADMIN_PASSWORD_FAIL,
          payload: 'Something went wrong!'
        })
      }
    )
  }
}

export const changeAdminPasswordState = (newState) => {
  return dispatch => {
    dispatch({
      type: samlSettingConstants.EDIT_ADMIN_PASSWORD_STATE,
      payload: newState
    })
  }
}