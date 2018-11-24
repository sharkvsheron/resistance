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
  const newPlayers = {...players}
  for (const prop in visibility) {
    newPlayers[prop].roleId = visibility[prop]
  }
  return newPlayers
}

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYERS:
      return action.players //{1: {username:adam, roleId:1}, 2: {username:russell, roleId:1}, etc.}
    case GET_VISIBILITY:
      return writeVisibility(state, action.visibility)
    default:
      return state
  }
}
