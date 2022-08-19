import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { ROUTES } from '../../constants/routeConstants'
import logo from '../../assets/img/combo-logo.png' 
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap'

class HomeHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true
    }
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    let {props} = this
    return (
      <header>
        <Navbar className="navbar-expand-lg navbar-light cs-nav">
          <div className="container-fluid tsz-container">
            <NavbarBrand href={ROUTES.HOME} className="mr-auto"><img src={logo} alt="Logo" /></NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            {props.noLinks === undefined && 
            <Collapse  id="navbarSupportedContent" isOpen={!this.state.collapsed} navbar>
              <Nav navbar className="ml-auto">
                <NavItem active>
                  <Link className="nav-link" to={ROUTES.LOGIN}>Sign in</Link>
                </NavItem>
                <NavItem>
                  <a className="nav-link nav-link-blue-btn">See the demo</a>
                </NavItem>
              </Nav>
            </Collapse>
            }
          </div>
        </Navbar>
      </header>
    )
  }
}

const mapStateToProps = ( state ) => ({
  ...state
})

export default connect(
  mapStateToProps,
  null
)(HomeHeader)
