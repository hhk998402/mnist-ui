import React, {Component} from 'react'
import Swipeable from 'react-swipeable-views'
import {Tabs, Tab} from '@material-ui/core'
import Dropzone from './Dropzone'
import InputCanvas from './InputCanvas'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  },
  slide: {
    padding: 10
  }
}

class FileCards extends Component {

  constructor(props) {
    super(props)
    this.state = {slideIndex: 0}
  }

  handleChange = (ev, value) => {
    this.setState({slideIndex: value})
  }

  handleInputChange = (data) =>  {
    console.log("Data", data)
    console.log("this", this);
    this.setState({data})
    this.props.onChange({data})
    console.log(this.state.data)
  }

  render() {
    return (
      <div>
        <Tabs value={this.state.slideIndex} onChange={this.handleChange}>
          <Tab label="Draw digit" value={0}/>
        </Tabs>
        <Swipeable index={this.state.slideIndex} onChangeIndex={this.handleChange}>
          <div>
            <InputCanvas data={this.props.data} onChange={this.handleInputChange}/>
          </div>
        </Swipeable>
      </div>
    )
  }
}

export default FileCards