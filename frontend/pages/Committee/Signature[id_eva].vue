<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">ยืนยันผลการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="ไฟล์" v-model="file" accept=".docx,image/*,.pdf" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" class="text-center">
                                        <v-btn class="text-white" type="submit" color="blue">บันทึก</v-btn>&nbsp;&nbsp;
                                        <v-btn class="text-white" type="reset" color="error">ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>
                        <v-table v-else>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ไฟล์</th>
                                    <th class="text-center border">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">{{ 1 }}</td>
                                    <td class="text-center border">{{ result.signature }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" color="warning" @click="views(result.signature)" prepend-icon="mdi-eye" size="small">เปิดดู</v-btn>&nbsp;&nbsp;
                                        <v-btn class="text-white" color="error" @click="del(id_eva)" size="small" prepend-icon="mdi-delete">ลบ</v-btn>
                                    </td>
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
const id_eva = useRoute().params.id_eva
const result = ref([])

const file = ref<File | null>(null)

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const saveMember = async () =>{
    try{
        if(!file.value) return alert('กรุณากรอกไฟล์ก่อนบันทึก')
        const formData = new FormData()
        formData.append('file',file.value)
        await axios.post(`${commit}/signature/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        file.value = null
        await fetch()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_eva:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const views = (filename:string) => {
    const url = new URL(`/uploads/signature/${filename}`,commit).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>