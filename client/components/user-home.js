import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import socket from '../socket'
import { Link } from 'react-router-dom'

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    socket.emit('syncSocketId', this.props.user.id)
  }

  render() {
    const { email } = this.props
    return (
      <div>
        <h3>Welcome, {email}</h3>
        <Link to='/game-room'>Enter Game</Link>
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
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
