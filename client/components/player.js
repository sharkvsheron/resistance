import React, {Component} from 'react'
import Video from './video'
import {connect} from 'react-redux'

export default class Player extends Component {
  constructor(props) {
    super(props)
  }

  isNominated = (userId, array) => {
    return array.includes(userId) ? 'nominated' : ''
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

    const handleSelectForNominatorOnly = isNominator
      ? () => handleSelect(playerId)
      : () => alert('You are not the nominator')

    const nominatorClass = isNominator && playerId === 1 ? 'nominator' : ''
    console.log(this.props)
    return (
      <div
        className={`player-card ${this.isNominated(
          playerId,
          nominatedPlayers
        )} nominator-${playerId === '1'}`}
        id={`player${id}`}
        onClick={() => handleSelect(playerId)}
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
// const mapState = state => ({
//   user: state.user,
//   video: state.video
// })
// export default connect(mapState, null)(Player)
