import React, {Component} from 'react'
import Mission from './mission'
import {connect} from 'react-redux'
import socket from '../socket'

// const missionInfo = [
//   { mission: 1, numberOfPlayers: 2, failsRequired: 1 },
//   { mission: 2, numberOfPlayers: 3, failsRequired: 1 },
//   { mission: 3, numberOfPlayers: 2, failsRequired: 1 },
//   { mission: 4, numberOfPlayers: 3, failsRequired: 1 },
//   { mission: 5, numberOfPlayers: 3, failsRequired: 1 },
// ]

class MissionTracker extends Component {
  constructor(props) {
    super(props)
  }

  leaveGame(userId) {
    socket.emit('leaveGame', userId)
    this.props.history.push('/home')
  }
  render() {
    const indexs = Object.keys(this.props.missions)
    // console.log('Props in mission tracker', this.props)
    return (
      <div className="mission-container">
        {indexs.map((number, i) => {
          return (
            <Mission
              key={i}
              number={number}
              status={this.props.missions[number]}
              // numberOfPlayers={single.numberOfPlayers}
              // failsRequired={single.failsRequired}
              {...this.props}
            />
          )
        })}
        <div
          className="game-button leave-game"
          onClick={() => this.leaveGame(this.props.user.id)}
        >
          LEAVE GAME
        </div>
      </div>
    )
  }
}

const mapToState = state => ({
  missions: state.missions,
  user: state.user
})

export default connect(mapToState)(MissionTracker)
