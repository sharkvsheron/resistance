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
    this.isWaitingOnNominator = this.isWaitingOnNominator.bind(this)
    this.amINominator = this.amINominator.bind(this)
    this.isNominationReady = this.isNominationReady.bind(this)
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

  handleNominationSubmit() {
    console.log('clicc')
    socket.emit(
      'submitNomination',
      this.props.user.id,
      this.state.selectedPlayers
    )
    this.setState({selectedPlayers: []})
  }

  isWaitingOnNominator() {
    const latestNomination = Math.max(...Object.keys(this.props.nominations))
    console.log('highest nomination id', latestNomination)
    const currentNomination = this.props.nominations[latestNomination]
    return (
      currentNomination.nominees.length === 0 &&
      currentNomination.missionStatus === null
    )
  }

  amINominator() {
    const nominationKeys = Object.keys(this.props.nominations)
    if (nominationKeys.length) {
      const latestNomination = Math.max(...Object.keys(this.props.nominations))
      return (
        this.props.user.id === this.props.nominations[latestNomination].userId
      )
    }
    return false
  }

  isNominationReady() {
    if (this.state.selectedPlayers.length >= 2 && this.amINominator()) {
      return 'ready'
    } else {
      return 'not-ready'
    }
  }

  submitAssassination() {
    const targetId = Number(this.state.selectedPlayers[0])
    socket.emit('submitAssassination', this.props.user.id, targetId)
    this.setState({selectedPlayers: []})
  }

  render() {
    const userIds = Object.keys(this.props.players)
    // ************ Change line 73 from 1 to whatever the current nom userId is
    const nominationKeys = Object.keys(this.props.nominations)
    return (
      <div>
        {/* {this.props.gameResult !== '' && (
          <div>Game Result: {this.props.gameResult}</div>
        )} */}
        <div className="video-container">
          {this.props.video.sessionId.length &&
            this.props.video.sessionKey.length && <Video />}
        </div>
        {this.amINominator() && (
          <div className="nominator-info">
            <p>
              You are the nominator. Nominate 2 players to go on a mission.
              Don't eff this up
            </p>
          </div>
        )}
        {nominationKeys.length &&
          this.isWaitingOnNominator() && (
            <div className="nominator-info">
              We are waiting on the nominator:
            </div>
          )}
        <div className="player-container">
          {userIds.map((playerId, i) => (
            <Player
              key={i}
              player={this.props.players[playerId]}
              id={i}
              playerId={playerId}
              nominatedPlayers={this.state.selectedPlayers}
              handleSelect={this.handleSelect}
              isNominator={this.amINominator()}
            />
          ))}
        </div>
        {this.amINominator() && (
          <div
            className={`game-button submit-nomination ${this.isNominationReady()}`}
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
        {
          //comment out up till === 'active' for testing purposes
          this.props.assassination.assassinationStatus === 'active' && <div
          className="game-button submit-assassination"
          onClick={() => this.submitAssassination()}
        >
          SUBMIT ASSASSINATION
        </div>}
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
  missions: state.missions,
  assassination: state.assassination
})

export default connect(
  mapState,
  null
)(GameRoom)
