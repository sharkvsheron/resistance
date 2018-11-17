const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {Game, User, GameType, Nomination, Role} = require('../../db/models')

const hasBlankNomination = async (gameId) => {
    const blankNomination = await Nomination.findOne({where: {gameId, nominees: {[Op.eq]: []}}})
    return (blankNomination !== null);
}
/*
    Params: userId
    Return: Nothing
    Side Effects: Creates the initial nomination instance of a game, assigns roleId's to users in game
*/

const startGame = async (userId) => {
    const user = await User.findById(userId)
    const gameId = user.gameId
    const {gameTypeId} = await Game.findById(gameId)
    const users = await User.findAll({where: {gameId}})
    const game = await GameType.findById(gameTypeId)
    const missionTypeId = game.missions[0]
    const isNewGame = ! await hasBlankNomination(gameId);
    console.log(isNewGame);
    if (users.length === game.numberOfPlayers && isNewGame) {
        await Nomination.create({
            nominees: [],
            gameId,
            missionTypeId,
            userId: users[Math.floor(Math.random() * users.length)].id
        })
        await game.assignRoles(users)
    }
}

/*
    Params: userId
    Return: 
*/
const getNominations = async (userId) => {
    const user = await User.findById(userId);
    const nominations = await Nomination.findAll({where: {gameId: user.gameId}})
    const allNominations = {};
    nominations.forEach(nomination => {
        allNominations[nomination.dataValues.id] = nomination.dataValues
    })
    return allNominations;
}

module.exports = {startGame, getNominations};