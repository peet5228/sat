require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// Endpoint PubLic API
const auth = require('./routes/auth')
app.use('/api/auth',auth)


// Block 404 Status
app.use((req,res) => res.status(404).json({message:'กำลังปรับปรุง!555'}))

// Listen Port
app.listen(3001 , () => console.log("Server Running On Port 3001"))