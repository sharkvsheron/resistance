import io from 'socket.io-client'
import store from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('gameStarted', startingState => {
    console.log('received starting state from server', startingState)
  })
})

export default socket
