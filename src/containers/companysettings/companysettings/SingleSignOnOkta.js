import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getSamlDetail } from '../../../actions/saml_auth'
import SingleSignOn from './SingleSignOn';

class SingleSignOnOkta extends Component{
  constructor(props) {
    super(props)

    let { location } = this.props
    this.state = {
      
    }
  }


  componentDidMount() {
    this.props._getSamlDetail()
  }

  render(){
    let { saml } = this.props;
    console.log(saml); 
    return(
      <SingleSignOn type="Okta" gettingStartedText="https://saml-doc.okta.com/SAML_Docs/How-to-Configure_SAML-2.0-for-TeamzSkill.html?baseAdminUrl=https://dev-697314-admin.oktapreview.com&app=teamzskill&instanceId=0oap1lf21kgpYArq60h7" />
    )
  }
}

const mapStateToProps = ({ saml }) => ({
  saml
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _getSamlDetail        : getSamlDetail
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSignOnOkta)