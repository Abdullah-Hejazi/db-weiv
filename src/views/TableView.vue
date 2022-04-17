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

            menuItems: [
                {
                    label: 'New Row',
                    icon: 'pi pi-plus',
                    command: () => this.newRow.active = true
                },
                {
                    label: 'Search',
                    icon: 'pi pi-search',
                    command: () => this.search.active = true
                },
                {
                    separator: true
                },
                {
                    label: 'Drop Table',
                    icon: 'pi pi-trash',
                    command: this.DropTableConfirmation
                }
            ],

            activeIndex: 0,
            pagination: {
                page: 0,
                perPage: 25,
                total: 0
            },

            data: [],
            columns: [],
            sort: null,
            error: '',
            loading: false,
            search: {
                active: false,
                value: '',
                field: null,
                searching: false
            },
            newRow: {
                active: false
            }
        }
    },

    props: [
        'table',
        'delete'
    ],

    methods : {
        PageChange() {
            this.LoadTable()
        },

        SortChange(e) {
            if (e.sortOrder === 1) {
                this.sort = {
                    field: e.sortField,
                    order: 'ASC'
                }
            } else if (e.sortOrder === -1) {
                this.sort = {
                    field: e.sortField,
                    order: 'DESC'
                }
            } else {
                this.sort = null
            }

            this.LoadTable()
        },

        async LoadTable () {
            let form = {
                database: this.$route.params.database,
                table: this.table,
                page: this.pagination.page,
                perPage: this.pagination.perPage,
                sort: this.sort
            }

            if (this.search.searching) {
                form.search = this.search
            }

            this.loading = true

            this.data = []
            this.columns = []

            this.$store.dispatch('database/loadTable', form).then(result => {
                if (result.success) {
                    this.data = result.data[0][0]
                    this.columns = result.data[1][0]
                    this.pagination.total = result.data[0][1][0].count
                } else {
                    this.error = result.error
                }
            }).finally(() => {
                this.loading = false
            })
        },

        Search() {
            if (! this.search.value || ! this.search.field?.name) {
                this.search.error = 'Search value and field are required !'
                return
            }

            this.search.searching = true
            this.LoadTable()
            this.search.active = false
        },

        ClearSearch() {
            this.search.searching = false
            this.search.value = ''
            this.LoadTable()
        },

        OpenTableMenu(event) {
            this.$refs.tableMenu.toggle(event)
        },

        async DropTable() {
            this.loading = true

            await this.$store.dispatch('database/dropTable', {
                database: this.$route.params.database,
                table: this.table
            }).then(result => {
                if (result.success) {
                    this.$toast.add({
                        severity:'success',
                        summary: 'Table deleted',
                        detail:'Table has been deleted successfully',
                        life: 3000
                    });

                    this.delete()
                } else {
                    this.error = result.error
                }
            }).finally(() => {
                this.loading = false
            })
        },

        DropTableConfirmation() {
            this.$confirm.require({
                message: 'Are you sure you want to drop this table ?',
                header: 'Delete the table ?',
                icon: 'pi pi-exclamation-triangle',
                accept: this.DropTable
            });
        }
    },

    mounted () {
        this.LoadTable()
    },

    computed: {
        rowOptions() {
            let options = [10, 25, 50, 100]

            if (this.pagination.total > 100) {
                options.push(this.pagination.total)
            }

            return options
        }
    },

    watch : {
        table: function () {
            this.pagination.total = 0
            this.pagination.page = 0
            this.search.value = ''
            this.search.field = null
            this.search.searching = false
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
                <Button class="p-button-text p-button-rounded" icon="pi pi-cog" @click="OpenTableMenu"  />
                <Menu ref="tableMenu" :model="menuItems" :popup="true" />
                <Button
                    @click="ClearSearch"
                    v-if="search.searching"
                    label="Clear Search"
                    class="p-button-text p-button-rounded"
                    icon="pi pi-times"
                />
            </template>

            <BlockUI :blocked="loading">
                <ScrollPanel class="w-full scroll-menu2">
                    <TableData :loading="loading" :error="error" :data="data" :sort="SortChange" :columns="columns" v-if="activeIndex == 0 && loading == false" />
                    <TableStructure v-if="activeIndex == 1" />

                    <div class="text-center mt-5" v-if="loading">
                        <ProgressSpinner />
                    </div>
                </ScrollPanel>

                <Paginator
                    v-model:first="pagination.page"
                    :rows="pagination.perPage"
                    :totalRecords="pagination.total"
                    :rowsPerPageOptions="rowOptions"
                    v-model:rows="pagination.perPage"
                    @page="PageChange"
                    :pageLinkSize="3"
                />
            </BlockUI>
        </Panel>

        <!-- Dialogs -->
        <!-- Search Dialog -->
        <Dialog header="Search" v-model:visible="search.active" class="search-dialog" :modal="true">

            <div class="text-center text-xl mb-4" v-if="search.error">
                <InlineMessage severity="error" class="w-full scalein select-text">
                    {{ search.error }}
                </InlineMessage>
            </div>

            <div class="md:flex grid-nogutter">
                <div class="col-12 md:col-7 md:mb-3 px-1">
                    <InputText v-model="search.value" placeholder="Search" class="w-full" />
                </div>
                <div class="col-12 md:col-5 px-1">
                    <Dropdown v-model="search.field" :options="columns" optionLabel="name" placeholder="Field" class="w-full" />
                </div>
            </div>

            <div class="text-center">
                <Button label="Search" class="w-full" icon="pi pi-search" @click="Search" />
            </div>
        </Dialog>
    </div>
</template>

<style>
.p-panel-content {
    padding: 0 !important;
}

.p-scrollpanel-content {
    padding: 10px !important;
    padding-bottom: 15px !important;
}

.p-paginator {
    justify-content: center !important;
}

.search-dialog {
    width: 400px;
    max-width: 100vw;
}
</style>