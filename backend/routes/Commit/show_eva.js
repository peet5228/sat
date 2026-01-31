const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')


// API สำหรับ Get ข้อมูล
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_eva , tb_member , tb_system where tb_eva.id_member=tb_member.id_member and tb_system.id_sys=tb_eva.id_sys and status_eva=1 and status_sys='y' order by id_eva desc`)
        res.json(rows)
    }catch(err){
        console.log("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router