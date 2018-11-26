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
    // # of players can only go up to # of players in mission type
    //
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

  render() {
    const userIds = Object.keys(this.props.players)
    const nominationKeys = Object.keys(this.props.nominations)
    const latestNominationNumber = Math.max(
      ...Object.keys(this.props.nominations)
    )
    const latestNomination = this.props.nominations[latestNominationNumber]
    console.log('latest nomination ', latestNomination)
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
        {!this.props.nominations[1] && (
          <div
            className="game-button"
            id="startgame-button"
            onClick={() => this.startGame(this.props.user.id)}
          >
            START Game
          </div>
        )}

        <div className="nomination-vote-container">
          <div
            className="game-button"
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'approve')
            }
          >
            APPROVE
          </div>
          <div
            className="game-button"
            onClick={async () =>
              socket.emit('submitNominationVote', this.props.user.id, 'reject')
            }
          >
            REJECT
          </div>
        </div>
        <div className="mission-vote-container">
          <div
            className="game-button"
            onClick={async () =>
              socket.emit('submitMissionVote', this.props.user.id, 'success')
            }
          >
            SUCCESS
          </div>
          <div
            className="game-button"
            onClick={async () =>
              socket.emit('submitMissionVote', this.props.user.id, 'fail')
            }
          >
            FAIL
          </div>
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

export default connect(mapState, null)(GameRoom)
