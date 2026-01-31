<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-h5 font-weight-bold">ดำเนินการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ</th>
                                    <th class="text-center border">นามสกุล</th>
                                    <th class="text-center border">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">ผลการประเมิน</th>
                                    <th class="text-center border">ยืนยันผลประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :keys="items.id_sys">
                                    <td class="text-center border">{{ index + 1 }}</td>
                                    <td class="text-center border">{{ items.first_name }}</td>
                                    <td class="text-center border">{{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border"><v-btn class="text-white" color="blue" @click="check(items.id_eva)" size="small">ตรวจสอบ</v-btn></td>
                                    <td class="text-center border">
                                        <v-btn v-if="items.signature" class="text-white" color="success" @click="go(items.id_eva)" size="small">ยืนยันแล้ว</v-btn>
                                        <v-btn v-else class="text-white" color="blue" @click="go(items.id_eva)" size="small">ยืนยัน</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {api, commit} from '../../API/base'

definePageMeta({
    ssr:false
})

const token = process.client ? localStorage.getItem('token') : null

const result = ref<any>([])

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path: `/Committee/Signature${id_eva}`})
}

const check = (id_eva:number) => {
    navigateTo({path: `/Committee/Score_commit${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>