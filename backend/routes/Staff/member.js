const express = require('express')
const app = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET



module.exports = router