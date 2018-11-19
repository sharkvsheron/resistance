import React from 'react'
import PropTypes from 'prop-types'
import MissionTracker from './missionTracker'
import Player from './player'
import {connect} from 'react-redux'
import socket from '../socket'
import {getOtherPlayersInRoom} from '../store/players'

/**
 * COMPONENT
 */
socket.on('startGame', startingState => {
  console.log(startingState);
})

export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    this.players = [
      {
        socketId: 12345,
        userName: 'russel',
        email: 'r@r.com',
        password: '123',
        gameId: 1,
        roleId: 3
      },
      {
        socketId: 23456,
        userName: 'adam',
        email: 'a@a.com',
        password: '123',
        gameId: 1,
        roleId: 2
      },
      {
        socketId: 34567,
        userName: 'khalid',
        email: 'k@k.com',
        password: '123',
        gameId: 1,
        roleId: 1
      },
      {
        socketId: 45678,
        userName: 'peter',
        email: 'p@p.com',
        password: '123',
        gameId: 1,
        roleId: 2
      },
      {
        socketId: 56789,
        userName: 'bot',
        email: 'b@b.com',
        password: '123',
        gameId: 1,
        roleId: 1
      }
    ]
    console.log('this props user,', this.props.user)
  }

  componentDidMount() {
    this.props.getPlayers(this.props.user.id)
  }

  render() {
    console.log('JOIIUHUHOIUHUJBB', this.players)
    return (
      <div>
        <div className="player-container">
          {this.players.map((player, i) => (
            <Player key={i} player={player} id={i} />
          ))}
        </div>

        <MissionTracker />
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

export default connect(mapState, mapDispatch)(GameRoom)
