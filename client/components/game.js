import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class Game extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="game-card" img="/images/space-background.jpg">
        <Link to={`/game/${this.props.id}`} key={this.props.id}>
          <button className="game-button">
            Enter Game {this.props.name} #{this.props.id}
          </button>
        </Link>
      </div>
    )
  }
}
