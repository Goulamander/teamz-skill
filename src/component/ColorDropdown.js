import React, {useState} from 'react'
import styled from 'styled-components'
import { Input } from 'reactstrap'
import classnames from 'classnames'

const DropdownWrapper = styled.div`
  .admin-feedback-group .feedback-list {
    background: transparent;
  }
  .admin-feedback-group .dropdown-item {
    margin-bottom: 8px;
    cursor: pointer;
  }
  .admin-feedback-group .form-control {
    background: #FADBCE;
    border: 1px solid #775f54;
    border-radius: 4px;
  }
  .admin-feedback-group .form-control::placeholder {
    color: #775f54;
    opacity: 1;
  }
  .admin-feedback-group .feedback-list .dropdown-item > span{
    line-height: 25px;
    background-color: #FADBCE;
    width: 100%;
    float: left;
    padding: 8px 16px 10px 16px;
    color: #775f54;
    opacity: 1;
    white-space: initial;
    border: 1px solid #775f54;
    border-radius : 4px;
  }
  .admin-feedback-group .feedback-list .dropdown-item span:hover {
    background-color: #EDCCBF;
  }
  .admin-feedback-group .feedback-list .dropdown-item.is-not-correct span {
    color: #d41111;
  }
  .admin-feedback-group .feedback-list .dropdown-item.selected span {
    background-color: #EDCCBF;
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

const ColorDropdown = ({
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
              <li key={`cp-opt-${i}`} className={classnames({"dropdown-item":1, "is-not-correct":!!readMode, "selected": selectedItem && selectedItem.option_title === option.option_title, "is-correct": (option.is_correct && !!readMode)})} >
                <span onClick={()=>setOption(option)}>{option.option_title}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </DropdownWrapper> 
  )
}

export default ColorDropdown