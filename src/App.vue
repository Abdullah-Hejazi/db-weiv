<script setup>
import { RouterView } from "vue-router";

const items = [
    {
        label: 'Login',
        icon: 'pi pi-user',
        to: '/'
    },
    {
        label: 'Register',
        icon: 'pi pi-users',
        to: '/databases'
    }
];

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
