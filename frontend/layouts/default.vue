<template>
    <v-app>
    <v-app-bar color="#7d0c14" >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>NTC evaluation system</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-logout" @click="logout" variant="text" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="260" color="#404040">
      <v-list density="comfortable">
        <v-list-item v-for="items in navitem" :key="items.title" :to="items.to">
            <v-list-item-title>
                {{ items.total }}
            </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="py-6">
        <slot />
      </v-container>
      <v-footer app class="text-caption justify-center">© 2025 NAN NTC</v-footer>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {useDisplay} from 'vuetify'
const {mdAndDown} = useDisplay()
const isMobile = computed(() => {mdAndDown.value})
const drawer = ref(false)
const user = ref<any>({})

const logout = async () =>{
    if(!confirm('ต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.remofr 
}
</script>

<style scoped>

</style>