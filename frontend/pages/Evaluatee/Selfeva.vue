<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form>
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
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
                                        <v-textarea v-model="indicate.detail_eva" label="คำอธิบายเพิ่มเติม(ถ้ามี)" rows="2" ></v-textarea>
                                        <v-file-input label="file" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" accept="image/*,.pdf"></v-file-input>
                                        <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนนประเมิน 1-4" v-model="indicate.score" :items="[1,2,3,4]" ></v-select>
                                        <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" v-model="indicate.score" type="number" @input="indicate.score < 4 ? indicate.score = 4 : null "></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {eva} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET Topics!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic()])
})
</script>

<style scoped>

</style>