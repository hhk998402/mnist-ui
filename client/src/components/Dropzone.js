import React, {Component} from 'react'
import DZ from 'react-dropzone'

const request = require('superagent')

class Dropzone extends Component {

  constructor(props) {
    super(props)
    this.state = {disabled: true, files: []}
  }

  onDrop(files) {
    this.setState({files})
    const req = request.post('/image/upload')
    files.forEach(file => {
      console.log('Upload ' + file)
      req.attach('file', file)
    })
    req.end((err, res) => {
      if (err) {
        throw err
      }
      this.setState({r: res.body.message})
      console.log(res)
      this.handleInputChange(res.body.result)
    })
  }

  handleInputChange(data) {
    console.log('Change ' + data)
    this.setState({data})
    this.props.onChange(this.state.data)
  }

  render() {
    return (
      <div>
        <button type="button"
                onClick={() => this.setState({disabled: !this.state.disabled})}>Toggle disabled
        </button>
        <div className="dropzone">
          <DZ onDrop={this.onDrop.bind(this)} disabled={this.state.disabled}>
            <p>Drop files here, or click to select files to upload.</p>
          </DZ>
        </div>
        <div>
          <h2>Dropped files</h2>
          <ul>
            {this.state.files.map(f =>
              <li>{f.name} - {f.size} bytes</li>
            )}
          </ul>
          <div>
            {this.state.files.map(f =>
              <img className="preview-img" src={f.preview} alt="Preview"/>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Dropzone