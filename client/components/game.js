import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class Game extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="game-card">
        <Card
          style={{'max-height': '82%'}}
          className="small"
          header={
            <CardTitle image="images/space-background.jpg">
              GAME ROOM # {this.props.game.id}
            </CardTitle>
          }
          actions={[
            <Link to={`/game/${this.props.game.id}`} key={this.props.game.id}>
              Click to enter game #{this.props.game.id}
            </Link>
          ]}
        >
          {' '}
        </Card>
      </div>
    )
  }
}
