import React, {Component} from 'react'
import { Input } from 'reactstrap'

export default class DateInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateInvalid: false
    }
  }

  onChange = (e) => {
    let currentDate = Date.now() 
    let input = e.target.value;
    try {
      let dob = new Date(input).getTime()
      if(dob > currentDate){
        this.setState({dateInvalid: true})
      } else {
        this.setState({dateInvalid: false})

        this.props._onChange(e, "birthday")
      }
    } catch (error) {
      this.setState({dateInvalid: true})  
    }
  }

  render () { 
    let isError = this.props.requiredErr || false
    return (
      <Input type="date" placeholder="Month and Day only"  onChange={this.onChange} invalid={this.state.dateInvalid || isError }/>    
    )
  }
}