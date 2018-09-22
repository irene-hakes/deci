const Sequelize = require('sequelize')
const db = require('../db')

const Friends = db.define('friends', {
  name: {
    type: Sequelize.STRING
  },
  spotifyId: {
    type: Sequelize.STRING
  }
})

module.exports = Friends
