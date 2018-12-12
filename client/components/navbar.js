import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import socket from '../socket'

const modal = document.getElementsByClassName('modal')
const outside = document.getElementById('app')

window.onclick = function(event) {
  if (event.target.className === 'modal') {
    modal[0].style.display = 'none'
  }
}

const Navbar = ({handleClick, isLoggedIn, user}) => (
  <div className="nav-container">
    <h1>Moon Marauders</h1>
    <div className="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>How To Play:</h2>
        </div>
        <div class="modal-body">
          <p id="rulestext">
            Create a game and specify the roles you want to include. The default
            settings are for a standard 5 player game. <br />
            Once all players have entered the game room, you may start the game.
            At the start of the game, you will receive a role and a nominator
            will be designated at random (highlighted in orange).<br />Each
            turn, the nominator designates a certain quantity of players to go
            on a mission, all players must then vote to approve or reject the
            nominated team. If the nominated team is approved, the nominated
            players must then choose to succeed or fail the mission <br />
            <br />
            Good guys win condition: Three missions succeed AND the assassin
            incorrectly guesses who the Commander (Merlin) is. <br />
            Bad guys win condition: Three missions fail OR your team's assassin
            correctly guesses who the Commander (Merlin) is. <br />
            <br />
            Role Information: <br />
            <br />
            Crew Member: You are a good guy. You have to deduce who the bad guys
            are and do your best to prevent them from going on missions. <br />
            <br />
            Saboteur: You are a bad guy. You can see the other bad guys on your
            team. You want to convince other players that you are good so that
            you can be nominated to go on missions and secretly fail them<br />
            <br />
            Commander: You are a good guy. You see all the good guys and bad
            guys. You must discretely guide the nominators into selecting good
            guys for missions<br />
            <br />
            Assassin: You are a bad guy. You must choose who to assasinate
            should three missions succeed.<br />
          </p>
        </div>
      </div>
    </div>
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
            <a onClick={() => (modal[0].style.display = 'block')}>
              How To Play
            </a>
          </h3>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <a onClick={() => (modal[0].style.display = 'block')}>How To Play</a>
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

export default connect(
  mapState,
  mapDispatch
)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
