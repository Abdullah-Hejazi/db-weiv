<script>

import { useDatabaseStore } from '@/stores/database'

import AccountItem from '@/components/AccountItem'

export default {
    name: 'LoginView',

    components: {
        AccountItem
    },

    data() {
        return {
            loginData: {
                username: '',
                password: '',
                host: '',
                port: null,
                displayName: ''
            },
            loading: false,
            moreOptions: {
                text: 'More Options',
                icon: 'pi pi-angle-down',
                active: false
            },
            error: '',
            displayNameDialog: false,
            savedAccounts: [],
        }
    },

    mounted () {
        this.savedAccounts = localStorage.getItem('savedAccounts') ? JSON.parse(localStorage.getItem('savedAccounts')) : []
    },

    methods: {
        async Login() {
            this.loading = true

            await this.PerformLogin(this.loginData)

            this.loading = false
        },

        async PerformLogin(data) {
            this.error = ''

            const database = useDatabaseStore()

            try {
                this.Invoke(
                    await database.Connect(
                        data.host,
                        data.username,
                        data.password,
                        data.port
                    )
                )
            } catch (error) {
                this.error = error.message
            }
        },

        Invoke(result) {
            if (result.success) return true;

            throw new Error(result?.error)
        },

        MoreOptions() {
            this.moreOptions.active = !this.moreOptions.active
            if (this.moreOptions.active) {
                this.moreOptions.icon = 'pi pi-angle-up'
                this.moreOptions.text = 'Less Options'
            } else {
                this.moreOptions.icon = 'pi pi-angle-down'
                this.moreOptions.text = 'More Options'
            }
        },

        SaveAccount() {
            let data = {
                username: this.loginData.username,
                host: this.loginData.host == '' ? 'localhost' : this.loginData.host,
                port: this.loginData.port == null ? 3306 : this.loginData.port,
                displayName: this.loginData.displayName
            }

            this.savedAccounts.push(data)
            localStorage.setItem('savedAccounts', JSON.stringify(this.savedAccounts))

            this.displayNameDialog = false
        },

        RemoveAccount(index) {
            this.savedAccounts.splice(index, 1);
            localStorage.setItem('savedAccounts', JSON.stringify(this.savedAccounts))
        },

        async LoadAccount(index) {
            await this.PerformLogin(this.savedAccounts[index])
        }
    },
}

</script>

<template>
    <div class="login">
        <div class="loginData-card loginData-margin mx-auto surface-card p-4 shadow-2 border-round">
            <div class="text-center mb-5">
                <img src="@/assets/logo.png" alt="DB Weiv" width="100" class="mb-3">
                <div class="text-900 text-3xl font-medium mb-3">Login</div>
            </div>

            <InlineMessage severity="error" v-if="error" class="mb-3 w-full">
                {{ error }}
            </InlineMessage>

            <div>
                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" v-model="loginData.username" />
                    </div>
                </div>

                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <Password placeholder="Password" v-model="loginData.password" toggle-mask :feedback="false" />
                    </div>
                </div>

                <div class="scalein" v-if="moreOptions.active">
                    <div class="col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-server"></i>
                            </span>
                            <InputText placeholder="Host" v-model="loginData.host"
                                v-tooltip.right="'Defaults to: localhost'" />
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-sort-alt"></i>
                            </span>
                            <InputNumber placeholder="Port" v-model="loginData.port" mode="decimal" :use-grouping="false"
                                v-tooltip.right="'Defaults to: 3306'" />
                        </div>
                    </div>
                </div>

                <div class="text-center p-text-secondary cursor-pointer mt-1 mb-3" @click="MoreOptions">
                    <p class="text-small">
                        {{ moreOptions.text }}
                        <i :class="'pi ' + moreOptions.icon"></i>
                    </p>
                </div>

                <div class="text-center mt-3 flex justify-content-between">
                    <Button label="Sign In" icon="pi pi-user" @click="Login" :loading="loading"></Button>
                    <Button label="Save Account" class="p-button-text p-button-plain"
                        @click="displayNameDialog = true"></Button>
                </div>
            </div>
        </div>

        <div class="loginData-card mx-auto surface-card pt-3 shadow-2 border-round mt-3">
            <div class="text-center">
                <div class="text-600 text-2xl font-medium">Saved Accounts</div>
            </div>

            <div class="px-5">
                <Divider />
            </div>

            <div class="p-3">
                <AccountItem
                    v-for="(account, index) in savedAccounts"
                    :key="index"
                    :account="account"
                    :index="index"
                    :remove="RemoveAccount"
                    :load="LoadAccount"
                />

                <div class="text-center text-600 mb-3" v-if="savedAccounts.length == 0">
                    There are no saved accounts.
                </div>
            </div>
        </div>

        <Dialog header="Save account" v-model:visible="displayNameDialog" class="display-name-dialog">
            <div class="p-text-secondary">
                <small>Your password will not be saved. You'll enter it manually everytime you connect.</small>

                <InputText placeholder="Display Name" v-model="loginData.displayName" class="w-full mt-3" />
            </div>

            <template #footer>
                <div class="flex justify-content-between">
                    <Button label="Save" icon="pi pi-check" @click="SaveAccount"></Button>
                    <Button label="Cancel" icon="pi pi-times" @click="displayNameDialog = false"
                        class="p-button-text"></Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style>
.loginData-card {
    width: 550px;
    max-width: 90vw;
}

.loginData-margin {
    margin-top: 100px;
}

.display-name-dialog {
    width: 400px;
}
</style>
