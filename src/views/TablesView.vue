<script>

import TablesList from '@/components/TablesList'

export default {
    name: 'TablesView',

    components: {
        TablesList
    },

    data() {
        return {
            items: [
                {
                    label: 'DatabaseName'
                }
            ],

            home: {
                icon: 'pi pi-server',
                to: '/databases',
                label: ' ' + this.$store.state.database.data.host
            },

            error: '',

            tables: [],
            views: [],
            sysViews: [],

            database: ''
        }
    },

    methods: {
        RefreshTables() {
            this.$store.dispatch('getDatabase', this.$route.params.database).then((result) => {
                this.tables = []
                this.views = []
                this.sysViews = []

                if (! result.success) {
                    this.error = result.error
                } else {
                    result.data.forEach((item) => {
                        let temp = {
                            label: item[result.name],
                            icon: 'pi pi-table',
                        }

                        if (item.Table_type === 'BASE TABLE') {
                            this.tables.push(temp)
                        } else if (item.Table_type === 'VIEW') {
                            this.views.push(temp)
                        } else if (item.Table_type === 'SYSTEM VIEW') {
                            this.sysViews.push(temp)
                        }
                    })
                }
            })
        }
    },

    mounted () {
        this.database = this.$route.params.database
        this.items[0].label = this.database

        this.$store.dispatch('getDatabase', this.$route.params.database).then((result) => {
            if (! result.success) {
                this.error = result.error
            } else {
                result.data.forEach((item) => {
                    let temp = {
                        label: item[result.name],
                        icon: 'pi pi-table',
                    }

                    if (item.Table_type === 'BASE TABLE') {
                        this.tables.push(temp)
                    } else if (item.Table_type === 'VIEW') {
                        this.views.push(temp)
                    } else if (item.Table_type === 'SYSTEM VIEW') {
                        this.sysViews.push(temp)
                    }
                })
            }
        })
    },

    computed: {
        data () {
            let result = []

            if (this.tables.length > 0) {
                result.push({
                    label: 'Tables',
                    items: this.tables
                })
            }

            if (this.views.length > 0) {
                if (result.length > 0) {
                    result.push({
                        separator: true
                    })
                }

                result.push({
                    label: 'Views',
                    items: this.views
                })
            }

            if (this.sysViews.length > 0) {
                if (result.length > 0) {
                    result.push({
                        separator: true
                    })
                }
                result.push({
                    label: 'System Views',
                    items: this.sysViews
                })
            }

            return result
        }
    }
}

</script>

<template>
    <div class="tables">
        <Breadcrumb :home="home" :model="items" :exact="false" />

        <div v-if="error" class="mx-5">
            <InlineMessage severity="error" class="w-full scalein select-text">
                {{ error }}
            </InlineMessage>
        </div>

        <div class="p-0 flex justify-content-start">
            <TablesList
                class="col-4 mt-3 p-0"
                :database="database"
                :data="data"
                :refresh="RefreshTables"
            />
        </div>
    </div>
</template>

<style>
</style>