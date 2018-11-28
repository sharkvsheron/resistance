import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import socket from '../socket'

const Navbar = ({handleClick, isLoggedIn, user}) => (
  <div className="nav-container">
    <h1>Moon Marauders</h1>
    <nav>
      {isLoggedIn ? (
        <div className="nav-links">
          {/* The navbar will show these links after you log in */}
          <h3>
            <Link to="/home">home</Link>
          </h3>
          <h3>
            <a href="#" onClick={handleClick}>
              logout
            </a>
          </h3>
          <h3>
            Welcome {user.userName}! You are user: {user.id}
          </h3>
          {/* {user.gameId !== 1 && (
            <h3>
              <Link
                onClick={() => {
                  socket.emit('leaveGame', user.id)
                }}
                to="/home"
              >
                leave game
              </Link>
            </h3>
          )} */}
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
