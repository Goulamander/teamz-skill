import React, {useState} from 'react'
import styled from 'styled-components'
import { Input } from 'reactstrap'
import classnames from 'classnames'

const DropdownWrapper = styled.div`
  .admin-feedback-group .feedback-list .dropdown-item > span{
    line-height: 40px;
    background-color: #fff;
    width: 100%;
    float: left;
    padding: 0px 15px;
    color: #171717;
    white-space: initial;
  }
  .admin-feedback-group .feedback-list .dropdown-item span:hover {
    background-color: #f5f5f5;
  }
  .admin-feedback-group .feedback-list .dropdown-item.is-not-correct span {
    color: #d41111;
  }
  .admin-feedback-group .feedback-list .dropdown-item.is-correct span {
    color: #2eb500;
  }
`;

// data=[
//   {
//     key: '',
//     value: ''
//   }
// ]

const Dropdown = ({
  placeholder,
  data,
  selected,
  readMode,
  _onChange
}) => {

  selected = (selected)? selected: null
  const [isExpand, setIsExpand] = useState(false)
  const [selectedItem, setSelectedItem] = useState(selected)

  const setOption = (type) => {
    
    if(!!readMode === false)
      setSelectedItem(type); 
    
    if(typeof _onChange === "function")
      _onChange(type)

    setIsExpand(false)
  }

  const _toggleInput = () => {
    setIsExpand(!isExpand)
  }

  return(
    <DropdownWrapper>
      <div className={classnames({'admin-feedback-group': true, 'show':isExpand})}>
        <Input placeholder={placeholder} type="text" value={(selectedItem? selectedItem.option_title : '')} onChange={()=> {}} />
        <span className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={_toggleInput}></span>
        <ul className="feedback-list animated fadeInUp" id="sizelist">
          {
            data.map((option, i) => (
              <li key={`cp-opt-${i}`} className={classnames({"dropdown-item":1, "is-not-correct":!!readMode, "is-correct": (option.is_correct && !!readMode)})} >
                <span onClick={()=>setOption(option)}>{option.option_title}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </DropdownWrapper> 
  )
}

export default Dropdown