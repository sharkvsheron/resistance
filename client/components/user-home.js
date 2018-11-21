import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import socket from '../socket'
import {Link} from 'react-router-dom'
import store, {me} from '../store'

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await store.dispatch(me())
    socket.emit('getGames')
    socket.emit('syncSocketId', this.props.user.id)
  }

  render() {
    const {email} = this.props
    return (
      <div>
        <h3>Welcome, {email}</h3>
        <button
          type="submit"
          onClick={() => socket.emit('createGame', this.props.user.id)}
        >
          CREATE GAME
        </button>

        {this.props.games.map(game => {
          return (
            <Link to={`/game/${game.id}`} key={game.id}>
              Click to enter game #{game.id}
            </Link>
          )
        })}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    games: state.games
  }
}

export default connect(mapState, null)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
