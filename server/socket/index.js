const fetch = require('node-fetch')

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('startGame', async userId => {
      //awit fetch post to create initial nomination instance
      //fetch to this instance
      console.log('server received emission')
      await fetch(`http://localhost:8080/api/game/start/${userId}`, {
        method: 'PUT',
        body: ''
      })
      const startingState = fetch(
        `http://localhost:8080/api/game/nominations/${userId}`,
        {
          method: 'GET'
        }
      )
        .then(res => res.json())
        .then(startingState =>
          console.log('server-side starting state', startingState)
        )

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
