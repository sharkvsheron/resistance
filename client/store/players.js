import axios from 'axios'

const GET_PLAYERS = 'GET_PLAYERS'

const getPlayers = players => ({type: GET_PLAYERS, players})

export const getOtherPlayersInRoom = userId => {
  return async dispatch => {
    try {
      const user = await axios.get(`/api/game/${userId}`)
      const gameId = user.data.gameId
      const allPlayers = await axios.get(`/api/game/waiting-phase/${gameId}`)
      const allPlayersList = allPlayers.data
      dispatch(getPlayers(allPlayersList))
    } catch (err) {
      console.log(err)
    }
  }
}

const initialState = []

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYERS:
      return action.players
    default:
      return state
  }
}
