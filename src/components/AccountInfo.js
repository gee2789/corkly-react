import React from 'react';
import { Link } from 'react-router-dom'
import {  bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BoardItem from './BoardItem'
import {push} from 'react-router-redux'
import FontAwesome from 'react-fontawesome';

import { setUser, setCurrentBoard, newBoard, login, logout, register, clearUser} from '../actions'


class AccountInfo extends React.Component {

  componentWillMount(){
    if (this.props.token){
      this.props.setUser(this.props.token)
    }
  }

  componentDidUpdate(prevProps, prevState){
     if(this.props.token && prevProps.token !== this.props.token){
       this.props.setUser(this.props.token)
     }
   }

  logOut(){
    this.props.push('/')
    this.props.logout()
    this.props.clearUser()
    this.props.newBoard()
  }


  render() {
    let account = this.props.account
    if (account){
      return (

      <div>
        <div style={{position: "relative", paddingLeft: 10, paddingRight: 10, textAlign: "left"}}>
          <span style={{width: "100%", fontSize: 20}}>Welcome, {account.username.charAt(0).toUpperCase() + account.username.slice(1)}
            <button data-tip="Log out" data-for="sidebar" style={{float: "right", fontSize: 20, background: "none", color: "#fff", border: 0, outline: 0}} onClick={this.logOut.bind(this)}>
              <FontAwesome name="power-off"/>
            </button>
          </span>
        </div>
      <hr />
      <h2 style={{fontFamily: "Lobster", border: 0, margin: 0}}>Your Boards</h2>
        {account.boards.map((board, index)=>{
          let boardUrl = `/${this.props.account.username}/b/${board.id}`
          return (
            <Link key={index} to={boardUrl}>
              <BoardItem board={board} />
            </Link>
          )
        })}
      </div>)
  } else {
    return null
  }
}
}

const mapStateToProps = (state) => {
  return ({
    token: state.manageLogin.token,
    account: state.account,
    boardId: state.board.boardId
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setUser: setUser,
    newBoard: newBoard,
    setCurrentBoard: setCurrentBoard,
    login: login,
    logout: logout,
    register: register,
    clearUser: clearUser,
    push: push
  }, dispatch)
}

const ConnectedAccountInfo = connect(mapStateToProps, mapDispatchToProps)(AccountInfo)

export default ConnectedAccountInfo
