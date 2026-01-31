<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">รายงานกรรมการประเมินทั้งหมด</h1>
                    </v-sheet>
                    <v-card-text>
                            รายชื่อผู้รับการประเมินผล
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ-นามสกุล</th>
                                    <th class="text-center border">อีเมล</th>
                                    <th class="text-center border">ชื่อผู้ใช้</th>
                                    <!-- <th class="text-center border">จัดการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :keys="items.id_member">
                                    <td class="text-center border">{{ index + 1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}<br><span class="opacity-80">{{ items.role }}</span></td>
                                    <td class="text-center border">{{ items.email }}</td>
                                    <td class="text-center border">{{ items.username }}</td>
                                    <!-- <td class="text-center border">
                                        <v-btn class="text-white" color="warning" @click="edit(items)" size="small">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" color="error" @click="del(items.id_member)" size="small">ลบ</v-btn>
                                    </td> -->
                                </tr>
                            </tbody>
                        </v-table>
                        <br>
                        <center><v-btn color="warning" class="text-white noP" prepend-icon="mdi-printer" @click="print()">พิมพ์</v-btn></center>
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


const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/member/commit`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const print = () => {
    window.print()
}

onMounted(fetch)
</script>

<style scoped>
@media print{
    .v-btn,.noP{
        display: none !important;
    }
}
</style>