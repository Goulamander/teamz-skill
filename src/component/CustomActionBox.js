import React, {Component} from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import optionIcon from '../assets/img/options icon.svg'

export default class CustomActionBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnDropright: false
    }
  }

  render() {
    let { handleClick, listData, showIcon } = this.props
    return (
      <ButtonDropdown direction="right" isOpen={this.state.btnDropright} toggle={() => { this.setState({ btnDropright: !this.state.btnDropright }); }}>
        <DropdownToggle color={'link'} className="action-bottom-dots">
          <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true"></a>
        </DropdownToggle>
        <DropdownMenu>    
          { 
            listData.map((item, index) => 
              <DropdownItem key={index} onClick={() => handleClick(item.key)}>
                { showIcon ?
                  <div className="d-flex align-items-center">
                    <img src={item.icon} width="20" height="20" /> 
                    <span className="ml-3">{item.title}</span>
                  </div> 
                  : item.title
                }
              </DropdownItem>
            )
          }
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}