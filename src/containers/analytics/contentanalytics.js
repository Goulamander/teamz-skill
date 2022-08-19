import React, { Component, Fragment, useState, useEffect } from 'react'
import {  Nav, NavItem, NavLink, Row, Col, TabContent, TabPane, Input } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import classnames from 'classnames'
import moment from 'moment'

import { get_content_analytics } from '../../actions/contentPortal'
import { appConstant } from '../../constants/appConstants'
import { ROUTES } from '../../constants/routeConstants'
import SelectTable from '../../component/SelectTable'
import shareIcon from '../../assets/img/share.png'
import recommendIcon from '../../assets/img/recommend.png'
import likeIcon from '../../assets/img/like-icon.png'
import viewsIcon from '../../assets/img/views_icon.png'
import expandIcon from '../../assets/img/expandIcon.png'
import { getUserRoleName } from '../../transforms'
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
        :first-child {
          width: 50px;
        }
        :nth-child(2) {
          max-width: 240px;
        }
        padding-right: 16px;
        padding-left: 16px;
        line-height: 30px;
        
        .custom-multi-progress {
          margin-left: -30px;
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
      padding: 10px 16px 10px 16px!important;

      .fa {
        width: 30px;
        text-align: center;
        // line-height: 38px;
        // font-size: 24px;
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
      font-size: 14px;
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
          <div className="d-none select-row-input">
            <input type="checkbox" />
            {/* <div className="expand-btn" title="Expand Record" onClick={() => handleExpandClick(row)}><img src={expandIcon} /></div> */}
          </div>
        </div>),
    },
    {
        Header: 'Name',
        id: "link",
        disableSortBy: true,
        accessor: 'doc_name',
        Cell: ({ row }) =>
        <div className="d-flex align-items-center">
            <img src={row.original.doc_icon_url} />
            <a className="ml-3 doc-text" href={row.original.doc_url} target="blank">{row.original.doc_name}</a>
        </div>
    },
    {
        Header: ()=>(
            <Fragment>
                <div className="pull-left d-flex align-items-center">
                    <img src={likeIcon} width="16" height="16" />    
                    <span className="ml-1">Liked</span>
                </div>
            </Fragment>
        ),
        accessor: 'thumbs_count',
        id: 'thumbs_count',
        Cell: ({ row }) => <div className="liked-count">{row.original.thumbs_count}</div>
    },
    {
        Header: ()=>(
            <Fragment>
                <div className="pull-left d-flex align-items-center">
                    <img src={recommendIcon} width="16" height="16" />
                    <span className="ml-1">Recommended</span>
                </div>    
            </Fragment>
        ),
        accessor: 'recommended_count',
        id: 'recommended_count',
        Cell: ({ row }) => <div className="recommended-count">{row.original.recommended_count}</div>
    },
    {
        Header: ()=>(
            <Fragment>
                <div className="pull-left d-flex align-items-center">
                    <img src={shareIcon} width="16" height="16" />
                    <span className="ml-1">Shared</span>
                </div>    
            </Fragment>
        ),
        accessor: 'shared_count',
        id: 'shared_count',
        Cell: ({ row }) => <div className="shared-count">{row.original.shared_count}</div>
    },
    {
        Header: ()=>(
            <Fragment>
                <div className="pull-left d-flex align-items-center">
                    <img src={viewsIcon} width="16" height="16" />
                    <span className="ml-1">Viewed</span>
                </div>    
            </Fragment>
        ),
        accessor: 'views_count',
        id: 'views_count',
        Cell: ({ row }) => <div className="viewed-count">{row.original.views_count}</div>
    },
    {
        Header: ()=> 'Data Uploaded',
        accessor: 'data_uploaded',
        id: 'data_uploaded',
        Cell: ({ row }) => {
            return row.original.data_uploaded != undefined? (
                <div>{moment(row.original.data_uploaded).format('MM/DD/YYYY')}</div>
            ) : ''
        }
    }
]

const NavBarSecondary = ({
    activeTopNav,
    activeSubNav,
    _selectSubNav,
    _onChangeHandler,
    _resetHandler
  }) => {
    return (
      <Row className="mt-4 sub-nav-container">
        <Col sm={12} className="pr-0 pl-0">
          <Nav tabs className="sub-nav">
            <NavItem className={activeSubNav === "usage" ? "active" : ""}>
              <NavLink onClick={() => _selectSubNav('usage')}>
                Usage
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    )
}

class ContentAnalytics extends Component {
    constructor(props) {
        super(props)
 
        this.state = {
          activeTopNav: 'analytics/content-analytics',
          activeSubNav: 'usage'
        }
    }

    selectSubNav = (navMenu) => {
        this.setState({
          activeSubNav: navMenu
        })
    }

    render() {
        const { activeTopNav, activeSubNav } = this.state;

        return (
            <Fragment>
                <NavBarSecondary 
                activeTopNav={activeTopNav}
                activeSubNav={activeSubNav}
                _selectSubNav={this.selectSubNav}
                />
                <TabContent className="page-content mt-4" activeTab={this.state.activeSubNav}>
                    <TabPane tabId="usage">
                        <Row className="content-analytics-wrapper">
                            <Col className="pl-0">
                                <ContentAnalyticsUsage
                                    {...this.props}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </Fragment>
        )
    }
}

const ContentAnalyticsUsage = (props) => {

    const [ContentAnalyticData, SetContentAnalyticData] = useState([]);

    useEffect(() => {
        props._get_content_analytics();
    }, []);

    useEffect(() => {
        if(props.contentPortal.analyticsContent.length) {
            processAnalyticContentData(props.contentPortal.analyticsContent)
        }
    }, [props.contentPortal.analyticsContent]);

    const handleContentSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value

        if(!!searchTxt === false) {
            if(props.contentPortal.analyticsContent.length > 0) {
                processAnalyticContentData(props.contentPortal.analyticsContent)
            } else {
                processAnalyticContentData([])
            }
            return false
        }

        let filteredData = props.contentPortal.analyticsContent.filter(data => {
            if(data.doc_name != null)
            return data.doc_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
        })

        if(filteredData.length > 0) {
            processAnalyticContentData(filteredData)
        } else {
            processAnalyticContentData([])
        }
    }

    const processAnalyticContentData = (data) => {
        let AllContent = data.filter(content => {
          return content.is_content_added
        });
        AllContent.sort(function(a,b){
          return new Date(b.added_to_portal_time) - new Date(a.added_to_portal_time);
        });
        SetContentAnalyticData(AllContent)
    }

    return (
        <Fragment>
            <Col sm="12" className="pl-0">
                <Row>
                    <Col md={4} sm={12}>
                        <div className="form-group has-search my-2">
                            <Input type="search" className="form-control" placeholder="Find a content" onChange={handleContentSearch}  />
                            <span className="fa fa-search form-control-feedback"></span>
                        </div> 
                    </Col>
                    <div className="col-sm-12">
                        <Styles>
                        <SelectTable columns={columns} data={ContentAnalyticData} />
                        </Styles>
                    </div>
                </Row>
            </Col>
        </Fragment>    
    )
}

const mapStateToProps = ({ admin, contentPortal }) => ({
    admin,
    contentPortal
})
  
const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_content_analytics      :   get_content_analytics,
    },
    dispatch
)
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContentAnalytics)