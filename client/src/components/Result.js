import React, {Component} from 'react'

class Result extends Component {

  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
    return (
      <div>
        <h1>Result</h1>
        <h2>Prediction: {this.props.data.data}</h2>
      </div>
    )
  }
}

export default Result