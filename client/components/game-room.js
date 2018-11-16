import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import socket from '../socket'
// import {getPlayersThunk} from '../store/players'

/**
 * COMPONENT
 */
export class GameRoom extends React.Component {
  constructor(props) {
    super(props)
    console.log('this props user,', this.props.user)
  }

  componentDidMount() {}

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

// const mapDispatch = dispatch => {
//   return {
//     getPlayers: () => dispatch(getPlayersThunk())
//   }
// }

const mapState = state => ({
  user: state.user,
  players: state.players
})

export default connect(
  mapState,
  null
)(GameRoom)
