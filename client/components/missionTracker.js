import React, {Component} from 'react'
import Mission from './mission'
export default class MissionTracker extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <Mission />
        <Mission />
        <Mission />
        <Mission />
        <Mission />
      </div>
    )
  }
}
