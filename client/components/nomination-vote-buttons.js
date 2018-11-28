import React from 'react'
import socket from '../socket'

const NominationVoteButtons = props => {
  const id = props.id
  return (
    <div className="nomination-vote-container">
      <p>Approve or reject the nominated team. (highlighted players)</p>
      <div
        className="game-button"
        onClick={async () => socket.emit('submitNominationVote', id, 'approve')}
      >
        APPROVE
      </div>
      <div
        className="game-button"
        onClick={async () => socket.emit('submitNominationVote', id, 'reject')}
      >
        REJECT
      </div>
    </div>
  )
}

export default NominationVoteButtons
