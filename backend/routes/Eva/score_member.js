const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// GET API , User
router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(
            'select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys and s.status_sys=? order by e.id_eva desc',
            [id_member,'y']
        )
        res.json(rows[0])
    }catch(err){
        console.error(" Error Get user!",err)
        res.status(500).json({message:'Error Get user'})
    }
})

// GET API , Topic
router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [[evaRow]] = await db.query(
            'select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys and s.status_sys=? order by e.id_eva desc',
            [id_member,'y']
        )
        const id_eva = evaRow.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and d.status_eva=? and d.id_eva=?`,[1,id_eva])
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error(" Error Get Topic!",err)
        res.status(500).json({message:'Error Get Topic'})
    }
})

module.exports = router