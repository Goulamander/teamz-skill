import React, {Component, Fragment, useState, useEffect, useRef} from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import classnames from 'classnames'
import moment from 'moment';
import { Row, Col } from 'reactstrap';

import { get_my_shares } from '../../../actions/microsites'
import { ROUTES } from '../../../constants/routeConstants'
import { appConstant } from '../../../constants/appConstants'
import { getUserRoleName, checkContentRowSelected, getRandomColor } from '../../../transforms'
import SelectTable from '../../../component/SelectTable'
import expandIcon from '../../../assets/img/expandIcon.png';
import crossIcon from '../../../assets/img/crossIcon.png';
import stepComplete from '../../../assets/img/stepcomplete.png';
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
          width: 80px;
        }
        :nth-child(2) {
          max-width: 320px;
        }
        padding-right: 15px;
        padding-left: 15px;
        padding-top:15px;
        padding-bottom:15px;
        line-height: 20px;
        
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
      padding: 15px 15px 15px 15px!important;

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
        Header: ({ getToggleAllRowsSelectedProps, isAllRowsSelected, selectedFlatRows }) => {
            return (
            <div>
            <div>
                <input type="checkbox" />
            </div>
            </div>
            )
        },
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
        Header: 'Share',
        id: "share",
        disableSortBy: true,
        accessor: 'share',
        Cell: ({ row }) => {
        return (
          <div className="d-flex align-items-center">
            <div className="bg-img">
              <img className="rounded" src={appConstant.BASE_URL + row.original.backgroung_img.replace("dist", "")} width="90" height="60" />
            </div>
            <div className="ml-3">
              <div className="link-created">Sent {moment(row.original.link_created).format('MMM Do YYYY, h:mm A')}</div>
              <div className="mb-3">
                <a href={ROUTES.MICROSITES + "/" + row.original.link}>{row.original.title}</a>
              </div>
              <div className="share-via">
              {
                row.original.share_via === 'LINK' && 
                <div>Shared via Link</div>
              }
              {
                row.original.share_via === 'EMAIL' && 
                <div>Shared via Email</div>
              }
            </div>
            </div>
          </div>
        )
      }
    },
    {
        Header: 'Shared with',
        accessor: 'sharedWith',
        disableSortBy: true,
        id: 'shareVia',
        Cell: ({ row }) => {
            return (
              <div className="">{
                // row.original.share_with.map(data => {
                //   return (
                //     <div className="share-with mb-1">{data}</div>
                //   )
                // })
                <div className="share-with mb-1">{row.original.share_with}</div>
              }
              </div>
            )
        }, 
    },
    {
        Header: 'Unique Views',
        accessor: 'view',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>{row.original.open_rate}</div>
          )
        }
    },
    {
        Header: 'Clicks',
        accessor: 'click',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>{row.original.click_rate}</div>
          )
        }
    },
    {
        Header: 'Avg. Time spent',
        accessor: 'timeSpent',
        disableSortBy: true,
        Cell: ({ row }) => {
          let timeString = '';
          if(row.original.time_spent) {
            let date = new Date(0);
            date.setSeconds(row.original.time_spent); // specify value for SECONDS here
            timeString = date.toISOString().substr(11, 8);
          }
          return (
            <div>{timeString}</div>
          )
        },
    }
]  

export const MyShares = (props) => {
  
  const mySharesTableRef = useRef(null)
  const [myShareData, SetMyShareData] = useState([]);
  const [isMSDMOpen, setIsMSDMOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex ] = useState(null)
  const [shareDetail, setShareDetail ] = useState([])

  useEffect(() => {
    props._get_my_shares(); 
  }, []);

  useEffect(() => {
    if(props.getMyShareData && props.getMyShareData.length) {
      SetMyShareData(props.getMyShareData);
    }
  }, [props.getMyShareData]);
   
  const globalClick = (e) => {
    // function to close courseDetailModal from outside click
    if (isMSDMOpen === true && e.target.closest('#shareDetailModal #rightView') === null) {
      setIsMSDMOpen(false); setSelectedRowIndex(null);
      setTimeout(() => {
        try {
          mySharesTableRef.current.scrollIntoView({block: 'center', behavior: 'smooth'}) 
        } catch (error) {
          console.log("Browser not supported")
        }
      }, 100);
    }
  }

  const handleExpandClick = (row) => {
    setIsMSDMOpen(true);
    setSelectedRowIndex(row.index)
    console.log(row.original);
    if(row.original.events_data) {
      setShareDetail(row.original.events_data);
    } else {
      setShareDetail([]);
    }
  }

  const onCloseMyShareDetailModal = () => {
    setIsMSDMOpen(false); 
    setSelectedRowIndex(null);
  }

  return (
    <div className="page-wrapper" onClick={globalClick}>
        <div className="page-title mb-4">My Shares</div>
        <div className="mb-5 mt-4 share-table" ref={mySharesTableRef}>
          <Styles>
            { myShareData.length ?
              <SelectTable columns={columns} data={myShareData} handleExpandClick={handleExpandClick} selectedRowIndex={selectedRowIndex} /> : ''
            }
          </Styles>
          {isMSDMOpen &&
          <MyShareDetail
            selectedRowIndex={selectedRowIndex}
            shareDetail={shareDetail}
            onClose={onCloseMyShareDetailModal}
          />
          }
        </div>
    </div>    
  )
}

const MyShareDetail = ({
  selectedRowIndex,
  shareDetail,
  onClose
}) => {

  const onCancel = (e) => {
    e.preventDefault(); 
    onClose()
  }

  return (
    <Row id="shareDetailModal" className="h-100">
      <Col lg="5" id="leftView" className="p-0"></Col>
      <Col lg="7" id="rightView" className="p-0">
        <div className="pull-right cancel-icon mt-1 pr-1 pl-0" onClick={onCancel}>
          <img src={crossIcon} className="icon" alt={'...'} />
        </div>
        <div className="mt-4 mb-4">
          <Row>
            <Col xs={8} className="pl-5 pr-2">
              <div className="label">Content Title</div>
            </Col>
            <Col xs={4}>  
              <div className="label">Clicks</div>
            </Col>  
          </Row>
          <hr className="mt-4 mb-4" />
          { shareDetail.length ?
            shareDetail.map((share, i) => {
              return (
                <Fragment key={i}>
                  <Row>
                    <Col xs={8} className="pl-5 pr-2">
                      <div className="d-flex align-items-center">
                        <div className="stepComplete-image">
                          <img src={stepComplete} width="27" height="27"/>
                        </div>  
                        <div className="ml-4">{share.eventlabel}</div>
                      </div>  
                    </Col>
                    <Col xs={4}>{share.eventvalue}</Col>
                  </Row>
                  <hr className="mt-4 mb-4" />  
                </Fragment>  
              )
            })
          : <div className="no-records m-5 text-center">no records found</div> }
        </div>  
      </Col>
    </Row>  
  )
}

const mapStateToProps = ({ microSites }) => ({
  ...microSites
})
  
const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
      _get_my_shares         :   get_my_shares
    },
    dispatch
)
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyShares)