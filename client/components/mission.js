import React, {Component} from 'react'
export default class Mission extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="mission">
        <div className="mission-number">
          Mission #<br />
          {this.props.index + 1}
        </div>
        <div
          className={
            this.props.status.status === 'null'
              ? 'pending'
              : `${this.props.status.status}`
          }
          id={`mission${this.props.number}`}
        />

        <div className="number-players">
          <h4>Players Required {this.props.playersRequired}</h4>
        </div>
        <div className="other-info">{this.props.description}</div>
      </div>
    )
  }
}
