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
  console.log(startingState)
})

export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    this.players = [
      {
        socketId: 12345,
        userName: 'russell',
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
    this.startGame = this.startGame.bind(this)
  }

  componentDidMount() {}

  async startGame(userId) {
    await socket.emit('startGame', userId)
    await socket.emit('getVisibility', userId)

    console.log('second fn invoked on component startGame')
  }

  render() {
    return (
      <div>
        <h3>This is the Game Room</h3>
        <div className="player-container">
          {this.players.map((player, i) => (
            <Player key={i} player={player} id={i} />
          ))}
        </div>
        <div className="footer">
          <MissionTracker />
        </div>

        {this.props.players.length > 0 &&
          this.props.players.map(player => {
            return <div>{player.email}</div>
          })}
        <button onClick={() => this.startGame(this.props.user.id)}>
          START Game
        </button>
        <button
          type="submit"
          onClick={async () =>
            socket.emit('submitVote', this.props.user.id, 'succeed')
          }
        >
          SUCCESS
        </button>
        <button
          type="submit"
          onClick={async () =>
            socket.emit('submitVote', this.props.user.id, 'fail')
          }
        >
          FAIL
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
  players: state.players,
  visibility: state.visible //obj {player1: vis1, player2: vis2, etc.}
})

export default connect(mapState, mapDispatch)(GameRoom)
