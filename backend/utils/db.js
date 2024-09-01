
const mongoose = require('mongoose')

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected successfully......')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB;