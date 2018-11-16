const router = require('express').Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {Game, User, GameType, Nomination, Role} = require('../db/models')
module.exports = router

router.put('/', async (req, res, next) => {
  try {
    const {userId, gameId} = req.body
    const user = await User.findById(userId)
    await user.update({gameId})
    res.status(202).send('changed users gameiD')
  } catch (err) {
    next(err)
  }
})

//this route takes userid of whoever clicks 'start game'
//updates our nomination table with the initial nomination instance
//updates our users table with roleId's
router.put('/start/:userId', async (req, res, next) => {
  try {
    const {userId} = req.params
    const user = await User.findById(userId)
    const gameId = user.gameId
    const {gameTypeId} = await Game.findById(gameId)
    const users = await User.findAll({where: {gameId}})
    const game = await GameType.findById(gameTypeId)
    const missionTypeId = game.missions[0]
    if (users.length === game.numberOfPlayers) {
      await Nomination.create({
        nominees: [],
        gameId,
        missionTypeId,
        userId: users[Math.floor(Math.random() * users.length)].id
      })
      await game.assignRoles(users)
      res.sendStatus(200)
    } else {
      res.json({message: 'NOT ENOUGH PLAYERS'})
    }
  } catch (error) {
    next(error)
  }
})

/*
  *USE CASE: Getting all the players and what the input player can see about their roleIds,
  *INPUT: No Input,
  *OUTPUT: An object with format {playerId: roleId} that has every player in the game
*/

router.get('/players/:userId', async (req, res, next) => {
  try {
    // const userId = req.session.userId;
    const userId = req.params.userId
    const user = await User.findById(userId)
    const {roleId, gameId} = user
    const role = await Role.findById(roleId)
    const visibleRoles = role.visible
    const players = await User.findAll({where: {gameId}})
    const playerVisibility = {}
    players.forEach(player => {
      if (visibleRoles.includes(player.roleId))
        playerVisibility[player.id] = player.roleId
      else playerVisibility[player.id] = 0
    })
    res.json(playerVisibility)
  } catch (error) {
    next(error)
  }
})

/*/nominator/:userId
INPUT userId
RETURN OBJ {currentNominator : id}*/

router.get('/nominator/:userId', async (req, res, next) => {
  try {
    const {userId} = req.params
    const user = await User.findById(userId)
    const nomination = await Nomination.findOne({
      where: {
        gameId: user.gameId,
        userId: userId,
        missionStatus: {[Op.eq]: null}
      }
    })
    const nominator = nomination.getNominator()
    res.json(nominator)
  } catch (error) {
    next(error)
  }
})
