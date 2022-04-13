<script>

import { useDatabaseStore } from '@/stores/database'

export default {
    name: 'LoginView',

    data() {
        return {
            form: {
                username: '',
                password: '',
                host: '',
                port: null
            },
            loading: false,
            moreOptions: {
                text: 'More Options',
                icon: 'pi pi-angle-down',
                active: false
            },
            error: '',
            displayName: '',
            displayNameDialog: false
        }
    },

    methods: {
        async Login() {
            this.error = ''
            this.loading = true

            const database = useDatabaseStore()

            let result = await database.connect(
                this.form.host == '' ? 'localhost' : this.form.host,
                this.form.username,
                this.form.password,
                this.form.port == null ? 3306 : this.form.port
            )

            this.loading = false

            if (result.success) {
                console.log('Login successful')
            } else {
                this.error = result.error
            }
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
            this.displayNameDialog = true
        }
    },
}

</script>

<template>
    <div class="login">
        <div class="form-card mx-auto surface-card p-4 shadow-2 border-round">
            <div class="text-center mb-5">
                <img src="@/assets/logo.png" alt="DB Weiv" width="100" class="mb-3">
                <div class="text-900 text-3xl font-medium mb-3">Login</div>
            </div>

            <InlineMessage severity="error" v-if="error" class="mb-3">
                {{ error }}
            </InlineMessage>

            <div>
                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" v-model="form.username" />
                    </div>
                </div>

                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <Password placeholder="Password" v-model="form.password" toggle-mask :feedback="false" />
                    </div>
                </div>

                <div class="scalein" v-if="moreOptions.active">
                    <div class="col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-server"></i>
                            </span>
                            <InputText placeholder="Host" v-model="form.host"
                                v-tooltip.right="'Defaults to: localhost'" />
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-sort-alt"></i>
                            </span>
                            <InputNumber placeholder="Port" v-model="form.port" mode="decimal" :use-grouping="false"
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

        <Dialog header="Save account" v-model:visible="displayNameDialog" class="display-name-dialog">
            <div class="p-text-secondary">
                <small>Your password will not be saved. You'll enter it manually everytime you connect.</small>

                <InputText placeholder="Display Name" v-model="displayName" class="w-full mt-3" />
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
.form-card {
    width: 550px;
    max-width: 90vw;
    margin-top: 20vh;
}

.display-name-dialog {
    width: 400px;
}
</style>
