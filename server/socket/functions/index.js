const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
  Game,
  User,
  GameType,
  Nomination,
  Role,
  NominationVote,
  MissionType,
  MissionVote
} = require('../../db/models')

const hasBlankNomination = async gameId => {
  const blankNomination = await Nomination.findOne({
    where: {gameId, nominees: {[Op.eq]: []}}
  })
  return blankNomination !== null
}

const getNominationWithUserId = async userId => {
  const user = await User.findById(userId)
  const nomination = await Nomination.findAll({where: {gameId: user.gameId}})
  return nomination
}

const getGamewithUserId = async userId => {
  const user = await User.findById(userId)
  const gameId = user.gameId
  return Game.findById(gameId)
}

const syncSocket = async (socket, userId) => {
  const toBeUpdatedUser = await User.findById(userId)
  await toBeUpdatedUser.update({socketId: socket.id})
}

const getPlayersWithUserId = async userId => {
  const game = await getGamewithUserId(userId)
  const players = await User.findAll({where: {gameId: game.id}})
  console.log(game.id)
  // return users.map(user => user.dataValues)
  const allPlayers = {}
  players.forEach(player => {
    allPlayers[player.dataValues.id] = {
      userName: player.dataValues.userName,
      userId: player.dataValues.id,
      roleId: 0
      sessionKey: player.dataValues.sessionKey

    }
  })
  console.log(game, allPlayers)
  return allPlayers
}

const getUsersInGame = async userId => {
  const user = await User.findById(userId)
  const users = await User.findAll({where: {gameId: user.gameId}})
  return users
}

const broadcastVisibility = async (io, users) => {
  users.forEach(async user => {
    let visibility = await getVisibility(user.id)
    io.to(`${user.socketId}`).emit('getVisibility', visibility)
  })
}

/*
    Params: userId
    Return: Nothing
    Side Effects: Creates the initial nomination instance of a game, assigns roleId's to users in game
*/

const startGame = async userId => {
  const user = await User.findById(userId)
  const gameId = user.gameId
  const {gameTypeId} = await Game.findById(gameId)
  const users = await User.findAll({where: {gameId}})
  const game = await GameType.findById(gameTypeId)
  const missionTypeId = game.missions[0]
  const isNewGame = !(await hasBlankNomination(gameId))
  if (users.length === game.numberOfPlayers && isNewGame) {
    await Nomination.create({
      nominees: [],
      gameId,
      missionTypeId,
      userId: users[Math.floor(Math.random() * users.length)].id
    })
    await game.assignRoles(users)
  }
}

/*
    Params: userId
    Return:
*/
const getNominations = async userId => {
  const user = await User.findById(userId)
  const nominations = await Nomination.findAll({where: {gameId: user.gameId}})
  const allNominations = {}
  nominations.forEach(nomination => {
    allNominations[nomination.dataValues.id] = nomination.dataValues
  })
  return allNominations
}

/*
      Params: userId
      Return: Object {currentNominator: userId}
*/
const getCurrentNominator = async userId => {
  const user = await User.findById(userId)
  const nomination = await Nomination.findAll({where: {gameId: user.gameId}})
  return nomination[0].dataValues.userId
}

/*
    Params: userId
    Return: {1:'succeed'}
    BUT: This function will create a new Mission and Nomination
*/

const submitVote = async (userId, missionResult) => {
  const game = await getGamewithUserId(userId)
  const nomination = await Nomination.findOne({
    where: {gameId: game.id, nominees: {[Op.eq]: []}}
  })
  await nomination.update({missionStatus: missionResult, nominees: [1, 2]})
  const result = await game.gameResult()
  if (result.gameEndResult !== 'none') return result
  else if (nomination.dataValues.missionTypeId < 5) {
    const missions = {}
    const newNominator = nomination.nextNominator()
    const newMission = nomination.nextMission()
    await Nomination.create({
      nominees: [],
      missionTypeId: newMission,
      userId: newNominator,
      gameId: nomination.gameId
    })
    missions[nomination.missionTypeId] = nomination.missionStatus
    return missions
  }
}
/*
  PARAMS: userId
  Return: object {player1: vis1, player2: vis2, etc.}
*/
const getVisibility = async userId => {
  const user = await User.findById(userId)
  const {roleId, gameId} = user
  const role = await Role.findById(roleId)
  const visibleRoles = role.visible
  const players = await User.findAll({where: {gameId}})
  const playerVisibility = {}
  // const hasStarted = await hasBlankNomination(gameId)
  players.forEach(player => {
    if (visibleRoles.includes(player.roleId))
      playerVisibility[player.id] = player.roleId
    else playerVisibility[player.id] = 1
  })
  return playerVisibility
}

