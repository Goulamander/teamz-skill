import React from 'react'
import { Row, Container } from 'reactstrap'

import foodIcon from '../../assets/img/food.png'
import cancelIcon from '../../assets/img/cancel.png'
import banner1 from '../../assets/img/banner1.jpg'
import banner2 from '../../assets/img/banner2.jpg'
import banner3 from '../../assets/img/banner3.jpg'
import listIcon from '../../assets/img/list.png'
import { isTenantSite } from '../../transforms'

export const SectionBanner = ({
  user,
  _handleCloseBanner,
}) => {
  let userData = user.data;
  let notificationCount = isTenantSite() === false ? '3' : '0';
  let imageArray = [banner1, banner2, banner3];
  //the num will generate a random number in the range 0 to 2
  let num = Math.floor(Math.random() * 3);
  let disPlayImage = imageArray[num];
  return (
    <section className="banner" style={{
        backgroundImage:`url(${disPlayImage})`,
        backgroundSize:'cover',
        backgroundColor: 'unset'
      }}>
      <div className="tsz-container">
        <a className="cross-notify" href="javascript:void(0)" onClick={_handleCloseBanner}><i className="fa fa-times"></i></a>
        <Container>
          <Row>
            <div className="col-lg-6 col-md-12">
              <div className="banner-left">
                <h3>Hello {userData.first_name},</h3>
                {/* <p>You have <span>{notificationCount}</span> new notifications</p> */}
                <p>Let's skill up and excel at what you do.</p>
              </div>
            </div>

            {/* <div className="col-lg-7 col-md-12">
              <div className="notify-box">
              {isTenantSite() === false ?  <Row>
                  <div className="col-sm-12">
                    <div className="notify-list">
                      <img src={foodIcon} alt="" />
                      <p><a href="javascript:void(0)">@Shelly's</a> 1st week in your team - plan a welcome lunch</p>
                      <button className="btn csnew-btn">Make plans</button>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="notify-list">
                      <img src={cancelIcon} alt="" />
                      <p><a href="javascript:void(0)">@Nitin</a> canceled last two 1:1's - plan a check-in </p>
                      <button className="btn btn-default csnew-btn">Plan Check-in</button>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="notify-list">
                      <img src={listIcon} alt="" />
                      <p>Diversity &amp; Inclusion Training </p>
                      <button className="btn btn-default csnew-btn">Sign Up</button>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <p className="view-all text-center"><a className="" href="javascript:void(0)">View all notifications</a></p>
                  </div>
                </Row>: '' }
              </div>
            </div> */}
          </Row>
        </Container>
      </div>
    </section>
  )
}