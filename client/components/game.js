import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class Game extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Link to={`/game/${this.props.id}`} key={this.props.id}>
        <div className="game-card">
          <h3 className="card-title">
            Enter Game {this.props.name} #{this.props.id}
          </h3>
        </div>
      </Link>
    )
  }
}
