<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold text-center">รายงานผลการประเมิน</h1>
                    <v-card class="pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,a) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ a+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="border pa-1 bg-grey text-black" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="border pa-1 bg-grey text-black" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="border pa-1 bg-grey text-black" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="border pa-1 bg-grey text-black" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="border pa-1 bg-grey text-black" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="text-center border pa-1">{{ indicate.name_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.detail_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate*4 }}</td>
                                    <td class="text-center border pa-1">
                                        {{ (((scores[indicate.id_indicate]?.a ?? 0)+(scores[indicate.id_indicate]?.b ?? 0)+(scores[indicate.id_indicate]?.c ?? 0))/3).toFixed(2) }}
                                    </td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2 text-end" color="success">คะแนนรวม : {{ totalScore.toFixed(2)  }} คะแนน</v-card>
                    </div>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <v-row class="mt-2">
                                <v-col cols="4" class="text-center" v-for="commit in commits" :key="commit.id_commit">
                                    <img :src="`http://localhost:3001/uploads/signature/${commit.signature}`" alt="รอการยืนยันผล" width="20%"> <br>
                                    ({{ commit.first_name }} {{ commit.last_name }}) <br>
                                    {{ commit.level_commit }}
                                </v-col>
                            </v-row>
                        </v-card>
                    </div>
                    <div class="text-center mt-4">
                        <v-btn color="warning" class="text-white noP" prepend-icon="mdi-printer" @click="print()">พิมพ์</v-btn>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1 || user.status_eva === 2" type="info">กำลังอยู่ในการดำเนินการ</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {eva} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const scores = ref<any>([])
const commits = ref<any>([])
const totalScore = ref(0)

const print = () =>{
    window.print()
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        totalScore.value = (user.value.total_eva + user.value.total_commit)/3
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Topics!',err)
    }
}

const fetchCommits = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/commits`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
    }catch(err){
        console.error('Error GET Topics!',err)
    }
}

const fetchScores = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data.scores
    }catch(err){
        console.error('Error GET Topics!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic(),fetchScores(),fetchCommits()])
})

</script>

<style scoped>
@media print {
    .v-btn,.noP{
        display: none;
    }
}
</style>