import React, {Component} from 'react'
import Mission from './mission'

// const missionInfo = [
//   { mission: 1, numberOfPlayers: 2, failsRequired: 1 },
//   { mission: 2, numberOfPlayers: 3, failsRequired: 1 },
//   { mission: 3, numberOfPlayers: 2, failsRequired: 1 },
//   { mission: 4, numberOfPlayers: 3, failsRequired: 1 },
//   { mission: 5, numberOfPlayers: 3, failsRequired: 1 },
// ]

const missionInfo = {
  1: 'succeed',
  2: 'fail',
  3: 'succeed',
  4: 'fail',
  5: 'succeed'
}

export default class MissionTracker extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(missionInfo)
    const indexs = Object.keys(missionInfo)
    return (
      <div className="mission-container">
        {indexs.map((number, i) => {
          console.log('HTHI ISN THIS MUNBER ', missionInfo[number])
          return (
            <Mission
              key={i}
              number={number}
              status={missionInfo[number]}
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
