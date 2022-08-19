import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Form, Button, Label } from 'reactstrap';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';
import classnames from 'classnames'

import defaultPP from '../../../assets/img/profile_default.png'
import SelectTable from '../../../component/SelectTable'
import { ROUTES } from '../../../constants/routeConstants'
import { appConstant, userRoles } from '../../../constants/appConstants'
import {
    get_all_org_users,
    add_team_members,
    set_is_team_members_added
} from '../../../actions/team';
import { checkRowSelected } from '../../../transforms'

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
      &.selected-row, &:hover {
        background-color: #feefe9;
        
        .cell-index {
          display: none;
        }
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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, handleExpandedClick, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} onClick={handleExpandedClick} />
      </>
    )
  }
)

const columns = [
    {
      Header: ({ getToggleAllRowsSelectedProps, isAllRowsSelected, selectedFlatRows, onMassSelection }) => {
        onMassSelection(isAllRowsSelected, selectedFlatRows)
        return (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        )
      },
      accessor: 'index',
      disableSortBy: true,
      Cell: ({row, handleExpandClick, selectedFlatRows}) => {
        let isSelected = checkRowSelected(row, selectedFlatRows)
        return (
        <div className="">
            <p className={classnames({"cell-index": true, "d-none": isSelected})}>{row.index+1}</p>
            <div className={classnames({"select-row-input":true, "d-none" : !isSelected})}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} handleExpandedClick={() => handleExpandClick(row)} />
              {/* <input type="checkbox" onClick={() => handleExpandClick(row)} /> */}
            </div>
      </div>)},
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
    }
];

