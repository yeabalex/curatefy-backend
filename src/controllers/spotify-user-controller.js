const userModel = require('../models/spotify-user-model');
const dotenv = require('dotenv');
const querystring = require('querystring');
const generateRandomString = require('../utils/generate-random-string')
const requestAccessToken = require('../services/access-token-auth')
const getProfile = require('../services/user-profile')

dotenv.config();


function createUser(req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-email user-read-private';

    res.redirect(
        'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: 'http://localhost:3000/redirect',
            state: state
        })
    );
}

async function redirect(req, res){
    const code = req.query.code || null;
    const state = req.query.state || null;

    const token = await requestAccessToken(code, state, 'http://localhost:3000/redirect')
    console.log(token)
    console.log(await getProfile(token));

    res.send("Done")
}
module.exports = {createUser, redirect};
