import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'

import hackathonImg from '../../../assets/img/hackathon.png'
import hiringEventImg from '../../../assets/img/hiring-event.png'
import wineClubImg from '../../../assets/img/wine-club.png'
import { isTenantSite } from '../../../transforms'

export default class UpEvents extends Component {
  render() {

    if(isTenantSite() === false){
      return (
        <div className="events-box">
          <h4 className="common-head">Upcoming events for you <a className="view-btn float-right" href="javascript:void(0)">View all events</a></h4>

          <div className="events-card">
              <Row>
                <Col lg="4" md="12">
                      <div className="card">
                        <div className="img-box">
                          <img src={hackathonImg} className="card-img-top" alt="..." />
                        </div>
                        <div className="card-body p-0 pt-3">
                          <h5 className="card-title"><a href="https://www.eventbrite.com/e/minerva-hackathon-2019-hack-a-problem-and-change-the-world-tickets-58015838936">Minerva Hackathon 2019 : Hack a problem and change the world</a></h5>
                          <ul className="card-info">
                            <li>GitHub, San Francisco, CA </li>
                            <li>Wed, MAR 6-7, 9:00 AM</li>
                          </ul>
                          <p className="card-text">At Minerva Hackathon, we believe that you can think and create bigger than most Hackathons expect of you. You will learn about the Sustainable Development Goals (SDGs) side by side with talented peers and outstanding mentors.</p>
                        </div>
                      </div>
                  </Col>

                  <Col lg="4" md="12">
                      <div className="card">
                        <div className="img-box">
                          <img src={hiringEventImg} className="card-img-top" alt="..." />
                        </div>

                        <div className="card-body p-0 pt-3">
                          <h5 className="card-title"><a href="https://www.eventbrite.com/e/2019-santa-clara-career-fair-tickets-47191890214">Hiring Event: 2019 Silicon Valley Career Fair</a></h5>
                          <ul className="card-info">
                            <li>Marriott Hotel, San Jose, CA</li>
                            <li>Tues, AUG 20, 9:30 AM - 12:30 PM PDT</li>
                          </ul>
                          <p className="card-text">This job fair is free to job seekers and allows you to connect with potential employees. Pls send your open positions ahead of time to share with registered candidates.</p>
                        </div>
                      </div>
                  </Col>

                  <Col lg="4" md="12">
                      <div className="card">
                        <div className="img-box">
                          <img src={wineClubImg} className="card-img-top" alt="..." />
                        </div>

                        <div className="card-body p-0 pt-3">
                          <h5 className="card-title"><a href="https://www.peju.com/clubs/clubs-upcoming-wine-club-events">Upcoming Bay Area Wine Club event : March Mixer and A taste of Europe</a></h5>
                          <ul className="card-info">
                            <li>Napa Valley</li>
                            <li>Sun, JUNE 2, 10:30 AM - 12:30 PM</li>
                          </ul>
                          <p className="card-text">Club Peju members are invited to join us for one of our upcoming wine club pick-up parties.</p>
                        </div>
                      </div>
                  </Col>


              </Row>
          </div>
      </div>
      )
    } else {
      return (
        <div className="events-box">
          <h4 className="common-head">Upcoming events for you</h4>
          <div className="events-card">
            <Row></Row>
          </div>
        </div>
      )
    }
  }
}
