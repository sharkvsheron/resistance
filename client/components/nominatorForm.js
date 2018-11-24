import React from 'react'

import { connect } from 'react-redux'
import socket from '../socket'
import store, { me } from '../store'

/**
 * COMPONENT
 */

class NominatorForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    const initState = {};

    for (const player in this.props.players) {
      initState[player.userId] = false
    }

    this.setState(initState)
  }

  handleInputChange(evt) {
    const target = evt.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  render() {
    console.log(this.state);
    let playerKeys = []
    if (this.state.players)
      playerKeys = Object.keys(this.state.players) // [1,2,3,4,5]
    const players = this.state.players
    return (
      <div>
        <form>
          {this.state.players && playerKeys.map(playerKey => (<label>
            {`${players[playerKey].userName}`}
            <input name={player.userId} type='checkbox' checked={this.state.player.userId} onChange={this.handleInputChange} />
          </label>))}
        </form>

      </div>

    )
  }
}

const mapState = state => ({
  user: state.user,
  players: state.players, //obj {1: {username: adam, roleId: 1}, 2: {username: russ, roleId: 2}, etc.}
  visibility: state.visible, //obj {player1: vis1, player2: vis2, etc.}
  gameResult: state.gameResult,
  video: state.video
})

export default connect(mapState, null)(NominatorForm)
