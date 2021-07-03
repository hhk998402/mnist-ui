import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'

const request = require('superagent');

/**
 * Converts RGBA image to greyscale.
 *
 * @param imageData {any[]} input image
 * @returns {any[]} greyscale image data
 */
function toGreyscale(imageData) {
  const greyscale = Array(imageData.length / 4)
  for (let i = 0; i < imageData.length; i += 4) {
    greyscale[i / 4] = imageData[i + 3]
  }
  return greyscale
}

/**
 * Scales greyscale data to size specified.
 *
 * @param greyscale {any[]} image data
 * @param size
 * @returns {any[]} scaled image data
 */
function rescale(greyscale, size) {
  const fromSize = Math.round(Math.sqrt(greyscale.length))
  const scale = fromSize / size
  const rescaled = Array(size ** 2)
  for (let i = 0; i < rescaled.length; i++) {
    let xStart = (i % size) * scale
    let xEnd = xStart + scale
    let yStart = Math.round(i / size) * scale
    let yEnd = yStart + scale
    let sum = 0
    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        sum += greyscale[x + y * fromSize]
      }
    }
    rescaled[i] = sum / (255 * scale ** 2)
  }
  return rescaled
}

class InputCanvas extends Component {

  componentDidMount() {
    const canvas = findDOMNode(this.inputCanvas)
    this.ctx = canvas.getContext('2d')
    canvas.addEventListener('touchstart', this.onMouseDown, false)
    canvas.addEventListener('touchend', this.onMouseUp, false)
    canvas.addEventListener('touchmove', this.onMouseMove, false)
    this.canvas = canvas

    function eatEvent(ev) {
      if (ev.target.id === 'input-canvas') {
        ev.preventDefault()
      }
    }

    document.body.addEventListener('touchstart', eatEvent, false)
    document.body.addEventListener('touchend', eatEvent, false)
    document.body.addEventListener('touchmove', eatEvent, false)
  }

  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.getCursorPosition = this.getCursorPosition.bind(this)
    this.drawLine = this.drawLine.bind(this)
    this.clear = this.clear.bind(this)
    this.state = {
      currentPosition: null,
      drawing: false
    }
  }

  onMouseDown(ev) {
    this.setState({
      currPos: this.getCursorPosition(ev),
      drawing: true
    })
  }

  onMouseMove(ev) {
    if (!this.state.drawing) {
      return
    }
    const prevPos = this.state.currPos
    const currPos = this.getCursorPosition(ev)
    this.drawLine(prevPos, currPos)
    this.setState({currPos})
  }

  // Adapted from https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  dataURItoBlob(dataURI) {
    // Convert Base64 URL-encoded data to a byte string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1])
    } else {
      byteString = unescape(dataURI.split(',')[1])
    }
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // Write the bytes
    let ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ia], {type: mimeType})
  }

  // Adapted from https://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript
  blobToFile(blob, filename) {
    // A Blob is almost a file, just missing two properties, which we'll add below
    blob.lastModifiedDate = new Date()
    blob.name = filename
    return blob
  }

  // On mouse up, we want to take the input, parse and resize it,
  // then post it to the Model API
  onMouseUp(ev) {
    if (this.state.drawing) {
      this.setState({drawing: false})
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
      const rescaledImage = rescale(toGreyscale(imageData), 28)
      const req = request.post(`/image/upload-json`)
      req.set('Content-Type', 'application/json')
      req.send(JSON.stringify(rescaledImage))
      req.end((err, res) => {
        if (err) {
          throw err
        }
        this.setState({r: res.body.message})
        console.log(res.body)
        this.handleInputChange(res.body.result)
      })
    }
  }

  handleInputChange(data) {
    console.log("Data1", data)
    this.setState({data})
    this.props.onChange(this.state.data)
  }

  drawLine(start, end) {
    const ctx = this.ctx
    ctx.save()
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.lineWidth = 16
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }

  getCursorPosition(ev) {
    let xPos, yPos;
    if (ev.touches !== undefined) {
      xPos = ev.touches[0].clientX
      yPos = ev.touches[0].clientY
    } else {
      xPos = ev.clientX
      yPos = ev.clientY
    }
    const {top, left} = this.canvas.getBoundingClientRect()
    return {
      x: xPos - left,
      y: yPos - top
    }
  }

  clear() {
    const {width, height} = this.canvas
    this.ctx.clearRect(0, 0, width, height)
  }

  render() {
    return (
      <div className="input-canvas-container">
        <div style={{marginBottom: '10px'}}>
          <i className="fa fa-pencil" aria-hidden={true}/>
          <span style={{marginLeft: '.5em'}}>
            Draw a digit. On key up, you will submit.
          </span>
        </div>
        <canvas id="input-canvas" className="input-canvas"
                ref={(el) => this.inputCanvas = el}
                width={224} height={224}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseUp}
                onMouseUp={this.onMouseUp}/>
        <span className="clear-canvas" onClick={this.clear}>
          <span style={{marginLeft: '.5em'}}>Reset</span>
        </span>
      </div>
    )
  }

}

export default InputCanvas