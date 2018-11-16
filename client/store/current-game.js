import axios from 'axios'

const GET_GAME = 'GET_GAME'

const getGame = gameId => ({type: GET_GAME, gameId})

export const getCurrentGameId = userId => {
  return async dispatch => {
    try {
      const currentGameId = await axios.get(`/api/game/${userId}`)
      const gameId = currentGameId.data
      dispatch(getGame(data.gameId))
    } catch (err) {
      console.error(error)
    }
  }
}

const initialState = ''

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GAME:
      return action.gameId
    default:
      return state
  }
}
