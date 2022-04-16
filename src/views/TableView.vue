<script>
export default {
    name: 'TableView',

    methods: {
        async LoadData () {
            this.loading = true
            this.$store.dispatch('database/loadTable', {
                database: this.$route.params.database,
                table: this.$route.params.table,
                page: this.page,
                perPage: this.perPage
            }).then(result => {
                if (result.success) {
                    this.data = result.data[0]
                    this.columns = result.data[1]
                }
            }).finally(() => {
                this.loading = false
            });
        },

        EditCell(e, r) {
            console.log(e, r)
        }
    },

    data () {
        return {
            columns: [],
            data: [],
            perPage: 25,
            page: 1,
            maxPage: 3,
            selectedRows: [],
            loading: false
        }
    },

    mounted () {
        this.LoadData()
    },

    watch : {
        '$route.params.table' : function() {
            this.LoadData()
        }
    }
}

</script>

<template>
    <div>
        <div>
            <DataTable
                :value="data"
                :paginator="true"
                :rows="perPage"
                :alwaysShowPaginator="true"
                :lazy="true"
                :row-hover="true"
                v-model:selection="selectedRows"
                :showGridlines="true"
                :loading="loading"
                paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rows-per-page-options="[10,25,50]"
                current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
                responsive-layout="scroll"
                editMode="cell" @cell-edit-complete="EditCell"
            >

                <template #empty>
                    <div class="text-center text-xl">
                        No rows found.
                    </div>
                </template>

                <Column selection-mode="multiple" header-style="width: 3rem" />

                <Column v-for="(col, index) of columns" :field="col.name" :header="col.name" :key="index" style="width: 100px;">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" autofocus />
                    </template>

                    <template #body="slotProps">
                        <div class="row-data">
                            {{ slotProps.data[slotProps.field] }}
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style>
.row-data {
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table-data {
    width: 100%;
    overflow: hidden;
}

.p-datatable-responsive-scroll > .p-datatable-wrapper{
    overflow-x: unset !important;
}

</style>