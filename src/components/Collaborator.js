import React from 'react'
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeBoardAttributes, addCollaborator, findCollaborator, addError } from '../actions'
import axios from 'axios'
import FontAwesome from 'react-fontawesome';
import {CorklyApi} from './constants'
class Collaborator extends React.Component{
  constructor(props){
    super(props)

    this.state={
      collaborator: '',
      collaboratorName: '',
      collaboratorId: null
    }
  }

  handleChange(e){
    this.setState({
      collaborator: e.target.value
    })
  }

  getCollab(token, email){
    return(axios
      .get(`${CorklyApi}/findaccount?email=${email}`, {
        headers:
        {token: token}
      }))
  }

  handleSubmit(e){
    e.preventDefault()
    this.getCollab(this.props.token, this.state.collaborator).then((data)=>{
      this.setState({
        collaboratorName: data.data.username,
        collaboratorId: data.data.id
      })
    }).catch(()=>{
      this.props.addError("Couldn't find user")
      setTimeout(()=>{this.props.addError("")}, 2000)
    })
  }

  addCollab(){
    this.props.addCollaborator(this.props.token, {
      id: this.props.boardId,
      account_id: this.state.collaboratorId
    })
    this.toggleCollabForm()
    this.setState({
      collaboratorName: '',
      collaboratorId: null
    })
  }

  toggleCollabForm(){
    this.props.changeBoardAttributes({showCollabForm: !this.props.boardAttributes.showCollabForm})
  }

  render(){
    const style={
      div: {
        background: "#000",
        position: "relative",
        margin: "auto",
        padding: 20,
        borderRadius: 10,
        color: "#fff",
        zIndex: 1000,
        boxShadow: "1px 1px 1px rgba(0,0,0,0.3)",
        display: "inline-block"
      }, form: {
        marginTop: 5
      }, h2: {
        fontFamily: "Lobster",
        fontSize: 20,
        padding: 0,
        margin: 0
      }, input: {
        background: "#fff",
        border: 0,
        outline: 0,
        padding: 10,
        color: "#00bcd4",
      }, button: {
        background: "#00bcd4",
        border: 0,
        outline: 0,
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
        color: "#fff"
      }
    }

    let findcollab=<div><input style={style.input} placeholder="Collaborator Email" className="collaborator-input" type="email" onChange={this.handleChange.bind(this)} />
    <button style={style.button} type="submit">Search</button></div>

    let verifycollab=<div>{this.state.collaboratorName}
      <button style={style.button} onClick={this.addCollab.bind(this)}>ADD</button></div>
    return (
      <div style={style.div}>
        <button onClick={this.toggleCollabForm.bind(this)}
          style={{float: "right", background: "none", color: "#fff", border: "none", outline: "none", padding: 0, margin: 0, marginTop: -10, marginRight: -10 }}>
          <FontAwesome name="close" /></button>
        <h2 style={style.h2}>Add a Collaborator</h2>
        <form style={style.form} onSubmit={this.handleSubmit.bind(this)}>
          {this.props.boardAttributes.error ? <div>{this.props.boardAttributes.error}</div>: null}
          {!!this.state.collaboratorName ? verifycollab : findcollab}
        </form>
        {this.props.board.accounts.map((collab)=>{
          return <span style={{display: "block", marginTop: 5}}>{collab.username} {collab.id==this.props.account.id ? "(you)":null}</span>
        })}
      </div>)
  }
}

const mapStateToProps=(state)=>{
  return({
    board: state.board,
    boardId: state.board.boardId,
    token: state.manageLogin.token,
    boardAttributes: state.boardAttributes,
    account: state.account
  })
}

const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({
    addCollaborator: addCollaborator,
    findCollaborator: findCollaborator,
    changeBoardAttributes: changeBoardAttributes,
    addError: addError
  }, dispatch)
}

const ConnectedCollaborator = connect(mapStateToProps, mapDispatchToProps)(Collaborator)

export default ConnectedCollaborator
