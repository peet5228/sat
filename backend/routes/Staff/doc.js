const express = require('express')
const router = express.Router()
const db = require('../../db')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/document')
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
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    }catch(err){
        console.log("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ uploads ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {name_doc} = req.body
        const file = req.files?.file
        const maxSize = 10 * 1024 * 1024;
        if (File.size > maxSize) {
            return res.status(400).json({ messages:'ไฟล์มีขนาดใหญ่เกินไป (จำกัดไม่เกิน 10 MB)'});
        }
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`insert into tb_doc (name_doc,day_doc,file) values (?,CURDATE(),?)`,[name_doc,filename])
        res.status(201).json({message:'Upload Success'})
    }catch(err){
        console.log("Error Upload",err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API Delete ข้อมูล
router.delete('/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_doc} = req.params
        const [[D]] = await db.query(`select file from tb_doc where id_doc='${id_doc}'`)
        const fp = path.join(uploadDir,D.file)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`delete from tb_doc where id_doc='${id_doc}'`)
        res.json({message:'Delete Success'})
    }catch(err){
        console.log("Error Delete",err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router