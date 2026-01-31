const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')


// API สำหรับ Get ข้อมูล
router.get('/',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(
            'select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and e.status_eva in (1,2) and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys and s.status_sys=? order by e.id_eva desc',
            [id_member,'y']
        )
        res.json(rows)
    }catch(err){
        console.error(" Get User Failed!",err)
        res.status(500).json({message:'Error Get User'})
    }
})

module.exports = router