/**
 *
 * PARAMS: userId of nominator, array of userId's of nominees
 * Return: array of userId's of nominees
 * Side effects: This nomination gets updated with nominees
 *                Create appropriate number of nominationVote instances for each userId with a status of 'null'
 */

const submitNomination = async (nominatorId, nominees) => {
  const user = await User.findById(nominatorId)
  const gameId = user.gameId
  const currentNomination = await Nomination.findOne({
    where: {
      userId: nominatorId,
      gameId,
      nominees: {
        [Op.eq]: []
      }
    }
  })

  const currentMissionType = await MissionType.findById(
    currentNomination.missionTypeId
  )
  const isValidNomiation =
    currentMissionType.numberOfPlayers === nominees.length

  if (currentNomination && isValidNomiation) {
    await currentNomination.update({nominees})
    const allPlayers = await getPlayersWithUserId(nominatorId)

    for (const userId in allPlayers) {
      await NominationVote.create({
        userId,
        nominationId: currentNomination.id,
        vote: null
      })
    }
    return nominees
  }
}

const voteOnNomination = async (userId, vote) => {
  const user = await User.findById(userId)
  const currentNominationVote = await NominationVote.findOne({
    where: {
      userId,
      vote: null
    }
  })
  if (currentNominationVote) {
    const nominationId = currentNominationVote.nominationId
    const currentNomination = await Nomination.findById(nominationId)
    await currentNominationVote.update({vote})
    // check number of votes
    const game = await getGamewithUserId(userId)
    const gameType = await GameType.findById(1)
    // console.log('USERID: ', userId, 'GAME: ', game, 'GAMETYPE: ', gameType);
    const numPlayers = gameType.numberOfPlayers
    //check if all votes are submitted
    //if all votesd are submitted, calculate success or failure of the nomination
    const allVotes = await NominationVote.findAll({
      where: {nominationId, vote: {[Op.ne]: null}}
    })
    const isVotingComplete = allVotes.length === numPlayers
    if (isVotingComplete) {
      const approveVotes = await NominationVote.findAll({
        where: {nominationId, vote: {[Op.eq]: 'approve'}}
      })
      const nominationPassed =
        approveVotes.length >= Math.floor(numPlayers / 2) + 1
      if (nominationPassed) {
        await currentNomination.update({nominationStatus: 'approve'})
        const nominees = currentNomination.nominees
        nominees.forEach(async nominee => {
          await MissionVote.create({vote: null, nominationId, userId: nominee})
        })
      } else {
        const {gameId, missionTypeId} = currentNomination
        const nominationsForMission = await Nomination.findAll({
          where: {gameId, missionTypeId}
        })
        if (nominationsForMission.length === 5) {
          return {gameEndResult: 'bad'}
        } else {
          await currentNomination.update({nominationStatus: 'reject'})
          await Nomination.create({
            nominees: [],
            userId: currentNomination.nextNominator(),
            gameId,
            missionTypeId
          })
        }
      }
      return allVotes
    }
  }
}

module.exports = {
  getPlayersWithUserId,
  startGame,
  getNominations,
  getCurrentNominator,
  submitVote,
  getVisibility,
  getNominationWithUserId,
  getUsersInGame,
  syncSocket,
  broadcastVisibility,
  submitNomination,
  voteOnNomination
}
