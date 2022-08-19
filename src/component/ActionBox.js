import React, {Component} from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import optionIcon from '../assets/img/options icon.svg'

export default class ActionBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnDropright: false
    }
  }

  render() {
    return (
      <ButtonDropdown direction="right" isOpen={this.state.btnDropright} toggle={() => { this.setState({ btnDropright: !this.state.btnDropright }); }}>
        <DropdownToggle color={'link'} className="btn btn-dots">
          <img src={optionIcon} alt="..." />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Share this course</DropdownItem>
          <DropdownItem>Assign the course</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}