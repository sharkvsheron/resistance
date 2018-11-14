const db = require('../db')
const Sequelize = require('sequelize')

const GameType = db.define('gameTypes', {
  numberOfPlayers: {
    type: Sequelize.INTEGER
  },
  rolesAvailable: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  missions: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
})

module.exports = GameType
