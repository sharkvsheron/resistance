import React, {Component} from 'react'
import socket from '../socket'

export default class NewGameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: '',
      numberOfPlayers: 0,
      roles: {
        5: {
          name: 'Percival',
          selected: false
        },
        6: {
          name: 'Morgana',
          selected: false
        },
        7: {
          name: 'Mordred',
          selected: false
        },

        8: {
          name: 'Oberon',
          selected: false
        }
      }
    }
    this.handleChecked = this.handleChecked.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChecked(event) {
    const target = event.target
    const id = target.id
    const newState = this.state
    newState.roles[id].selected = !newState.roles[id].selected
    this.setState({newState})
  }
  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({[name]: value})
  }
  handleSubmit() {
    socket.emit('createGame', this.props.user.id, this.state)
  }
  componentDidMount() {}

  render() {
    const roleArray = Object.values(this.state.roles)
    console.log(this.state)
    return (
      <div>
        <h2>Custom Game </h2>
        <br />
        <br />
        <br />
        <form>
          <label>
            Game Name:
            <input
              type="text"
              name="gameName"
              value={this.state.gameName}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Number of PLayers:
            <input
              type="number"
              name="numberOfPlayers"
              min="5"
              max="12"
              value={this.state.numberOfPlayers}
              onChange={this.handleChange}
            />
          </label>
          {roleArray.map((role, i) => (
            <label key={i}>
              {role.name}
              <input
                name={role.name}
                type="checkbox"
                onChange={this.handleChecked}
                id={i + 5}
              />
            </label>
          ))}
        </form>
        <button type="submit" onClick={this.handleSubmit}>
          CREATE NEW GAME
        </button>
      </div>
    )
  }
}
