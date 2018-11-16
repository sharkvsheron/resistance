import axios from 'axios'

const GET_GAMES = 'GET_GAMES'

const getGames = games => ({type: GET_GAMES, games})

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

const initialState = [] //list of objs, each obj is a game instance
/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GAMES:
      return action.games
    default:
      return state
  }
}
