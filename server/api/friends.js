const router = require('express').Router()
const { Friends } = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const friends = await Friends.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['name', 'spotifyId']
    })
    res.json(friends)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const response = await Friends.findAll({ where: { spotifyId: req.params.id } })
    const friend = response[0]
    res.json(friend)
  } catch (error) {
    next(error)
  }
})
