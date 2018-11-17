const fetch = require('node-fetch')
const {startGame, getNominations} = require('./functions');

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('startGame', async userId => {
      await startGame(userId);
      const startingState = await getNominations(userId);
      io.emit('gameStarted', startingState)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('syncSocketId', async userId => {
      await fetch(`http://localhost:8080/api/users/${userId}/${socket.id}`, {
        method: 'PUT',
        body: ''
      })
    })
  })
}
