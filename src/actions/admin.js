import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { adminConstant, rampTimeData } from '../constants/storeConstants'

const UPLOADED_CSV = 'tmz_uploaded_csv'

const saveCSV = (url) => {
  localStorage.setItem(UPLOADED_CSV, url)
}

export const getCSV = () => {
  return dispatch => {
    let csvUrl = localStorage.getItem(UPLOADED_CSV)
  
    if(csvUrl == null) return false;
    let result = JSON.parse(csvUrl)
    dispatch({
      type: adminConstant.UPLOAD_SUCCESS,
      payload: result
    })
  }
}

export const get_CSV = (filename) => {
  
  return dispatch => {

    let url = `${appConstant.BASE_URL}${appConstant.GET_CSV}${filename}`;
    let token = getToken();
    
    fetch(url, {
      method: 'get',
      headers: {
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(response => {return response.ok ? response.text() : Promise.reject(response.status);})
    .then((response) => {
        // console.log("response : ", response)
        dispatch({
          type: adminConstant.GET_CSV,
          payload: response
        })
      },
      (error) => {
        console.log("Error", error)
        // TODO: Handle error
      }
    )

  }
}

export const upload_CSV = (data, activeTopNav) => {
  
  return dispatch => {

    let url = `${appConstant.BASE_URL}${appConstant.UPLOAD_CSV}`;
    let token = getToken();
    
    fetch(url, {
      method: 'post',
      headers: {
        "JWTAuthorization": "Bearer "+ token
      },
      body:data
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          let result = {}
          result[activeTopNav] = response.result.path 
          saveCSV(JSON.stringify(result))
          dispatch({
            type: adminConstant.UPLOAD_SUCCESS,
            payload: result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: adminConstant.UPLOAD_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: adminConstant.UPLOAD_ERROR,
          payload: 'something went wrong'
        })

      }
    )

  }
}

export const get_opportunity_amount  = () => {
  
  return dispatch => {
    dispatch({
      type: rampTimeData.GETTING_OPPORTUNITY_AMOUNT
    })

    let url = `${appConstant.BASE_URL}${appConstant.OPPORTUNITY_AMOUNT_API}`;
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
            type: rampTimeData.GET_OPPORTUNITY_AMOUNT_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: rampTimeData.GET_OPPORTUNITY_AMOUNT_FAIL,           
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: rampTimeData.GET_OPPORTUNITY_AMOUNT_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_quota_attainment  = () => {
  
  return dispatch => {
    dispatch({
      type: rampTimeData.GETTING_QUOTA_ATTAINMENT
    })

    let url = `${appConstant.BASE_URL}${appConstant.QUOTA_ATTAINMENT_API}`;
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
            type: rampTimeData.GET_QUOTA_ATTAINMENT_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: rampTimeData.GET_QUOTA_ATTAINMENT_FAIL,           
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: rampTimeData.GET_QUOTA_ATTAINMENT_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

