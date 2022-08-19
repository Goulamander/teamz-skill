import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { ROUTES } from '../../constants/routeConstants'
import logo from '../../assets/img/combo-logo.png'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap'

class LoginHeader extends Component {
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

  render() {
    return (
      <header>
        <Navbar className="navbar navbar-expand-lg navbar-light cs-nav">
          <div className="container-fluid tsz-container">
            <NavbarBrand href={ROUTES.HOME} className="mr-auto"><img src={logo} alt="Logo" /></NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse  id="navbarSupportedContent" isOpen={!this.state.collapsed} navbar>
              <Nav navbar className="ml-auto">
                <NavItem active>
                  <a href="javascript:void(0)" className="nav-link">Sign in</a>
                </NavItem>
                <NavItem>
                  <Link className="nav-link nav-link-blue-btn" to={ROUTES.HOME}>Get Started</Link>
                </NavItem>
              </Nav>
            </Collapse>
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
)(LoginHeader)
