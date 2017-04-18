import React from 'react';
import corkboardImage from '../imgs/corkboard.jpg'
import CorkboardElement from './CorkboardElement'
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Link
} from 'react-router-dom'
import { addBoardElement, updateElement, createBoard, deleteElement, updateBoard } from '../actions'
import Account from './Account'

class Corkboard extends React.Component {
  constructor(){
    super()
    this.deleteSticky = this.deleteSticky.bind(this)
    this.addSticky = this.addSticky.bind(this)
    this.contentChange = this.contentChange.bind(this)
    this.createBoard = this.createBoard.bind(this)
    this.saveBoard = this.saveBoard.bind(this)

    this.state={
      boardTitle: ''
    }
  }

  deleteSticky(EID){
    this.props.deleteElement(EID)
  }

  addSticky(e){
    this.props.addBoardElement({
      x: e.clientX,
      y: e.clientY,
      width: "150px",
      height: "100px",
      bgcolor: "#eee",
      EID: this.props.boardElements.length
    })
  }

  contentChange(e, EID){
    this.props.updateElement({element: {EID: EID, content: e.target.value}})
  }

  titleChange(event){
    this.setState({
      boardTitle: event.target.value
    })
  }

  createBoard(event){
    event.preventDefault()
    this.props.createBoard({board: {title: this.state.boardTitle, elements_attributes: this.props.boardElements, id: this.props.boardId}})
    this.setState({
      boardTitle: ''
    })
  }

  saveBoard(){
    this.props.updateBoard({board: {id: this.props.boardId, elements_attributes: this.props.boardElements}})
  }

  render() {

    let showElements = this.props.boardElements.map((element) => {
        return(<CorkboardElement
            key={element.EID}
            element={element}
            resizeSticky={this.resizeSticky}
            deleteSticky={() => this.deleteSticky(element.EID)}
            contentChange={this.contentChange} />)
    })

    const corkboardStyle={
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
      padding: 0,
      margin: 0,
      background: `url(${corkboardImage})`,
      overflow: 'hidden',
      userSelect: 'none'
    }

    const sidebarStyle={
      background: "#000",
      color: "#fff",
      position: "absolute",
      top: 0,
      left: 0,
      width: 300
    }

    return (
      <div onDoubleClick={this.addSticky} style={corkboardStyle} className="corkboard-container">
        <div style={sidebarStyle}>
          <Account />
        </div>
        <form onSubmit={this.createBoard}>
          Title: <input type="text" value={this.state.boardTitle} onChange={this.titleChange.bind(this)}/>
          <button type="submit">Create Board</button>
        </form>
        <button onClick={this.saveBoard}>Save Bard</button>
        {showElements}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    boardElements: state.board.boardElements,
    boardId: state.board.boardId
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addBoardElement: addBoardElement,
    updateElement: updateElement,
    createBoard: createBoard,
    deleteElement: deleteElement,
    updateBoard: updateBoard
  }, dispatch)
}

const ConnectedCorkboard = connect(mapStateToProps, mapDispatchToProps)(Corkboard)

export default ConnectedCorkboard
