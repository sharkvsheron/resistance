import React, {Component} from 'react'
export default class Mission extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <button type="submit">MISSION NUMBER</button>
        <button type="submit">NUMBER OF PLAYERS</button>
        <button type="submit">MISSION PASS OR FAIL</button>
        <button type="submit">OTHER INFO</button>
      </div>
    )
  }
}
