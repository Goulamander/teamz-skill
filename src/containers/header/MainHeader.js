import React, {Component} from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Form, Input } from 'reactstrap'
import { bindActionCreators } from 'redux'

import Can from '../../component/Can'
import { ROUTES } from '../../constants/routeConstants'
import { appConstant, userRoles } from '../../constants/appConstants'
import { getUserRoleName } from '../../transforms'
import logo from '../../assets/img/combo-logo.png' 
import notificationIcon from '../../assets/img/notifications.png'
import defaultPP from '../../assets/img/profile_default.png'
import { get_search_data } from '../../actions/userProfilePage'

const routeResource = 'ROUTES'

class MainHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      dropdownOpen: false,
      searchTextEvent: '',
      searchResult: false
    }
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleProfile = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    let searchTxt = e.target.elements[0].value
    if(searchTxt !== ''){
      this.setState({
        searchResult: true,
        searchTextEvent: searchTxt
      })
    }
  }


  render() {
    let {login, user, active } = this.props
    let profileImg = (login.data.image_24)? login.data.image_24 : defaultPP 
        profileImg = (user.data.image)? (appConstant.BASE_URL + user.data.image.replace('dist','')) : profileImg
    let activeRoute = active
    let roleName = getUserRoleName(login.data.user_role)
    let {searchTextEvent} = this.state;
    if(this.state.searchResult){
      this.state.searchResult = false
      return <Redirect to={`${ROUTES.SEARCH_RESULT}?q=${searchTextEvent}`} />
    }
    return (
      <header>
        <Navbar className="navbar navbar-expand-lg navbar-light cs-nav">
          <div className="container-fluid tsz-container">
            <NavbarBrand href={ROUTES.HOME} className="mr-auto"><img src={logo} alt="Logo" /></NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse  id="navbarSupportedContent" isOpen={!this.state.collapsed} navbar>
              <Nav navbar className="ml-auto">
                <NavItem className={`nav-item ${(ROUTES.PROFILE === activeRoute || ROUTES.MY_COURSES === activeRoute || ROUTES.COURSE === activeRoute || ROUTES.COURSES_LIBRARY === activeRoute || ROUTES.COMPANY_SETTINGS === activeRoute || ROUTES.PUBLIC_VIEW_PAGE === activeRoute || ROUTES.PROFILE_SETTINGS === activeRoute )? `active`: ``}`}>
                  <Link className="nav-link" to={ROUTES.PROFILE}>You</Link>
                </NavItem>
                <NavItem className={`nav-item ${(ROUTES.CONTENT_PORTAL === activeRoute)? `active`: ``}`}>
                  <Link className="nav-link" to={ROUTES.CONTENT_PORTAL} >Home</Link>
                </NavItem>
                <Can
                  role={roleName}
                  resource={routeResource}
                  action={ROUTES.TEAM}
                  yes={(attr) => (
                    <NavItem className={`nav-item ${(ROUTES.TEAM === activeRoute)? `active`: ``}`}>
                      <Link className="nav-link" to={ROUTES.TEAM} >Team</Link>
                    </NavItem>
                  )}
                  no={() => (
                    null
                  )}
                />
                <Can
                  role={roleName}
                  resource={routeResource}
                  action={ROUTES.GROW}
                  yes={(attr) => (
                    <NavItem className={`nav-item ${(ROUTES.GROW === activeRoute)? `active`: ``}`}>
                      <Link className="nav-link" to={ROUTES.GROW}>Grow</Link>
                    </NavItem>
                  )}
                  no={() => (
                    null
                  )}
                />
                <Can
                  role={roleName}
                  resource={routeResource}
                  action={ROUTES.PRAISE}
                  yes={(attr) => (
                    <NavItem className={`nav-item ${(ROUTES.PRAISE === activeRoute || ROUTES.FEEDBACK === activeRoute)? `active`: ``}`}>
                      <Link className="nav-link" to={ROUTES.PRAISE}>Praise</Link>
                    </NavItem>
                  )}
                  no={() => (
                    null
                  )}
                />
                <Can
                  role={roleName}
                  resource={routeResource}
                  action={ROUTES.ANALYTICS}
                  yes={(attr) => (
                    <NavItem className={`nav-item ${(ROUTES.ANALYTICS === activeRoute)? `active`: ``}`}>
                      <Link className="nav-link" to={ROUTES.ANALYTICS}>Analytics</Link>
                    </NavItem>
                  )}
                  no={() => (
                    null
                  )}
                />
                <NavItem className="nav-item">
                  <Form className="form-inline mt-2 srch-box" onSubmit={this.handleSearch}>
                    <i className="fa fa-search" />
                    <Input className="mr-sm-2" id="search" type="search" placeholder="Search by name" aria-label="Search" defaultValue={searchTextEvent != null ? searchTextEvent : ''}/>
                  </Form>
                </NavItem>
                <NavItem className="nav-item">
                  <a className="nav-link pr-0" href="javascript:void(0)"><img className="notify-icon" src={notificationIcon} alt="..." /></a>
                </NavItem>
                <Dropdown className={'pr-4'} nav isOpen={this.state.dropdownOpen} toggle={this.toggleProfile}>
                  <DropdownToggle nav className={'pro-img'}>
                    <img alt={'profile-pic'} src={profileImg} />
                  </DropdownToggle>
                  <DropdownMenu className={'profile-setting-menu'}>
                    <Can
                      role={roleName}
                      resource={routeResource}
                      action={ROUTES.COMPANY_SETTINGS}
                      yes={(attr) => (
                        <DropdownItem><Link to={ROUTES.COMPANY_SETTINGS}>Company Settings</Link></DropdownItem>
                      )}
                      no={() => (
                        null
                      )}
                    />
                    <DropdownItem><Link to={ROUTES.PROFILE_SETTINGS}>My Setting</Link></DropdownItem>
                    <DropdownItem><Link to={ROUTES.LOGOUT}>Sign-off</Link></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
)(MainHeader)
