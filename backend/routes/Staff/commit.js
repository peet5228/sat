const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// ======== Demo =========
// API สำหรับ Get ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         res.json(rows)
//     }catch(err){
//         console.log("Error Get",err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// ======== Demo =========

// API สำหรับ Get ข้อมูล
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(``)
        res.json(rows)
    }catch(err){
        console.log("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router