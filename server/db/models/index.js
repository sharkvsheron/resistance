const User = require('./user')
const Game = require('./game')
const GameType = require('./gameType')
const MissionType = require('./missionType')
const MissionThrow = require('./missionThrow')
const Nomination = require('./nomination')
const Role = require('./role')
const Vote = require('./vote')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,Game,GameType,MissionType,MissionThrow,Role,Vote
}

Game.hasMany(Nomination)
Game.hasMany(Nomination)
Game.belongs(GameType)

Nomination.belongsTo(Game)
Nomination.belongsTo(MissionType)
Nomination.hasOne(User)

User.belongsTo(Game)
User.belongsTo(Role)

Vote.belongsTo(Nomination)
Vote.belongsTo(User)
