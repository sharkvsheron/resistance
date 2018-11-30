import React, {Component} from 'react'
export default class Tips extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log('*********', this.props.display)

    return (
      <div className={`tips-text ${this.props.display}`}>
        <p>
          Lygma Lygma Lygma Lygma Lygma Lygma Lygma Lygma Lygma Lygma Lygma
          Lygma.
        </p>
      </div>
    )
  }
}
