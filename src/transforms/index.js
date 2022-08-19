import moment from 'moment'

import store from '../store';
import { actions as authActions } from "../containers/app/auth";
import { userRoles, appConstant, custCourseStepTypeConstant } from '../constants/appConstants'
import doc from '../assets/img/doc.png'
import activity from '../assets/img/activity.png'
import quizIcon from '../assets/img/quiz-icon.png'
import link from '../assets/img/link.png'

var authToken = ''
var userRole = null

const msStreamRegx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-z0-9]+\.microsoftstream.com\/video+\/[a-zA-Z0-9]/;
const msOfficeRegx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-z0-9|-]+\.sharepoint.com\/:[wpxo]{1}:/;
export const youtubeRegx = /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

const userRolesMapping = ["MANAGER", "IT_ADMIN_MANAGER", "ADMIN_MANAGER", "IC", "IT_ADMIN_IC", "ADMIN_IC"]

export const getQueryCode = (queryStr) => {
  return queryStr.slice(queryStr.indexOf('code=')+5, queryStr.indexOf("&"))
}

export const getSlackRediredirectBaseURL = () => {
  let url = appConstant.BASE_URL
  if(process.env.REACT_APP_NODE_ENV === "developmemt") {
    url = `${process.env.REACT_APP_PROTOCOL}${window.location.host}`
  }
  return url
}

export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export const validateName = (name) => {
  return (name.length > 25 || name.length === 0)? false : true 
}

export const validatePassword = (pass) => {
  return (pass.length < 6 || pass.length === 0)? false : true 
}

export const validateHttpLink = (link) => {
  var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  if (!re.test(link)) { 
      // alert("url error");
      return false;
  }
  return true
}

export const getToken = () => {
  return (authToken === '')? authActions.getAccessToken() : authToken
  
}

export const getUserRole = () => {
  let roleId = authActions.getUserRole()
  return userRolesMapping[roleId -1]
}

