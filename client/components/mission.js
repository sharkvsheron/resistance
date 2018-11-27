import React, {Component} from 'react'
export default class Mission extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(`props in mission`, this.props)
    return (
      <div className="mission">
        <div
          className={
            this.props.status.status === 'null'
              ? 'pending'
              : `${this.props.status.status}`
          }
          id={`mission${this.props.number}`}
        />
        <div className="mission-number">Mission #{this.props.mission}</div>
        <div className="number-players">
          People Required {this.props.numberOfPlayers}
        </div>
        <div className="mission-status">Mission Pass/Fail</div>
        <div className="other-info">OTHER INFO</div>
      </div>
    )
  }
}
