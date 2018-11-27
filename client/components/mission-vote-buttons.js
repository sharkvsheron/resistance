import React from 'react'
import socket from '../socket'

const MissionVoteButtons = props => {
  const id = props.id
  console.log('props in missionvotebuttons', props)
  return (
    <div className="mission-vote">
      <p>Throw Success or Fail if you are bad. Success if you are good.</p>
      <div className="mission-vote-buttons">
        <br />
        <div
          className="game-button"
          onClick={async () => socket.emit('submitMissionVote', id, 'success')}
        >
          SUCCESS
        </div>
        <div
          className="game-button"
          onClick={async () => socket.emit('submitMissionVote', id, 'fail')}
        >
          FAIL
        </div>
      </div>
    </div>
  )
}

export default MissionVoteButtons
