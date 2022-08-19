import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Input, Label, Form, Button } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'

import SelectTable from '../../../component/SelectTable'
import { ROUTES } from '../../../constants/routeConstants'
import { appConstant, userRoles } from '../../../constants/appConstants'
import defaultPP from '../../../assets/img/profile_default.png'
import { getPeopleAccess, updatePeopleAccess } from '../../../actions/peopleaccess'
import { InviteTeamModal } from '../../../containers/onboarding/InviteTeamModal'
import {
  list_team_members,
  add_team_member,
  update_team_member,
  delete_team_member,
  send_invites
} from '../../../actions/invite_team'
import { validateEmail , validateName, getTenantSite } from '../../../transforms'

const Styles = styled.div`
  padding: 1rem 0 1rem 0;

  table {
    border-spacing: 0;
    width: 100%;

    .table-header-analytics{
      background-color: #ffffff;
      
      .th-completion {
        margin-bottom: 0;
        margin-left: -30px;
        margin-right: 30px;
      }
    }
    tr {
       
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    & .table-content-analytics{
      box-shadow: none;
      td{
        padding-right: 15px;
        padding-left: 15px;
        line-height: 30px;
        font-size: 14px;
        
        .custom-multi-progress {
          margin-left: -30px;
        }
      }
      .cell-index {
        margin-bottom: 0
      }
      &.selected-row, &:hover {
        background-color: #feefe9;
        
        .select-row-input {
          display: flex !important;
          justify-content: space-between;
          align-items: center;

          .expand-btn {
            max-width: 30px;
            max-height: 30px;
            cursor: pointer;
            img {
              max-width: 100%;
              max-height: 100%;
              vertical-align: top;
            }
          }
        }
      }
    }

    th{
      font-size: 14px;
      font-weight: 700;
      color: #181818;
      border-bottom: 5px solid #edeffd!important;
      border-top: none;
      padding: 10px 15px 10px 15px!important;

      .fa {
        width: 40px;
        text-align: center;
        line-height: 38px;
        font-size: 24px;
        color: #5352ed;
        transition: all 0.3s ease-out;
        cursor: pointer
      }
      & .disable{
        color: #d2d6db;
      }
      .fa.fa-caret-down:before {
        content: "\f0d7";
      }
      .fa-caret-up:before {
        content: "\f0d8";
      }
    }
    td {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 5px solid #edeffd!important;
      line-height: 40px;
    }
  }
`

const columns = [
  {
    Header: () => (
      <div>
        <input type="checkbox" />
      </div>
    ),
    accessor: 'index',
    disableSortBy: true,
    Cell: ({row, handleExpandClick}) => (
      <div className="">
        <p className="cell-index">{row.index+1}</p>
      </div>),
  },
  {
    Header: 'Name',
    accessor: 'username',
    disableSortBy: true,
    Cell: ({ row }) => 
    {
      if (!!row.original.profile_pic2) {
        var meta = appConstant.BASE_URL + row.original.profile_pic2.replace("dist", "");
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      } else if (row.original.profile_pic1) {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.profile_pic1} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      } else {
        return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
      }
    },
  },
  {
    Header: 'Access Level',
    accessor: 'role',
    disableSortBy: true,
    Cell: ({ row, roleChange }) => (
      <div className="">
        <select className="form-control input-lg" value={row.original.role <= userRoles.length ? userRoles[row.original.role - 1] : 'IC'} onChange={(e) => roleChange(e, row.original.user_id)}>
          {
            userRoles.map((role, i) => {
              return(
                <option key={i} value={role}>{role}</option>
              )
            })
          }
        </select>
        <i className="fa fa-angle-down"></i>
        {/* <p className="access-level">{row.original.role <= userRoles.length ? userRoles[row.original.role - 1] : 'IC'}</p> */}
      </div>
    )
  },
  {
    Header: 'Title',
    accessor: 'jobtitle',
    disableSortBy: true,
    Cell: ({ row }) => (
      <div className="job-title">{row.original.job_title}</div>
    )
  },
  {
    Header: 'Location',
    accessor: 'zip_code',
    disableSortBy: true,
    Cell: ({ row }) => (
      <div className="location">{row.original.zip_code}</div>
    )
  },
  {
    Header: 'Last Login',
    accessor: 'last_login',
    disableSortBy: true,
    Cell: ({ row }) => (
      <div className="last-login">{row.original.last_login === null ? '-- --' : moment(row.original.last_login).format('L')}</div>
    )
  }
];

