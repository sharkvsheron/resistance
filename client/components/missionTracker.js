import React, { Component } from 'react'
import Mission from './mission'

const missionInfo = [
  { mission: 1, numberOfPlayers: 2, failsRequired: 1 },
  { mission: 2, numberOfPlayers: 3, failsRequired: 1 },
  { mission: 3, numberOfPlayers: 2, failsRequired: 1 },
  { mission: 4, numberOfPlayers: 3, failsRequired: 1 },
  { mission: 5, numberOfPlayers: 3, failsRequired: 1 },
]
export default class MissionTracker extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='mission-container'>
        {missionInfo.map((single, i) => {
          return (<Mission
            key={i}
            mission={single.mission}
            numberOfPlayers={single.numberOfPlayers}
            failsRequired={single.failsRequired} {...this.props} />)
        })}
      </div>
    )
  }
}
