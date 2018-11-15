const db = require('../db')
const Sequelize = require('sequelize')

const MissionType = db.define('missionTypes', {
  numberOfPlayers: {
    type: Sequelize.INTEGER,
    validate: {}
  },
  failsRequired: {
    type: Sequelize.INTEGER,
    validate: {}
  }
})

module.exports = MissionType
