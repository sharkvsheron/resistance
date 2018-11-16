import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../socket'
import startGameThunk from './'

/**
 * COMPONENT
 */
export class GameRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }




  render() {
    return (
      <div>
        <h3>This is the Game Room</h3>
        <button onClick={() => this.props.startGame()} >Enter GAME</button>
      </div>
    )
  }
}


const mapDispatch = dispatch => {
  return {
    startGame: dispatch(startGameThunk())
  }
}

export default connect(null, mapDispatch)(GameRoom)
