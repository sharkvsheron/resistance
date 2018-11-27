import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import socket from '../socket'

export default class NewGameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: 'The Ulysses Mission',
      numberOfPlayers: 5,
      missions: [1, 2, 3, 4, 5],
      roles: [
        {
          name: 'Commander / Merlin',
          selected: false,
          id: 3
        },
        {
          name: 'HAL 9000 / Percival',
          selected: false,
          id: 5
        },
        {
          name: 'Symbiote / Morgana',
          selected: false,
          id: 6
        },
        {
          name: ' Mangalord / Mordred',
          selected: false,
          id: 7
        },
        {
          name: 'Doppelganger / Oberon',
          selected: false,
          id: 8
        }
      ]
    }

    this.handleChecked = this.handleChecked.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChecked(event) {
    const target = event.target
    const id = target.id
    const newState = {...this.state}
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
    const {gameName, numberOfPlayers, roles, missions} = this.state
    const additionalRoles = roles.filter(role => role.selected)
    socket.emit(
      'createGame',
      gameName,
      numberOfPlayers,
      additionalRoles,
      missions
    )
    this.props.openForm()
  }

  componentDidMount() {}

  render() {
    const roleArray = Object.values(this.state.roles)
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
                id={i}
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
