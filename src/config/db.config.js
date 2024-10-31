const dotenv = require('dotenv')
const mongoose  = require('mongoose')

dotenv.config()
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Successfully")
    }catch(err){
        console.error(err)
    }
}

module.exports = connectDB

