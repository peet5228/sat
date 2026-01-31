<template>
    <v-app>
    <v-app-bar color="#7d0c14" >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>NTC evaluation system</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-logout" @click="logout" variant="text" />
    </v-app-bar>
    <ClientOnly>
    <v-navigation-drawer v-model="drawer" width="260" color="#404040">
      <v-list density="comfortable">
        <v-list-item v-for="items in navitem" :key="items.title" :to="items.to">
            <v-list-item-title>
                {{ items.title }}
            </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </ClientOnly>
    <v-main>
      <v-container fluid class="py-6">
        <slot />
      </v-container>
      <v-footer app class="text-caption justify-center">© 2025 NAN NTC</v-footer>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, ref } from 'vue';
import {useDisplay} from 'vuetify'
import {api} from '../API/base'
const {mdAndDown} = useDisplay()
const isMobile = computed(() => {mdAndDown.value})
const drawer = ref(false)
const user = ref<any>({})

const logout = async () =>{
    if(!confirm('ต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles = [
    //staff
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'รายชื่อผู้รับการรปะเมิน',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
]
const navitem = computed(() => roles.filter((item) => item.role.includes(user.value.role)))

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    if(!token){
        return await navigateTo('/',{replace:true})
    }
    try{
        const res = await axios.get(`${api}/auth/regis`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
        localStorage.removeItem('token')
        await navigateTo('/',{replace:true})
    }
}
onMounted(fetchUser)
</script>

<style scoped>

</style>