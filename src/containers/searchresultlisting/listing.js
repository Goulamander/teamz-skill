import React, {Component} from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataTable from '../../component/TSZDataTable';
import defaultPP from '../../assets/img/profile_default.png';
import { ROUTES } from '../../constants/routeConstants';
import { appConstant } from '../../constants/appConstants';
import { get_search_data } from '../../actions/userProfilePage';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    width: 100%;
    
    tr {
       
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th{
      font-size: 16px;
      font-weight: 700;
      color: #171717;
      border-bottom: none;
      border-top: none;
      padding: 10px 15px 10px 0!important;
    }
    td {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 15px solid #edeffd!important;
      line-height: 40px;
    }
  }
`

const columns = [
    {
      Header: 'Name',
      accessor: 'firstname',
      Cell: ({ row }) => 
      {
        if (!!row.original.img2) {
          var meta = appConstant.BASE_URL + row.original.img2.replace("dist", "");
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.userid}}}> <img src={meta} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{`${row.original.firstname} ${row.original.lastname}`}</Link>;
        } else if (row.original.img) {
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.userid}}}> <img src={row.original.img} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{`${row.original.firstname} ${row.original.lastname}`}</Link>;
        } else {
          // return <Link to={`${ROUTES.PUBLIC_VIEW_PAGE}${row.original.createdby}`}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{row.original.createdby}</Link>;
          return <Link to={{pathname:ROUTES.PUBLIC_VIEW_PAGE, state:{user_id: row.original.userid}}}> <img src={defaultPP} width="40" height="40" style={{borderRadius: '50%', marginRight: '12px'}} />{`${row.original.firstname} ${row.original.lastname}`}</Link>;
        }
      },
    },
    {
      Header: 'Title',
      accessor: 'jobtitle',
    },
    {
      Header: 'Email',
      accessor: 'email',
    //   Cell: ({ row }) => {
    //     return row.original.duration? convertWeekNumber(row.original.duration) : '--'
    //   }
    },
    {
      Header: 'Manager',
      accessor: 'manager',
    },
    {
      Header: 'Department',
      accessor: 'department',
    },
  ]

class ResultListing extends Component{
  constructor(props) {
    super(props)
    this.state={
      queryParam: this.props.query.get('q')
    }
  }

  componentDidMount(){

    this.getSearchResults()  
  }

  componentDidUpdate(prevProps){
    if(prevProps.query.get('q') != this.props.query.get('q')){
      this.setState({
        queryParam: this.props.query.get('q')
      }, ()=>{
        this.getSearchResults();
      })
    }
  }

  getSearchResults = () => {
    let { _get_search_data } = this.props
    let { queryParam } = this.state
    
    let data = {
      search_text: queryParam
    }
    if(!!data.search_text === true)
      _get_search_data(data);
  }

    render(){
      let {searchResult} = this.props.userProfilePage.userProfilePage;
      let data;
      if(searchResult.length >= 1){
        data = searchResult.map(dt=>{
          return {
            firstname: dt.first_name,
            lastname: dt.last_name,
            email: dt.email,
            img2: dt.image,
            jobtitle: dt.job_title,
            department: dt.department,
            userid: dt.user_id,
            img: dt.profile_pic,
            manager: dt.manager
          }
      })
      } else { 
       return (
        <div id="page-search-listing" className="main-page page-admin">
          <div className="container clearfix">
            <h3 className="no-result my-5 py-5 ">No Result Found</h3>
          </div>
        </div>
        )
      }

        const resultLength = searchResult.length;
        const resultText = resultLength <= 1 ? 'Result' : 'Results';
        return(
            <div id="page-search-listing" className="main-page page-admin">
                <div className="container clearfix">
                    <div className="page-header">
                        <h3>Showing {resultLength} {resultText}</h3>
                    </div>
                    {searchResult && searchResult.length > 0 && <div className="courses-box">
                        <Styles>
                            <DataTable columns={columns} data={data} />
                        </Styles>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ( userProfilePage ) => ({
  userProfilePage
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_search_data: get_search_data
    },
    dispatch
  )


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultListing);