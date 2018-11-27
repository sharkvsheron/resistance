const {
  startGame,
  getNominations,
  getVisibility,
  getCurrentNominator,
  getCurrentNominees,
  submitMissionVote,
  getPlayersWithUserId,
  getUsersInGame,
  syncSocket,
  broadcastVisibility,
  submitNomination,
  getNominationVotes,
  voteOnNomination,
  getMissions,
  getGameResult,
  getAssassin,
  submitAssassination
} = require('./functions')
const {User, Game} = require('../db/models')
const OpenTok = require('opentok')
/*
  Params: socket
  Returns: gameRoom that socket is in
  Side Effects: assigns the socket to the room with gameId
*/

const joinGameRoom = async socket => {
  const socketId = socket.id
  const user = await User.findOne({where: {socketId}})
  const gameId = user.dataValues.gameId
  socket.join(gameId)
  return gameId
}
let opentok = new OpenTok(
  '46225662',
  '2ce7562d0d4a766d9cd55c246ddcd8d35aa4ab85'
)

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('getGames', async () => {
      const allGames = await Game.findAll()
      io.to(`${socket.id}`).emit('getGames', allGames)
    })

    socket.on('createGame', async userId => {
      let sessionId

      await opentok.createSession({mediaMode: 'routed'}, async function(
        err,
        session
      ) {
        if (err) {
          console.log(err)
          return
        }
        sessionId = session.sessionId
        // let sessionKey = opentok.generateToken(sessionId)
        // await User.update({sessionKey}, {where: {id: userId}})
        await Game.create({sessionId, gameTypeId: 1})
        const allGames = await Game.findAll()
        socket.emit('createdNewGame', allGames)
      })
    })

    socket.on('joinGame', async (userId, gameId) => {
      const game = await Game.findById(gameId)
      const sessionId = game.sessionId
      let sessionKey = opentok.generateToken(sessionId)

      await syncSocket(socket, userId)
      await joinGameRoom(socket)
      const user = await User.findById(userId)
      await user.update({sessionKey, gameId})
      // await user.update({gameId})
      const gameRoom = await joinGameRoom(socket)
      const players = await getPlayersWithUserId(userId)
      io.in(gameRoom).emit('getPlayers', players)
      const gameResult = await getGameResult(userId)
      io.in(gameRoom).emit('getGameResult', gameResult)
      const missions = await getMissions(userId)
      io.in(gameRoom).emit('getMissions', missions)
      const users = await User.findAll({where: {gameId: user.gameId}})
      broadcastVisibility(io, users)
      const nominations = await getNominations(userId)
      const nominationVotes = await getNominationVotes(userId)
      io.to(`${socket.id}`).emit('gameStarted', nominations, nominationVotes)

      io.to(`${socket.id}`).emit('getSessionIdAndKey', {sessionId, sessionKey})
    })

    socket.on('getPlayers', async userId => {
      const players = await getPlayersWithUserId(userId)
      const gameRoom = await joinGameRoom(socket)
      io.in(gameRoom).emit('getPlayers', players)
      const users = await getUsersInGame(userId)
      broadcastVisibility(io, users)
    })

    socket.on('startGame', async userId => {
      await startGame(userId)
      //potential refactor--joining game room not necc, just the return val.
      const gameRoom = await joinGameRoom(socket)
      const nominations = await getNominations(userId)
      const nominationVotes = await getNominationVotes(userId)
      //selectively emits to only people in the gameRoom
      io.in(gameRoom).emit('gameStarted', nominations, nominationVotes)
      const users = await getUsersInGame(userId)
      broadcastVisibility(io, users)
    })

    socket.on('getVisibility', async userId => {
      let visibility = await getVisibility(userId)
      io.to(`${socket.id}`).emit('getVisibility', visibility)
    })

    //When user clicks join game, their socket joins the appropriate gameRoom
    socket.on('syncSocketId', async userId => {
      await syncSocket(socket, userId)
    })

    socket.on('submitNomination', async (nominatorId, nominees) => {
      const newNomination = await submitNomination(nominatorId, nominees)
      if (newNomination !== null) {
        const gameRoom = await joinGameRoom(socket)
        const nominations = await getNominations(nominatorId)
        const nominationVotes = await getNominationVotes(nominatorId)
        io.in(gameRoom).emit(
          'nominationSubmitted',
          nominations,
          nominationVotes
        )
      }
    })

    socket.on('submitNominationVote', async (userId, vote) => {
      const voteResult = await voteOnNomination(userId, vote)
      if (voteResult !== null) {
        const gameRoom = await joinGameRoom(socket)
        const nominations = await getNominations(userId)
        const nominationVotes = await getNominationVotes(userId)
        io.in(gameRoom).emit(
          'nominationSubmitted',
          nominations,
          nominationVotes
        )
      }
    })

    //When user clicks Submit Vote, this socet will write vote to db.
    socket.on('submitMissionVote', async (userId, missionResult) => {
      const gameRoom = await joinGameRoom(socket)
      const nominees = await getCurrentNominees(userId)
      if (nominees.includes(userId)) {
        const voteResult = await submitMissionVote(userId, missionResult)
        // console.log('VOTE RESULT', voteResult)
        if (voteResult !== null) {
          const missions = await getMissions(userId)
          io.in(gameRoom).emit('getMissions', missions)
          const nominations = await getNominations(userId)
          const nominationVotes = await getNominationVotes(userId)
          io.in(gameRoom).emit(
            'nominationSubmitted',
            nominations,
            nominationVotes
          )
          const gameResult = await getGameResult(userId)
          if (gameResult === 'good') {
            const assassin = getAssassin(userId)
            io.in(gameRoom).emit('assassinationActive', {
              assassinationStatus: 'active',
              assassinId: assassin.id
            })
          }
          io.in(gameRoom).emit('getGameResult', gameResult)
        }
      }
    })

    socket.on('submitAssassination', async (assassinId, targetId) => {
      const gameRoom = await joinGameRoom(socket)
      const gameResult = await submitAssassination(assassinId, targetId)
      if (gameResult !== null) {
        io.in(gameRoom).emit('getGameResult', gameResult)
      }
    })
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
