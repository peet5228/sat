const express = require('express')
const router = express.Router()
const db = require('../../db')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API สำหรับ Get ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.json(rows[0])
    }catch(err){
        console.log("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ uploads ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const file = req.files?.file
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[filename,id_eva,id_member])
        res.status(201).json({message:'Upload Success'})
    }catch(err){
        console.log("Error Upload",err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API Delete ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[D]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        const fp = path.join(uploadDir,D.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json({message:'Delete Success'})
    }catch(err){
        console.log("Error Delete",err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router