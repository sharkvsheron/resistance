'use strict'

const db = require('../server/db')
const {
  User,
  Role,
  GameType,
  MissionType,
  Game,
  Nomination
} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const roles = await Promise.all([
    Role.bulkCreate([
      {visible: [], name: 'goodguy'},
      {visible: [2], name: 'badguy'},
      {visible: [1, 2, 3, 4, 5, 6, 8], name: 'merlin'},
      {visible: [2], name: 'assasin'},
      {visible: [3, 6], name: 'percival'},
      {visible: [2], name: 'morgana'},
      {visible: [2], name: 'mordred'},
      {visible: [1], name: 'oberon'}
    ])
  ])

  const gameType = await Promise.all([
    GameType.bulkCreate([
      {
        numberOfPlayers: 5,
        rolesAvailable: [1, 2, 3, 1, 2],
        missions: [1, 2, 3, 4, 5]
      }
    ])
  ])

  const missionType = await Promise.all([
    MissionType.bulkCreate([
      {numberOfPlayers: 2, failsRequired: 1},
      {numberOfPlayers: 3, failsRequired: 1},
      {numberOfPlayers: 2, failsRequired: 1},
      {numberOfPlayers: 3, failsRequired: 1},
      {numberOfPlayers: 3, failsRequired: 1}
    ])
  ])
  const game = await Promise.all([Game.create({gameTypeId: 1})])

  const users = [
    {
      socketId: 12345,
      userName: 'russell',
      email: 'r@r.com',
      password: '123',
      gameId: 1,
      roleId: 1
    },
    {
      socketId: 23456,
      userName: 'adam',
      email: 'a@a.com',
      password: '123',
      gameId: 1,
      roleId: 1
    },
    {
      socketId: 34567,
      userName: 'khalid',
      email: 'k@k.com',
      password: '123',
      gameId: 1,
      roleId: 1
    },
    {
      socketId: 45678,
      userName: 'peter',
      email: 'p@p.com',
      password: '123',
      gameId: 1,
      roleId: 1
    },
    {
      socketId: 56789,
      userName: 'bot',
      email: 'b@b.com',
      password: '123',
      gameId: 1,
      roleId: 1
    }
  ]

  await Promise.all(users.map(user => User.create(user)))
  console.log(`seeded ${users.length} users`)

  console.log(`seeded ${game.length} game`)
  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${roles.length} roles`)
  console.log(`seeded ${gameType.length} gametypes`)
  console.log(`seeded ${missionType.length} missiontypes`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
