<script>

    export default {
        name: 'LoginView',

        data () {
            return {
                username: '',
                password: '',
                loading: false
            }
        },

        methods: {
            login () {
                this.loading = true
                console.log(this.username)
            }
        },
    }

</script>

<template>
    <div class="login">
        <Card class="form-card text-center mx-auto" style="margin-top: 20vh;">
            <template #title>
                <p class="text-center m-0">Login</p>
            </template>
            <template #content>
                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" v-model="username" />
                    </div>
                </div>

                <div class="col-12">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <Password placeholder="Password" v-model="password" toggle-mask :feedback="false" />
                    </div>
                </div>
            </template>
            <template #footer>
                <Button icon="pi pi-user" label="Login" @click="login" :loading="loading" />
            </template>
        </Card>
    </div>
</template>

<style>
    .form-card {
        width: 450px;
        max-width: 90vw;
    }
</style>