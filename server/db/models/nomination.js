const db = require('../db')
const Sequelize = require('sequelize')

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
Nomination.prototype.nextNominator = function() {}
Nomination.prototype.nextMission = function() {
  if (this.mission===)
}

module.exports = Nomination
