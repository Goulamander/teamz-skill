import React, {Component} from 'react';
import { Row } from 'reactstrap';
import LeftSection from './left/left-content';
import PublicMainView from './publicview';
import { get_user_detail } from '../../actions/userProfilePage';
import { get_logo_placeholder_images } from '../../actions/userProfilePage'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PublicView extends Component{

  componentDidMount(){
    if(this.props.location && this.props.location.state && this.props.location.state.user_id){
      this.props._get_user_detail(this.props.location.state.user_id);
    }
    this.props._get_logo_placeholder_images();
  }
    render(){
        const { profileData, workHighlights, courses, achievements, assignCourses } = this.props.userProfilePage.userdetails
        return(
            <section className="main-content hidediv">
                <div className="container-fluid tsz-container">
                    <Row className="bg-container">
                        <LeftSection courses={courses} profileData={profileData}/>
                        <PublicMainView workHighlights={workHighlights} achievements={achievements} assignCourses={assignCourses} courses={courses}/>
                    </Row>
                </div>
            </section>
        );
    }
}

const mapStateToProps = ({ user, userProfilePage, userdetails }) => ({
    user,
    userProfilePage,
    userdetails
  })

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_user_detail    : get_user_detail,
      _get_logo_placeholder_images :  get_logo_placeholder_images,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(PublicView);