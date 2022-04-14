<script>
import DatabaseItem from '@/components/DatabaseItem';

export default {
    name: 'DatabasesView',

    components: {
        DatabaseItem
    },

    data() {
        return {
            newDatabase: {
                name: '',
                collation: this.$store.state.database.collations[122],
            },

            items: [],

            home: {
                icon: 'pi pi-database',
                to: '/databases',
                label: ' ' + this.$store.state.database.data.host
            },

            newDBError: '',
            error: '',

            createDatabaseDialog: false
        }
    },

    methods: {
        async CreateDatabase() {
            this.$store.dispatch('createDatabase', this.newDatabase).then((result) => {
                if (result.success) {
                    this.newDatabase.name = '';
                    this.createDatabaseDialog = false;
                    this.$toast.add({
                        severity:'success',
                        summary: 'Database created',
                        detail:'Database has been created successfully',
                        life: 3000
                    });
                } else {
                    this.newDBError = result.error;
                }
            })
        },

        async RefreshDatabase() {
            this.error = ''

            this.$store.dispatch('refreshDatabases').then((result) => {
                if (! result.success) {
                    this.error = result.error;
                }
            })
        },

        async DeleteDatabase(database) {
            this.$store.dispatch('dropDatabase', database.SCHEMA_NAME).then((result) => {
                if (result.success) {
                    this.$toast.add({
                        severity:'success',
                        summary: 'Database Dropped Successfully',
                        detail:'Database has been dropped successfully',
                        life: 3000
                    });
                } else {
                    this.error = result.error;
                }
            })
        },
    }
}

</script>

<template>
    <div class="databases">
        <Breadcrumb :home="home" :model="items" />

        <div class="flex justify-content-center align-items-center my-3 text-2xl text-center">
            <div>Databases</div>
            <Button
                icon="pi pi-plus"
                class="ml-3 p-button-text p-button-primary p-button-rounded"
                @click="createDatabaseDialog = true"
            />
            <Button
                icon="pi pi-refresh"
                class="p-button-text p-button-secondary p-button-rounded"
                @click="RefreshDatabase"
            />
        </div>

        <div v-if="error" class="mx-5">
            <InlineMessage severity="error" class="w-full scalein select-text">
                {{ error }}
            </InlineMessage>
        </div>

        <div class="flex flex-wrap justify-content-center mt-5">
            <DatabaseItem
                class="mx-3"
                v-for="(database, index) in $store.state.database.databases"
                :key="index"
                :index="index"
                :database="database"
                :delete="DeleteDatabase"
            />
        </div>

        <Dialog header="Create new Database" :modal="true" v-model:visible="createDatabaseDialog" class="display-name-dialog text-sm">
            <InlineMessage severity="error" v-if="newDBError" class="mb-3 w-full scalein">
                {{ newDBError }}
            </InlineMessage>
            
            <div>
                <InputText placeholder="Display Name" v-model="newDatabase.name" class="w-full mt-3" />

                <Dropdown
                    class="w-full mt-3"
                    v-model="newDatabase.collation"
                    :options="$store.state.database.collations"
                    optionLabel="COLLATION_NAME"
                    placeholder="Select Collation"
                    option-group-children="items"
                />
            </div>

            <template #footer>
                <div class="flex justify-content-between">
                    <Button
                        label="Cancel"
                        @click="createDatabaseDialog = false"
                        class="p-button-text"
                    />
                    <Button label="Create" @click="CreateDatabase" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style>
.display-name-dialog {
    width: 400px;
}
</style>