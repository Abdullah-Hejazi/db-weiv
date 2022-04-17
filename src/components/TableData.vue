<script>
export default {
    name: 'TableData',

    methods: {
        EditColumn(e) {
            console.log(e)
        }
    },

    props : [
        'columns',
        'data',
        'sort',
        'error'
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
            :resizableColumns="true"
            removableSort
            columnResizeMode="expand"
            :value="data"
            :lazy="true"
            :row-hover="true"
            v-model:selection="selectedRows"
            :showGridlines="true"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[10,25,50]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
            responsive-layout="scroll"
            @sort="sort"
        >
            <div class="text-center text-xl mb-4" v-if="error">
                <InlineMessage severity="error" class="w-full scalein select-text">
                    {{ error }}
                </InlineMessage>
            </div>

            <template #empty>
                <div class="text-xl" v-if="! error">
                    No rows found.
                </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem" />

            <Column :sortable="true" v-for="(col, index) of columns" :field="col.name" :header="col.name" :key="index" style="width: 100px;">
                <template #body="slotProps">
                    <div class="row-data" v-on:dblclick="EditColumn(slotProps)">
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

.p-datatable-responsive-scroll > .p-datatable-wrapper{
    overflow-x: unset !important;
}

</style>