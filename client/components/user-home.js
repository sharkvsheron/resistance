import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../socket'
import { Link } from 'react-router-dom'
import { getGameList, setUsersGameId } from '../store/gameList'

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getGames()
    socket.emit('syncSocketId', this.props.user.id)
  }

  render() {
    const { email } = this.props
    return (
      <div>
        <h3>Welcome, {email}</h3>
        {this.props.games.map(game => {
          return (
            <Link onClick={() => this.props.setGameId(game.id, this.props.user.id)} to={`/game/${game.id}`} key={game.id}>
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

const mapDispatch = dispatch => {
  return {
    getGames: () => dispatch(getGameList()),
    setGameId: (id, userId) => dispatch(setUsersGameId(id, userId))
  }
}

export default connect(
  mapState,
  mapDispatch
)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
