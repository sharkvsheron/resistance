const fetch = require('node-fetch')
const {startGame, getNominations} = require('./functions');
const {User} = require ('../db/models');
/*
  Params: socket
  Returns: gameRoom that socket is in
  Side Effects: assigns the socket to the room with gameId
*/

const joinGameRoom = async (socket) => {
  console.log(socket.id);
  const socketId = socket.id;
  const user = await User.findOne({where: {socketId}})
  const gameId = user.dataValues.gameId;
  socket.join(gameId);
  return gameId
}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    socket.on('startGame', async userId => {
      await startGame(userId);
      //potential refactor--joining game room not necc, just the return val.
      const gameRoom = await joinGameRoom(socket);
      const startingState = await getNominations(userId);
      //selectively emits to only people in the gameRoom
      io.in(gameRoom).emit('gameStarted', startingState)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
    
    //When user clicks join game, their socket joins the appropriate gameRoom
    socket.on('syncSocketId', async userId => {
      await fetch(`http://localhost:8080/api/users/${userId}/${socket.id}`, {
        method: 'PUT',
        body: ''
      })
      await joinGameRoom(socket);
    })
  })
}
