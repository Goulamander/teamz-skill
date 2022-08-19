import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col, Input, Form, Button } from 'reactstrap';
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import defaultPP from '../../../../assets/img/profile_default.png'
import SelectTable from '../../../../component/SelectTable'
import Can from '../../../../component/Can'
import { ROUTES } from '../../../../constants/routeConstants'
import { appConstant, userRoles } from '../../../../constants/appConstants'
import { validateEmail, getUserRoleName, validateName } from '../../../../transforms'
const routeResource = "COMPONENT"

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
        :nth-child(2) {
          white-space: nowrap;
        }
      }
      .cell-index {
        margin-bottom: 0
      }
      .icon-btn {
        .fa {
          font-size: 19px;
          color: #bdc3c7;
          line-height: 1.19;
          cursor: pointer;
        }
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
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="30" height="30" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
        } else if (row.original.profile_pic1) {
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.profile_pic1} width="30" height="30" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
        } else {
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="30" height="30" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.user_name}</Link>;
        }
      },
    },
    {
      Header: 'Department',
      accessor: 'department',
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="">{row.original.department === '' ? '-- --' : row.original.department}</div>
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
        <div className="location">{row.original.location}</div>
      )
    },
    {
      Header: 'Manager',
      accessor: 'manager',
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="last-login">{row.original.manager === '' ? '-- --' : row.original.manager}</div>
      )
    },
    {
      Header: '',
      accessor: 'deletemember',
      disableSortBy: true,
      Cell: ({ row, deleteMember, selectedTeam }) => (
        <Can
          role={getUserRoleName()}
          resource={routeResource}
          action={"TEAMMEMBER:DELETE"}
          yes={(attr) => (
            getUserRoleName() === 'MANAGER' ?
            selectedTeam.team_owner ? 
            <div className="icon-btn">
              <i className="fa fa-times" onClick={() => deleteMember(row)}></i>
            </div> : null : <div className="icon-btn">
              <i className="fa fa-times" onClick={() => deleteMember(row)}></i>
            </div>
          )}
          no={() => (
            null
          )}
        />
      )
    }
];

const TeamMembers = ({
  _members,
  _handleMemberSearch,
  deleteMember,
  selectedTeam
}) => {
  return (
    <div className="team-members">
      <div className="team-members-header d-flex mt-3 justify-content-between">
        <div>
          {/* <Form className="form-inline srch-box">
            <Input type="search" placeholder="Find a member" aria-label="Search" onChange={_handleMemberSearch} />
            <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button>
          </Form> */}
          <div className="form-group has-search mt-2">
            <Input type="search" className="form-control" placeholder="Find a member" onChange={_handleMemberSearch}  />
            <span className="fa fa-search form-control-feedback"></span>
          </div>
        </div>
        <div>
          <Can
            role={getUserRoleName()}
            resource={routeResource}
            action={"TEAMMEMBER:ADDTEAMMEMBER"}
            yes={(attr) => (
              getUserRoleName() === 'MANAGER' ?
              selectedTeam.team_owner ? 
              <Button type="submit" className="addMembers">Add Team Members</Button> : null : <Link to={ROUTES.ADD_TO_TEAM} ><Button type="submit" className="addMembers">Add Team Members </Button></Link>
            )}
            no={() => (
              null
            )}
          />
        </div>
      </div>

      <div>
        <Styles>
          <SelectTable columns={columns} data={_members} deleteMember={deleteMember} selectedTeam={selectedTeam} />
        </Styles>
      </div>
    </div>
  )
}

export default TeamMembers