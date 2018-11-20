import io from 'socket.io-client'
import store from './store'
import {getVisibility} from './store/visible'
const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('gameStarted', startingState => {
    console.log('received starting state from server', startingState)
  })

  socket.on('getVisibility', visibilityObj => {
    console.log('client listener hit', visibilityObj)
    store.dispatch(getVisibility(visibilityObj))
  })
})
socket.on('voteSubmitted', vote => {
  console.log('THIS IS THE VOT E', vote)
})

export default socket
