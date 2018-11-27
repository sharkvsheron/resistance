const db = require('../db')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Nomination = require('./nomination')

const Game = db.define('game', {
  sessionId: {
    type: Sequelize.TEXT
  },
  gameName: {
    type: Sequelize.STRING
  }
})

//methods:
// how many players associated to this game.

Game.prototype.gameResult = async function() {
  const missionResults = await Nomination.findAll({
    where: {gameId: this.id, missionStatus: {[Op.ne]: null}}
  })
  let successes = 0
  let fails = 0
  for (let i = 0; i < missionResults.length; i++) {
    if (missionResults[i].missionStatus === 'succeed') successes++
    if (missionResults[i].missionStatus === 'fail') fails++
  }
  if (successes >= 3) return 'good'
  if (fails >= 3) return 'bad'
  else return 'none'
}

module.exports = Game
