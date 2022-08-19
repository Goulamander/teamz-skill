import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getSamlDetail } from '../../../actions/saml_auth'
import SingleSignOn from './SingleSignOn';

class SingleSignOnAzure extends Component{
  constructor(props) {
    super(props)

    let { location } = this.props;
    this.state = {

    }
  }


  componentDidMount() {
    this.props._getSamlDetail()
  }

  render(){
    return(
      <SingleSignOn type="Azure" gettingStartedText="#" />
    );
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
)(SingleSignOnAzure)