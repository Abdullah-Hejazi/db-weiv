<script>
export default {
    name: 'App',

    data() {
        return {
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

        Home () {
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

    mounted() {
        this.themes.forEach(theme => {
            let link = document.createElement('link');
            link.rel = "";
            link.id = theme;
            link.href = '/themes/' + theme + '.css';
            document.head.appendChild(link);
        })

        this.theme = localStorage.getItem('theme') ?? 'arya-blue';
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
                <img alt="logo" src="@/assets/logo2.png" height="34" class="cursor-pointer" @click="Home">
                <Button v-if="$store.state.database.connected" icon="pi pi-home" class="ml-3 p-button-text p-button-plain" label="Home" @click="Home" />
            </div>

            <div class="flex align-items-center">
                <div>
                    <span class="pi pi-moon text-primary px-2"></span>
                    <Dropdown placeholder="Theme" class="cursor-pointer theme-selector" v-model="theme" :options="themes" @change="SelectTheme" />
                </div>

                <Button v-if="$store.state.database.connected" icon="pi pi-power-off" class="p-button-plain p-button-text ml-3" label="Logout" @click="Logout" />
            </div>
        </div>
    </header>

    <div>
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
    max-width: 100%;
    width: 200px;
}
</style>
