const express = require('express')
const db = require('../db')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

// GET API , Profile
router.get('/',async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query('select * from tb_member where id_member=?',[id_member])
        res.json(rows[0])
    }catch(err){
        console.error(" Get Profile Failed!",err)
        res.status(500).json({message:'Error Get Profile'})
    }
})

module.exports = router