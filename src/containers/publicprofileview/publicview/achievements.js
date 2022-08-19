import React, {Component, Fragment} from 'react'
import { Row, Col } from 'reactstrap'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import AchievementsList from '../../../component/common/Achievements'
import prevArrowIcon from '../../../assets/img/backward-arrow.png'
import nextArrowIcon from '../../../assets/img/forward-arrow.png'
import courseImgDefault from '../../../assets/img/recognition-image-with-star.png'
import { appConstant } from '../../../constants/appConstants'

class AchievementsPublicView extends Component{
    
    render(){
        const {achievements} = this.props;
        const CourseNextArrow = (props) => (
            <div className="slider-arrow next" onClick={props.onClick}> <img src={nextArrowIcon} /> </div>
        )
          
        const CoursePrevArrow = (props) => (
            <div className="slider-arrow prev" onClick={props.onClick}> <img src={prevArrowIcon} /> </div>
        )

        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            useTransform: false,
            adaptiveHeight: true,
            nextArrow: <CourseNextArrow />,
            prevArrow: <CoursePrevArrow />,
            responsive: [
              {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                  }
              },
              {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false
                }
            }
            ]
          };
        return(
            <div className="weekly-box achievements-public-view">
                <Row>
                    <Col sm={4}>
                        <h4 className="common-head">Achievements</h4>
                    </Col>
                </Row>
                <div className="events-box achievements-list">
                    <Fragment>
                        {achievements && achievements.length == 0 && 
                        <Col>
                            <h4 className="no-course my-5 py-5">No achievements</h4>
                        </Col>
                        }
                        { 
                        <div className="events-card">
                            <div className="tzs-slider achievement-slider-public-view">
                            <Slider {...settings}>
                            
                                { achievements && achievements.length && achievements.map((item, index)=>{
                                var courseImg = courseImgDefault;
                                if(!!item.cert_url === true){
                                    courseImg = appConstant.BASE_URL + item.cert_url.replace('dist', '')
                                }else{
                                    courseImg = courseImgDefault;
                                }

                                let dt = item.archived_date,
                                    date = new Date(dt),
                                    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                                    achievementDate = months[date.getMonth()] + ' ' + date.getFullYear();
                                return (
                                <AchievementsList courseImg={courseImg} item={item} key={index} achievementDate={achievementDate}/>
                                )}
                            )}</Slider>
                            </div>
                        </div>
                        }
                    </Fragment>
                </div>
            </div>
        );
    }
}

export default AchievementsPublicView;