const AddToTeam = (props) => {
    let { orgUsers, selectedTeam, isTeamMembersAdded } = props.teamDetails;

    const [orgusers, setOrgusers] = useState([]);
    const [isAddedToTeamEmpty, setIsAddedToTeamEmpty] = useState(false);
    const [isMemberAddedError, setIsMemberAddedError] = useState(false);
    const [isMemberAdded, setIsMemberAdded] = useState(false);
    const [membersToAdd, setMembersToAdd] = useState([]);
    const [selectedMember, setSelectedMember] = useState([]);
    let membersToSelect = []

    useEffect(() => {
      if(selectedTeam != null) 
      props._get_all_org_users(selectedTeam.team_id)
    }, [selectedTeam])
    
    useEffect(() => {
      if(isTeamMembersAdded) {
        setIsMemberAdded(true);
      }
    }, [props.teamDetails.isTeamMembersAdded])

    useEffect(() => {
      if(props.teamDetails.addTmError != null) {
        setIsMemberAddedError(true);
      }
    }, [props.teamDetails.addTmError])

    useEffect(() => {
      if(props.teamDetails.isTeamMembersAdded == true) {
        setMembersToAdd([]);
        props._get_all_org_users(selectedTeam.team_id)
      }
    }, [props.teamDetails.isTeamMembersAdded])

    useEffect(() => {
        if(orgUsers.length > 0) {
            setOrgusers(orgUsers)
        } else {
            setOrgusers([])
        }
    }, [orgUsers])

    const handleExpandClick = (row) => {
        // let members = [];
        // if(checkMemberExist(membersToAdd, row.original.user_id)) {
        //     members = membersToAdd.filter(data => {
        //       return data.user_id != row.original.user_id
        //     });
        //     setMembersToAdd(members);
        // } else {
        //   members = [...membersToAdd, {team_id: selectedTeam.team_id, user_id: row.original.user_id}]
        //   setMembersToAdd(members);
        // }
    }

    const onMassSelection = (a,b) => {
      if(b.length > 0) {
        let members = [];
        for(let i=0; i<b.length; i++) {
          members.push({team_id: selectedTeam.team_id, user_id: b[i].original.user_id});
        }
        membersToSelect = members
      } else {
        membersToSelect = []
      }
    }

    const checkMemberExist = (memberToAdd, user_id) => {
        if(memberToAdd.length) {
          for(let i=0; i<memberToAdd.length; i++) {
            if(memberToAdd[i].user_id === user_id) {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
    }

    const handleMemberSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(orgUsers.length > 0) {
          setOrgusers(orgUsers)
        } else {
          setOrgusers([])
        }
        return false
      }

      let filteredMember = orgUsers.filter(member => {
        if(member.user_name != null)
        return member.user_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })

      if(filteredMember.length > 0) {
        setOrgusers(filteredMember)
      } else {
        setOrgusers([])
      }
    }

    const handleLocationSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(orgUsers.length > 0) {
          setOrgusers(orgUsers)
        } else {
          setOrgusers([])
        }
        return false
      }

      let filteredMember = orgUsers.filter(member => {
        if(member.location != null)
        return member.location.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })

      if(filteredMember.length > 0) {
        setOrgusers(filteredMember)
      } else {
        setOrgusers([])
      }
    }

    const handleTitleSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(orgUsers.length > 0) {
          setOrgusers(orgUsers)
        } else {
          setOrgusers([])
        }
        return false
      }

      let filteredMember = orgUsers.filter(member => {
        return member.job_title.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })

      if(filteredMember.length > 0) {
        setOrgusers(filteredMember)
      } else {
        setOrgusers([])
      }
    }

    const handleDepartmentSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(orgUsers.length > 0) {
          setOrgusers(orgUsers)
        } else {
          setOrgusers([])
        }
        return false
      }

      let filteredMember = orgUsers.filter(member => member.department.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1)

      if(filteredMember.length > 0) {
        setOrgusers(filteredMember)
      } else {
        setOrgusers([])
      }
    }

    const handleManagerSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(orgUsers.length > 0) {
          setOrgusers(orgUsers)
        } else {
          setOrgusers([])
        }
        return false
      }

      let filteredMember = orgUsers.filter(member => {
        if(member.manager != null)
        return member.manager.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })

      if(filteredMember.length > 0) {
        setOrgusers(filteredMember)
      } else {
        setOrgusers([])
      }
    }

    const addMembersToTeam = () => {
      if(membersToSelect.length) {
        props._add_team_members(membersToSelect);
      } else {
        setIsAddedToTeamEmpty(true);
      }
    }

    const hideAlert = () => {
      setIsAddedToTeamEmpty(false);
    }

    const hideAddedMemberAlert = () => {
      setIsMemberAdded(false);
      props._set_is_team_members_added();
    }

    const hideAddedMemberErrorAlert = () => {
      setIsMemberAddedError(false);
    }

    return (
        <div className="add-to-team-wrapper mt-2">
            <Row className="mt-2">
                <Col md={6} sm={12}>
                  {/* <Form className="form-inline srch-box">
                      <Input type="search" id="search-add-to-member" placeholder="Search for people to add to team" aria-label="Search" onChange={handleMemberSearch} />
                      <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button>
                  </Form> */}
                  <div className="form-group has-search mt-2">
                    <Input type="search" className="form-control" placeholder="Search for people to add to team" onChange={handleMemberSearch}  />
                    <span className="fa fa-search form-control-feedback"></span>
                  </div>
                </Col>    
            </Row>
            <Row className="mt-4">
                <Col md={5} sm={12}>
                    <Form className="srch-box">
                        <Label>Filter by location</Label>
                        <Input type="search" className="search-input" placeholder="Type Employee's location" aria-label="Search" onChange={handleLocationSearch} />
                        {/* <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button> */}
                    </Form>
                </Col>
                <Col md={5} sm={12}>
                    <Form className="srch-box">
                        <Label>Filter by title</Label>
                        <Input type="search" className="search-input" placeholder="Type Employee's title" aria-label="Search" onChange={handleTitleSearch} />
                        {/* <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button> */}
                    </Form>
                </Col>    
            </Row>
            <Row className="mt-4">
                <Col md={5} sm={12}>
                    <Form className="srch-box">
                        <Label>Filter By Department</Label>
                        <Input type="search" className="search-input" placeholder="Type Employee's Department" aria-label="Search" id="" onChange={handleDepartmentSearch} />
                        {/* <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button> */}
                    </Form>
                </Col> 
                <Col md={5} sm={12}>
                    <Form className="srch-box">
                        <Label>Filter by Manager</Label>
                        <Input type="search" className="search-input" placeholder="Type Employee's Manager" aria-label="Search" onChange={handleManagerSearch} />
                        {/* <Button type="submit" className="searchSubBtn"><i className="fa fa-search" /></Button> */}
                    </Form>
                </Col>   
            </Row>
            <div className="mt-4">
                <Button type="submit" className="addMembers" onClick={addMembersToTeam}>Add to Team</Button>
            </div>
            <div className="divider mt-4 mb-4"></div>
            <div>
              <Styles>
                <SelectTable columns={columns} data={orgusers} handleExpandClick={handleExpandClick} onMassSelection={onMassSelection} />
              </Styles>
            </div>
            { isAddedToTeamEmpty &&
              <SweetAlert
              info
              title="Error"
              onConfirm={hideAlert}
              >Please select member to add</SweetAlert>
            }
            { isMemberAdded &&
              <SweetAlert
              success
              title="Woot!"
              onConfirm={hideAddedMemberAlert}
              >Members added to the team</SweetAlert>
            }
            { isMemberAddedError &&
              <SweetAlert
              danger
              title="Error"
              onConfirm={hideAddedMemberErrorAlert}
              >{props.teamDetails.addTmError}</SweetAlert>
            }
        </div>
    )
}

const mapStateToProps = ( state ) => ({
    router: state.router,
    addTeam: state.addTeam,
    teamDetails: state.team
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_all_org_users          :  get_all_org_users,
        _add_team_members           :  add_team_members,
        _set_is_team_members_added  :  set_is_team_members_added
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddToTeam)