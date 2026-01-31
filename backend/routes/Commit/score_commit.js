const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// GET API , User
router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            'select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys and s.status_sys=? order by e.id_eva desc',
            [id_member ,id_eva,'y']
        )
        res.json(rows[0])
    }catch(err){
        console.error(" Get User Failed!",err)
        res.status(500).json({message:'Error Get User'})
    }
})

// GET API , Topic
router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[Commit]] = await db.query(`select * from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        var Scommit = 0
        if(Commit.level_commit === 'ประธาน'){
            Scommit = 2
        }else if(Commit.level_commit === 'กรรมการ'){
            Scommit = 3
        }else if(Commit.level_commit === 'เลขา'){
            Scommit = 4
        }
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and d.status_eva=? and d.id_eva=?`,[Scommit,id_eva])
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