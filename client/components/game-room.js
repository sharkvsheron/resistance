import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import socket from '../socket'
import {getOtherPlayersInRoom} from '../store/players'

/**
 * COMPONENT
 */
export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    console.log('this props user,', this.props.user)
  }

  componentDidMount() {
    this.props.getPlayers(this.props.user.id)
  }

  render() {
    return (
      <div>
        <h3>This is the Game Room</h3>
        {this.props.players.length > 0 &&
          this.props.players.map(player => {
            return <div>{player.email}</div>
          })}
        <button onClick={() => socket.emit('startGame', this.props.user.id)}>
          START Game
        </button>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  getPlayers: userId => dispatch(getOtherPlayersInRoom(userId))
})

const mapState = state => ({
  user: state.user,
  players: state.players
})

export default connect(
  mapState,
  mapDispatch
)(GameRoom)
