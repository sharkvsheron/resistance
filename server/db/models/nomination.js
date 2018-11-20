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
Nomination.prototype.nextNominator = function() {
  if (this.userId !== 5) {
    return this.userId + 1
  } else {
    return 1
  }
}

Nomination.prototype.nextMission = function() {
  if (this.missionTypeId < 5) {
    return this.missionTypeId + 1
  }
}
Nomination.prototype.getNominator = function() {
  return this.userId
}

module.exports = Nomination
