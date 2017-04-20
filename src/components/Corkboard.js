import React from 'react';
import CorkboardElement from './CorkboardElement'
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Image from 'react-image-file'

import { changeBoardAttributes, publish, addBoardElement, updateElement, createBoard, deleteElement, updateBoard, addCollaborator, updateTitle, deleteBoard, setCurrentBoard, newBoard } from '../actions'
import Collaborator from './Collaborator'

import Account from './Account'
import FontAwesome from 'react-fontawesome';
import corkboardImage from '../imgs/corkboard.jpg'

class Corkboard extends React.Component {
  constructor(){
    super()
    this.addSticky = this.addSticky.bind(this)
    this.contentChange = this.contentChange.bind(this)
    this.createBoard = this.createBoard.bind(this)
    this.saveBoard = this.saveBoard.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    // this.handleDrop = this.handleDrop.bind(this)
    // this.preventDefault = this.preventDefault.bind(this)

    this.state={
      boardTitle: '',
      imageBlob: null
    }
  }


//   preventDefault(event){
//     event.preventDefault()
//   }

//   handleDrop(event){
//     event.preventDefault()
//     let file = event.dataTransfer.files[0]
//     let imageBlob = window.URL.createObjectURL(file)
//     this.setState({
//       imageBlob: imageBlob
//     })
//   }

  addSticky(e){
    if(!(e.target.type === "textarea")){
      this.props.addBoardElement({
        x: e.clientX,
        y: e.clientY,
        width: "150px",
        height: "100px",
        bgcolor: this.props.boardAttributes.currentColor,
        content: '',
        EID: this.props.boardElements.length
      })
    }
  }

  componentWillMount(){
    let {corkboardId} = this.props.match.params
    if (corkboardId){
      this.props.setCurrentBoard(this.props.token, corkboardId)
    }
  }

  componentWillReceiveProps(nextProps){
    let {corkboardId} = nextProps.match.params
    if (corkboardId && corkboardId === "new" && corkboardId !== this.props.match.params.corkboardId){
      this.props.newBoard()
    } else if (corkboardId && corkboardId !== this.props.match.params.corkboardId){
      this.props.setCurrentBoard(this.props.token, corkboardId)
    } else if (this.props.match.params.corkboardId !== nextProps.boardId && nextProps.boardId && this.props.boardId !== nextProps.boardId){
        this.props.history.push(`/boards/${nextProps.boardId}`)
      }
    }

  componentWillUpdate(nextProps){
    if (!nextProps.token && this.props.match.params.corkboardId) {
      this.props.history.push('/boards')
    }
  }

  componentDidUpdate(prevProps, prevState){
     if(this.props.token && prevProps.token !== this.props.token){
       this.props.setCurrentBoard(this.props.token, this.props.match.params.corkboardId)
     }
   }

  contentChange(e, EID){
    this.props.updateElement({element: {EID: EID, content: e.target.value}})
  }

  titleChange(event){
    this.props.updateTitle(event.target.value)
  }

  createBoard(event){
    event.preventDefault()
    this.props.createBoard(this.props.token, {board: {title: this.props.title, currentcolor: this.props.boardAttributes.currentColor, elements_attributes: this.props.boardElements, id: this.props.boardId}})
  }

  publish(event){
    this.props.publish(this.props.token, {board: {id: this.props.boardId}})
  }

  handleDelete(id){
    this.props.deleteBoard(this.props.token, {id: id})
    this.props.history.push('/boards')
  }

  saveBoard(){
    this.props.updateBoard(this.props.token, {board: {title: this.props.title, currentcolor: this.props.boardAttributes.currentColor, id: this.props.boardId, elements_attributes: this.props.boardElements}})
  }

  render() {
    let showElements = this.props.boardElements.map((element) => {
        return(<CorkboardElement
            key={element.EID}
            element={element}
            resizeSticky={this.resizeSticky}
            deleteSticky={this.props.deleteElement.bind(this, element.EID)}
            contentChange={this.contentChange} />)
    })

    const saveButton = <button style={{fontSize: "20px"}} className="icon-button" onClick={this.saveBoard}>
      <FontAwesome name="floppy-o" /></button>
    const createButton = <span style={{display: "block"}}><button style={{fontSize: "20px"}} className="icon-button" onClick={this.createBoard}>
      <FontAwesome name="floppy-o" /></button></span>
    const deleteButton =<button style={{fontSize: "20px"}} className="icon-button" onClick={this.handleDelete.bind(null, this.props.boardId)}>
      <FontAwesome name="trash" /></button>
    const addUser=<button style={{fontSize: "20px"}} className="icon-button"
      onClick={this.props.changeBoardAttributes.bind(this, {showCollabForm: !this.props.boardAttributes.showCollabForm})}>
      <FontAwesome name="user" /></button>
    const publishButton=<button style={{fontSize: "20px"}} className="icon-button" onClick={this.publish.bind(this)}>
      <FontAwesome name="share" /></button>
    const shareLink=<input type="text"
      style={{
        border: 0, borderRadius: 5, outline: 0, fontSize: 12, padding: 4, paddingLeft: 5, background: "rgba(255,255,255,0.3)"
      }}
      value={`http://corkly.io/${this.props.account.username}/${this.props.slug}`} />
    const enterTitle=<span style={{display: "block"}}><strong>Please enter a title to save this board</strong></span>
    const pleaseLogin=<span style={{display: "block"}}><strong>Please login or register to save this board</strong></span>

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
      userSelect: 'none',
      zIndex: -1
    }

    return (
      <div onDoubleClick={this.addSticky} style={corkboardStyle} onDragOver={this.preventDefault} onDrop={this.handleDrop} className="corkboard-container">
        <input
          style={{
            fontSize: "30px",
            background: "none",
            border: "none",
            outline: "none",
            color: "#fff",
            borderBottom: "2px solid #000",
            fontFamily: "Lobster",
            textShadow: "1px 1px 1px #000",
            textAlign: "center"
          }}
          className="title-text"
          placeholder="title your corkly"
          type="text" value={this.props.title}
          onChange={this.titleChange.bind(this)}
          />
        {this.props.boardId ? <span style={{display: "block"}}>{saveButton}{deleteButton}{addUser}{this.props.board.public ? shareLink : publishButton}</span> : (this.props.title ? (this.props.token ? createButton : pleaseLogin): enterTitle )}
        {this.props.boardAttributes.showCollabForm ? <Collaborator /> : null}
        {this.state.imageBlob ? <Image file={this.state.imageBlob} /> : null}
        {showElements}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    account: state.account,
    board: state.board,
    boardElements: state.board.boardElements,
    boardAccounts: state.board.accounts,
    boardId: state.board.boardId,
    title: state.board.title,
    slug: state.board.slug,
    token: state.manageLogin.token,
    boardAttributes: state.boardAttributes
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addBoardElement: addBoardElement,
    updateElement: updateElement,
    createBoard: createBoard,
    deleteElement: deleteElement,
    updateBoard: updateBoard,
    updateTitle: updateTitle,
    setCurrentBoard: setCurrentBoard,
    deleteBoard: deleteBoard,
    newBoard: newBoard,
    changeBoardAttributes: changeBoardAttributes,
    publish: publish
  }, dispatch)
}

const ConnectedCorkboard = connect(mapStateToProps, mapDispatchToProps)(Corkboard)

export default ConnectedCorkboard
