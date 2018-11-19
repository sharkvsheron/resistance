import React, { Component } from 'react'
export default class Player extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { userName, roleId } = this.props.player
    const { id } = this.props
    return (
      <div className="player-card" id={`player${id}`}>
        <div className="videoWrapper" id={`role${roleId}`}>
        </div>

        <h3>username: {userName}</h3>
        <h3>role id: {roleId}</h3>
        <button type="submit">WAITING FOR PLAYER TO JOIN</button>
        <div>
          <button type="submit">ADD BOT</button>
        </div>
      </div>
    )
  }
}
