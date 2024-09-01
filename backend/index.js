const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv  = require('dotenv')
const connectDB = require('./utils/db')
dotenv.config({})

const app = express()

//middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}

app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running successfully on PORT ${PORT}`)
})