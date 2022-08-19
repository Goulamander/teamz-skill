import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom';
import { ROUTES } from '../../../constants/routeConstants' 
class LeftContent extends Component{
  render(){
    let activeRoute = this.props.router.location.pathname
    return(
      <div className="left-bar-content">
        <div className="account-content">
          <h3>My Account</h3>
          <Link to={ROUTES.CHANGE_PASSWORD} className={`anchor-links${(activeRoute === ROUTES.CHANGE_PASSWORD)? ` active`: ``}`}>Change Password</Link>
        </div>
        <div className="team-content menu-opt-p">
          <h3>Team</h3>
          <Link to={ROUTES.MANAGE_ACCESS} className={`anchor-links${(activeRoute === ROUTES.MANAGE_ACCESS)? ` active`: ``}`}>Manage People Access</Link>
          <Link to="#" className="anchor-links">Manage Group Access</Link>
          <Link to="#" className="anchor-links">Import</Link>
          <Link to="#" className="anchor-links">Export</Link>
        </div>
        <div className="company-content menu-opt-p">
          <h3>Company</h3>
          <Link to={ROUTES.MANAGE_COMPANY_BRANDKIT} className={`anchor-links${(activeRoute === ROUTES.MANAGE_COMPANY_BRANDKIT)? ` active`: ``}`}>Manage brand kit</Link>
        </div>
        <div className="single-sign-on-content menu-opt-p">
          <h3>Single Sign-On</h3>
          <Link to={ROUTES.COMPANY_SETTINGS_OKTA} className={`anchor-links${(activeRoute === ROUTES.COMPANY_SETTINGS_OKTA)? ` active`: ``}`}>Single Sign-On (Okta)</Link>
          <Link to={ROUTES.COMPANY_SETTINGS_AZURE} className={`anchor-links${(activeRoute === ROUTES.COMPANY_SETTINGS_AZURE)? ` active`: ``}`}>Single Sign-On (Azure AD)</Link>
        </div>
        <div className="integrations menu-opt-p">
          <h3>Integrations</h3>
          <Link to={ROUTES.COMPANY_SETTINGS_SALESFORCE} className={`anchor-links${(activeRoute === ROUTES.COMPANY_SETTINGS_SALESFORCE)? ` active`: ``}`}>SalesForce</Link>
          <Link to="#" className="anchor-links">Google</Link>
          <Link to="#" className="anchor-links">OneDrive</Link>
        </div>
        <div className="billings menu-opt-p">
          <h3>Billing</h3>
          <Link to="#" className="anchor-links">Stripe</Link>
        </div> 
      </div>
    );
  }
}

const mapStateToProps = ( state ) => ({
  router: state.router
})

export default connect(
  mapStateToProps,
  null
)(LeftContent)