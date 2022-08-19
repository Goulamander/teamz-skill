import React, { useState, useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col, Row, Input, Form, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Link, HashRouter, Redirect, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import styled from 'styled-components';
import moment from 'moment'
import _ from 'lodash'

import BubblePlot from "../../../component/bubble_chart/BubblePlot";
import { appConstant, oppDuring, salesforceObject } from '../../../constants/appConstants';
import { get_quota_attainment } from '../../../actions/admin';
import {
  get_teams_listing
} from '../../../actions/team'
import { ROUTES } from '../../../constants/routeConstants';
import SfSelectTable from '../../../component/SfSelectTable';
import defaultPP from '../../../assets/img/profile_default.png';
import expandIcon from '../../../assets/img/expandIcon.png';

const SUB_ROUTES = {
    OPP_AMT: 'OPPORTUNITY_AMOUNT',
    QTA_ATTMN: 'QUOTA_ATTAINMENT',
}

const Styles = styled.div`
  padding: 1rem 0 1rem 0;

  table {
    border-spacing: 0;
    width: 100%;
    white-space: nowrap;
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
        padding-right: 8px;
        padding-left: 8px;
        line-height: 20px;
        :first-child {
          padding-right: 2px;
          padding-left: 10px;
          width: 40px;
        }
        :nth-child(2) {
          max-width: 240px;
        }
        .custom-multi-progress {
          margin-left: -30px;
        }
      }
      .cell-index {
        margin-bottom: 0
      }
      .team-name {
        white-space: -o-pre-wrap; 
        word-wrap: break-word;
        white-space: pre-wrap; 
        white-space: -moz-pre-wrap; 
        white-space: -pre-wrap;
        width: 120px;
        text-align: left; 
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
            max-width: 12px;
            max-height: 20px;
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
      font-size: 12px;
      font-weight: 700;
      color: #181818;
      border-bottom: 5px solid #edeffd!important;
      border-top: none;
      padding: 5px 5px 5px 5px!important;
      position: sticky!important;
      top:0;
      background-color: #FEEFE9;
      :first-child {
        padding-right: 2px!important;
        padding-left: 10px!important;
        width: 40px;
        padding-top: 12px!important;
      }
      .fa {
        width: 40px;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
        color: #5352ed;
        transition: all 0.3s ease-out;
        cursor: pointer;
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
      font-size: 12px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 5px solid #edeffd!important;
      line-height: 40px;
    }
    .avg-amount span {
      padding: 2px 10px;
      border-radius: 22px;
    }
    .avg-amount span.average {
        background-color: #5cb23e;
    }
    .avg-amount span.between {
        background-color: #ffeab6;
    }
    .avg-amount span.below {
        background-color: #eb0000;
    }
}
`
const FilterDropdowns = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    
    useEffect(() => {
        if(!!props.defaultSelected === true) {
            setSelectedItem(props.defaultSelected)
        }
    }, []);

    const toggleDD = () => {
      setDropdownOpen(!dropdownOpen)
    }
  
    const handleClick = (option) => {
      setSelectedItem(option)
      if(typeof props.handleChange === 'function' ) props.handleChange(option)
    }
    return (
      <Dropdown className="filter-dd team-filter" isOpen={dropdownOpen} toggle={toggleDD}>
        <DropdownToggle>
          <div className="d-flex">
            <Input disabled value={selectedItem} placeholder={props.placeholder} />
            <span className={classnames({'fa': true, 'fa-caret-down': !dropdownOpen, 'fa-caret-up': dropdownOpen})}></span>
          </div>
        </DropdownToggle>
        <DropdownMenu className="mx-3">
          {props.data.map((val, index) => {
            return <DropdownItem key={`interval-${index}`} onClick={() => handleClick(val)}>{val}</DropdownItem>
          })}
        </DropdownMenu>
      </Dropdown>
    )
}

