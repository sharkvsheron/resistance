import axios from 'axios'

const GET_GAMES = 'GET_GAMES'
const SET_GAME_ID_FOR_USER = 'SET_GAME_ID_FOR_USER'

const setGameId = (id) => ({ type: SET_GAME_ID_FOR_USER, id })
const getGames = games => ({ type: GET_GAMES, games })

export const getGameList = () => {
  return async dispatch => {
    try {
      const allGames = await axios.get('/api/game')
      const gameList = allGames.data
      dispatch(getGames(gameList))
    } catch (err) {
      console.log(err)
    }
  }
}

export const setUsersGameId = (gameId, userId) => {
  return async dispatch => {
    try {
      const updatedUser = await axios.put('/api/game/', { userId, gameId })
      console.log(`user has been assigned to a game id`)
    } catch (error) {
      console.error(error)
    }
  }
}

const initialState = [] //list of objs, each obj is a game instance
/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GAMES:
      return action.games
    default:
      return state
  }
}
