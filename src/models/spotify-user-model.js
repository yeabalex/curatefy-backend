const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    displayName: {type: mongoose.Schema.Types.String, required: true},
    email: {type:mongoose.Schema.Types.String, required: true, unique:true},
    spotifyId: {type: mongoose.Schema.Types.String, required: true, unique: true} 
}, {timestamps: true})

module.exports = mongoose.model('SpotifyUser', userSchema)