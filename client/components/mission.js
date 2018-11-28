import React, {Component} from 'react'
export default class Mission extends Component {
  constructor(props) {
    super(props)
  }
  render() {
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
        <div className="mission-number">Mission #{this.props.index + 1}</div>
        <div className="number-players">
          People Required {this.props.numberOfPlayers}
        </div>
        <div className="other-info">{this.props.description}</div>
      </div>
    )
  }
}
