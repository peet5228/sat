<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">เพิ่มกรรมการ</h1>
                        <p class="text-center"><b>ผู้รับการประเมิน : </b>{{ header.first_name }} {{ header.last_name }}</p>
                        <p class="text-center"><b>รอบการประเมิน : </b>รอบการประเมินที่ {{ header.round_sys }} ปี {{ header.year_sys }}</p>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <template v-for="(c,index) in List" :key="index">
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.id_member" :items="MEMBER(index).map(p => ({title:`${p.fullname_commit}`,value:p.id_member}))" :label="`กรรมการคนที่ ${index+1}`"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.role" :items="ROLE(index)" :label="`ตำแหน่งกรรมการที่ ${index+1}`"></v-select>
                                    </v-col>
                                </template>
                                <v-btn class="text-white" color="blue" type="submit" block>บันทึก</v-btn>
                            </v-row>
                        </v-form>

                        <br><br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">กรรมการประเมิน</th>
                                    <th class="text-center border">ตำแหน่ง</th>
                                    <th class="text-center border">จัดการ</th>
                                    <!-- <th class="text-center border">เพิ่มกรรมการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :keys="items.id_commit">
                                    <td class="text-center border">{{ index + 1 }}</td>
                                    <td class="text-center border">{{ nameOf(items.id_member) }}</td>
                                    <td class="text-center border">{{ items.role }}</td>
                                    <td class="text-center border">
                                        <!-- <v-btn class="text-white" color="warning" @click="edit(items)" size="small">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" color="error" @click="del(items.id_commit)" size="small">ลบ</v-btn>
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
import {api, staff} from '../../API/base'

const id_eva = useRoute().params.id_eva

definePageMeta({
    ssr:false
})

const token = process.client ? localStorage.getItem('token') : null

const people = ref([])
const header = ref([])
const role = ['ประธาน','กรรมการ','เลขา']
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
])

const nameMap = computed(() => Object.fromEntries(people.value.map(p => [p.id_member,p.fullname_commit])))
const nameOf = (id:number) => nameMap.value[id]

const fetch = async () => {
    try{
        const h = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        header.value = h.data
        const res = await axios.get(`${staff}/commit/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        people.value = res.data.before
        const useData = res.data.after
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
            ]
        }else{
            List.value = useData.map(c => ({
                id_commit:c.id_commit,id_member:c.id_member,role:c.role
            }))
            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})   
            }
        }
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const MEMBER = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.id_member : null) )
    return people.value.filter( (p) => !picked.includes(p.id_member) )
}

const ROLE = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.role : null) )
    return role.filter( (p) => !picked.includes(p) )
}

const saveMember = async () =>{
    try{
        await axios.post(`${staff}/commit/${id_eva}`,List.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_commit:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/commit/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path: `Eva_commit-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>