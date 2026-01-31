<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">รายงาน</h1>
                    </v-sheet>
                    <v-card-text>
                        
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
        // const res = await axios.get(`${staff}/topic`,{headers:{Authorization: `Bearer ${token}`}})
        // result.value = res.data
        const b = await axios.get(`${api}/dash/eva`,{headers:{Authorization: `Bearer ${token}`}})
        box.value = b.data.box
        // box2.value = b.data.box2
    }catch(err){
        console.error("Error Fetching",err)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>