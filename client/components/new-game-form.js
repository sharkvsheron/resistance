import React, {Component} from 'react'
import socket from '../socket'

export default class NewGameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameName: 'The Ulysses Mission',
      numberOfPlayers: 5,
      roleArray: [],
      missions: [
        {
          numberOfPlayers: 2,
          failsRequired: 1
        },
        {
          numberOfPlayers: 3,
          failsRequired: 1
        },
        {
          numberOfPlayers: 2,
          failsRequired: 1
        },
        {
          numberOfPlayers: 3,
          failsRequired: 1
        },
        {
          numberOfPlayers: 3,
          failsRequired: 1
        }
      ],
      roles: [
        {
          name: 'Troopers / Good Guys',
          amount: 2,
          id: 1
        },
        {
          name: 'Baddies / Bad Guys',
          amount: 2,
          id: 2
        },
        {
          name: 'Commander / Merlin',
          amount: 1,
          id: 3
        },
        {
          name: 'HAL 9000 / Percival',
          amount: 0,
          id: 5
        },
        {
          name: 'Symbiote / Morgana',
          amount: 0,
          id: 6
        },
        {
          name: 'Mangalord / Mordred',
          amount: 0,
          id: 7
        },
        {
          name: 'Doppelganger / Oberon',
          amount: 0,
          id: 8
        }
      ]
    }

    this.handleChecked = this.handleChecked.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleMissionChange = this.handleMissionChange.bind(this)
  }
  handleChecked(event) {
    const target = event.target
    const id = target.id
    const value = target.value
    const newState = {...this.state}
    newState.roles[id].amount = value
    const numberOfPlayers = newState.roles
      .map(role => role.amount)
      .reduce((a, b) => Number(a) + Number(b))
    this.setState({newState})

    this.setState({numberOfPlayers: numberOfPlayers})
  }
  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({[name]: value})
  }
  handleMissionChange(event) {
    const target = event.target
    const name = target.name
    const id = target.id
    const value = target.value
    const newState = {...this.state}
    newState.missions[id][name] = value
    this.setState({newState})
  }

  handleSubmit() {
    const {gameName, numberOfPlayers, roles, missions} = this.state
    const roleArray = []
    roles.forEach(role => {
      for (let i = Number(role.amount); i > 0; i--) {
        roleArray.push(role.id)
      }
    })
    socket.emit('createGame', gameName, numberOfPlayers, roleArray, missions)
    this.props.openForm()
  }

  componentDidMount() {}

  render() {
    const roleArray = Object.values(this.state.roles)
    const missionArray = [0, 1, 2, 3, 4]
    return (
      <div>
        <h2>Custom Game </h2>
        <h2>Number of Players: {this.state.numberOfPlayers}</h2>

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
          {roleArray.map((role, i) => (
            <label key={i}>
              {role.name}
              <input
                name={role.name}
                type="number"
                min={0}
                max={10}
                onChange={this.handleChecked}
                value={role.amount}
                id={i}
              />
            </label>
          ))}

          {missionArray.map(mission => (
            <label key={mission}>
              Mission : {mission}
              <input
                type="number"
                name="numberOfPlayers"
                min="1"
                max="10"
                value={this.state.missions[mission].numberOfPlayers}
                onChange={this.handleMissionChange}
                id={mission}
              />
              <input
                type="number"
                name="failsRequired"
                min="1"
                max="10"
                value={this.state.missions[mission].failsRequired}
                onChange={this.handleMissionChange}
                id={mission}
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
