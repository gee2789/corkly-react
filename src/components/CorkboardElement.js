import React from 'react';
import Draggable from 'react-draggable';
import FontAwesome from 'react-fontawesome';
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateElement  } from '../actions'


class CorkboardElement extends React.Component {
  constructor(props){
    super(props)

  }

  onStop(){
    let div = this.refs[this.props.element.EID]
    this.props.updateElement({
      element: {
        EID: this.props.element.EID,
        x: div.getBoundingClientRect().left,
        y: div.getBoundingClientRect().top
      }
    })
  }

  render(){
    let stickyStyle={
      position: "absolute",
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      background: this.props.element.bgcolor,
      boxShadow: "0px 2px 2px rgba(0,0,0,0.4)",
      borderRadius: 5
    }

    let inputStyle={
      // background: "rgba(255, 255, 255, 0.3)",
      background: "none",
      outline: "none",
      border: "none",
      paddingLeft: 10,
      paddingRight: 10,
      marginRight: 5,
      width: this.props.element.width,
      height: this.props.element.height
    }

    let buttonStyle={float: "left", padding: 5, margin: 0, background: "none", outline: "none",border: "none"}

    return (
      <Draggable
        axis="both"
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={{x: this.props.element.x, y: this.props.element.y}}
        grid={null}
        zIndex={100}
        onStop={this.onStop.bind(this)}>
        <div ref={this.props.element.EID} style={stickyStyle}>
          <div className="handle" style={{minHeight: 20, width: "100%"}}>
            <button onClick={this.props.deleteSticky} style={buttonStyle}>
              <FontAwesome name="close" />
            </button>
            <button style={{...buttonStyle, float: "right"}}>
              <FontAwesome name="thumb-tack" />
            </button>
          </div>
          <textarea
            autoFocus
            id={`textarea-${this.props.element.EID}`}
            style={inputStyle}
            value={this.props.element.content}
            onChange={(e) => {this.props.contentChange(e, this.props.element.EID)}}
            onMouseUp={(e)=> {this.props.resizeSticky(e, this.props.element.EID)}} />
        </div>
      </Draggable>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateElement: updateElement
  }, dispatch)
}

const ConnectedCorkboardElement = connect(null, mapDispatchToProps)(CorkboardElement)

export default ConnectedCorkboardElement
