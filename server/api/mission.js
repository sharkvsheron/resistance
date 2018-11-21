const router = require('express').Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { Game, User, GameType, Nomination } = require('../db/models')
const { submitNomination } = require('../socket/functions')
module.exports = router

router.get('/test/:userId', async (req, res, next) => {
  const response = await submitNomination(req.params.userId, [1, 2])
  res.json(response)
})


router.put('/:userId', async (req, res, next) => {
  try {
    // const {userId} = req.session.userId
    const { userId } = req.params
    const { missionResult } = req.body
    const user = await User.findById(userId)
    const game = await Game.findById(user.gameId)
    const nomination = await Nomination.findOne({ where: { id: userId } })
    if (Number(userId) === nomination.dataValues.userId) {
      await nomination.update({ missionStatus: missionResult })
    } else {
      res.send('Unathorized')
    }
    const result = await game.gameResult()
    if (result.teamWon !== 'none') res.json(result)
    else if (nomination.dataValues.missionTypeId < 5) {
      const newNominator = nomination.nextNominator()
      const newMission = nomination.nextMission()
      await Nomination.create({
        nominees: [],
        missionTypeId: newMission,
        userId: newNominator,
        gameId: nomination.gameId
      })

      const missionNominations = await Nomination.findAll({
        where: {
          gameId: game.id,
          missionStatus: {
            [Op.ne]: null
          }
        }
      })
      const missions = {}
      missionNominations.forEach(mission => {
        missions[mission.missionTypeId] = mission.missionStatus
      })
      res.json(missions)
    }
  } catch (err) {
    next(err)
  }
})