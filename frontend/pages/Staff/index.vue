<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color=""> 
                        <h1 class="text-h5 font-weight-bold">Dashboard - Staff</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="4" v-for="b in box" :key="b">
                                <v-card class="pa-4" elevation="5">
                                    <div class="text-h5">{{ b.title }}</div>
                                    <div class="text-h3">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" v-for="b in box2" :key="b">
                                <v-card class="pa-4" elevation="5">
                                    <div class="text-h5">{{ b.title }}</div>
                                    <div class="text-h3">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {api, staff} from '../../API/base'

definePageMeta({
    ssr:false
})

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const box = ref([])
const box2 = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/topic`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
        const b = await axios.get(`${api}/dash/staff`,{headers:{Authorization: `Bearer ${token}`}})
        box.value = b.data.box
        box2.value = b.data.box2
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        form.value.id_topic
            ? await axios.put(`${staff}/topic/${form.value.id_topic}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
            : await axios.post(`${staff}/topic`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_topic:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/topic/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error("Error Delete",err)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>