const Heading = () => (
  <Row>
    <Col className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pb-2">
      <div className="company-section-title">People</div>
    </Col>
  </Row>
)

export const ManageAccess = (props) => {
  let { inviteTeam } = props;
  const [users, setUsers] = useState([])
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
    props._getPeopleAccess()
  }, [])

  useEffect(() => {
    setModalShow(false)
  }, [inviteTeam.success])

  useEffect(() => {
    if(props.peopleAccessData.length > 0) {
      setUsers(props.peopleAccessData)
    } else {
      setUsers([])
    }
  }, [props.peopleAccessData])

  useEffect(() => {
    if(props.isRoleUpdate) {
      props._getPeopleAccess()
    }
  }, [props.isRoleUpdate])


  const handleMemberSearch = (e) => {
    e.preventDefault();
    let searchTxt = e.target.value

    if(!!searchTxt === false) {
      if(props.peopleAccessData.length > 0) {
        setUsers(props.peopleAccessData)
      } else {
        setUsers([])
      }
      return false
    }

    let filteredMember = props.peopleAccessData.filter(member => member.user_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1)

    if(filteredMember.length > 0) {
      setUsers(filteredMember)
    } else {
      setUsers([])
    }
  }

  const toggleInviteModal = () => {
    if(modalShow === false) {
      setModalShow(true)
    } else {
      setModalShow(false)
    }
  }

  const add_member = () => {
    let user = {
      email:'',
      name: '',
      error: {
        email: null,
        name: null
      }
    }
    props._add_team_member(user)
  }

  const edit_member = (e, user, index, inputType) => {
    let input = e.target.value;
    user[inputType] = input
    if(inputType === 'email') {
      // Validate email address
      user.error[inputType] = (input.length === 0)? null : !validateEmail(input) 
    } else if(inputType === 'name'){
      user.error[inputType] = !validateName(input)
    }
    props._update_team_member(index, user)
  }
  
  const send_invites = (e) => {
    e.preventDefault();

    // check validation error
    if(validateInviteForm())
      props._send_invites();
  }

  const roleChange = (e, userId) => {
    if(process.env.REACT_APP_NODE_ENV === 'sandbox') {
      if(e.target.value) {
        let roleId = userRoles.indexOf(e.target.value);
        let json = {
          role: roleId + 1,
          user_id : userId
        }
        props._updatePeopleAccess(json)
      }
    }
    if(process.env.REACT_APP_NODE_ENV === 'staging') {
      if(getTenantSite() === 'app') {
        if(e.target.value) {
          let roleId = userRoles.indexOf(e.target.value);
          let json = {
            role: roleId + 1,
            user_id : userId
          }
          props._updatePeopleAccess(json)
        }
      }
    }
  }

  const validateInviteForm = () => {
    let { invites } = props.inviteTeam
    let isValid = true
    invites.forEach((user) => {
      if(user.error.email)
        isValid=false
    })
    return isValid
  }

  return (
    <div className="manage-access">
      <Row>
        <Col className="meta-data-container">
          <Heading />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm='4'>
          <div className="form-group has-search my-2">
            <Input id="searchCourse" type="search" placeholder="Find a member" aria-label="Search" onChange={handleMemberSearch} />
            <span className="fa fa-search form-control-feedback"></span>
            {/* <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button> */}
          </div>
        </Col>
        <Col className="text-right">
          <Button type="submit" className="addMembers my-2" onClick={toggleInviteModal}>Add Team Members</Button>
        </Col>
      </Row>
      <Row>
        <Col>
        <div>
          <Styles>
            <SelectTable columns={columns} data={users} roleChange={roleChange} />
          </Styles>
        </div>
        </Col>
      </Row>

      <InviteTeamModal 
        isModalShow={modalShow}
        invites={inviteTeam.invites}
        showError={inviteTeam.error}  
        loading={inviteTeam.sending}
        _toggle={toggleInviteModal}
        _add_member={add_member}
        _onChange={edit_member}
        _sendInvites={send_invites}
      />

    </div>
  )
}

const mapStateToProps = ({ peopleAccess, inviteTeam }) => ({
  ...peopleAccess,
  inviteTeam
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _getPeopleAccess       :  getPeopleAccess,
      _updatePeopleAccess    :  updatePeopleAccess,
      _add_team_member       :  add_team_member,
      _update_team_member    :  update_team_member,
      _delete_team_member    :  delete_team_member,
      _send_invites          :  send_invites,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAccess)
