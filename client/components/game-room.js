import React from 'react'
import PropTypes from 'prop-types'
import MissionTracker from './missionTracker'
import Player from './player'
import Video from './video'
import {connect} from 'react-redux'
import socket from '../socket'
import NominatorForm from './nominatorForm'
import store, {me} from '../store'
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react'

/**
 * COMPONENT
 */
socket.on('startGame', startingState => {
  console.log(startingState)
})

export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {selectedPlayers: []}
    this.startGame = this.startGame.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.isNominator = this.isNominator.bind(this)
  }

  async componentDidMount() {
    await store.dispatch(me())
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

  handleSelect(playerId) {
    if (this.state.selectedPlayers.includes(playerId)) {
      const newSelectedPlayers = [...this.state.selectedPlayers].filter(
        id => id !== playerId
      )
      if (newSelectedPlayers.length <= 2) {
        this.setState({selectedPlayers: newSelectedPlayers})
      }
    } else {
      this.setState({
        selectedPlayers: [...this.state.selectedPlayers, playerId]
      })
    }
  }

  isNominator(userId) {
    return userId === 1
  }

  handleNominationSubmit() {
    console.log('clicc')
    socket.emit(
      'submitNomination',
      this.props.user.id,
      this.state.selectedPlayers
    )
  }

  render() {
    const userIds = Object.keys(this.props.players)
    // ************ Change line 73 from 1 to whatever the current nom userId is
    const amINominator = this.props.user.id === 1
    const isNominationReady = () => {
      if (this.state.selectedPlayers.length === 2 && amINominator) {
        return 'ready'
      } else {
        return 'not-ready'
      }
    }

    console.log(this.props.user.id === 1)
    return (
      <div>
        {/* {this.props.gameResult !== '' && (
          <div>Game Result: {this.props.gameResult}</div>
        )} */}
        <div className="video-container">
          {this.props.video.sessionId.length &&
            this.props.video.sessionKey.length && <Video />}
        </div>
        {amINominator && (
          <div className="nominator-info">
            <p>
              You are the nominator. Nominate 2 players to go on a mission.
              Don't eff this up
            </p>
          </div>
        )}
        {}
        <div className="player-container">
          {userIds.map((playerId, i) => (
            <Player
              key={i}
              player={this.props.players[playerId]}
              id={i}
              playerId={playerId}
              nominatedPlayers={this.state.selectedPlayers}
              handleSelect={this.handleSelect}
              isNominator={amINominator}
            />
          ))}
        </div>
        {amINominator && (
          <div
            className={`game-button submit-nomination ${isNominationReady()}`}
            onClick={() => this.handleNominationSubmit()}
          >
            SUBMIT NOMINATION
          </div>
        )}
        <MissionTracker {...this.props} />
        <button onClick={() => this.startGame(this.props.user.id)}>
          START Game
        </button>

        <div className="nomination-vote-container">
          <button
            type="submit"
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'approve')
            }
          >
            Approve
          </button>
          <button
            type="submit"
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'reject')
            }
          >
            Reject
          </button>
        </div>
        <div className="nominate-form">
          <NominatorForm players={this.props.players} />
        </div>
        <button
          type="submit"
          onClick={async () =>
            socket.emit('submitMissionVote', this.props.user.id, 'success')
          }
        >
          SUCCESS
        </button>
        <button
          type="submit"
          onClick={async () =>
            socket.emit('submitMissionVote', this.props.user.id, 'fail')
          }
        >
          FAIL
        </button>
        <div
          className="game-button submit-nomination"
          onClick={() => this.handleNominationSubmit()}
        >
          SUBMIT NOMINATION
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user,
  players: state.players, //obj {1: {username:adam, roleId: 1}, 2: {username:russ, roleId: 2}, etc.}
  visibility: state.visible, //obj {player1: vis1, player2: vis2, etc.}
  gameResult: state.gameResult,
  video: state.video,
  nominations: state.nominations,
  nominationVotes: state.nominationVotes,
  missions: state.missions
})

export default connect(
  mapState,
  null
)(GameRoom)
