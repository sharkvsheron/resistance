import React from 'react'
import PropTypes from 'prop-types'
import MissionTracker from './missionTracker'
import Player from './player'
import Video from './video'
import { connect } from 'react-redux'
import socket from '../socket'
import store, { me } from '../store'
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react'

/**
 * COMPONENT
 */
socket.on('startGame', startingState => {
  console.log(startingState)
})

export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    this.startGame = this.startGame.bind(this)
  }

  async componentDidMount() {
    await store.dispatch(me())
    console.log(this.props.user)
    await socket.emit(
      'joinGame',
      this.props.user.id,
      this.props.match.params.id
    )
    // await socket.emit('getPlayers', this.props.user.id)
    // await socket.emit('getVisibility', this.props.user.id)
  }

  async startGame(userId) {
    socket.emit('startGame', userId)
    // await socket.emit('getVisibility', userId)
  }

  render() {
    const userIds = Object.keys(this.props.players)

    return (
      <div>
        {this.props.gameResult !== '' && (
          <div>Game Result: {this.props.gameResult}</div>
        )}
        <h3>This is the Game Room</h3>
        <div>
          {this.props.video.sessionId.length &&
            this.props.video.sessionKey.length && <Video />}
        </div>
        <div className="player-container">
          {userIds.map((playerId, i) => (
            <Player key={i} player={this.props.players[playerId]} id={i} />
          ))}
        </div>
        <MissionTracker {...this.props} />
        <button onClick={() => this.startGame(this.props.user.id)}>
          START Game
        </button>
        <div className='nomination-vote-container'>
          <button type='submit'
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'approve')
            }
          >Approve</button>
          <button type='submit'
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'reject')
            }
          >Reject</button>
        </div>
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

const mapState = state => ({
  user: state.user,
  players: state.players, //obj {1: {username:adam, roleId: 1}, 2: {username:russ, roleId: 2}, etc.}
  visibility: state.visible, //obj {player1: vis1, player2: vis2, etc.}
  gameResult: state.gameResult,
  video: state.video
})

export default connect(mapState, null)(GameRoom)
