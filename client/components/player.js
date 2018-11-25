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
    console.log('this is props: ', this.props)
    const handleSelectForNominatorOnly = isNominator
      ? () => handleSelect(playerId)
      : () => alert('You are not the nominator')
    // console.log('props in player.js ', this.props)
    return (
      <div
        className={`player-card ${this.isNominated(
          playerId,
          nominatedPlayers
        )}`}
        id={`player${id}`}
        onClick={handleSelectForNominatorOnly}
      >
        <div className="videoWrapper" id={`role${roleId}`} />
        <h3>{userName}</h3>
        {/* <h3>role id: {roleId}</h3> */}
        <div className="game-button nominate">Nominate</div>
        <button type="submit">WAITING FOR PLAYER TO JOIN</button>
        <div>
          <button type="submit">ADD BOT</button>
        </div>
      </div>
    )
  }
}
// const mapState = state => ({
//   user: state.user,
//   video: state.video
// })
// export default connect(mapState, null)(Player)
