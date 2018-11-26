import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import socket from '../socket'
import {Link} from 'react-router-dom'
import store, {me} from '../store'
import NewGameForm from './new-game-form'

/**
 * COMPONENT
 */
class UserHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openForm: false
    }
  }
  openForm() {
    this.setState({openForm: !this.state.openForm})
  }
  async componentDidMount() {
    await store.dispatch(me())
    socket.emit('getGames')
    socket.emit('syncSocketId', this.props.user.id)
  }

  render() {
    const {email} = this.props
    const {openForm} = this.state
    console.log('THIS IS THE OPEN FORM ', this.state.openForm)
    return (
      <div>
        <h3>Welcome, {email}</h3>
        {!openForm ? (
          <button type="submit" onClick={() => this.openForm()}>
            CREATE GAME
          </button>
        ) : (
          <NewGameForm />
        )}

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

{
  /* <Row>
    <Input name='group1' type='checkbox' value='red' label='Red' />
    <Input name='group1' type='checkbox' value='yellow' label='Yellow' defaultValue='checked' />
    <Input name='group1' type='checkbox' value='green' label='Green' className='filled-in' defaultChecked='checked' />
    <Input name='group1' type='checkbox' value='brown' label='Brown' disabled='disabled' />
</Row> */
}
