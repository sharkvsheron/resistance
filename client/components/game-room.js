import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../socket'
// import startGameThunk from './'

/**
 * COMPONENT
 */
export class GameRoom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.props.getPlayers()
  }

  render() {
    return (
      <div>
        <h3>This is the Game Room</h3>
        <button onClick={() => socket.emit('startGame', this.props.user.id)}>
          START Game
        </button>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getPlayers: () => { dispatch(getPlayersThunk()) }
  }
}

const mapState = state => ({
  user: state.user,
  players: state.players
})


export default connect(
  mapState,
  mapDispatch
)(GameRoom)
