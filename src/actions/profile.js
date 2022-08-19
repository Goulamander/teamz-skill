import { actions as authActions } from "../containers/app/auth"
import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { profileConstant, logInConstant } from '../constants/storeConstants'

export const get_profile = (cb) => {
  
  return dispatch => {
    dispatch({
      type: profileConstant.GETTING_PROFILE
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_ONBOARDING_API}`;
    let token = getToken();

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        // console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: profileConstant.GET_PROFILE_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: profileConstant.GET_PROFILE_ERROR
          })
        }

        cb()
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: profileConstant.GET_PROFILE_ERROR,
          payload: 'something went wrong'
        })
        cb()
      }
    )

  }
}

export const edit_profile = (profile) => {
  return dispatch => {
    dispatch({
      type: profileConstant.EDIT_PROFILE,
      payload: profile
    })
  }
}

export const save_profile = (profile) => {
  return (dispatch, getState) => {
    dispatch({
      type: profileConstant.SAVE_PROFILE,
    })

    let url = `${appConstant.BASE_URL}${appConstant.SAVE_PROFILE_API}`;

    let token = getToken();

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(profile)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: profileConstant.SAVE_PROFILE_SUCCESS
          })

          // Reset form data
          setTimeout(function() {
            dispatch({
              type: profileConstant.RESET_PROFILE
            })
          }, 500)

          // Set is_new_user flag to false
          let { login } = getState();
          login.data.is_new_user = false
          dispatch({
            type: logInConstant.LOGIN_SUCCESS,
            payload: login.data
          })

          // update localstorage too
          // authActions.setIsNewUser(false)

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
            payload: {...login.data, ...userData}
          })


        } else {
          dispatch({
            type: profileConstant.SAVE_PROFILE_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        dispatch({
          type: profileConstant.SAVE_PROFILE_ERROR,
          payload: error.message
        })

      }
    )
      // on success response
      dispatch({
        type: profileConstant.SAVE_PROFILE_SUCCESS,
        payload: profile
      })

      // on Error response
      dispatch({
        type: profileConstant.SAVE_PROFILE_ERROR,
        payload: profile
      })
  }
}