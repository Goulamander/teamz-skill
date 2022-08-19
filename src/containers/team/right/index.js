import React, { useState, useEffect, useRef } from 'react'
import { Route, Switch,  Redirect  } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import  RightPartContent from './rightPartContent'
import  AddToTeam from './addToTeam'
import { ROUTES } from '../../../constants/routeConstants';

const RightPart = (props) => {
    let { selectedTeam, teamsData } = props.teamDetails;
    return (
      <Col xl="8" lg="8" md="7" className="pl-0 pr-0 pb-2 col-xxl-8">
        <div className="team-right-bar">
          { selectedTeam != null ?
            <div className="title">
              <div className="initial-letter" style={{backgroundColor : selectedTeam.color}}>{selectedTeam.initial_letter}</div>
              <div className="team-name">{selectedTeam.team_name}</div>
            </div> : <div className="title">Team</div>
          }
          <Switch>
            <Route
              exact 
              path={ROUTES.MY_TEAM}
              component={RightPartContent}
            />
            <Route 
              exact 
              path={ROUTES.ADD_TO_TEAM}
              component={AddToTeam} 
            />
            <Route
              exact
              path="/team"
              render={() => {
                  return (
                    <Redirect to={ROUTES.MY_TEAM} />
                  )
              }}
            />
          </Switch>
        </div>
      </Col>
    )
}

const mapStateToProps = ( state ) => ({
  router: state.router,
  teamDetails: state.team
})

export default connect(
  mapStateToProps,
  null
)(RightPart)