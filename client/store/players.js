import axios from 'axios'

const GET_VISIBILITY = 'GET_VISIBILITY'
const GET_PLAYERS = 'GET_PLAYERS'

export const getPlayers = players => ({
  type: GET_PLAYERS,
  players
})

export const getVisibility = visibility => ({
  type: GET_VISIBILITY,
  visibility
})

const writeVisibility = (players, visibility) => {
  const newPlayers = {...players};
  for (let prop in visibility) {
    newPlayers[prop][roleId] = visibility[prop]
  }
  return newPlayers
}

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYERS:
      return action.players
    case GET_VISIBILITY:
      return writeVisibility(state.players, action.visibility)
    default:
      return state
  }
}
