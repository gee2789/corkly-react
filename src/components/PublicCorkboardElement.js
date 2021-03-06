import React from 'react';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateElement, addError } from '../actions'
import {CirclePicker} from 'react-color'
import Dropzone from 'react-dropzone'


class PublicCorkboardElement extends React.Component {
  message(){
    this.props.addError("Please login to do that!")
    setTimeout(()=>{this.props.addError("")}, 2000)
  }

  render(){
    let {width, height} = this.props.element

    let elementwidth = (typeof width === "string") ? parseInt(width.slice(0,-2))+20 : width+20
    let elementheight = (typeof height === "string") ? parseInt(height.slice(0,-2)) : height

    let stickyStyle={
      position: "absolute",
      top: 0,
      left: 0,
      margin: 0,
      padding: "0 !important",
      background: this.props.element.bgcolor,
      boxShadow: "0px 2px 2px rgba(0,0,0,0.4)",
      borderRadius: 5,
      zIndex: this.props.zIndex
    }

    let inputStyle={
      background: "none",
      outline: "none",
      border: "none",
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 0,
      paddingTop: 0,
      marginRight: 5,
      fontSize: "18px",
      width: this.props.element.width,
      height: this.props.element.height,
      resize: "none"
    }

    return (
      <Draggable
        axis="both"
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={{x: this.props.element.x, y: this.props.element.y}}
        grid={null}
        zIndex={1}>
        <div ref={this.props.element.EID} style={stickyStyle}>
          <div style={{minHeight: 20, width: "100%"}}>
            <button className="icon-button" style={{float: "left"}} onClick={this.message.bind(this)}>
              <FontAwesome name="close" />
            </button>

            <button className="icon-button" style={{float: "right"}} onClick={this.message.bind(this)}>
              <FontAwesome name="thumb-tack" />
            </button>

            <button className="icon-button" style={{float: "right"}} onClick={this.message.bind(this)}>
              <FontAwesome name="image" />
            </button>

            <button className="icon-button" style={{float: "right"}} onClick={this.message.bind(this)}>
              <FontAwesome name="paint-brush" />
            </button>
          </div>
          {this.props.element.is_image ? <img src={this.props.element.image_blob}
              style={{width: elementwidth+20}} className="postit-image" /> : <textarea
                  ref={`textarea-${this.props.element.EID}`}
                  style={inputStyle}
                  value={this.props.element.content} />}

        </div>
      </Draggable>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateElement: updateElement,
    addError: addError
  }, dispatch)
}

const mapStateToProps = (state) => {
  return ({
    corkboardElements: state.board.boardElements
  })
}

const ConnectedPublicCorkboardElement = connect(mapStateToProps, mapDispatchToProps)(PublicCorkboardElement)

export default ConnectedPublicCorkboardElement
