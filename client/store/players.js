import axios from 'axios'

const GET_PLAYERS = 'GET_PLAYERS'

const getPlayers = players => ({type: GET_PLAYERS, players})

// export const getPlayersThunk = gameId => {
//   return async dispatch => {
//     try{
//       const
//     }catch(err){
//       console.log(err)
//     }
//   }
// }

const initialState = []

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYERS:
      return action.players
    default:
      return state
  }
}
