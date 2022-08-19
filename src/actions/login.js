import { appConstant } from '../constants/appConstants'
import { actions as authActions } from "../containers/app/auth"
import { logInConstant } from '../constants/storeConstants'
import { getToken, validateEmail, isTenantSite } from '../transforms/'

export const edit_email_login = (email) => {
  return dispatch => {
    dispatch({
      type: logInConstant.EDIT_EMAIL_LOGIN,
      payload: email
    })
  }
}

export const edit_pass_login = (pass) => {
  return dispatch => {
    dispatch({
      type: logInConstant.EDIT_PASS_LOGIN,
      payload: pass
    })
  }
}

export const update_login_cred = (data) => {
  return dispatch => {
    dispatch({
      type: logInConstant.UPDATE_LOGIN_CRED,
      payload: data
    })
  }
}

export const login = (user) => {
  return dispatch => {
    dispatch({
      type: logInConstant.LOGGING_IN
    })

    // validate
    if(!!user.email === false || !!user.password === false){
      dispatch({
        type: logInConstant.LOGIN_FAILURE,
        payload: "Email and Password are required fields!"
      })
      return false
    }
    if(!validateEmail(user.email)) {
      dispatch({
        type: logInConstant.LOGIN_FAILURE,
        payload: "Email is incorrect"
      })
      return false
    }

    let url = `${appConstant.BASE_URL}${appConstant.LOGIN_API}`
    // let url = `http://tenant1.vcap.me:3000${appConstant.LOGIN_API}`
    
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("Login response : ", response)
        if(response.success) {
          if(response.result){
            let userData = {
              is_new_user: response.result.first_time_user || false,
              is_slack_user: response.result.is_slack_user || false,
              user_role: response.result.role,
              email: user.email
            }
            let authResult = {
              access_token: response.result.token,
              token_type: 'Bearer',
              expires_in: 3600 * 24,
              user: userData
            }
            
            authActions.saveSession(authResult)

            // if(process.env.REACT_APP_NODE_ENV === 'sandbox' && !isTenantSite()) {
            //   localStorage.removeItem("user_data");
            // }
            localStorage.removeItem("user_data");

            dispatch({
              type: logInConstant.LOGIN_SUCCESS,
              payload: userData
            })
          }          
        } else {
          console.log("Error", response.message);
          let errMsg = 'Email and password incorrect';
          if(typeof response.message === 'string') {
            errMsg = response.message;
          }
          dispatch({
            type: logInConstant.LOGIN_FAILURE,
            payload: errMsg
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: logInConstant.LOGIN_FAILURE,
          payload: 'Email and password incorrect'
        })
      }
    )
  }
}

export const logout = () => {
  return dispatch => {
    let url = `${appConstant.BASE_URL}${appConstant.SAML_LOGOUT_API}`
    let token = getToken();
    
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    })
    .then(res => res.json())
    .then((response) => {
        // console.log("Logout response : ", response)
        if(!response.success) {
          console.log("Error in saml session logout")
        }
          
        authActions.clearSession()
        dispatch({
          type: logInConstant.LOGOUT_SUCCESS
        })
      },
      (error) => {
        console.log("Error", error)
        // still try to logout at app level
        dispatch({
          type: logInConstant.LOGOUT_SUCCESS
        })
      }
    )
  }
}

export const checkTenatExist = (tenantName) => {
  return dispatch => {
    dispatch({
      type: logInConstant.CHECK_TENANT_EXIST
    })
    let data = { tenant: tenantName }
    // validate
    if(!!data.tenant === false){
      dispatch({
        type: logInConstant.CHECK_TENANT_EXIST_FAILURE,
        payload: "Could not get the tenant!"
      })
      return false
    }

    let url = `${appConstant.BASE_URL}${appConstant.CHECK_SANDBOX_TENANT_EXIST}`
    // let url = `http://tenant1.vcap.me:3000${appConstant.LOGIN_API}`
    
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("Check tenant response : ", response)
        if(response.success) {
          if(response.result){
            
            dispatch({
              type: logInConstant.CHECK_TENANT_EXIST_SUCCESS,
              payload: response
            })
          }          
        } else {
          dispatch({
            type: logInConstant.CHECK_TENANT_EXIST_FAILURE,
            payload: response
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: logInConstant.CHECK_TENANT_EXIST_FAILURE,
          payload: error.message
        })
      }
    )
  }
}

export const verify_user = (code) => {
  return dispatch => {
    dispatch({
      type: logInConstant.GETTING_VERIFY_USER,
    })

    // validate
    if(!!code === false){
      dispatch({
        type: logInConstant.GET_VERIFY_USER_ERROR,
        payload: "Code not found"
      })
      return false
    }

    let url = `${appConstant.BASE_URL}${appConstant.VERIFY_USER}/${code}`;
    
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json"
      }
    })
    .then(res => res.json())
    .then((response) => {
        console.log("verify response : ", response)
        if(response.success) {
          if(response.result){
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
              type: logInConstant.GET_VERIFY_USER_SUCCESS,
              payload: userData
            })
          }          
        } else {
          console.log("Error", response.message);
          let errMsg = response.message
          dispatch({
            type: logInConstant.GET_VERIFY_USER_ERROR,
            payload: errMsg
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: logInConstant.GET_VERIFY_USER_ERROR,
          payload: 'Invalid verification code'
        })
      }
    )
  }
}