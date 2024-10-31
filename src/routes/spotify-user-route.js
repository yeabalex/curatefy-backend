const express = require('express')
const {createUser, redirect} = require('../controllers/spotify-user-controller')
const dontn = require('../middleware/dontn')

const spotifyUserRoute = express.Router()

spotifyUserRoute.get('/login', createUser)
spotifyUserRoute.get('/redirect', redirect)

module.exports = spotifyUserRoute