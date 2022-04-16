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
            ],

            themes: [
                "arya-blue",
                "arya-green",
                "arya-orange",
                "arya-purple",
                "bootstrap4-dark-blue",
                "bootstrap4-dark-purple",
                "bootstrap4-light-blue",
                "bootstrap4-light-purple",
                "fluent-light",
                "lara-dark-blue",
                "lara-dark-indigo",
                "lara-dark-purple",
                "lara-dark-teal",
                "lara-light-blue",
                "lara-light-indigo",
                "lara-light-purple",
                "lara-light-teal",
                "luna-amber",
                "luna-blue",
                "luna-green",
                "luna-pink",
                "md-dark-deeppurple",
                "md-dark-indigo",
                "md-light-deeppurple",
                "md-light-indigo",
                "mdc-dark-deeppurple",
                "mdc-dark-indigo",
                "mdc-light-deeppurple",
                "mdc-light-indigo",
                "nova",
                "nova-accent",
                "nova-alt",
                "nova-vue",
                "rhea",
                "saga-blue",
                "saga-green",
                "saga-orange",
                "saga-purple",
                "tailwind-light",
                "vela-blue",
                "vela-green",
                "vela-orange",
                "vela-purple"
            ],
            theme: ''
        }
    },

    methods: {
        Logout() {
            this.$store.dispatch('database/clearConnection');
            this.$router.push('/');
        },

        ToggleProfileItems(event) {
            this.$refs.menu.toggle(event)
        },

        Home() {
            this.$router.push('/databases')
        },

        async SelectTheme() {
            this.themes.forEach(theme => {
                document.getElementById(theme).rel = '';
            })

            document.getElementById(this.theme).rel = 'stylesheet';

            localStorage.setItem('theme', this.theme);
        }
    },

    created() {
        this.themes.forEach(theme => {
            let link = document.createElement('link');
            link.rel = "";
            link.id = theme;
            link.href = '/themes/' + theme + '.css';
            document.head.appendChild(link);
        })

        this.theme = localStorage.getItem('theme')
        this.SelectTheme()
    }
}

</script>

<template>
    <ConfirmDialog />
    <Toast />

    <header>
        <div class="border-round mb-3 p-3 surface-card shadow-4 flex justify-content-between">
            <div class="flex align-items-center">
                <img alt="logo" src="@/assets/logo.png" height="28" class="mr-2 cursor-pointer" @click="Home">
            </div>

            <div class="flex align-items-center">
                <Dropdown placeholder="Theme" class="cursor-pointer theme-selector" v-model="theme" :options="themes" @change="SelectTheme" />

                <Button v-if="$store.state.database.connected" iconPos="right" icon="pi pi-angle-down" class="p-button-text p-button-plain" :label="$store.state.database.data?.user" @click="ToggleProfileItems" />

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

.theme-selector {
    width: 300px;
    max-width: 100%;
}
</style>
