import React, { Component } from 'react'
export default class Mission extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log('this.props should be everything ', this.props)
    return (
      <div className="mission">
        <div className="pending" id={`mission${this.props.mission}`}></div>
        <div className="mission-number">Mission #{this.props.mission}</div>
        <div className="number-players">People Required {this.props.numberOfPlayers}</div>
        <div className="mission-status">Mission Pass/Fail</div>
        <div className="other-info">OTHER INFO</div>
      </div>
    )
  }
}
