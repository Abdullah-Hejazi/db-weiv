<script>
export default {
    name: 'DB Weiv - Database Viewer',

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

            settings: false,

            theme: '',
            language: ''
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

        FinishSettings () {
            this.SelectTheme();
            this.SelectLanguage();

            this.settings = false
        },

        async SelectTheme() {
            this.themes.forEach(theme => {
                document.getElementById(theme).rel = '';
            })

            document.getElementById(this.theme).rel = 'stylesheet';

            localStorage.setItem('theme', this.theme);
        },

        SelectLanguage() {
            if (this.language) {
                this.$i18n.locale = this.language;
                localStorage.setItem('language', this.language);
            }
        }
    },

    created() {
        // load language
        let language = localStorage.getItem('language')

        if (language) {
            this.language = localStorage.getItem('language');
            this.SelectLanguage()
        }

        this.themes.forEach(theme => {
            let link = document.createElement('link');
            link.rel = "";
            link.id = theme;
            link.href = '/themes/' + theme + '.css';
            document.head.appendChild(link);
        })

        let link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = 'primeicons.css';
        document.head.appendChild(link);

        this.theme = localStorage.getItem('theme') ?? 'arya-blue';
        this.SelectTheme()
    }
}

</script>

<template>
    <div>
        <ConfirmDialog />
        <Toast />

        <p id="db-weiv-loading-module">
            <ProgressSpinner strokeWidth="3" class="db-weiv-loading-module-spinner" />
        </p>

        <header>
            <div class="border-round mb-3 p-3 surface-card shadow-4 flex justify-content-between">
                <div class="flex align-items-center">
                    <img alt="logo" src="@/assets/logo2.png" height="34" class="cursor-pointer" @click="Home">
                    <Button v-if="$store.state.database.connected" icon="pi pi-home" class="ml-3 p-button-text p-button-plain" :label="$t('general.home')" @click="Home" />
                </div>

                <div class="flex align-items-center">
                    <Button icon="pi pi-cog" class="p-button-plain p-button-text ml-3" :label="$t('general.settings')" @click="settings = true" />

                    <Button v-if="$store.state.database.connected" icon="pi pi-power-off" class="p-button-plain p-button-text ml-3" :label="$t('general.logout')" @click="Logout" />
                </div>
            </div>
        </header>

        <div>
            <RouterView />
        </div>

        <Dialog class="settings-dialog" :header="$t('general.settings')" v-model:visible="settings" :modal="true">
            <div>
                <div>
                    <p class="my-1">{{ $t('general.themes') }}</p>
                    <Dropdown :placeholder="$t('general.themes')" class="w-full" v-model="theme" :options="themes" @change="SelectTheme" />
                </div>

                <div class="mt-5">
                    <p class="mb-1">{{ $t('general.language') }}</p>
                    <Dropdown :placeholder="$t('general.language')" class="w-full" v-model="language" :options="$i18n.availableLocales" @change="SelectLanguage" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style>
body {
    background-color: var(--surface-ground);
    font-family: var(--font-family);
    font-weight: 400;
    color: var(--text-color);
}

.settings-dialog {
    width: 400px;
    max-width: 90vw;
}

#db-weiv-loading-module {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    margin: 0px;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.493);
    z-index: 2500;
    display: none;
}

.db-weiv-loading-module-spinner {
    margin-top: calc(50vh - 50px);
    margin-left: calc(50vw - 50px);
}
</style>
