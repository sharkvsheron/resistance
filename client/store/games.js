import axios from 'axios'

const GET_GAMES = 'GET_GAMES'

export const getGames = games => ({type: GET_GAMES, games})

const initialState = [] 
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
