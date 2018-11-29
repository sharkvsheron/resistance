import React, {Component} from 'react'
import Video from './video'
import {connect} from 'react-redux'
import {roleNames} from '../lore'

class Player extends Component {
  constructor(props) {
    super(props)
    this.getCurrentNomination = this.getCurrentNomination.bind(this)
    this.state = {}
    this.isSelected = this.isSelected.bind(this)
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

  isSelected(bool) {
    if (bool) return 'nominated'
    return 'notnominated'
  }

  amIAssassin() {
    return this.props.players[this.props.user.id].roleId === 4
  }

  render() {
    console.log('am I assassin? ', this.amIAssassin())
    const {
      id,
      playerId,
      handleSelect,
      nominatedPlayers,
      isNominator,
      selected,
      user
    } = this.props
    const {userName, roleId, sessionKey} = this.props.players[playerId]
    return (
      <div
        className={`player-card ${this.isNominated(playerId, nominatedPlayers)}
        ${this.isSelected(selected)}
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
        {this.amIAssassin() &&
          this.props.assassination.assassinationStatus === 'active' && (
            <div
              className="game-button submit-assassination"
              onClick={() => this.props.submitAssassination(playerId)}
            >
              SUBMIT ASSASSINATION
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
  user: state.user,
  assassination: state.assassination
})
export default connect(mapState)(Player)
