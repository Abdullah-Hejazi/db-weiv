<script>

import TableData from '@/components/TableData.vue'
import TableStructure from '@/components/TableStructure.vue'

export default {
    name: 'TableView',

    components: {
        TableData,
        TableStructure
    },

    data() {
        return {
            items: [
                {
                    label: 'Table',
                    icon: 'pi pi-table',
                    command: () => this.activeIndex = 0
                },
                {
                    label: 'Structure',
                    icon: 'pi pi-database',
                    command: () => this.activeIndex = 1
                }
            ],

            activeIndex: 0,
            pagination: {
                page: 0,
                perPage: 25,
                total: 0
            },

            data: [],
            columns: []
        }
    },

    props: [
        'table',
    ],

    methods : {
        PageChange(event) {
            this.LoadTable()
        },

        async LoadTable () {
            this.$store.dispatch('database/loadTable', {
                database: this.$route.params.database,
                table: this.table,
                page: this.pagination.page,
                perPage: this.pagination.perPage
            }).then(result => {
                if (result.success) {
                    this.data = result.data[0][0]
                    this.columns = result.data[1][0]
                    this.pagination.total = result.data[0][1][0].count
                }
            })
        }
    },

    mounted () {
        this.LoadTable()
    },

    watch : {
        table: function () {
            this.pagination.page = 0
            this.LoadTable()
        }
    },
}
</script>

<template>
    <div>
        <Panel>
            <template #header>
                <TabMenu :model="items" :activeIndex="activeIndex" />
            </template>

            <template #icons>
                <Button class="p-panel-header-icon p-link mr-2">
                    <span class="pi pi-cog"></span>
                </Button>
            </template>

            <ScrollPanel class="w-full scroll-menu2">
                <TableData :data="data" :columns="columns" v-if="activeIndex == 0" />
                <TableStructure v-if="activeIndex == 1" />
            </ScrollPanel>

            <Paginator
                v-model:first="pagination.page"
                :rows="pagination.perPage"
                :totalRecords="pagination.total"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                v-model:rows="pagination.perPage"
                @page="PageChange($event)"
            />
        </Panel>
    </div>
</template>