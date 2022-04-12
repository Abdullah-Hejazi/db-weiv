<script setup>
import { RouterView } from "vue-router";
import { useDatabaseStore } from '@/stores/database'


const items = [
    {
        label: 'Login',
        icon: 'pi pi-user',
        to: '/login'
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
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
}
</style>
