<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">ประเมินผู้รับการประเมิน</h1>
                    <v-card class="pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,a) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ a+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,b) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ a+1 }}.{{ b+1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }}
                                        </p>
                                        <p class="mt-2">รายละเอียด : {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">ไฟล์ : <v-btn v-if="indicate.file_eva" @click="viweFile(indicate.file_eva)" color="blue" size="small">ดูไฟล์</v-btn><span v-else>-</span></p>
                                        <v-select label="ใส่คะแนนประเมิน 1-4" class="mt-2" v-model="indicate.score" :items="[1,2,3,4]" ></v-select>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-2">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะ</label>
                            <v-textarea v-model="detail_commit" label="(ถ้ามี)" rows="2" ></v-textarea>
                        </v-card>
                    </div>
                    <div class="mt-4 text-center">
                        <v-btn color="blue" type="submit">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_commit === 'y'" type="success">กรอกแบบประเมินสำเร็จ</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {commit} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const id_eva = useRoute().params.id_eva
const detail_commit = ref('')

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'__blank')
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Topics!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic()])
})

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap(t =>
        t.indicates.map((i:any) =>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบทุกช่อง')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    formData.append('detail_commit',detail_commit.value)
    await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
    alert('บันทึกคะแนนสำเร็จ')
    navigateTo('/Committee/Show_eva')
    await Promise.all([fetchUser(),fetchTopic()])
}
</script>

<style scoped>

</style>