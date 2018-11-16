const router = require('express').Router()
const {Game, User, GameType, Nomination} = require('../db/models')
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

router.get('/nominations/:userId', async (req, res, next) => {
  try {
    const {userId} = req.params
    const nomination = await Nomination.findOne({where: {userId, nominees: []}})
    res.json(nomination)
  } catch (err) {
    next(err)
  }
})
