import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import socket from '../socket'
import {Link} from 'react-router-dom'
import store, {me} from '../store'
import NewGameForm from './new-game-form'
import Game from './game'

class UserHome extends React.Component {
  constructor(props) {
    super(props)
    this.openForm = this.openForm.bind(this)
    this.state = {
      openForm: false
    }
  }
  openForm() {
    this.setState({openForm: !this.state.openForm})
  }
  async componentDidMount() {
    await store.dispatch(me())
    socket.emit('getGames')
    socket.emit('syncSocketId', this.props.user.id)
  }

  render() {
    const {email} = this.props
    const {openForm} = this.state
    return (
      <div className="user-home">
        <h3>Welcome, {email}</h3>
        {!openForm ? (
          <div className="game-button" onClick={() => this.openForm()}>
            CREATE GAME
          </div>
        ) : (
          <NewGameForm openForm={this.openForm} />
        )}
        {this.props.games.map((game, i) => (
          <Game name={game.gameName} id={game.id} key={i} />
        ))}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    games: state.games
  }
}

export default connect(mapState, null)(UserHome)
