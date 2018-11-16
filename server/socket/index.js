const fetch = require('node-fetch');

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('syncSocketId', async (userId) => {
      await fetch(`http://localhost:8080/api/users/${userId}/${socket.id}`, {method: 'PUT', body: ''});
    })
  })
}
