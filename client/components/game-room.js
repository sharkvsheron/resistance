import React from 'react'
import PropTypes from 'prop-types'
import MissionTracker from './missionTracker'
import NominationVoteButtons from './nomination-vote-buttons'
import MissionVoteButtons from './mission-vote-buttons'
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
    this.getCurrentNomination = this.getCurrentNomination.bind(this)
    this.isNominationStage = this.isNominationStage.bind(this)
    this.isVotingStage = this.isVotingStage.bind(this)
    this.isMissionStage = this.isMissionStage.bind(this)
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

  getCurrentNomination() {
    const maxKey = Math.max(...Object.keys(this.props.nominations))
    const currentNomination = this.props.nominations[maxKey]
    if (currentNomination === undefined) return {nominees: []}
    return currentNomination
  }

  getNumPlayersRequiredForMission() {
    let playersReq
    for (let prop in this.props.missions) {
      console.log(this.props.missions[prop])
      if (this.props.missions[prop].status === 'null') {
        playersReq = this.props.missions[prop].playersRequired
        break
      }
    }
    return playersReq
  }

  isNominationStage() {
    const currentNomination = this.getCurrentNomination()
    if (!currentNomination) return false
    return currentNomination.nominees.length === 0
    // Nominees have not yet been selected, Nominator is in nomination selection process.
  }

  isVotingStage() {
    const currentNomination = this.getCurrentNomination()
    if (!currentNomination) return false

    return (
      !this.isNominationStage() && currentNomination.nominationStatus === null
    )
    // nominees have been selected, all users should see the currently selected nominees and Approve/Reject buttons
  }

  isMissionStage() {
    const currentNomination = this.getCurrentNomination()
    if (!!currentNomination) return false
    return !this.isVotingStage() && currentNomination.missionStatus === null
    // Nominees should see succeed/fail buttons. Non-nominated players should see 'waiting for succeed/fail' and should still see nomination status borders.
  }

  handleSelect(playerId) {
    // # of players can only go up to # of players in mission type
    //
    const latestNomination = Math.max(...Object.keys(this.props.nominations))
    if (
      this.state.selectedPlayers.length <
      this.props.missions[
        this.props.nominations[latestNomination].missionTypeId
      ].playersRequired
    ) {
      this.setState({
        selectedPlayers: [...this.state.selectedPlayers, playerId]
      })
    }
    if (this.state.selectedPlayers.includes(playerId)) {
      const newSelectedPlayers = [...this.state.selectedPlayers].filter(id => {
        return id !== playerId
      })
      this.setState({selectedPlayers: newSelectedPlayers})
    }
  }

  handleNominationSubmit() {
    socket.emit(
      'submitNomination',
      this.props.user.id,
      this.state.selectedPlayers
    )
    this.setState({selectedPlayers: []})
  }

  isWaitingOnNominator() {
    const latestNomination = Math.max(...Object.keys(this.props.nominations))
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

  amIOnMission() {
    const currentNomination = this.getCurrentNomination()
    if (currentNomination === undefined) return false
    if (Object.keys(currentNomination).length === 0) return false
    else {
      return (
        this.getCurrentNomination().nominees.includes(this.props.user.id) &&
        this.isMissionStage()
      )
    }
  }

  isNominationReady() {
    const latestNomination = Math.max(...Object.keys(this.props.nominations))
    const playersRequiredForMission =
      this.props.missions[
        this.props.nominations[latestNomination].missionTypeId
      ].playersRequired || 0
    // the num 2 in 105 needs to be taken from mission type
    if (
      this.state.selectedPlayers.length === playersRequiredForMission &&
      this.amINominator()
    ) {
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
    const nominationKeys = Object.keys(this.props.nominations)
    const latestNominationNumber = Math.max(
      ...Object.keys(this.props.nominations)
    )
    const latestNomination = this.props.nominations[latestNominationNumber]
    return (
      <div>
        <div className="video-container">
          {this.props.video.sessionId.length &&
            this.props.video.sessionKey.length && <Video />}
        </div>
        {this.amIOnMission() && (
          <div className="nominator-info">You're on the mission, glhf.</div>
        )}
        {this.amINominator() &&
          this.isNominationStage() && (
            <div className="nominator-info">
              <p>
                You are the nominator. Nominate
                {this.getNumPlayersRequiredForMission()} players to go on a
                mission. Don't eff this up
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
          {userIds.map((playerId, i) => {
            return (
              <Player
                key={i}
                player={this.props.players[playerId]}
                id={i}
                playerId={playerId}
                nominatedPlayers={
                  this.getCurrentNomination().nominees.length
                    ? this.getCurrentNomination().nominees
                    : this.state.selectedPlayers
                }
                selectedPlayers={this.state.selectedPlayers}
                handleSelect={this.handleSelect}
                isNominator={this.amINominator()}
              />
            )
          })}
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
        {(this.props.nominations[0] ||
          Object.keys(this.props.nominations).length === 0) && (
          <div
            className="game-button"
            id="startgame-button"
            onClick={() => this.startGame(this.props.user.id)}
          >
            START Game
          </div>
        )}
        {this.isVotingStage() && (
          <NominationVoteButtons id={this.props.user.id} />
        )}
        <MissionVoteButtons id={this.props.user.id} />
        {//comment out up till === 'active' for testing purposes
        this.props.assassination.assassinationStatus === 'active' && (
          <div
            className="game-button submit-assassination"
            onClick={() => this.submitAssassination()}
          >
            SUBMIT ASSASSINATION
          </div>
        )}
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
