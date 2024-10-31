const express = require("express")
const connectDB = require('./config/db.config')
const spotifyUserRoute = require('./routes/spotify-user-route')

const app = express()
const PORT = 3000;


//connectDB()
app.use(express.json())
app.use(spotifyUserRoute)
app.listen(PORT, ()=>{console.log("hello")})


module.exports = app