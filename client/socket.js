import io from 'socket.io-client'
import store from './store'
import {getPlayers, getVisibility} from './store/players'
import {getGames} from './store/games'
import {getMissions} from './store/mission'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('getGames', allGames => {
    store.dispatch(getGames(allGames))
  })
  socket.on('getPlayers', players => {
    store.dispatch(getPlayers(players))
  })

  socket.on('gameStarted', startingState => {
    console.log('received starting state from server', startingState)
  })

  socket.on('getVisibility', visibilityObj => {
    store.dispatch(getVisibility(visibilityObj))
  })
})
socket.on('voteSubmitted', vote => {
  store.dispatch(getMissions(vote))
})

export default socket
