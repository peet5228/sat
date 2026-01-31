<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">สถานะการประเมินของกรรมการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อกรรมการประเมิน
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">กรรมการประเมิน</th>
                                    <th class="text-center border">สถานะการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :keys="items.id_eva">
                                    <td class="text-center border">{{ index + 1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white font-weight-bold" size="small" :color="bg(items.status_commit)">{{ items.status_commit === 'n' ? 'ยังไม่ได้ประเมิน' : 'ประเมินแล้ว' }}</v-btn>
                                    </td>
                                    <!-- <td class="text-center border">
                                        <v-btn class="text-white" color="success" @click="go(items.id_eva)" size="small">รายละเอียด</v-btn>
                                    </td> -->
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
import {api, staff} from '../../API/base'

definePageMeta({
    ssr:false
})

const token = process.client ? localStorage.getItem('token') : null

const id_eva= useRoute().params.id_eva

const result = ref([])


const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/statusCommit/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const bg = (status_commit:string) => {
    if(status_commit === 'n') return 'error'
    // else if(status_commit === 2) return 'blue'
    else if(status_commit === 'y') return 'success'
}

const go = (id_eva:number) => {
    navigateTo({path: `StatusCommit-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>