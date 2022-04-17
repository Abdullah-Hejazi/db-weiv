<script>
export default {
    name: 'TableData',

    methods: {
        EditCell(e, r) {
            console.log(e, r)
        }
    },

    props : [
        'table',
        'columns',
        'data'
    ],

    data () {
        return {
            selectedRows: []
        }
    }
}

</script>

<template>
    <div>
        <DataTable
            :value="data"
            :lazy="true"
            :row-hover="true"
            v-model:selection="selectedRows"
            :showGridlines="true"
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