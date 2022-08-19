import React from 'react'
import Avatar from 'react-avatar-edit'
import editIcon from '../../../assets/img/user-edit.png'
import defaultPP from '../../../assets/img/profile_default.png'
import { appConstant } from '../../../constants/appConstants';

const ProfilePhoto = ({userData, _onFileLoad, _onCrop, _onBeforeFileLoad}) => {
  return (
    <div className={'avtar-container'}>
      <Avatar
        width={180}
        height={180}
      />
    </div>
  )
}


export const UserDetailSec = ({
  user,
  profileData
}) => {
  let profileImg = '';
    if(profileData && profileData.length && profileData[0].image) {
      profileImg = appConstant.BASE_URL + profileData[0].image.replace('dist', '')
    } else if(profileData && profileData.length && profileData[0].profile_pic) {
      profileImg = profileData[0].profile_pic
    } else {
      profileImg = defaultPP
    }
    return (
      <div className="prof-info text-center">
        
        <img className="profile-img" src={profileImg} alt="zx" />
         {/* <span className="edit-icon" onClick={() => _handleEdit("USER_PROFILE")}><img className="pro-edit" src={editIcon} alt="..." /></span> */}
        <h4>{`${ profileData && profileData.length ? profileData[0].first_name : ''} ${profileData && profileData.length ? profileData[0].last_name: ''}`}</h4>
        <p className="desg">{ profileData && profileData.length ? profileData[0].job_title : ''}</p>
        <span className="level6-badge">{ profileData && profileData.length ? profileData[0].job_level : ''}</span>
    
        <h5>My Motto</h5>
        <p className="prof-bio">{ profileData && profileData.length ? profileData[0].motto : ''}</p>
        <hr />
      </div>
    )
  
}
