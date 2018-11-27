const User = require('./user')
const Game = require('./game')
const GameType = require('./gameType')
const MissionType = require('./missionType')
const MissionVote = require('./missionVote')
const Nomination = require('./nomination')
const Role = require('./role')
const NominationVote = require('./nominationVote')

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

//cannot place in game, creates circular dependency

Game.hasMany(Nomination)
Game.hasMany(Nomination)
Game.belongsTo(GameType)

Nomination.belongsTo(Game)
Nomination.belongsTo(MissionType)
Nomination.belongsTo(User)

User.belongsTo(Game)
User.belongsTo(Role)

NominationVote.belongsTo(Nomination)
NominationVote.belongsTo(User)

MissionVote.belongsTo(Nomination)
MissionVote.belongsTo(User)

module.exports = {
  User,
  Game,
  GameType,
  Nomination,
  MissionType,
  MissionVote,
  Role,
  NominationVote
}
