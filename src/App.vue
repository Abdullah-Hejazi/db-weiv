<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import { useDatabaseStore } from '@/stores/database'


const items = [
    {
        label: 'Login',
        icon: 'pi pi-user',
    },
    {
        label: 'Register',
        icon: 'pi pi-users',
    }
];

const counter = useDatabaseStore();

counter.connect('localhost', 'root', '')

</script>

<template>
  <header>
    <Menubar :model="items" />

  </header>

  <RouterView />
</template>

<style>
    body {
        background-color: var(--surface-ground);
    }
</style>
