const db = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')
const GameType = require('./gameType')
// const Game = require('./game')

const Nomination = db.define('nominations', {
  nominees: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    validate: {}
  },
  missionStatus: {
    type: Sequelize.ENUM('succeed', 'fail'),
    allowNull: true,
    defaultValue: null
  },
  nominationStatus: {
    type: Sequelize.ENUM('approve', 'reject'),
    allowNull: true,
    defaultValue: null
  }
})

Nomination.prototype.nextNominator = async function() {
  const playersInGame = await User.findAll({
    where: {gameId: this.gameId},
    order: [['id', 'ASC']]
  })
  for (let i = 0; i < playersInGame.length; i++) {
    if (playersInGame[i].dataValues.id === this.userId) {
      if (i === playersInGame.length - 1) {
        return playersInGame[0].dataValues.id
      } else {
        return playersInGame[i + 1].dataValues.id
      }
    }
  }
}

Nomination.prototype.nextMission = async function(Game) {
  const user = await User.findById(this.userId)
  console.log('USER GAME ID', user.dataValues.gameId)
  console.log('GAME MODEL', Game)
  const game = await Game.findById(user.dataValues.gameId)
  const gameType = await GameType.findById(Number(game.dataValues.gameTypeId))
  const missionsInGame = gameType.missions
  console.log('all games for gameid', missionsInGame)
  if (this.missionTypeId < missionsInGame[4]) {
    return this.missionTypeId + 1
  }
}

Nomination.prototype.getNominator = function() {
  return this.userId
}

module.exports = Nomination
