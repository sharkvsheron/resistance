import React, {Component} from 'react'
import Mission from './mission'
import {connect} from 'react-redux'

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
      </div>
    )
  }
}

const mapToState = state => ({
  missions: state.missions
})

export default connect(mapToState)(MissionTracker)