export const getWeekDays = (weekStart) => {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

export const getWeekRange = (date) => {
  return {
    from: moment(date)
      .startOf('week')
      .toDate(),
    to: moment(date)
      .endOf('week')
      .toDate(),
  };
}

export const verfiyTenant = () => {

  let path = window.location.pathname.toLowerCase();
  if(!authActions.isLoggedIn()) {
    if(isTenantSite()) {
      if(path.indexOf('/tenant') != -1 ){
        return false;
      }
      if(path.indexOf('/microsites') != -1) {
        return false;
      }
      if(path !== '/saml')
        window.location = '/saml';
    }
  }
}

export const isTenantSite = () => {
  let domain = window.location.host.toLowerCase();
  let domainChunks = domain.split('.');
  let subdomain = domainChunks[domainChunks.length - 3];

  if(process.env.REACT_APP_NODE_ENV === 'staging') {
    let devSubDomain = domainChunks[domainChunks.length - 4];
    return (!!devSubDomain && devSubDomain !== "app");
  } if(process.env.REACT_APP_NODE_ENV === 'sandbox') {
    let sandboxSubDomain = domainChunks[domainChunks.length - 4];
    return (!!sandboxSubDomain && sandboxSubDomain !== "app");
  } else {
    return (!!subdomain && subdomain !== "app");
  }
}

export const getTenantSite = () => {
  let domain = window.location.host.toLowerCase();
  let path = window.location.pathname.toLowerCase();
  let domainChunks = domain.split('.');
  let subdomain = domainChunks[domainChunks.length - 3];

  if(process.env.REACT_APP_NODE_ENV === 'staging') {
    let devSubDomain = domainChunks[domainChunks.length - 4];
    return devSubDomain || ''
  } else if(process.env.REACT_APP_NODE_ENV === 'sandbox') {
    let sandboxSubDomain = domainChunks[domainChunks.length - 4];
    return sandboxSubDomain || '';
  } else {
    return subdomain || ''
  }
}

export const getUserRoleName = (roleID=null) => {
  // grab current state
  const state = store.getState();
  if(!!roleID === false) {
    if(state.login && state.login.data && state.login.data.user_role) {
      roleID = state.login.data.user_role
    } else {
      roleID = authActions.getUserRole()
    }
  }
  
  return roleID <= userRolesMapping.length ? userRolesMapping[roleID -1] : 'IC'
}

export const convertWeekNumber = (week) => {
  return isNaN(week)? week : week > 1 ? week + " weeks" : week + " week"
}

export const getQueryParams = ( params, url ) => {
  
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
};

export const iframeyStepLinks = async (eurl) => {
 
  let corsurl = "https://cors-anywhere.herokuapp.com/"

  // Hard-code few links
  // 1. google drive file link
  if(eurl.indexOf('https://drive.google.com/open?id=') != -1) {
    let fileId = getQueryParams('id', eurl) || ''
    let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
    return driveEmbedUrl;

  } else if(eurl.indexOf('https://drive.google.com/file/d/') != -1) {
    let fileId = eurl.substr(eurl.indexOf('file/d/')+7).split("/")[0] || ''
    let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
    return driveEmbedUrl;
  }

  // 2. microsoft stream links
  // example https://web.microsoftstream.com/video/f36603ec-7acc-4b95-94a6-8acd8d4890db
  
  if(msStreamRegx.test(eurl)) {
    let encodedUrl = encodeURIComponent(eurl)
    let embedUrl = `https://web.microsoftstream.com/oembed?url=${encodedUrl}`
    return await fetch(corsurl+embedUrl, {method: 'get'})
    .then(response=> response.json())
    .then(res => {
      console.log("embedUrl", res)
      if(!!res.embed_url === true) return res.embed_url
      else return false
    })
    .catch(e => {
      return false
    })
  }

  // 3. microsoft office apps links
  // example https://myteamzskill-my.sharepoint.com/:w:/g/personal/sumit_myteamzskill_onmicrosoft_com/Eawq1k99yptPrBwuEd864pYB_IJcSNLzQv_24fBvJG_vnw?e=b2cabX
  if(eurl.indexOf('&action=embedview&wdbipreview=true') > 0) return eurl;

  if(msOfficeRegx.test(eurl)) {
    let embededUrl = eurl
    let embedUrl = `${eurl}&action=embedview&wdbipreview=true`
    return await fetch(corsurl+embedUrl, {method: 'HEAD', mode: 'cors'})
  .then(res => {
    console.log("res", res.headers.get('x-frame-options'))
    let xframeAccess = res.headers.get('x-frame-options')
    let xframeAccessNew = xframeAccess === null ? xframeAccess : xframeAccess.toLowerCase()
    switch(xframeAccessNew) {
      case "allow":
        embededUrl = embedUrl
        break;
      case "deny":
      case "sameorigin":
        embededUrl = false
        break;
      default:
        if(youtubeRegx.test(embedUrl))
          embededUrl = false
        else
          embededUrl = embedUrl
    }
    return embededUrl
  })
  .catch(er => {
    embededUrl = false
  })
  }

  // check 'x-frame-options'
  let embededUrl = eurl
  return await fetch(corsurl+eurl, {method: 'HEAD', mode: 'cors'})
  .then(res => {
    console.log("res", res.headers.get('x-frame-options'))
    let xframeAccess = res.headers.get('x-frame-options')
    let xframeAccessNew = xframeAccess === null ? xframeAccess : xframeAccess.toLowerCase()
    switch(xframeAccessNew) {
      case "allow":
        embededUrl = eurl
        break;
      case "deny":
      case "sameorigin":
        embededUrl = false
        break;
      default:
        if(youtubeRegx.test(eurl))
          embededUrl = false
        else
          embededUrl = eurl
    }
    return embededUrl
  })
  .catch(er => {
    embededUrl = false
  })

}

export const createSlideIframeUrl = (link) => {
  let fileId = link.substr(link.indexOf('presentation/d/')+15).split("/")[0] || '';
  let driveEmbedUrl;
  if(link.includes('docs.google.com')) {
    driveEmbedUrl = `https://docs.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
  } else {
    driveEmbedUrl = `https://drive.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
  }
  return driveEmbedUrl;
}

export const handleTopicIframeLink = (link, expType) => {
  let driveEmbedUrl;
  if(link.indexOf('https://drive.google.com/open?id=') != -1) {
    let fileId = getQueryParams('id', link) || ''
    driveEmbedUrl = expType === 'draft' ? `https://drive.google.com/file/d/${fileId}/edit` : `https://drive.google.com/file/d/${fileId}/preview`;
  } else if(link.indexOf('https://drive.google.com/file/d/') != -1) {
    let fileId = link.substr(link.indexOf('file/d/')+7).split("/")[0] || ''
    driveEmbedUrl = expType === 'draft' ? `https://drive.google.com/file/d/${fileId}/edit` : `https://drive.google.com/file/d/${fileId}/preview`;
  } else if(link.indexOf('https://drive.google.com/presentation/d/') != -1) {
    let fileId = link.substr(link.indexOf('presentation/d/')+15).split("/")[0] || '';
    driveEmbedUrl = expType === 'draft' ? `https://drive.google.com/presentation/d/${fileId}` : `https://drive.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
  } else if(link.indexOf('https://docs.google.com/presentation/d/') != -1) {
    let fileId = link.substr(link.indexOf('presentation/d/')+15).split("/")[0] || '';
    driveEmbedUrl = expType === 'draft' ? `https://docs.google.com/presentation/d/${fileId}` : `https://docs.google.com/presentation/d/${fileId}/embed?&slide=id.p1&rm=minimal`;
  } else if(link.indexOf('https://docs.google.com/spreadsheets/d/') != -1) {
    let fileId = link.substr(link.indexOf('spreadsheets/d/')+15).split("/")[0] || '';
    driveEmbedUrl = expType === 'draft' ? `https://docs.google.com/spreadsheets/d/${fileId}/edit` : `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  } else if(link.indexOf('https://drive.google.com/spreadsheets/d/') != -1) {
    let fileId = link.substr(link.indexOf('spreadsheets/d/')+15).split("/")[0] || '';
    driveEmbedUrl = expType === 'draft' ? `https://drive.google.com/spreadsheets/d/${fileId}/edit` : `https://drive.google.com/spreadsheets/d/${fileId}/preview`;
  } else {
    driveEmbedUrl = link;
  }
  return driveEmbedUrl;
}

export const getTypeIcon = (type) => {
  let icon = link;
  switch(type) {
    case custCourseStepTypeConstant.INTERNAL_CONTENT:
      icon = doc;
      break;

    case custCourseStepTypeConstant.EXTERNAL_CONTENT:
      icon = link;
      break;

    case custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ:
      icon = quizIcon;
      break;

    case custCourseStepTypeConstant.ACTIVITY:
    case custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO:
    case custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO:
      icon = activity;
      break
  }
  return icon
}

export const addKeyIds = (steps) => {
  steps.map(step=> {
    if(step.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ) {
      if(step.step_quiz) {
        step.step_quiz.questions.map(q => {
          if(q.options && q.options.length > 0) {
            q.options.map((o,i)=> o.option_key = i+1)
          }
        })
      }
    }
  })
  return steps
}

export const decodeQuizAnswers = (answersArr) => {
  // string to array
  return answersArr.map(ans => {
    ans.answer=ans.answer.split(',').map(n => Number(n))
    return ans
  })
}

export const encodeQuizAnswers = (answersArr) => {
  // array to string
  return answersArr.map(ans => {
    ans.answer=ans.answer.join(',')
    return ans
  })
}

export const checkRowSelected = (row, selectedFlatRows) => {
  if(selectedFlatRows && selectedFlatRows.length)
  for(let i=0; i<selectedFlatRows.length; i++) {
    if(selectedFlatRows[i].original.user_id === row.original.user_id) {
      return true
    }
  }
  return false
}

export const checkCourseRowSelected = (row, selectedFlatRows) => {
  if(selectedFlatRows && selectedFlatRows.length)
  for(let i=0; i<selectedFlatRows.length; i++) {
    if(selectedFlatRows[i].original.c_id === row.original.c_id) {
      return true
    }
  }
  return false
}

export const checkContentRowSelected = (row, selectedFlatRows) => {
  if(selectedFlatRows && selectedFlatRows.length)
  for(let i=0; i<selectedFlatRows.length; i++) {
    if(selectedFlatRows[i].original.doc_id === row.original.doc_id) {
      return true
    }
  }
  return false
}

export const convertAmountString = (value) => {
  if(value>=1000000)
  {
      value=(value/1000000)
  }
  else if(value>=1000)
  {
      value=(value/1000);
  }
  return value;
}

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const copySharableLink = (uri) => {
  let aTag = document.createElement('a');
  aTag.setAttribute('href', `${uri}`);
  aTag.setAttribute("class", "copy-anchor-link");
  aTag.innerText = "link to share";
  document.body.appendChild(aTag);
  const link = document.querySelector('.copy-anchor-link');
  const range = document.createRange();
  range.selectNode(link);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  aTag.remove();
}