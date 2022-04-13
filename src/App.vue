<script>
export default {
    name: 'App',

    data() {
        return {
            userItems: [
                {
                    label: 'Logout',
                    icon: 'pi pi-power-off',
                    command: this.Logout
                }
            ]
        }
    },

    methods: {
        Logout() {
            this.$store.dispatch('clearConnection');
            this.$router.push('/');
        },

        ToggleProfileItems(event) {
            this.$refs.menu.toggle(event)
        }
    },
}

</script>

<template>
    <ConfirmDialog />
    <Toast />

    <header>
        <div class="border-round mb-3 p-3 surface-card shadow-4 flex justify-content-between" v-if="$store.state.database.connection">
            <div class="flex align-items-center">
                <img alt="logo" src="@/assets/logo.png" height="28" class="mr-2">
            </div>

            <div class="flex align-items-center">
                <Button iconPos="right" icon="pi pi-angle-down" class="p-button-text p-button-plain" :label="$store.state.database.data.user" @click="ToggleProfileItems" />

                <Menu id="menu" :model="userItems" ref="menu" :popup="true" />
            </div>
        </div>
    </header>

    <div class="select-none">
        <RouterView />
    </div>
</template>

<style>
body {
    background-color: var(--surface-ground);
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
}
</style>
