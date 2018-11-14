const db = require('../db')
const Sequelize = require('sequelize')

const Role = db.define('roles', {
  visible: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },

  name: {
    type: Sequelize.STRING
  }
})

module.exports = Role
