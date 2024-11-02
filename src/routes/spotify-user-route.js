const express = require('express')
const {redirect} = require('../controllers/spotify-user-controller')
const authUser = require('../middleware/spotify-user-auth');

const spotifyUserRoute = express.Router()

//spotifyUserRoute.get('/login', authUser)
spotifyUserRoute.get('/login', authUser)
spotifyUserRoute.get('/redirect', redirect)

module.exports = spotifyUserRoute