export const QuotaAttainment = (props) => {
    let { quotaAttainmentData } = props.admin;
    let { teamsData } = props.team;
    
    const [sfObject, setSfObject] = useState(false);
    const [quotaAttainment, setQuotaAttainment] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [columns, setColumns] = useState([]);
    const [sort, setSort] = useState(true);

    useEffect(() => {
        props._get_quota_attainment();
        props._get_teams_listing();
    }, []);

    useEffect(() => {
        if(quotaAttainmentData.length > 0) {
            let filteredTeams = getFilteredTeamData(props.selectedFilterTeam.toLowerCase(), quotaAttainmentData);
            let storeQuotaAttainment = filteredTeams.length > 0 ? filteredTeams : [];

            let filteredData = getFilteredDurationData(props.selectedFilterDuration, storeQuotaAttainment)

            setQuotaAttainment(filteredData);
            setChartData(processChartData(filteredData));
            setColumns(processColumns(filteredData))
        } else {
            setQuotaAttainment([]);
            setChartData([]);
            setColumns([])
        }
    }, [quotaAttainmentData]);

    useEffect(() => {
      if(teamsData.length > 0) {
        // console.log("teamsData", teamsData)
        setTeams(getTeamData(teamsData))
      } else {
        setTeams([])
      }
    }, [teamsData]);

    useEffect(() => {
      setChartData(processChartData(quotaAttainment));
    }, [sort]);

    const getTeamData = (data) => {
      let teams = data.map(val => {
        return val.team_name
      });
      teams.push('All Teams')
      return teams;
    }

    const processColumns = (val) => {
      let columnsVal = [{
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
            <div className="d-none select-row-input">
              <input type="checkbox" />
              <div className="expand-btn" title="Expand Record" onClick={() => handleExpandClick(row)}><img src={expandIcon} alt={'...'} /></div>
            </div>
          </div>),
      },
      {
        Header: 'Name',
        id: "link",
        disableSortBy: true,
        accessor: 'user_name',
        Cell: ({ row }) => 
        {
          if (!!row.original.profile_pic2) {
            var meta = appConstant.BASE_URL + row.original.profile_pic2.replace("dist", "");
            return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={meta} width="26" height="26" style={{borderRadius: '50%', marginRight: '6px'}} alt={'...'} />{row.original.user_name}</Link>;
          } else if (row.original.profile_pic1) {
            return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={row.original.profile_pic1} width="26" height="26" style={{borderRadius: '50%', marginRight: '6px'}} alt={'...'} />{row.original.user_name}</Link>;
          } else {
            return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.user_id}}}> <img src={defaultPP} width="26" height="26" style={{borderRadius: '50%', marginRight: '6px'}} alt={'...'} />{row.original.user_name}</Link>;
          }
        },
      },
      {
        Header: 'Team',
        accessor: 'team_name',
        id: 'team_name',
        disableSortBy: true,
        Cell: ({ row }) => (!!row.original.team_name === true)? (
          <div className="team-name">{row.original.team_name[0]}</div> 
        ) : ''
      },
      {
        Header: 'First Login',
        accessor: 'first_login',
        sortDescFirst: false,
        id:"first_login",
        Cell: ({ row }) => {
          return row.original.first_login != undefined? (
              <div>{moment(row.original.first_login).format('M/D/YYYY')}</div>
          ) : ''
        }
      }]; 
      Object.keys(_.omit(val[0], ['app_email', 'email', 'profile_pic1', 'profile_pic2', 'team_name', 'user_id', 'user_name', 'first_login'])).forEach(data => {
        
        if(data === 'eighth_month') {
            columnsVal.push({
            Header: () => {
              return <div>{moment(moment(), 'MM/DD/YYYY').subtract(8, 'months').startOf('month').format('M/D/YYYY')}</div>
            },
            accessor: 'eighth_month',
            disableSortBy: true,
            Cell: ({ row }) => (row.original.eighth_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.eighth_month>=80, "between": (row.original.eighth_month>=60&&row.original.eighth_month<80), "below": row.original.eighth_month<60})}>{`${Number(row.original.eighth_month).toFixed()}%`}</span>
              </div> : '')
          })
        } else if(data === 'seventh_month') {
            columnsVal.push({
              Header: () => {
                return <div>{moment(moment(), 'MM/DD/YYYY').subtract(7, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'seventh_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.seventh_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.seventh_month>=80, "between": (row.original.seventh_month>=60&&row.original.seventh_month<80), "below": row.original.seventh_month<60})}>{`${Number(row.original.seventh_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'sixth_month'){
            columnsVal.push({
              Header: () => {
                return <div>{moment(moment(), 'MM/DD/YYYY').subtract(6, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'sixth_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.sixth_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.sixth_month>=80, "between": (row.original.sixth_month>=60&&row.original.sixth_month<80), "below": row.original.sixth_month<60})}>{`${Number(row.original.sixth_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'fifth_month'){
            columnsVal.push({
              Header: () => {
                  return <div>{moment(moment(), 'MM/DD/YYYY').subtract(5, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'fifth_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.fifth_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.fifth_month>=80, "between": (row.original.fifth_month>=60&&row.original.fifth_month<80), "below": row.original.fifth_month<60})}>{`${Number(row.original.fifth_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'fourth_month'){
            columnsVal.push({
              Header: () => {
                return <div>{moment(moment(), 'MM/DD/YYYY').subtract(4, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'fourth_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.fourth_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.fourth_month>=80, "between": (row.original.fourth_month>=60&&row.original.fourth_month<80), "below": row.original.fourth_month<60})}>{`${Number(row.original.fourth_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'third_month') {
            columnsVal.push({
              Header: () => {
                  return <div>{moment(moment(), 'MM/DD/YYYY').subtract(3, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'third_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.third_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.third_month>=80, "between": (row.original.third_month>=60&&row.original.third_month<80), "below": row.original.third_month<60})}>{`${Number(row.original.third_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'second_month') {
            columnsVal.push({
              Header: () => {
                return <div>{moment(moment(), 'MM/DD/YYYY').subtract(2, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'second_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.second_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.second_month>=80, "between": (row.original.second_month>=60&&row.original.second_month<80), "below": row.original.second_month<60})}>{`${Number(row.original.second_month).toFixed()}%`}</span>
              </div> : '')
            })
        } else if(data === 'current_month') {
            columnsVal.push({
              Header: () => {
                  return <div>{moment(moment(), 'MM/DD/YYYY').subtract(1, 'months').startOf('month').format('M/D/YYYY')}</div>
              },
              accessor: 'current_month',
              disableSortBy: true,
              Cell: ({ row }) => (row.original.current_month != undefined? <div className="avg-amount">
              <span className={classnames({"average":row.original.current_month>=80, "between": (row.original.current_month>=60&&row.original.current_month<80), "below": row.original.current_month<60})}>{`${Number(row.original.current_month).toFixed()}%`}</span>
              </div> : '')
            })
          }
      });
      columnsVal.push({
        Header: () => {
          return <div>Avg</div>
        },
        accessor: 'avg',
        disableSortBy: true,
        Cell: ({ row }) => {
          let totalAmmount;
          if(row.original.eighth_month === undefined && row.original.seventh_month === undefined && row.original.sixth_month === undefined && row.original.fifth_month === undefined) {
            totalAmmount = (Number(row.original.fourth_month) + Number(row.original.third_month) + Number(row.original.second_month) + Number(row.original.current_month)) / 4
          } else if(row.original.eighth_month === undefined && row.original.seventh_month === undefined) {
            totalAmmount = (Number(row.original.sixth_month) + Number(row.original.fifth_month) + Number(row.original.fourth_month) + Number(row.original.third_month) + Number(row.original.second_month) + Number(row.original.current_month)) / 6
          } else {
            totalAmmount = (Number(row.original.eighth_month) + Number(row.original.seventh_month) + Number(row.original.sixth_month) + Number(row.original.fifth_month) + Number(row.original.fourth_month) + Number(row.original.third_month) + Number(row.original.second_month) + Number(row.original.current_month)) / 8
          }
          return totalAmmount != undefined ? (
              <div>{totalAmmount.toFixed()}%</div>
          ) : ''
        }
      })
      console.log("columns", columnsVal)
      return columnsVal;
    }

    const getFilteredTeamData = (searchTxt, quotaAttainmentData) => {
      let filteredTeams = [];
      if(searchTxt.toLowerCase() != 'all teams') {
        quotaAttainmentData.forEach(member => {
          if(member.team_name != null || member.team_name != undefined) {
            member.team_name.forEach(data => {
              if(data.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1) {
                filteredTeams.push(member);
              }
            });
          }
        });
      } else {
        filteredTeams = quotaAttainmentData.length > 0 ? quotaAttainmentData : [];
      }
      return filteredTeams;
    }

    const getFilteredDurationData = (searchTxt, storeOppAmt) => {
      let filteredData = [];
      if(searchTxt === 'Last 6 Months') {
        filteredData = _.map(storeOppAmt, function (row) {
          return _.omit(row, ['eighth_month', 'seventh_month']);
        });
      } else if(searchTxt === 'Last 4 Months') {
        filteredData = _.map(storeOppAmt, function (row) {
          return _.omit(row, ['eighth_month', 'seventh_month', 'sixth_month', 'fifth_month']);
        });
      } else {
        filteredData = storeOppAmt;
      }
      return filteredData;
    }

    const onChangeDuring = (during) => {
      let searchTxt = during;
      let filteredTeams = getFilteredTeamData(props.selectedFilterTeam, quotaAttainmentData)
      let storeQuotaAttainment = filteredTeams.length > 0 ? filteredTeams : [];
  
      if(!!searchTxt === false) {
        if(quotaAttainmentData.length > 0) {
          setQuotaAttainment(quotaAttainmentData)
          setChartData(processChartData(quotaAttainmentData))
          setColumns(processColumns(quotaAttainmentData))
        } else {
          setQuotaAttainment([]);
          setChartData([])
          setColumns(processColumns([]))
        }
        return false
      }
      props.setSelectedFilterDuration(searchTxt);
      let filteredData = getFilteredDurationData(searchTxt, storeQuotaAttainment);
    
      if(filteredData.length > 0) {
        setQuotaAttainment(filteredData);
        setChartData(processChartData(filteredData));
        setColumns(processColumns(filteredData))
      } else {
        setQuotaAttainment([]);
        setChartData([]);
        setColumns(processColumns([]))
      }
    }

    const onChangeTeam = (team) => {
      let searchTxt = team
  
      if(!!searchTxt === false) {
        if(quotaAttainmentData.length > 0) {
          setQuotaAttainment(quotaAttainmentData)
          setChartData(processChartData(quotaAttainmentData))
        } else {
          setQuotaAttainment([]);
          setChartData([])
        }
        return false
      }
      
      props.setSelectedFilterTeam(searchTxt);

      let filteredTeams = getFilteredTeamData(searchTxt, quotaAttainmentData);

      let filteredData = getFilteredDurationData(props.setSelectedFilterDuration, filteredTeams)
    
      if(filteredData.length > 0) {
        setQuotaAttainment(filteredData);
        setChartData(processChartData(filteredData))
      } else {
        if(searchTxt.toLowerCase() === 'all teams') {
          setQuotaAttainment(filteredData);
          setChartData(processChartData(filteredData))
        } else {
          setQuotaAttainment([]);
          setChartData([])
        }
      }
    }

    const onChangeObject = (obj) => {
        if(obj === 'Opportunity Amount %') {
          setSfObject(true);
        }
    }

    const onChangeHandleSort = (sortBy) => {
      if(sortBy.length) {
        if(sortBy[0].desc) {
          setSort(true);
        } else if(!sortBy[0].desc) {
          setSort(false);
        }
      } else {
        setSort();
      }
    }

    const processChartData = (data) => {
      let cData = data.map((val, i) => {
        let stats = [];
        Object.keys(_.omit(val, ['app_email', 'email', 'profile_pic1', 'profile_pic2', 'team_name', 'user_id', 'user_name', 'first_login'])).forEach((data, k) => {
          if(data === 'current_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(1, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'second_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(2, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'third_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(3, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'fourth_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(4, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'fifth_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(5, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'sixth_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(6, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'seventh_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(7, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else if(data === 'eighth_month') {
            stats.push({date: moment(moment(), 'MM/DD/YYYY').subtract(8, 'months').startOf('month').format('M/D/YYYY'), value: val[data] != null ? val[data] : 0})
          } else {

          }
        });
        let json = {
          name: val.user_name,
          first_login: val.first_login,
          avatar: val.profile_pic1 != null ? val.profile_pic1 : (val.profile_pic2 != null ? appConstant.BASE_URL + val.profile_pic2.replace("dist", "") : defaultPP),
          stats: stats
        }
        return json;
      });
      cData.sort((a,b) => {
        if(sort === true) {
          return new Date(a.first_login) - new Date(b.first_login);
        } else if(sort === false) {
          return new Date(b.first_login) - new Date(a.first_login);
        } else {
          return -1
        }
      })
      //console.log("data", cData)
      return cData
    }

    const handleMemberSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value
    
        if(!!searchTxt === false) {
          if(quotaAttainmentData.length > 0) {
            setQuotaAttainment(quotaAttainmentData)
            setChartData(processChartData(quotaAttainmentData))
          } else {
            setQuotaAttainment([]);
            setChartData([])
          }
          return false
        }
    
        let filteredMembers = quotaAttainment.filter(member => (member.user_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1))
    
        if(filteredMembers.length > 0) {
          setQuotaAttainment(filteredMembers);
          setChartData(processChartData(filteredMembers))
        } else {
          setQuotaAttainment([]);
          setChartData([])
        }
    }
    return (
        <Row className="ramp-time-wrapper">
            <Col lg={12} className="pl-0 pr-0">
                <Row>
                    <Col>
                        <h3>Quota Attainment by Rep</h3>
                        <div className="pt-4 pb-4 pl-2 pr-2 mt-4 card sales-charts">
                          {chartData.length ? <BubblePlot data={chartData} maxWidth={1140} /> : '' }
                        </div>
                        <div className="chart-x-axis-content mt-2 mb-3 text-center">Quota Attainment % </div>
                    </Col>    
                </Row>
                <Row className="my-4">
                    <Col sm="12" md="6" lg="3">
                        <span className="filter-label">Opportunities During</span>
                        <FilterDropdowns defaultSelected={props.selectedFilterDuration} placeholder="Select during" data={oppDuring} handleChange={onChangeDuring} />
                    </Col>
                    <Col sm="12" md="6" lg="3">
                        <span className="filter-label">Filter by Salesforce object</span>
                        <FilterDropdowns defaultSelected='Quota Attainment %' placeholder="Salesforce object" data={salesforceObject} handleChange={onChangeObject} />
                    </Col>
                    <Col sm="12" md="6" lg="3">
                        <span className="filter-label">Filter by Team</span>
                        <FilterDropdowns defaultSelected={props.selectedFilterTeam} placeholder="Select team" data={teams} handleChange={onChangeTeam} />
                    </Col>
                </Row>

                <Row>
                    <Col className="sperator"></Col>
                </Row>

                <Row>
                    <Col sm="12" className="mt-4">
                        <Row>
                            <Col md={4} sm={12}>
                                <div className="form-group has-search my-2">
                                    <Input type="search" className="form-control" placeholder="Find a member" onChange={handleMemberSearch}  />
                                    <span className="fa fa-search form-control-feedback"></span>
                                </div> 
                            </Col>
                            <Col md={8} sm={12}>
                                <div className="statuses d-flex justify-content-around align-items-center">
                                    <div className="status status-above"><span className="status-color"></span>Above 80% of</div>
                                    <div className="status status-between"><span className="status-color"></span>Between 60% and 80% of</div>
                                    <div className="status status-below"><span className="status-color"></span>Below 60% of Target</div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <div className="col-sm-12">
                      <div className="table-responsive p-0">
                        <Styles>
                            <SfSelectTable columns={columns} data={quotaAttainment} onSort={onChangeHandleSort} />
                        </Styles>
                      </div>  
                    </div>
                </Row>
            </Col>
            { sfObject &&
              <HashRouter hashType={'noslash'}>
              <Redirect to={SUB_ROUTES.OPP_AMT} />
              </HashRouter>
            }  
        </Row>
    )
}

const mapStateToProps = ({ admin, team }) => ({
  admin,
  team
})

const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
       _get_quota_attainment       :   get_quota_attainment,
      _get_teams_listing     :  get_teams_listing,
    },
    dispatch
)

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(QuotaAttainment))