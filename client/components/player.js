import React, {Component} from 'react'
import Video from './video'
import {connect} from 'react-redux'

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
    const {
      id,
      playerId,
      handleSelect,
      nominatedPlayers,
      isNominator
    } = this.props
    const {userName, roleId, sessionKey} = this.props.player
    return (
      <div
        className={`player-card ${this.isNominated(playerId, nominatedPlayers)}
        nominator-${this.isPlayerNominator(Number(playerId))}`}
        id={`player${id}`}
      >
        <div className="video-wrapper" id={`role${roleId}`} />
        <h3>
          {userName} <br />UserId = {playerId}
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
  nominations: state.nominations
})
export default connect(mapState)(Player)
