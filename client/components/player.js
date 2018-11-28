import React, {Component} from 'react'
import Video from './video'
import {connect} from 'react-redux'

const roleNames = {
  1: 'Crew Member',
  2: 'Saboteur',
  3: 'Commander',
  4: 'Bounty Hunter',
  5: 'Lieutenant',
  6: 'Morgana',
  7: 'Mordred',
  8: 'Oberon'
}
class Player extends Component {
  constructor(props) {
    super(props)
    this.getCurrentNomination = this.getCurrentNomination.bind(this)
    this.state = {}
  }

  isNominated = (userId, array) => {
    return array.includes(Number(userId)) ? 'nominated' : ''
  }

  isPlayerNominator(userId) {
    const nominationKeys = Object.keys(this.props.nominations)
    const latestNomination = Math.max(...nominationKeys)
    if (nominationKeys.length) {
      return userId === this.props.nominations[latestNomination].userId
    }
  }

  getCurrentNomination() {
    const maxKey = Math.max(...Object.keys(this.props.nominations))
    const currentNomination = this.props.nominations[maxKey]
    if (!currentNomination) return
    return currentNomination
  }

  render() {
    console.log('user in player.js ', this.props.user.id)
    console.log('playerId in player.js ', this.props.playerId)
    const {
      id,
      playerId,
      handleSelect,
      nominatedPlayers,
      isNominator,
      user
    } = this.props
    const {userName, roleId, sessionKey} = this.props.players[playerId]
    return (
      <div
        className={`player-card ${this.isNominated(playerId, nominatedPlayers)}
        ${this.isNominated(playerId, this.props.selectedPlayers)}
        nominator-${this.isPlayerNominator(Number(playerId))}`}
        id={`player${id}`}
      >
        <div className="video-wrapper" id={`role${roleId}`} />
        <h3>
          {userName} <br />UserId = {playerId}
          <br />
          {Number(playerId) === user.id && roleNames[roleId]}
        </h3>
        {isNominator && (
          <div
            onClick={() => handleSelect(playerId)}
            className="game-button nominate"
          >
            Nominate
          </div>
        )}
        <br />
        {/* <div className="game-button">waiting for others...</div>
        <div className="game-button">Add Bot</div> */}
      </div>
    )
  }
}
const mapState = state => ({
  nominations: state.nominations,
  players: state.players,
  missions: state.missions,
  visibility: state.visible,
  user: state.user
})
export default connect(mapState)(Player)
