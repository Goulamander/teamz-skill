const ACCESS_TOKEN_KEY = 'tmz_access_token'
const ACCESS_TOKEN_TYPE = 'tmz_access_type'
const TOKEN_EXPIRY_KEY = 'tmz_token_expires_in'
const USER_DETAILS = 'tmz_user_details'
const UPLOADED_CSV = 'tmz_uploaded_csv'

const saveAccessToken = (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

/*
* Persist auth cred
* */
const saveSession = (authResult) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, authResult.access_token)
  localStorage.setItem(ACCESS_TOKEN_TYPE, authResult.token_type)
  const expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime())
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
  localStorage.setItem(USER_DETAILS, JSON.stringify(authResult.user))
}

/*
* Clear auth cred
* */
const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_TYPE)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
  localStorage.removeItem(USER_DETAILS)
  localStorage.removeItem(UPLOADED_CSV)
  localStorage.removeItem("user_data");
}

/*
* IsTokenExpired
* */
const isTokenExpired = () => {
  const expiresAt = getExpiresAt()
  const expired = new Date().getTime() > expiresAt
  if (expired) {
    clearSession()
  }
  return expired
}

/*
* IsLoggedIn
* */
const isLoggedIn = () => {
  const accessToken = getAccessToken()
  let result = !!accessToken && !isTokenExpired()
  return result;
}

const getExpiresAt = () => {
  return JSON.parse(localStorage.getItem(TOKEN_EXPIRY_KEY))
}

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

const getUserDetails = () => {
  return JSON.parse(localStorage.getItem(USER_DETAILS)) || {}
}

const isNewUser = () => {
  let userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {}
  return (userDetails)? userDetails.is_new_user: false;
}

const getUserRole = () => {
  let defaultUserRoleId = 4
  let userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {}
  return (userDetails && userDetails.user_role)? userDetails.user_role : defaultUserRoleId;
}

const setIsNewUser = (val) => {
  let userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {}
  if(userDetails){
    userDetails.is_new_user = val;
    localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails))
  }
}

export const actions = {
  saveAccessToken,
  saveSession,
  clearSession,
  isLoggedIn,
  isTokenExpired,
  getExpiresAt,
  getAccessToken,
  getUserDetails,
  isNewUser,
  getUserRole,
  setIsNewUser
};